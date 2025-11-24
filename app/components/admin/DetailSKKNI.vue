<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import { getApplicationDetail, getApplicationLogs, approveApplicationFirst, rejectApplication, approveApplicationNext, requestApplicationFix } from "~/services/application.services";

// ========== ROUTER ==========
definePageMeta({ middleware: "admin", layout: "admin" });

const props = defineProps<{
	applicationId: number;
}>();

const route = useRoute();
const router = useRouter();
const applicationId = Number(route.params.id) || props.applicationId;

// ========== STATE ==========
const detail = ref<any>(null);
const logs = ref<any[]>([]);

const letterLink = ref("");
const adminNote = ref("");
const actionLoading = ref(false);

// Log dialog
const isLogOpen = ref(false);
const logStageName = ref("");
const logItems = ref<any[]>([]);

const openLog = (name: string, list: any[]) => {
	logStageName.value = name;
	logItems.value = list;
	isLogOpen.value = true;
};

// ========== LOAD DATA ==========
onMounted(async () => {
	detail.value = await getApplicationDetail(applicationId || props.applicationId);
	logs.value = (await getApplicationLogs(applicationId || props.applicationId)) as any[];
});

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

// ========== TIMELINE (4 STAGE) ==========
const getStageClass = (status: string) => {
	if (!status) return "bg-gray-100 text-gray-700";
	status = status.toLowerCase();

	if (status.includes("processing")) return "bg-blue-100 text-blue-700";
	if (status.includes("perbaikan")) return "bg-yellow-100 text-yellow-700";
	if (status.includes("rejected")) return "bg-red-100 text-red-700";
	if (status.includes("completed")) return "bg-green-100 text-green-700";

	return "bg-gray-100 text-gray-700";
};

const timeline = computed(() => {
	if (!logs.value.length) return [];

	const grouped: Record<number, any[]> = {};

	for (const lg of logs.value) {
		if (lg.stageNumber) {
			const s = Number(lg.stageNumber);
			grouped[s] = grouped[s] || [];
			grouped[s].push({
				date: new Date(lg.createdAt).toLocaleString("id-ID"),
				status: lg.status,
				note: lg.note,
			});
		}
	}

	return [
		{
			step: detail.value?.currentStageNumber,
			stage1: grouped[1] || null,
			stage2: grouped[2] || null,
			stage3: grouped[3] || null,
			stage4: grouped[4] || null,
		},
	];
});

// ========== ACTIONS SKKNI ==========
/*
	>>> SKKNI RULES:
	- Stage 0: admin bisa centang dokumen
	- Stage 0 approve → wajib lampiran
	- Stage 1–4 approve → tidak perlu lampiran
*/

const approveFirstStage = async () => {
	try {
		if (!letterLink.value) {
			toast.error("Link lampiran wajib diisi.");
			return;
		}

		actionLoading.value = true;
		await approveApplicationFirst(applicationId, {
			letterLink: letterLink.value,
			note: adminNote.value,
		});
		router.back();
	} finally {
		actionLoading.value = false;
	}
};

const rejectFirstStage = async () => {
	try {
		if (!letterLink.value) {
			toast.error("Link lampiran wajib diisi.");
			return;
		}

		actionLoading.value = true;
		await rejectApplication(applicationId, {
			letterLink: letterLink.value,
			note: adminNote.value,
		});
		router.back();
	} finally {
		actionLoading.value = false;
	}
};

// NEXT STAGE (tidak butuh link)
const approveNext = async () => {
	actionLoading.value = true;
	await approveApplicationNext(applicationId, { note: adminNote.value });
	router.back();
};

const fixStage = async () => {
	actionLoading.value = true;

	const invalidIds = detail.value.applicationRequirements.filter((r: any) => !r.status).map((r: any) => r.id);

	await requestApplicationFix(applicationId, {
		note: adminNote.value,
		requirementIds: invalidIds,
	});

	router.back();
};
</script>

<template>
	<div class="p-8 space-y-10">
		<button @click="router.back()" class="px-4 py-2 bg-gray-200 rounded text-sm">Kembali</button>

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
					<div class="px-4 py-2 mt-2 rounded text-sm font-bold" :class="getStageClass(detail?.status)">
						{{ detail?.status }}
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
								<div class="flex items-center justify-between p-3 bg-white rounded-lg border">
									<div>
										<p class="font-medium text-sm">Surat Permohonan</p>
										<a :href="detail?.requestLetterDocument" target="_blank" class="text-blue-500 text-xs underline">Link Berkas</a>
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
									<div>
										<div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
											{{ index + 1 }}
										</div>
										<p class="font-medium text-sm">{{ req.requirement.description }}</p>
									</div>

									<!-- switch sesuai -->
									<div class="flex items-center gap-2">
										<label class="text-xs text-gray-600">Sesuai</label>
										<Checkbox :checked="req.status" :disabled="detail?.currentStageNumber !== 0" @update:checked="req.status = $event" />
									</div>
								</div>
							</div>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
		</div>

		<!-- TIMELINE TABLE -->
		<div v-if="timeline.length" class="mt-10">
			<h3 class="font-bold text-gray-900 mb-4">Posisi Berkas</h3>

			<table class="w-full border">
				<thead class="bg-gray-100">
					<tr>
						<th class="p-3">Tahap 1</th>
						<th class="p-3">Tahap 2</th>
						<th class="p-3">Tahap 3</th>
						<th class="p-3">Tahap 4</th>
					</tr>
				</thead>

				<tbody>
					<tr>
						<td v-for="n in 4" :key="n" class="p-4 text-center">
							<!-- <div v-if="timeline[0]['stage' + n]">
								<div class="px-3 py-1 rounded text-xs font-semibold" :class="getStageClass(timeline[0]['stage' + n].at(-1).status)">
									{{ timeline[0]["stage" + n].at(-1).date }}
									<br />
									{{ timeline[0]["stage" + n].at(-1).status }}
								</div>

								<button @click="openLog('Tahap ' + n, timeline[0]['stage' + n])" class="mt-2 text-blue-600 underline text-xs">Lihat Log</button>
							</div> -->
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- ACTIONS STAGE 0 -->
		<div v-if="detail?.currentStageNumber === 0" class="mt-8 border-t pt-6">
			<h3 class="font-semibold text-gray-900 mb-4">Tindakan Admin (Tahap Awal)</h3>

			<div class="space-y-4">
				<div>
					<label class="text-sm text-gray-700">Link Lampiran</label>
					<input v-model="letterLink" class="w-full p-2 border rounded" />
				</div>

				<div>
					<label class="text-sm text-gray-700">Catatan</label>
					<AdminAppEditor v-model="adminNote" rows="4" />
				</div>

				<div class="flex justify-end gap-3">
					<button @click="rejectFirstStage" class="px-4 py-2 bg-red-600 text-white rounded">Tolak</button>
					<button @click="approveFirstStage" class="px-4 py-2 bg-blue-600 text-white rounded">Terima</button>
				</div>
			</div>
		</div>

		<!-- ACTIONS NEXT STAGE -->
		<div v-if="detail?.currentStageNumber > 0" class="mt-8 border-t pt-6">
			<div class="space-y-4">
				<div>
					<label class="text-sm">Catatan</label>
					<AdminAppEditor v-model="adminNote" rows="4" />
				</div>

				<div class="flex justify-end gap-3">
					<button @click="fixStage" class="px-4 py-2 bg-red-600 text-white rounded">Perbaiki</button>
					<button @click="approveNext" class="px-4 py-2 bg-blue-600 text-white rounded">Terima</button>
				</div>
			</div>
		</div>
	</div>

	<!-- LOG DIALOG -->
	<Dialog v-model:open="isLogOpen">
		<DialogContent class="max-w-md">
			<DialogHeader>
				<DialogTitle>{{ logStageName }}</DialogTitle>
				<DialogDescription>Riwayat perubahan status</DialogDescription>
			</DialogHeader>

			<div class="space-y-3 mt-4">
				<div v-for="item in logItems" class="p-3 border rounded bg-gray-50">
					<p class="text-sm font-semibold">{{ item.date }}</p>
					<p class="inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold" :class="getStageClass(item.status)">
						{{ item.status }}
					</p>
				</div>
			</div>
		</DialogContent>
	</Dialog>
</template>
