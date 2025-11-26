<script setup lang="ts">
import { useRoute } from "vue-router";
import { toast } from "vue-sonner";
import getClassStatus from "~/helper/getClassStatus";
import getTranslateStatus from "~/helper/getTranslateStatus";

import { getApplicationDetail, getApplicationLogs, submitApplicationDocs, submitApplicationFix } from "~/services/application.services";

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

const props = defineProps<{
	applicationId: number;
}>();

const emit = defineEmits<{
	(event: "close"): void;
}>();

const route = useRoute();

const applicationId = Number(route.params.id) || props.applicationId;

// ========== STATE ==========
const detail = ref<any>(null);
const logs = ref<any[]>([]);

const actionLoading = ref(false);
const isLoading = ref(true); // <-- loading state untuk fetch

// Log dialog
const isLogOpen = ref(false);
const logStageName = ref("");
const logItems = ref<any[]>([]);

const openLog = (name: string, list: any[]) => {
	logStageName.value = name;
	logItems.value = list;
	isLogOpen.value = true;
};

// ========== LEFT INFO ==========
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

onMounted(async () => {
	isLoading.value = true;

	detail.value = await getApplicationDetail(applicationId);
	const raw = (await getApplicationLogs(applicationId)) as any[];

	logs.value = raw.filter((s: any) => s.stageNumber > 0).flatMap((s: any) => (s.logs || []).map((l: any) => ({ ...l, stageNumber: s.stageNumber })));

	isLoading.value = false;
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

const docsLink = ref("");
const onSubmitDocs = async () => {
	try {
		if (!docsLink.value) {
			toast.error("Link dokumen wajib diisi.");
			return;
		}

		actionLoading.value = true;

		await submitApplicationDocs(applicationId, {
			documentLink: docsLink.value,
		});

		emit("close");
	} finally {
		actionLoading.value = false;
	}
};

const fixStage = async () => {
	actionLoading.value = true;
};

const onAllowSubmitDocs = (detail: any) => {
	console.log(detail);

	return detail.currentStageNumber === 0 && detail.requestLetterDocument && !detail.documentLink && detail.confirmationLetterDocument;
};

const isConfirmOpenFix = ref(false);
const docsEditedLink = ref("");
const onSubmitApplicationFix = async () => {
	try {
		actionLoading.value = true;

		await submitApplicationDocs(applicationId, {
			documentLink: docsEditedLink.value,
		});

		emit("close");
	} finally {
		actionLoading.value = false;
	}
};

// Stage 2 additional link
const stage2AdditionalLink = computed(() => {
	if (!logs.value.length) return null;

	const stage2Logs = logs.value.filter((l: any) => l.stageNumber === 2 && l.additionalLink);

	if (!stage2Logs.length) return null;

	return stage2Logs.at(-1).additionalLink;
});
</script>

<template>
	<div class="relative p-8 space-y-10">
		<!-- LOADING OVERLAY -->
		<div v-if="isLoading" class="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm" aria-hidden="true">
			<div class="flex flex-col items-center gap-3">
				<!-- spinner (shadcn-like) -->
				<svg class="w-10 h-10 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
				</svg>
				<span class="text-sm font-medium text-gray-700">Memuat data...</span>
			</div>
		</div>

		<template v-else>
			<h2 class="font-semibold text-xl">{{ detail?.applicationNumber }}</h2>

			<div class="grid md:grid-cols-2 gap-6">
				<!-- LEFT -->
				<div class="space-y-4">
					<div v-for="info in leftInfo" :key="info.label" class="flex justify-between border-b py-2">
						<span class="text-gray-600">{{ info.label }}</span>
						<span class="text-gray-900 font-semibold">{{ info.value }}</span>
					</div>
				</div>

				<!-- RIGHT STATUS -->
				<div class="p-6 bg-gray-50 rounded-xl">
					<div class="text-center mb-6">
						<h3 class="font-semibold text-gray-700">Status</h3>
						<div class="px-4 py-2 mt-2 rounded text-sm font-bold" :class="getClassStatus(detail?.lastLogStatus)">
							{{ getTranslateStatus(detail?.lastLogStatus) }}
						</div>
					</div>

					<!-- REQUIREMENTS -->
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
											<Checkbox v-model="req.status" disabled />
										</div>
									</div>
								</div>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</div>
			</div>

			<!-- timeline -->
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

										<Button size="sm" variant="default" class="mt-2 text-xs w-full" @click="openLog('Tahap ' + n, (row['stage' + n] as any)?.logs)"> Lihat Log </Button>
									</template>
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</div>
			</div>

			<!-- ACTIONS STAGE 0 -->
			<div v-if="onAllowSubmitDocs(detail)" class="mt-8 border-t pt-6">
				<h3 class="font-semibold text-gray-900 mb-4">Pengajuan Anda Diterima, Harap Lengkapi Berkas</h3>

				<div class="space-y-4">
					<div>
						<Label class="text-sm text-gray-700">Link Dokumen</Label>
						<Input v-model="docsLink" class="w-full p-2 border rounded" />
					</div>

					<div class="flex justify-end gap-3">
						<Button @click="onSubmitDocs" class="px-4 py-2 bg-blue-600 text-white rounded" :disabled="actionLoading || isLoading"> Kirim </Button>
					</div>
				</div>
			</div>

			<!-- Actions for fix docs stage 0 -->
			<div v-if="detail?.currentStageNumber === 0 && detail?.lastLogStatus === 'NOT_FULFILLED' && detail?.documentLink" class="mt-6 border-t pt-6">
				<div class="grid grid-cols-1 gap-10">
					<div>
						<Label class="text-sm text-gray-700">Link Dokumen</Label>
						<Input v-model="docsEditedLink" class="w-full p-2 border rounded" />
					</div>

					<div class="flex gap-3 justify-end">
						<!-- PERBAIKI -->
						<Button
							variant="default"
							class="px-4 py-2 rounded text-white"
							:disabled="actionLoading"
							@click="
								() => {
									isConfirmOpenFix = true;
								}
							"
						>
							Dilengkapi
						</Button>
					</div>
				</div>
			</div>

			<!-- Show link stage 2 finished -->
			<div v-if="stage2AdditionalLink && detail?.status === 'COMPLETED' && detail?.currentStageNumber === 2" class="mt-6 p-4 border rounded bg-green-50">
				<p class="text-sm text-gray-700">
					Link Registrasi SKKK/SKKI <a :href="stage2AdditionalLink" target="_blank" class="text-blue-600 underline">{{ stage2AdditionalLink }}</a>
				</p>
			</div>
		</template>
	</div>

	<!-- LOG DIALOG -->
	<Dialog v-model:open="isLogOpen">
		<DialogContent class="max-w-md">
			<DialogHeader>
				<DialogTitle>{{ logStageName }}</DialogTitle>
				<DialogDescription>Riwayat perubahan status</DialogDescription>
			</DialogHeader>

			<div class="space-y-3 mt-4">
				<div v-for="(log, index) in logItems" :key="index" class="p-3 border rounded-lg bg-gray-50">
					<p class="text-sm font-medium">{{ log.date }}</p>

					<p class="inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold" :class="getClassStatus(log.status)">
						{{ getTranslateStatus(log.status) }}
					</p>

					<p class="text-xs text-gray-600 mt-1" v-html="log.note"></p>
				</div>
			</div>
		</DialogContent>
	</Dialog>

	<!-- Confirm FIX -->
	<Dialog v-model:open="isConfirmOpenFix">
		<DialogContent class="max-w-md">
			<DialogHeader>
				<DialogTitle> Konfirmasi Kelengkapan Berkas </DialogTitle>
				<DialogDescription> Pastikan berkas sudah lengkap untuk di verifikasi </DialogDescription>
			</DialogHeader>

			<div class="flex justify-end gap-3 mt-6">
				<Button variant="secondary" @click="isConfirmOpenFix = false"> Batal </Button>

				<Button :disabled="actionLoading" @click="onSubmitApplicationFix" variant="default">
					{{ actionLoading ? "Memproses..." : "Ya, Sudah Lengkap" }}
				</Button>
			</div>
		</DialogContent>
	</Dialog>
</template>
