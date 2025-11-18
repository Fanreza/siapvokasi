<script setup lang="ts">
import { toast } from "vue-sonner";

definePageMeta({
	middleware: "admin",
	layout: "admin",
});

import { useRoute, useRouter } from "vue-router";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { getApplicationDetail, getApplicationLogs, approveApplicationFirst, rejectApplication, approveApplicationNext, requestApplicationFix } from "~/services/application.services";

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
	stage3: Stage;
	stage4: Stage;
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

// STATUS COLOR
const getStageClass = (status: string) => {
	if (!status) return "bg-gray-100 text-gray-600";
	status = status.toLowerCase();

	if (["processing"].includes(status)) return "bg-blue-100 text-blue-700";
	if (["perbaikan", "revision", "diperbaiki"].includes(status)) return "bg-yellow-100 text-yellow-700";
	if (["rejected", "ditolak"].includes(status)) return "bg-red-100 text-red-700";
	if (["completed", "selesai"].includes(status)) return "bg-green-100 text-green-700";
	return "bg-gray-100 text-gray-700";
};

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

// ✨ TIMELINE — juga computed langsung
// ✨ TIMELINE — juga computed langsung
const timeline = computed<TimelineRow[]>(() => {
	if (!detail.value || !Array.isArray(logs.value)) return [];

	// Group logs by stage (handle log.stageNumber AND log.preStage)
	const grouped: Record<number, StageLog[]> = {};

	// ensure we keep stable sort: older first
	const sortedLogs = [...logs.value].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

	for (const lg of sortedLogs) {
		// 1) push by explicit stageNumber if present and > 0
		if (lg.stageNumber != null && Number(lg.stageNumber) > 0) {
			const s = Number(lg.stageNumber);
			grouped[s] = grouped[s] || [];
			grouped[s].push({
				date: new Date(lg.createdAt).toLocaleString("id-ID"),
				status: lg.status,
				note: lg.note,
			});
		}

		// 2) if log contains preStage object, map that preStage.id into grouped
		if (lg.preStage && typeof lg.preStage.id !== "undefined" && lg.preStage.id != null) {
			const ps = Number(lg.preStage.id);
			// try to use preStage.createdAt if available, otherwise fall back to log.createdAt
			const preCreatedAt = lg.preStage.createdAt || lg.createdAt;
			grouped[ps] = grouped[ps] || [];
			grouped[ps].push({
				date: new Date(preCreatedAt).toLocaleString("id-ID"),
				status: lg.preStage.status || lg.status || "UNKNOWN",
				note: lg.preStage.letterLink ?? lg.note,
			});
		}
	}

	// Detect if we actually have any stage 1..4 entries to show
	const hasStages = [1, 2, 3, 4].some((s) => Array.isArray(grouped[s]) && grouped[s].length > 0);
	if (!hasStages) return [];

	// Build one-row timeline with stage1..stage4 (null if missing)
	return [
		{
			step: detail.value.currentStageNumber ?? 0,
			stage1: grouped[1] ? { logs: grouped[1] } : null,
			stage2: grouped[2] ? { logs: grouped[2] } : null,
			stage3: grouped[3] ? { logs: grouped[3] } : null,
			stage4: grouped[4] ? { logs: grouped[4] } : null,
		},
	];
});

// LOAD
onMounted(async () => {
	detail.value = await getApplicationDetail(applicationId);
	logs.value = (await getApplicationLogs(applicationId)) as any[];
});

// ACTIONS for initial stage (currentStageNumber === 0)
const letterLink = ref("");
const adminNote = ref("");
const actionLoading = ref(false);

// CONFIRMATION DIALOG
const isConfirmOpen = ref(false);
const confirmType = ref<"approve" | "reject" | null>(null);

const approveFirst = async () => {
	try {
		actionLoading.value = true;
		await approveApplicationFirst(applicationId, {
			letterLink: letterLink.value,
			note: adminNote.value,
		});

		toast.success("Pengajuan berhasil diterima.");

		router.back();
	} catch (err) {
	} finally {
		actionLoading.value = false;
	}
};

const rejectFirst = async () => {
	try {
		actionLoading.value = true;
		await rejectApplication(applicationId, {
			letterLink: letterLink.value,
			note: adminNote.value,
		});

		toast.success("Pengajuan berhasil ditolak.");

		router.back();
	} catch (err) {
	} finally {
		actionLoading.value = false;
	}
};

const stageAction = ref<"approve" | "fix" | null>(null);
const stageConfirmOpen = ref(false);

const approveStage = async () => {
	try {
		actionLoading.value = true;

		await approveApplicationNext(applicationId, {
			note: adminNote.value,
		});

		toast.success("Pengajuan berhasil diterima.");

		router.back();
	} finally {
		actionLoading.value = false;
	}
};

const fixStage = async () => {
	try {
		actionLoading.value = true;

		const notSuitableIds = detail.value.applicationRequirements.filter((req: any) => req.status === false).map((req: any) => req.id);

		await requestApplicationFix(applicationId, {
			note: adminNote.value,
			requirementIds: notSuitableIds,
		});

		toast.success("Permintaan perbaikan berhasil dikirim.");

		router.back();
	} finally {
		actionLoading.value = false;
	}
};
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
					<div class="px-4 py-2 rounded-lg font-bold text-sm" :class="getStageClass(detail?.status)">
						{{ detail?.status }}
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
								<div class="flex items-center justify-between p-3 bg-white rounded-lg border">
									<div>
										<p class="font-medium text-sm">Surat Permohonan</p>
										<a :href="detail?.requestLetterDocument" target="_blank" class="text-blue-500 text-xs underline">Link Berkas</a>
									</div>
								</div>

								<!-- Dokumen Utama -->
								<div class="flex items-center justify-between p-3 bg-white rounded-lg border">
									<div>
										<p class="font-medium text-sm">Dokumen Utama</p>
										<a :href="detail?.mainDocument" target="_blank" class="text-blue-500 text-xs underline">Link Berkas</a>
									</div>
								</div>

								<!-- Lampiran -->
								<div class="flex items-center justify-between p-3 bg-white rounded-lg border">
									<div>
										<p class="font-medium text-sm">Lampiran</p>
										<a :href="detail?.attachmentDocument" target="_blank" class="text-blue-500 text-xs underline">Link Berkas</a>
									</div>
								</div>
							</div>
						</AccordionContent>
					</AccordionItem>

					<!-- REQUIREMENTS -->
					<AccordionItem value="requirements" v-if="detail?.currentStageNumber > 0">
						<AccordionTrigger class="font-semibold text-gray-700"> Kelengkapan Dokumen </AccordionTrigger>

						<AccordionContent>
							<div class="mt-3 space-y-3">
								<div v-for="(req, index) in detail?.applicationRequirements" :key="req.id" class="flex items-center justify-between p-3 bg-white rounded-lg border">
									<div>
										<div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
											{{ index + 1 }}
										</div>
										<p class="font-medium text-sm">{{ req.requirement.description }}</p>
									</div>

									<!-- switch sesuai -->
									<div class="flex items-center gap-2">
										<label class="text-xs text-gray-600">Sesuai</label>
										<Checkbox :checked="!!req.status" @update:checked="(val: any) => (req.status = val)" />
									</div>
								</div>
							</div>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
		</div>

		<!-- TIMELINE -->
		<div class="mt-10" v-if="timeline.length > 0">
			<h3 class="text-gray-900 font-bold mb-6">Posisi Berkas</h3>

			<div class="overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead class="w-32">Tahap 1</TableHead>
							<TableHead class="w-32">Tahap 2</TableHead>
							<TableHead class="w-32">Tahap 3</TableHead>
							<TableHead class="w-32">Tahap 4</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						<TableRow v-for="row in timeline" :key="row.step">
							<TableCell v-for="n in 4" :key="n">
								<div v-if="row['stage' + n]">
									<span class="px-3 py-1 rounded text-xs font-semibold block" :class="getStageClass(row['stage' + n].logs.at(-1).status)">
										{{ row["stage" + n].logs.at(-1).date }}
										<br />
										{{ row["stage" + n].logs.at(-1).status }}
									</span>

									<Button size="sm" variant="default" class="mt-2 text-xs" @click="openLog('Tahap ' + n, row['stage' + n].logs)"> Lihat Log </Button>
								</div>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div>
		</div>

		<!-- ACTIONS for initial stage (currentStageNumber === 0) -->
		<div v-if="detail?.currentStageNumber === 0" class="mt-6 border-t pt-6">
			<h3 class="text-gray-900 font-semibold mb-3">Tindakan Admin (Tahap Awal)</h3>

			<div class="grid grid-cols-1 gap-10">
				<div>
					<Label class="text-sm text-gray-600">Surat Balasan (Link)</Label>
					<Input v-model="letterLink" type="text" placeholder="https://drive.google.com/..." class="w-full rounded-md border p-2 bg-white" />
				</div>

				<div>
					<Label class="text-sm text-gray-600">Catatan Admin</Label>
					<AdminAppEditor v-model="adminNote" rows="4" placeholder="Catatan untuk pengaju..." class="w-full rounded-md border p-2 bg-white"></AdminAppEditor>
				</div>

				<div class="flex gap-3 justify-end">
					<Button
						@click="
							() => {
								confirmType = 'reject';
								isConfirmOpen = true;
							}
						"
						:disabled="actionLoading || !letterLink || !adminNote"
						variant="destructive"
						class="px-4 py-2 rounded text-white"
					>
						Tolak
					</Button>

					<Button
						@click="
							() => {
								confirmType = 'approve';
								isConfirmOpen = true;
							}
						"
						:disabled="actionLoading || !letterLink || !adminNote"
						class="px-4 py-2 rounded text-white"
					>
						Terima
					</Button>
				</div>
			</div>
		</div>

		<!-- Actions for stage start (detail?.currentStageNumber > 0) -->
		<div v-if="detail?.currentStageNumber > 0" class="mt-6 border-t pt-6">
			<div class="grid grid-cols-1 gap-10">
				<div>
					<Label class="text-sm text-gray-600">Catatan Admin</Label>
					<AdminAppEditor v-model="adminNote" rows="4" placeholder="Catatan untuk pengaju..." class="w-full rounded-md border p-2 bg-white"></AdminAppEditor>
				</div>

				<div class="flex gap-3 justify-end">
					<!-- PERBAIKI -->
					<Button
						variant="destructive"
						class="px-4 py-2 rounded text-white"
						:disabled="actionLoading || !adminNote"
						@click="
							() => {
								stageAction = 'fix';
								stageConfirmOpen = true;
							}
						"
					>
						Perbaiki
					</Button>

					<!-- TERIMA -->
					<Button
						class="px-4 py-2 rounded text-white"
						:disabled="actionLoading || !adminNote"
						@click="
							() => {
								stageAction = 'approve';
								stageConfirmOpen = true;
							}
						"
					>
						Terima
					</Button>
				</div>
			</div>
		</div>
	</div>

	<!-- LOG DIALOG -->
	<Dialog v-model:open="isOpen">
		<DialogContent class="max-w-md">
			<DialogHeader>
				<DialogTitle>{{ selectedStageName }}</DialogTitle>
				<DialogDescription>Riwayat perubahan status.</DialogDescription>
			</DialogHeader>

			<div class="mt-4 space-y-3">
				<div v-for="(log, index) in selectedStageLogs" :key="index" class="p-3 border rounded-lg bg-gray-50">
					<p class="text-sm font-medium">{{ log.date }}</p>

					<p class="inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold" :class="getStageClass(log.status)">
						{{ log.status }}
					</p>

					<!-- <p class="text-xs text-gray-600 mt-1" v-html="log.note"></p> -->
				</div>
			</div>
		</DialogContent>
	</Dialog>

	<!-- DIALOG KONFIRMASI -->
	<Dialog v-model:open="isConfirmOpen">
		<DialogContent class="max-w-md">
			<DialogHeader>
				<DialogTitle>Konfirmasi {{ confirmType === "approve" ? "Penerimaan" : "Penolakan" }}</DialogTitle>
				<DialogDescription> Pastikan data berikut sudah benar sebelum melanjutkan. </DialogDescription>
			</DialogHeader>

			<div class="mt-4 space-y-4">
				<div class="p-3 border rounded bg-gray-50">
					<p class="text-xs text-gray-500">Link Surat Balasan:</p>
					<p class="text-sm font-medium break-all">{{ letterLink }}</p>
				</div>

				<div class="p-3 border rounded bg-gray-50">
					<p class="text-xs text-gray-500">Catatan Admin:</p>
					<p class="text-sm whitespace-pre-wrap" v-html="adminNote"></p>
				</div>
			</div>

			<div class="flex justify-end gap-3 mt-6">
				<Button variant="secondary" @click="isConfirmOpen = false">Batal</Button>

				<!-- Execution -->
				<Button :disabled="actionLoading" @click="confirmType === 'approve' ? approveFirst() : rejectFirst()" :variant="confirmType === 'approve' ? 'default' : 'destructive'" class="px-4 py-2">
					{{ actionLoading ? "Memproses..." : confirmType === "approve" ? "Ya, Terima" : "Ya, Tolak" }}
				</Button>
			</div>
		</DialogContent>
	</Dialog>

	<Dialog v-model:open="stageConfirmOpen">
		<DialogContent class="max-w-md">
			<DialogHeader>
				<DialogTitle> Konfirmasi {{ stageAction === "approve" ? "Penerimaan" : "Permintaan Perbaikan" }} </DialogTitle>
				<DialogDescription> Pastikan data berikut benar. </DialogDescription>
			</DialogHeader>

			<div class="mt-4 space-y-4">
				<!-- CATATAN ADMIN -->
				<div class="p-3 border rounded bg-gray-50">
					<p class="text-xs text-gray-500">Catatan Admin:</p>
					<p class="text-sm whitespace-pre-wrap" v-html="adminNote"></p>
				</div>

				<!-- LIST PERBAIKAN -->
				<div v-if="stageAction === 'fix'" class="p-3 border rounded bg-red-50">
					<p class="text-xs text-gray-500 mb-2">Dokumen yang perlu diperbaiki:</p>

					<ul class="list-disc pl-5 text-sm space-y-1">
						<li v-for="req in detail.applicationRequirements.filter((r: any) => r.status === false)" :key="req.id">
							{{ req.requirement.description }}
						</li>
					</ul>
				</div>
			</div>

			<div class="flex justify-end gap-3 mt-6">
				<Button variant="secondary" @click="stageConfirmOpen = false"> Batal </Button>

				<Button :disabled="actionLoading" @click="stageAction === 'approve' ? approveStage() : fixStage()" :variant="stageAction === 'approve' ? 'default' : 'destructive'">
					{{ actionLoading ? "Memproses..." : stageAction === "approve" ? "Ya, Terima" : "Ya, Perbaiki" }}
				</Button>
			</div>
		</DialogContent>
	</Dialog>
</template>
