<script setup lang="ts">
import { ref, computed } from "vue";
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
	[key: string]: any;
};

// Props dari page tracking
const props = defineProps<{
	detail: any;
	logs: any[];
}>();

const isLoading = ref(false);

const isLogOpen = ref(false);
const logStageName = ref("");
const logItems = ref<any[]>([]);

const openLog = (name: string, list: any[]) => {
	logStageName.value = name;
	logItems.value = list;
	isLogOpen.value = true;
};

const leftInfo = computed(() => {
	const d = props.detail;
	if (!d) return [];

	return [
		{ label: "Jenis Layanan", value: d.service?.name },
		{ label: "Nama Pengajuan", value: d.applicationName },
		{ label: "Nama Pengusul", value: d.applicantName },
		{ label: "Nama Instansi", value: d.instanceName || "-" },
		{ label: "Alamat", value: d.applicantAddress },
		{
			label: "Tanggal Surat",
			value: new Date(d.applicationDate).toLocaleDateString("id-ID"),
		},
	];
});

const timeline = computed<TimelineRow[]>(() => {
	const list = props.logs || [];
	if (!list.length) return [];

	const stages: Record<number, Stage> = {};

	for (const l of list) {
		const sn = Number(l.stageNumber);
		if (!stages[sn]) stages[sn] = { logs: [] };

		stages[sn].logs.push({
			...l,
			date: new Date(l.createdAt).toLocaleDateString("id-ID", {
				day: "2-digit",
				month: "long",
				year: "numeric",
			}),
		});
	}

	return [
		{
			step: props.detail?.currentStageNumber ?? 1,
			stage1: stages[1] ?? null,
			stage2: stages[2] ?? null,
		},
	];
});

const stage2AdditionalLink = computed(() => {
	return props.logs?.filter((l: any) => l.stageNumber === 2 && l.status === "COMPLETED" && l.additionalLink)?.at(-1)?.additionalLink || null;
});
</script>

<template>
	<div class="relative p-8 space-y-10">
		<!-- LOADING OVERLAY -->
		<div v-if="isLoading" class="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm" aria-hidden="true">
			<div class="flex flex-col items-center gap-3">
				<svg class="w-10 h-10 animate-spin" viewBox="0 0 24 24" fill="none">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
				</svg>
				<span class="text-sm font-medium text-gray-700">Memuat data...</span>
			</div>
		</div>

		<template v-else>
			<h2 class="font-semibold text-xl">{{ detail?.code }}</h2>

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
						<!-- BERKAS PERMOHONAN -->
						<AccordionItem value="berkas">
							<AccordionTrigger class="font-semibold text-gray-700"> Daftar Berkas Permohonan </AccordionTrigger>

							<AccordionContent>
								<div class="space-y-3 mt-3">
									<!-- Surat Permohonan -->
									<div class="flex items-center justify-between p-3 bg-white rounded-lg border" v-if="detail?.requestLetterDocument">
										<div>
											<p class="font-medium text-sm">Surat Permohonan</p>
											<a :href="detail?.requestLetterDocument" target="_blank" class="text-blue-500 text-xs underline"> Link Berkas </a>
										</div>
									</div>

									<!-- Dokumen -->
									<div class="flex items-center justify-between p-3 bg-white rounded-lg border" v-if="detail?.documentLink">
										<div>
											<p class="font-medium text-sm">Dokumen</p>
											<a :href="detail?.documentLink" target="_blank" class="text-blue-500 text-xs underline"> Link Berkas </a>
										</div>
									</div>

									<!-- Draft SKKNI -->
									<div class="flex items-center justify-between p-3 bg-white rounded-lg border" v-if="detail?.attachmentLink">
										<div>
											<p class="font-medium text-sm">Draft SKKNI</p>
											<a :href="detail?.attachmentLink" target="_blank" class="text-blue-500 text-xs underline"> Link Berkas </a>
										</div>
									</div>
								</div>
							</AccordionContent>
						</AccordionItem>

						<!-- REQUIREMENTS -->
						<AccordionItem value="requirements" v-if="detail?.status !== 'NEW'">
							<AccordionTrigger class="font-semibold text-gray-700"> Kelengkapan Dokumen </AccordionTrigger>

							<AccordionContent>
								<div class="mt-3 space-y-3">
									<div v-for="(req, index) in detail?.requirements" :key="req.id" class="flex items-center justify-between p-3 bg-white rounded-lg border">
										<div class="flex items-center gap-2">
											<div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
												{{ index + 1 }}
											</div>
											<p class="font-medium text-sm">{{ req.description }}</p>
										</div>

										<div class="flex items-center gap-2">
											<label class="text-xs text-gray-600">Ada</label>
											<Checkbox v-model="req.status" disabled />
										</div>
									</div>
								</div>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</div>
			</div>

			<!-- TIMELINE -->
			<div class="mt-10 w-full" v-if="timeline.length && detail?.currentStageNumber > 0">
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
										<span class="px-3 py-1 rounded text-xs font-semibold block text-center" :class="getClassStatus(row['stage' + n]?.logs?.at(-1)?.status)">
											<p>{{ row["stage" + n]?.logs?.at(-1)?.date }}</p>
											<p>
												{{ getTranslateStatus(row["stage" + n]?.logs?.at(-1)?.status) }}
											</p>
										</span>

										<Button size="sm" variant="default" class="mt-2 text-xs w-full" @click="openLog('Tahap ' + n, row['stage' + n].logs)"> Lihat </Button>
									</template>
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</div>
			</div>

			<!-- Show Acceptance Link -->
			<div v-if="detail?.confirmationLetterDocument" class="mt-6 flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm">
				<div class="flex flex-col">
					<p class="font-medium text-gray-800 text-sm">Surat Penerimaan</p>
					<p class="text-xs text-gray-500">{{ detail?.confirmationLetterDocument }}</p>
				</div>

				<a :href="detail?.confirmationLetterDocument" target="_blank" class="px-4 py-2 bg-blue-600 text-white text-xs rounded-lg font-semibold shadow hover:bg-blue-700 transition"> DOWNLOAD </a>
			</div>

			<!-- LINK SKKNI FINAL -->
			<div v-if="stage2AdditionalLink && detail?.status === 'COMPLETED' && detail?.currentStageNumber === 4" class="mt-6 flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm">
				<div class="flex flex-col">
					<p class="font-medium text-gray-800 text-sm">Dokumen SKKK/SKKI Final</p>
					<p class="text-xs text-gray-500">{{ stage2AdditionalLink }}</p>
				</div>

				<a :href="stage2AdditionalLink" target="_blank" class="px-4 py-2 bg-blue-600 text-white text-xs rounded-lg font-semibold shadow hover:bg-blue-700 transition"> DOWNLOAD </a>
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
</template>
