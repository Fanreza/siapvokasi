<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import { getApplicationDetail, getApplicationLogs, approveApplicationNext, requestApplicationFix } from "~/services/application.services";

// ROUTE
definePageMeta({ middleware: "admin", layout: "admin" });

const route = useRoute();
const router = useRouter();
const applicationId = Number(route.params.id);

// STATE
const detail = ref<any>(null);
const logs = ref<any[]>([]);
const link = ref("");
const note = ref("");
const loading = ref(false);

// LOAD DATA
onMounted(async () => {
	detail.value = await getApplicationDetail(applicationId);
	logs.value = (await getApplicationLogs(applicationId)) as any[];
});

// INFO
const leftInfo = computed(() => [
	{ label: "Jenis", value: detail.value?.service?.name },
	{ label: "Pengusul", value: detail.value?.applicantName },
	{ label: "Instansi", value: detail.value?.institution },
]);

// STATUS CLASS
const getStageClass = (status: string) => {
	if (!status) return "bg-gray-100";
	status = status.toLowerCase();
	if (status.includes("processing")) return "bg-blue-100";
	if (status.includes("completed")) return "bg-green-100";
	if (status.includes("rejected")) return "bg-red-100";
	return "bg-gray-100";
};

// TIMELINE (2 stage only)
const timeline = computed(() => {
	const grouped: Record<number, any[]> = {};

	for (const lg of logs.value) {
		if (lg.stageNumber) {
			grouped[lg.stageNumber] = grouped[lg.stageNumber] || [];
			grouped[lg.stageNumber]!.push({
				date: new Date(lg.createdAt).toLocaleString("id-ID"),
				status: lg.status,
				note: lg.note,
			});
		}
	}

	return [
		{
			stage1: grouped[1] || null,
			stage2: grouped[2] || null,
		},
	];
});

// ACTION
const approve = async () => {
	if (!link.value) {
		toast.error("Link lampiran wajib.");
		return;
	}

	loading.value = true;

	// await approveApplicationNext(applicationId, {
	// 	letterLink: link.value,
	// 	note: note.value,
	// });

	toast.success("Tahap disetujui");
	router.back();
};

const fix = async () => {
	loading.value = true;

	const invalidIds = detail.value.applicationRequirements.filter((r: any) => !r.status).map((r: any) => r.id);

	await requestApplicationFix(applicationId, {
		note: note.value,
		requirementIds: invalidIds,
	});

	toast.success("Perbaikan dikirim");
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
					<span>{{ info.label }}</span>
					<span class="font-semibold">{{ info.value }}</span>
				</div>
			</div>

			<!-- RIGHT -->
			<div class="p-6 bg-gray-50 rounded-xl">
				<div class="text-center">
					<h3 class="font-semibold">Status</h3>
					<div class="px-4 py-2 mt-2 rounded" :class="getStageClass(detail?.status)">
						{{ detail?.status }}
					</div>
				</div>

				<!-- REQUIREMENTS -->
				<div class="mt-6">
					<h4 class="font-semibold mb-2">Kelengkapan Dokumen</h4>

					<div v-for="req in detail?.applicationRequirements" :key="req.id" class="p-3 border rounded mb-3 flex justify-between items-center">
						<span>{{ req.requirement.description }}</span>

						<!-- CLSP: tidak editable by admin -->
						<Checkbox :checked="req.status" disabled />
					</div>
				</div>
			</div>
		</div>

		<!-- TIMELINE -->
		<div class="mt-10">
			<h3 class="font-bold">Posisi Berkas</h3>

			<table class="w-full border mt-3">
				<thead class="bg-gray-100">
					<tr>
						<th class="p-3">Tahap 1</th>
						<th class="p-3">Tahap 2</th>
					</tr>
				</thead>

				<tbody>
					<tr>
						<td v-for="n in 2" :key="n" class="p-4 text-center">
							<div v-if="timeline[0]['stage' + n]">
								<div class="px-3 py-1 rounded text-xs font-semibold" :class="getStageClass(timeline[0]['stage' + n].at(-1).status)">
									{{ timeline[0]["stage" + n].at(-1).date }}<br />
									{{ timeline[0]["stage" + n].at(-1).status }}
								</div>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- ACTIONS -->
		<div class="mt-8 border-t pt-6">
			<div class="space-y-4">
				<!-- Link required for CLSP both stage 1 & 2 -->
				<div>
					<label class="text-sm text-gray-700">Link Lampiran</label>
					<input v-model="link" class="w-full p-2 border rounded" />
				</div>

				<div>
					<label class="text-sm text-gray-700">Catatan</label>
					<AdminAppEditor v-model="note" rows="4" />
				</div>

				<div class="flex justify-end gap-3">
					<button @click="fix" class="px-4 py-2 bg-red-600 text-white rounded">Perbaiki</button>
					<button @click="approve" class="px-4 py-2 bg-blue-600 text-white rounded">Terima</button>
				</div>
			</div>
		</div>
	</div>
</template>
