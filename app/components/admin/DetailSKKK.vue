<script setup lang="ts">
import { toast } from "vue-sonner";

import { useRoute, useRouter } from "vue-router";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { getApplicationDetail, getApplicationLogs, approveApplicationFirst, rejectApplication, approveApplicationNext, requestApplicationFix, toggleRequirementStatus, approveApplicationDocs, submitApplicationFix } from "~/services/application.services";
import getClassStatus from "~/helper/getClassStatus";
import getTranslateStatus from "~/helper/getTranslateStatus";

type StageLog = {
	date: string;
	status: string;
	note?: string;
};

type Stage = { logs: StageLog[] } | null;

type TimelineRow = {
	step: any;
	stage1: Stage;
	stage2: Stage;
	[key: string]: any; // allow string indexing like row['stage' + n] in template
};

// ROUTE
const route = useRoute();
const router = useRouter();
const applicationId = Number(route.params.id);

// LOG POPUP
const isOpen = ref(false);
const selectedStageName = ref("");
const selectedStageLogs = ref<any[]>([]);

const openLog = (name: string, stageLogs: any[]) => {
	selectedStageName.value = name;
	selectedStageLogs.value = stageLogs || [];
	isOpen.value = true;
};

// RAW DATA
const detail = ref<any>(null);
const logs = ref<any[]>([]);

// ✨ LEFT INFO — Langsung computed, tidak butuh function
const leftInfo = computed(() => {
	if (!detail.value) return [];

	return [
		{ label: "Jenis Layanan", value: detail.value.service?.name },
		{ label: "Nama Pengajuan", value: detail.value.applicationName },
		{ label: "Nama Pengusul", value: detail.value.applicantName },
		{ label: "Nama Instansi", value: detail.value.institution || "-" },
		{ label: "Alamat", value: detail.value.applicantAddress },
		{
			label: "Tanggal Surat",
			value: new Date(detail.value.applicationDate).toLocaleDateString("id-ID"),
		},
	];
});

// LOAD onMounted
onMounted(async () => {
	detail.value = await getApplicationDetail(applicationId);
	const raw = (await getApplicationLogs(applicationId)) as any[];

	logs.value = raw.filter((s: any) => s.stageNumber > 0).flatMap((s: any) => (s.logs || []).map((l: any) => ({ ...l, stageNumber: s.stageNumber })));
});

const timeline = computed<TimelineRow[]>(() => {
	if (!logs.value.length) return [];

	// group logs by stageNumber (1..4)
	const stages: Record<number, any> = {};
	for (const log of logs.value) {
		const sn = Number(log.stageNumber) || 1;
		if (!stages[sn]) stages[sn] = { logs: [] };
		stages[sn].logs.push({
			status: log.status,
			note: log.note,
			raw: log,
			date: new Date(log.createdAt).toLocaleDateString("id-ID", {
				day: "2-digit",
				month: "long",
				year: "numeric",
			}),
		});
	}

	// build single timeline row
	return [
		{
			step: detail.value?.currentStageNumber ?? 1,
			stage1: stages[1] ?? null,
			stage2: stages[2] ?? null,
		},
	];
});

// ACTIONS for initial stage (currentStageNumber === 0)
const letterLink = ref("");
const adminNote = ref("");
const actionLoading = ref(false);

// CONFIRMATION DIALOG
const isConfirmOpen = ref(false);
const confirmType = ref<"approve" | "reject" | null>(null);

// Approve first stage
const approveFirst = async () => {
	try {
		actionLoading.value = true;
		await approveApplicationFirst(applicationId, {
			letterLink: letterLink.value,
			note: adminNote.value,
		});

		router.back();
	} catch (err) {
	} finally {
		actionLoading.value = false;
	}
};

// Reject first stage
const rejectFirst = async () => {
	try {
		actionLoading.value = true;
		await rejectApplication(applicationId, {
			letterLink: letterLink.value,
			note: adminNote.value,
		});

		router.back();
	} catch (err) {
	} finally {
		actionLoading.value = false;
	}
};

const stageAction = ref<"approve" | "fix" | null>(null);
const stageConfirmOpen = ref(false);

// ON APPROVE STAGE
const approveStage = async () => {
	try {
		actionLoading.value = true;

		await approveApplicationNext(applicationId, {
			note: adminNote.value,
		});

		router.back();
	} finally {
		actionLoading.value = false;
	}
};

// ON FIX STAGE
const fixStage = async () => {
	try {
		actionLoading.value = true;

		const notSuitableIds = detail.value.applicationRequirements.filter((req: any) => req.status === false).map((req: any) => req.id);

		await requestApplicationFix(applicationId, {
			note: adminNote.value,
			requirementIds: notSuitableIds,
		});

		router.back();
	} finally {
		actionLoading.value = false;
	}
};

// TOGGLE CHECK UNCHECK REQUIREMENTS
const updatingReq = ref<number | null>(null);
const onToggleRequirement = async (req: any, newValue: boolean) => {
	try {
		updatingReq.value = req.requirementId;

		// optimist update
		req.status = newValue;

		console.log(req.status);

		await toggleRequirementStatus(applicationId, req.requirementId, newValue);
	} catch (err) {
		// rollback
		req.status = !newValue;
	} finally {
		updatingReq.value = null;
	}
};

// ON VERIFY DOCS (stage 0 and status NEW_DOCUMENTS)
const selectedAction = ref<"approve" | "reject" | null>(null);

const onVerifyDocs = async () => {
	try {
		actionLoading.value = true;

		const payload = {
			note: adminNote.value,
			letterLink: letterLink.value,
			...(selectedAction.value === "reject" && {
				returnToSubmitter: true,
			}),
		};

		await approveApplicationDocs(applicationId, payload);

		router.back();
	} finally {
		actionLoading.value = false;
	}
};

// on submit fix
const isConfirmOpenFix = ref(false);
const onSubmitApplicationFix = async () => {
	try {
		actionLoading.value = true;

		await submitApplicationFix(applicationId, {
			note: adminNote.value,
		});

		router.back();
	} finally {
		actionLoading.value = false;
	}
};

const isConfirmLastStageOpen = ref(false);
const additionalLink = ref("");
const lastStageAction = ref<"approve" | "reject" | null>(null);

const onSubmitLastStage = async () => {
	if (!additionalLink.value) {
		toast.error("Link RSKKNI harus diisi.");
		return;
	}

	try {
		actionLoading.value = true;

		await approveApplicationNext(applicationId, {
			note: adminNote.value,
			additionalLink: additionalLink.value,
		});

		router.back();
	} finally {
		actionLoading.value = false;
	}
};

// Stage 4 additional link

const stage2AdditionalLink = computed(() => {
	if (!logs.value.length) return null;

	const stage2Logs = logs.value.filter((l: any) => l.stageNumber === 2 && l.additionalLink);

	if (!stage2Logs.length) return null;

	return stage2Logs.at(-1).additionalLink;
});
</script>

<template>
	<div class="p-8 space-y-10 bg-white">
		<button @click="router.back()" class="px-4 py-2 bg-gray-200 rounded text-sm">Kembali</button>

		<!-- HEADER -->
		<div class="flex items-center gap-2 pb-4 border-b">
			<span class="text-blue-600 font-bold text-lg">{{ detail?.applicationNumber }}</span>
		</div>

		<div class="grid md:grid-cols-2 gap-6">
			<!-- LEFT -->
			<div class="space-y-4">
				<div v-for="info in leftInfo" :key="info.label" class="flex justify-between py-3 border-b border-gray-100">
					<span class="text-gray-600 text-sm">{{ info.label }}</span>
					<span class="text-gray-900 font-semibold text-sm">{{ info.value }}</span>
				</div>
			</div>

			<!-- RIGHT -->

			<div class="bg-gray-50 rounded-xl p-6 space-y-6">
				<div class="text-center">
					<h3 class="text-gray-700 font-semibold mb-2">Status Berkas</h3>
					<div class="px-4 py-2 rounded-lg font-bold text-sm" :class="getClassStatus(detail?.lastLogStatus)">
						{{ getTranslateStatus(detail?.lastLogStatus) }}
					</div>
				</div>

				<!-- ACCORDION -->
				<Accordion type="multiple" class="w-full">
					<!-- DAFTAR BERKAS PERMOHONAN -->
					<AccordionItem value="berkas">
						<AccordionTrigger class="font-semibold text-gray-700">Daftar Berkas Permohonan</AccordionTrigger>
						<AccordionContent>
							<div class="space-y-3 mt-3">
								<!-- Surat Permohonan -->
								<div class="flex items-center justify-between p-3 bg-white rounded-lg border" v-if="detail?.requestLetterDocument">
									<div>
										<p class="font-medium text-sm">Surat Permohonan</p>
										<a :href="detail?.requestLetterDocument" target="_blank" class="text-blue-500 text-xs underline">Link Berkas</a>
									</div>
								</div>

								<!-- Dokumen Permohonan -->
								<div class="flex items-center justify-between p-3 bg-white rounded-lg border" v-if="detail?.documentLink">
									<div>
										<p class="font-medium text-sm">Dokumen</p>
										<a :href="detail?.documentLink" target="_blank" class="text-blue-500 text-xs underline">Link Berkas</a>
									</div>
								</div>

								<div class="flex items-center justify-between p-3 bg-white rounded-lg border" v-if="detail?.attachmentLink">
									<div>
										<p class="font-medium text-sm">Surat Usulan Registrasi</p>
										<a :href="detail?.attachmentLink" target="_blank" class="text-blue-500 text-xs underline">Link Berkas</a>
									</div>
								</div>
							</div>
						</AccordionContent>
					</AccordionItem>

					<!-- REQUIREMENTS -->
					<AccordionItem value="requirements">
						<AccordionTrigger class="font-semibold text-gray-700"> Kelengkapan Dokumen </AccordionTrigger>

						<AccordionContent>
							<div class="mt-3 space-y-3">
								<div v-for="(req, index) in detail?.applicationRequirements" :key="req.id" class="flex items-center justify-between p-3 bg-white rounded-lg border">
									<div class="flex items-center gap-2">
										<div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
											{{ index + 1 }}
										</div>
										<p class="font-medium text-sm">{{ req.requirement.description }}</p>
									</div>

									<!-- switch sesuai -->
									<div class="flex items-center gap-2">
										<label class="text-xs text-gray-600">Sesuai</label>
										<Checkbox v-model="req.status" :disabled="detail?.currentStageNumber > 0 || updatingReq === req.requirementId || !detail?.documentLink" @click="onToggleRequirement(req, $event)" />
									</div>
								</div>
							</div>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
		</div>

		<!-- TIMELINE -->
		<div class="mt-10 w-[50%]" v-if="timeline.length && detail?.currentStageNumber > 0">
			<h3 class="text-gray-900 font-bold mb-6">Posisi Berkas</h3>

			<div class="overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead class="w-32">Tahap 1</TableHead>
							<TableHead class="w-32">Tahap 2</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						<TableRow v-for="row in timeline" :key="row.step">
							<TableCell v-for="n in 4" :key="n">
								<template v-if="row['stage' + n]">
									<span class="px-3 py-1 rounded text-xs font-semibold block text-center" :class="getClassStatus((row['stage' + n] as any)?.logs?.at(-1)?.status)">
										<p>{{ (row["stage" + n] as any)?.logs?.at(-1)?.date }}</p>

										<p>{{ getTranslateStatus((row["stage" + n] as any)?.logs?.at(-1)?.status) }}</p>
									</span>

									<Button size="sm" variant="default" class="mt-2 text-xs w-full" @click="openLog('Tahap ' + n, (row['stage' + n] as any)?.logs)"> Lihat </Button>
								</template>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div>
		</div>

		<!-- Actions Approve Form -->
		<div v-if="detail?.currentStageNumber === 0 && detail?.status === 'NEW' && !detail?.confirmationLetterDocument" class="mt-6 border-t pt-6">
			<h3 class="text-gray-900 font-semibold mb-3">Aksi Permohonan</h3>

			<!-- TOGGLE BUTTON -->
			<div class="flex gap-3 mb-6">
				<Button :variant="selectedAction === 'approve' ? 'default' : 'secondary'" @click="selectedAction = 'approve'"> Terima </Button>

				<Button :variant="selectedAction === 'reject' ? 'destructive' : 'secondary'" @click="selectedAction = 'reject'"> Tolak </Button>
			</div>

			<!-- APPROVE FORM -->
			<div class="space-y-6" v-if="selectedAction">
				<div>
					<Label class="text-sm text-gray-600">{{ selectedAction === "approve" ? "Surat Penerimaan" : "Surat Penolakan" }}</Label>
					<Input v-model="letterLink" type="text" placeholder="https://drive.google.com/..." class="w-full rounded-md border p-2 bg-white" />
				</div>

				<div>
					<Label class="text-sm text-gray-600">Catatan Admin</Label>
					<AdminAppEditor v-model="adminNote" rows="4" placeholder="Catatan untuk pengaju..." class="w-full rounded-md p-2 bg-white" />
				</div>

				<div class="flex justify-end">
					<Button
						class="px-4 py-2"
						:disabled="actionLoading || !letterLink || !adminNote"
						@click="
							() => {
								confirmType = selectedAction;
								isConfirmOpen = true;
							}
						"
					>
						Kirim
					</Button>
				</div>
			</div>
		</div>

		<!-- Actions for stage start (detail?.currentStageNumber > 0) -->
		<div v-if="detail?.currentStageNumber > 0 && detail?.currentStageNumber !== 2 && (detail?.status === 'PROCESSING' || detail?.status === 'FIXED')" class="mt-6 border-t pt-6">
			<h3 class="text-gray-900 font-semibold mb-3">Aksi Tahap</h3>

			<!-- TOGGLE BUTTON -->
			<div class="flex gap-3 mb-6">
				<Button :variant="stageAction === 'approve' ? 'default' : 'secondary'" @click="stageAction = 'approve'"> Terima </Button>

				<Button :variant="stageAction === 'fix' ? 'destructive' : 'secondary'" @click="stageAction = 'fix'"> Perbaiki </Button>
			</div>

			<!-- FORM MUNCUL SETELAH PILIH TOGGLE -->
			<div v-if="stageAction" class="space-y-6">
				<div>
					<Label class="text-sm text-gray-600">Catatan Admin</Label>
					<AdminAppEditor v-model="adminNote" rows="4" placeholder="Catatan untuk pengaju..." class="w-full rounded-md border p-2 bg-white" />
				</div>

				<!-- BUTTON -->
				<div class="flex justify-end">
					<Button
						class="px-4 py-2"
						:variant="stageAction === 'approve' ? 'default' : 'destructive'"
						:disabled="actionLoading || !adminNote"
						@click="
							() => {
								stageConfirmOpen = true;
							}
						"
					>
						Kirim
					</Button>
				</div>
			</div>
		</div>

		<!-- ACTIONS: muncul hanya jika stage 0 dan status = NEW_DOCUMENTS -->
		<div v-if="detail?.currentStageNumber === 0 && detail?.status === 'NEW_DOCUMENTS' && detail?.documentLink && detail?.lastLogStatus !== 'NOT_FULFILLED'" class="mt-6 border-t pt-6">
			<h3 class="text-gray-900 font-semibold mb-3">Verifikasi Berkas</h3>

			<!-- TOGGLE BUTTON -->
			<div class="flex gap-3 mb-6">
				<Button :variant="selectedAction === 'approve' ? 'default' : 'secondary'" @click="selectedAction = 'approve'"> Terima </Button>

				<Button :variant="selectedAction === 'reject' ? 'destructive' : 'secondary'" @click="selectedAction = 'reject'"> Tolak </Button>
			</div>

			<!-- APPROVE FORM -->
			<div v-if="selectedAction === 'approve'" class="space-y-6">
				<div>
					<Label class="text-sm text-gray-600">Surat Usulan Registrasi</Label>
					<Input v-model="letterLink" type="text" placeholder="https://drive.google.com/..." class="w-full rounded-md border p-2 bg-white" />
				</div>

				<div>
					<Label class="text-sm text-gray-600">Catatan Admin</Label>
					<AdminAppEditor v-model="adminNote" rows="4" placeholder="Catatan untuk pengaju..." class="w-full rounded-md border p-2 bg-white" />
				</div>

				<div class="flex justify-end">
					<Button class="px-4 py-2" :disabled="actionLoading || !letterLink || !adminNote" @click="onVerifyDocs()"> Kirim </Button>
				</div>
			</div>

			<!-- REJECT FORM -->
			<div v-if="selectedAction === 'reject'" class="space-y-6">
				<div>
					<Label class="text-sm text-gray-600">Catatan Penolakan</Label>
					<AdminAppEditor v-model="adminNote" rows="4" placeholder="Catatan untuk pengaju..." class="w-full rounded-md border p-2 bg-white" />
				</div>

				<div class="flex justify-end">
					<Button variant="destructive" class="px-4 py-2" :disabled="actionLoading || !adminNote" @click="onVerifyDocs()"> Kirim </Button>
				</div>
			</div>
		</div>

		<!-- Actions for fix form -->
		<div v-if="detail?.currentStageNumber > 0 && detail?.status === 'FIXING'" class="mt-6 border-t pt-6">
			<div class="grid grid-cols-1 gap-10">
				<div>
					<Label class="text-sm text-gray-600">Catatan Admin</Label>
					<AdminAppEditor v-model="adminNote" rows="4" placeholder="Catatan untuk pengaju..." class="w-full rounded-md border p-2 bg-white"></AdminAppEditor>
				</div>

				<div class="flex gap-3 justify-end">
					<!-- PERBAIKI -->
					<Button
						variant="default"
						class="px-4 py-2 rounded text-white"
						:disabled="actionLoading || !adminNote"
						@click="
							() => {
								isConfirmOpenFix = true;
							}
						"
					>
						Perbaiki
					</Button>
				</div>
			</div>
		</div>

		<!-- Actions for last stage approve with additional link -->
		<div v-if="detail?.currentStageNumber === 2 && (detail?.status === 'PROCESSING' || detail?.status === 'FIXED')" class="mt-6 border-t pt-6">
			<h3 class="text-gray-900 font-semibold mb-3">Aksi Tahap Akhir</h3>

			<!-- TOGGLE BUTTON -->
			<div class="flex gap-3 mb-6">
				<Button :variant="lastStageAction === 'approve' ? 'default' : 'secondary'" @click="lastStageAction = 'approve'"> Terima </Button>

				<Button :variant="lastStageAction === 'reject' ? 'destructive' : 'secondary'" @click="lastStageAction = 'reject'"> Tolak </Button>
			</div>

			<!-- FORM AKSI -->
			<div v-if="lastStageAction" class="space-y-6">
				<!-- MUNCUL HANYA JIKA TERIMA -->
				<div v-if="lastStageAction === 'approve'">
					<Label class="text-sm text-gray-600">Lampiran Registrasi SKKK/SKKI</Label>
					<Input v-model="additionalLink" type="text" placeholder="https://drive.google.com/..." class="w-full rounded-md border p-2 bg-white" />
				</div>

				<!-- CATATAN ADMIN -->
				<div>
					<Label class="text-sm text-gray-600">Catatan Admin</Label>
					<AdminAppEditor v-model="adminNote" rows="4" placeholder="Catatan untuk pengaju..." class="w-full rounded-md border p-2 bg-white" />
				</div>

				<!-- BUTTON -->
				<div class="flex justify-end">
					<Button
						class="px-4 py-2"
						:variant="lastStageAction === 'approve' ? 'default' : 'destructive'"
						:disabled="actionLoading || !adminNote || (lastStageAction === 'approve' && !additionalLink)"
						@click="
							() => {
								confirmType = lastStageAction;
								isConfirmLastStageOpen = true;
							}
						"
					>
						Kirim
					</Button>
				</div>
			</div>
		</div>

		<!-- Show link stage 4 finished -->
		<div v-if="stage2AdditionalLink && detail?.status === 'COMPLETED' && detail?.currentStageNumber === 2" class="mt-6 p-4 border rounded bg-green-50">
			<p class="text-sm text-gray-700">
				Link Registrasi SKKK/SKKI <a :href="stage2AdditionalLink" target="_blank" class="text-blue-600 underline">{{ stage2AdditionalLink }}</a>
			</p>
		</div>
	</div>

	<!-- LOG DIALOG -->
	<Dialog v-model:open="isOpen">
		<DialogOverlay />
		<DialogContent class="max-w-md">
			<!-- HEADER -->
			<DialogHeader>
				<DialogTitle>{{ selectedStageName }}</DialogTitle>
				<DialogDescription>Riwayat perubahan status.</DialogDescription>
			</DialogHeader>

			<!-- BODY SCROLL ONLY -->
			<div class="max-h-[60vh] overflow-y-auto mt-4 pr-1">
				<div v-for="(log, index) in selectedStageLogs" :key="index" class="p-3 border rounded-lg bg-gray-50">
					<p class="text-sm font-medium">{{ log.date }}</p>

					<p class="inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold" :class="getClassStatus(log.status)">
						{{ getTranslateStatus(log.status) }}
					</p>

					<p class="text-xs text-gray-600 mt-1" v-html="log.note"></p>
				</div>
			</div>
		</DialogContent>
	</Dialog>

	<!-- DIALOG KONFIRMASI -->
	<Dialog v-model:open="isConfirmOpen">
		<DialogOverlay />
		<DialogContent class="max-w-md">
			<!-- HEADER -->
			<DialogHeader>
				<DialogTitle>Konfirmasi {{ confirmType === "approve" ? "Penerimaan" : "Penolakan" }}</DialogTitle>
				<DialogDescription>Pastikan data berikut sudah benar sebelum melanjutkan.</DialogDescription>
			</DialogHeader>

			<!-- BODY -->
			<div class="max-h-[60vh] overflow-y-auto mt-4 pr-1">
				<div class="p-3 border rounded bg-gray-50">
					<p class="text-xs text-gray-500">Link Surat Balasan:</p>
					<p class="text-sm font-medium break-all">{{ letterLink }}</p>
				</div>

				<div class="p-3 border rounded bg-gray-50 mt-4">
					<p class="text-xs text-gray-500">Catatan Admin:</p>
					<p class="text-sm whitespace-pre-wrap" v-html="adminNote"></p>
				</div>
			</div>

			<!-- FOOTER -->
			<div class="flex justify-end gap-3 mt-6">
				<Button variant="secondary" @click="isConfirmOpen = false">Batal</Button>
				<Button :disabled="actionLoading" @click="confirmType === 'approve' ? approveFirst() : rejectFirst()" :variant="confirmType === 'approve' ? 'default' : 'destructive'">
					{{ actionLoading ? "Memproses..." : confirmType === "approve" ? "Ya, Terima" : "Ya, Tolak" }}
				</Button>
			</div>
		</DialogContent>
	</Dialog>

	<!-- STAGE CONFIRM -->
	<Dialog v-model:open="stageConfirmOpen">
		<DialogOverlay />
		<DialogContent class="max-w-md">
			<!-- HEADER -->
			<DialogHeader>
				<DialogTitle>Konfirmasi {{ stageAction === "approve" ? "Penerimaan" : "Permintaan Perbaikan" }}</DialogTitle>
				<DialogDescription>Pastikan data berikut benar.</DialogDescription>
			</DialogHeader>

			<!-- BODY -->
			<div class="max-h-[60vh] overflow-y-auto mt-4 pr-1">
				<div class="p-3 border rounded bg-gray-50">
					<p class="text-xs text-gray-500">Catatan Admin:</p>
					<p class="text-sm whitespace-pre-wrap" v-html="adminNote"></p>
				</div>
			</div>

			<!-- FOOTER -->
			<div class="flex justify-end gap-3 mt-6">
				<Button variant="secondary" @click="stageConfirmOpen = false">Batal</Button>
				<Button :disabled="actionLoading" @click="stageAction === 'approve' ? approveStage() : fixStage()" variant="default">
					{{ actionLoading ? "Memproses..." : stageAction === "approve" ? "Ya, Terima" : "Ya, Perbaiki" }}
				</Button>
			</div>
		</DialogContent>
	</Dialog>

	<!-- CONFIRM FIX -->
	<Dialog v-model:open="isConfirmOpenFix">
		<DialogOverlay />
		<DialogContent class="max-w-md">
			<!-- HEADER -->
			<DialogHeader>
				<DialogTitle>Konfirmasi Perbaikan</DialogTitle>
				<DialogDescription>Pastikan data berikut benar.</DialogDescription>
			</DialogHeader>

			<!-- BODY -->
			<div class="max-h-[60vh] overflow-y-auto mt-4 pr-1">
				<div class="p-3 border rounded bg-gray-50">
					<p class="text-xs text-gray-500">Catatan Admin:</p>
					<p class="text-sm whitespace-pre-wrap" v-html="adminNote"></p>
				</div>
			</div>

			<!-- FOOTER -->
			<div class="flex justify-end gap-3 mt-6">
				<Button variant="secondary" @click="isConfirmOpenFix = false">Batal</Button>
				<Button :disabled="actionLoading" @click="onSubmitApplicationFix" variant="default">
					{{ actionLoading ? "Memproses..." : "Ya, Perbaiki" }}
				</Button>
			</div>
		</DialogContent>
	</Dialog>

	<!-- LAST STAGE CONFIRM -->
	<Dialog v-model:open="isConfirmLastStageOpen">
		<DialogOverlay />
		<DialogContent class="max-w-md">
			<!-- HEADER -->
			<DialogHeader>
				<DialogTitle> Konfirmasi {{ lastStageAction === "approve" ? "Penerimaan" : "Penolakan" }} </DialogTitle>
				<DialogDescription> Pastikan data berikut sudah benar sebelum melanjutkan. </DialogDescription>
			</DialogHeader>

			<!-- BODY -->
			<div class="max-h-[60vh] overflow-y-auto mt-4 pr-1">
				<!-- MUNCUL HANYA JIKA APPROVE -->
				<div v-if="lastStageAction === 'approve'" class="p-3 border rounded bg-gray-50">
					<p class="text-xs text-gray-500">Lampiran Registrasi SKKK/SKKI</p>
					<p class="text-sm font-medium break-all">
						{{ additionalLink }}
					</p>
				</div>

				<!-- Catatan admin tampil untuk dua-duanya -->
				<div class="p-3 border rounded bg-gray-50 mt-4">
					<p class="text-xs text-gray-500">Catatan Admin:</p>
					<p class="text-sm whitespace-pre-wrap" v-html="adminNote"></p>
				</div>
			</div>

			<!-- FOOTER -->
			<div class="flex justify-end gap-3 mt-6">
				<Button variant="secondary" @click="isConfirmLastStageOpen = false"> Batal </Button>

				<Button :disabled="actionLoading" @click="lastStageAction === 'approve' ? onSubmitLastStage() : fixStage()" :variant="lastStageAction === 'approve' ? 'default' : 'destructive'">
					{{ actionLoading ? "Memproses..." : lastStageAction === "approve" ? "Ya, Terima" : "Ya, Tolak" }}
				</Button>
			</div>
		</DialogContent>
	</Dialog>
</template>
