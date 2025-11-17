<script setup lang="ts">
import { ref } from "vue";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

import { getApplicationDetail, getApplicationLogs } from "~/services/application.services";

// SHEET
const open = ref(false);

// LOG POPUP
const isOpen = ref(false);
const selectedStageName = ref("");
const selectedStageLogs = ref<any[]>([]);

const openLog = (name: string, stageLogs: any[]) => {
	selectedStageName.value = name;
	selectedStageLogs.value = stageLogs || [];
	isOpen.value = true;
};

// STATE DATA
const detail = ref<any>(null);
const logs = ref<any[]>([]);

// info kiri
const leftInfo = ref<any[]>([]);

// timeline (dibangun dari logs)
const timeline = ref<any[]>([]);

// utility warna
const getStageClass = (status: string) => {
	if (!status) return "bg-gray-100 text-gray-600";
	status = status.toLowerCase();

	if (["processing"].includes(status)) return "bg-blue-100 text-blue-700";
	if (["perbaikan", "diperbaiki", "revision"].includes(status)) return "bg-yellow-100 text-yellow-700";
	if (["rejected", "ditolak"].includes(status)) return "bg-red-100 text-red-700";
	if (["completed", "selesai"].includes(status)) return "bg-green-100 text-green-700";

	return "bg-gray-100 text-gray-700";
};

// ✨ MAPKAN LOGS → TIMELINE TABLE
const buildTimeline = () => {
	// group logs by stageNumber
	const grouped: Record<number, any[]> = {};

	for (const lg of logs.value) {
		if (!grouped[lg.stageNumber]) grouped[lg.stageNumber] = [];
		grouped[lg.stageNumber].push({
			date: new Date(lg.createdAt).toLocaleString("id-ID"),
			status: lg.status,
			note: lg.note,
		});
	}

	// create timeline array
	timeline.value = [
		{
			step: detail.value.currentStageNumber,
			stage1: grouped[1] ? { logs: grouped[1] } : null,
			stage2: grouped[2] ? { logs: grouped[2] } : null,
			stage3: grouped[3] ? { logs: grouped[3] } : null,
			stage4: grouped[4] ? { logs: grouped[4] } : null,
		},
	];
};

// ✨ MAPKAN DETAIL → LEFT INFO PANEL
const buildLeftInfo = () => {
	leftInfo.value = [
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
};

// ✨ METHOD PENTING: DIPANGGIL DARI LIST
const openSheet = async (item: any) => {
	open.value = true;

	const applicationId = Number(item.raw.id); // dari table row mapping

	// Ambil detail
	detail.value = await getApplicationDetail(applicationId);

	// Ambil logs
	logs.value = await getApplicationLogs(applicationId);

	// build UI internal
	buildLeftInfo();
	buildTimeline();
};

defineExpose({ openSheet });
</script>

<template>
	<Sheet v-model:open="open">
		<SheetContent side="right" class="w-full sm:max-w-5xl h-full overflow-y-auto p-0">
			<div v-if="detail" class="p-8 space-y-10">
				<!-- Ticket -->
				<div class="flex items-center gap-2 pb-4 border-b">
					<span class="text-blue-600 font-bold text-lg">{{ detail.applicationNumber }}</span>
				</div>

				<div class="grid md:grid-cols-2 gap-6">
					<!-- LEFT INFO -->
					<div class="space-y-4">
						<div v-for="info in leftInfo" :key="info.label" class="flex justify-between py-3 border-b border-gray-100">
							<span class="text-gray-600 text-sm">{{ info.label }}</span>
							<span class="text-gray-900 font-semibold text-sm">{{ info.value }}</span>
						</div>
					</div>

					<!-- RIGHT STATUS -->
					<div class="bg-gray-50 rounded-xl p-6">
						<div class="text-center mb-6">
							<h3 class="text-gray-700 font-semibold mb-2">Status Berkas</h3>

							<div class="px-4 py-2 rounded-lg font-bold text-sm" :class="getStageClass(detail.status)">
								{{ detail.status }}
							</div>
						</div>

						<h4 class="text-gray-700 font-semibold text-sm mb-3">Daftar Berkas</h4>

						<div class="space-y-3">
							<div class="flex items-center justify-between p-3 bg-white rounded-lg">
								<div class="flex items-center gap-3">
									<div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
									<span class="text-gray-700 text-sm">Surat Permohonan</span>
								</div>
								<span class="px-3 py-1 rounded-full text-xs bg-green-100 text-green-600">ADA</span>
							</div>

							<div class="flex items-center justify-between p-3 bg-white rounded-lg">
								<div class="flex items-center gap-3">
									<div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
									<span class="text-gray-700 text-sm">Dokumen Utama</span>
								</div>
								<span class="px-3 py-1 rounded-full text-xs bg-green-100 text-green-600">ADA</span>
							</div>

							<div class="flex items-center justify-between p-3 bg-white rounded-lg">
								<div class="flex items-center gap-3">
									<div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
									<span class="text-gray-700 text-sm">Lampiran</span>
								</div>
								<span class="px-3 py-1 rounded-full text-xs bg-green-100 text-green-600">ADA</span>
							</div>
						</div>
					</div>
				</div>

				<!-- TIMELINE -->
				<div class="mt-8">
					<h3 class="text-gray-900 font-bold mb-6">Posisi Berkas</h3>

					<div class="overflow-x-auto">
						<table class="w-full">
							<thead>
								<tr class="border-b">
									<th class="text-left py-3 px-4 text-sm">Ajuan Ke</th>
									<th class="text-left py-3 px-4 text-sm">Tahap 1</th>
									<th class="text-left py-3 px-4 text-sm">Tahap 2</th>
									<th class="text-left py-3 px-4 text-sm">Tahap 3</th>
									<th class="text-left py-3 px-4 text-sm">Tahap 4</th>
								</tr>
							</thead>

							<tbody>
								<tr v-for="row in timeline" :key="row.step" class="border-b">
									<td class="py-4 px-4 font-semibold">{{ row.step }}</td>

									<!-- GENERATE 4 TAHAP OTOMATIS -->
									<td v-for="n in 4" :key="n" class="py-4 px-4">
										<div v-if="row['stage' + n]">
											<!-- Ambil log terakhir -->
											<span class="px-3 py-1 rounded text-xs font-semibold block" :class="getStageClass(row['stage' + n].logs.at(-1).status)">
												{{ row["stage" + n].logs.at(-1).date }} <br />
												{{ row["stage" + n].logs.at(-1).status }}
											</span>

											<button @click="openLog('Tahap ' + n, row['stage' + n].logs)" class="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded">Lihat Log</button>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</SheetContent>
	</Sheet>

	<!-- DIALOG LOG -->
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

					<p class="text-xs text-gray-600 mt-1">{{ log.note }}</p>
				</div>
			</div>
		</DialogContent>
	</Dialog>
</template>
