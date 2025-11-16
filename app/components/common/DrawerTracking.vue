<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const open = ref(false);

// dialog log
const isOpen = ref(false);
const selectedStageName = ref("");
const selectedStageLogs = ref<any[]>([]);

// to open log popup
const openLog = (name: string, stage: any) => {
	selectedStageName.value = name;
	selectedStageLogs.value = stage.logs || [];
	isOpen.value = true;
};

// > ========= DATA ========== <
const route = useRoute();
const ticketNumber = ref("");
const trackingData = ref<any>(null);

// DUMMY SAMPLE (ganti dari API kalau perlu)
const sampleData = {
	ticketId: "IDBRKS0001",
	serviceType: "SKKNI",
	submissionName: "Sean",
	handlerName: "Sean",
	institution: "Kemnaker",
	address: "Jln Merdeka",
	letterDate: "12/02/2023",
	status: "DITOLAK",
	documents: [
		{ name: "Surat Permohonan", status: "OK" },
		{ name: "Dokumen", status: "OK" },
		{ name: "Lampiran", status: "OK" },
	],
	timeline: [
		{
			step: "1",
			stage1: {
				logs: [{ date: "7/10/2025", status: "Selesai" }],
			},
			stage2: {
				logs: [{ date: "7/10/2025", status: "Perbaikan" }],
			},
			stage3: {
				logs: [{ date: "7/10/2025", status: "Ditolak" }],
			},
		},
	],
};

const leftInfo = ref([
	{ label: "Jenis Layanan", value: sampleData.serviceType },
	{ label: "Nama Pengajuan", value: sampleData.submissionName },
	{ label: "Nama Pengusul", value: sampleData.handlerName },
	{ label: "Nama Instansi", value: sampleData.institution },
	{ label: "Alamat", value: sampleData.address },
	{ label: "Tanggal Surat", value: sampleData.letterDate },
]);

const handleTracking = () => {
	trackingData.value = sampleData;
};

// warna status logs
const getStageClass = (status: string) => {
	if (!status) return "bg-gray-100 text-gray-600";
	if (["Diproses"].includes(status)) return "bg-blue-100 text-blue-700";
	if (["Diperbaiki", "Perbaikan"].includes(status)) return "bg-yellow-100 text-yellow-700";
	if (["Ditolak"].includes(status)) return "bg-red-100 text-red-700";
	if (["Selesai"].includes(status)) return "bg-green-100 text-green-700";
	return "bg-gray-100 text-gray-700";
};

// Method untuk dipanggil dari luar
const openSheet = (item: any) => {
	ticketNumber.value = item?.id || "";
	trackingData.value = sampleData; // nanti replace API fetch
	open.value = true;
};

defineExpose({ openSheet });
</script>

<template>
	<Sheet v-model:open="open">
		<SheetContent side="right" class="w-full sm:max-w-5xl h-full overflow-y-auto p-0">
			<!-- HEADER -->
			<div class="text-center py-6 px-6 border-b">
				<div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
					</svg>
				</div>
				<h2 class="text-xl font-bold text-blue-600">Tracking Pengajuan Layanan</h2>
			</div>

			<!-- BODY -->
			<div class="p-8 space-y-10">
				<!-- Ticket -->
				<div v-if="trackingData" class="space-y-6">
					<div class="flex items-center gap-2 pb-4 border-b">
						<span class="text-blue-600 font-bold text-lg">{{ trackingData.ticketId }}</span>
					</div>

					<!-- INFO GRID -->
					<div class="grid md:grid-cols-2 gap-6">
						<!-- LEFT SIDE -->
						<div class="space-y-4">
							<div v-for="info in leftInfo" :key="info.label" class="flex justify-between py-3 border-b border-gray-100">
								<span class="text-gray-600 text-sm">{{ info.label }}</span>
								<span class="text-gray-900 font-semibold text-sm">{{ info.value }}</span>
							</div>
						</div>

						<!-- RIGHT SIDE -->
						<div class="bg-gray-50 rounded-xl p-6">
							<div class="text-center mb-6">
								<h3 class="text-gray-700 font-semibold mb-2">Status Berkas</h3>
								<div class="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-bold text-sm">
									{{ trackingData.status }}
								</div>
							</div>

							<h4 class="text-gray-700 font-semibold text-sm mb-3">Daftar Berkas</h4>
							<div class="space-y-3">
								<div v-for="(doc, index) in trackingData.documents" :key="index" class="flex items-center justify-between p-3 bg-white rounded-lg">
									<div class="flex items-center gap-3">
										<div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
											{{ index + 1 }}
										</div>
										<span class="text-gray-700 text-sm">{{ doc.name }}</span>
									</div>

									<span :class="doc.status === 'OK' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'" class="px-3 py-1 rounded-full text-xs font-semibold">
										{{ doc.status }}
									</span>
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
									<tr v-for="(row, index) in trackingData.timeline" :key="index" class="border-b">
										<td class="py-4 px-4">{{ row.step }}</td>

										<!-- Tahap 1 -->
										<td class="py-4 px-4">
											<div v-if="row.stage1" class="flex flex-col gap-2">
												<span class="px-3 py-1 rounded text-xs font-semibold" :class="getStageClass(row.stage1.logs.at(-1).status)">
													{{ row.stage1.logs.at(-1).date }} <br />
													{{ row.stage1.logs.at(-1).status }}
												</span>

												<button @click="openLog('Tahap 1', row.stage1)" class="px-3 py-1 bg-blue-600 text-white text-xs rounded">Lihat Log</button>
											</div>
										</td>

										<!-- Tahap 2 -->
										<td class="py-4 px-4">
											<div v-if="row.stage2" class="flex flex-col gap-2">
												<span class="px-3 py-1 rounded text-xs font-semibold" :class="getStageClass(row.stage2.logs.at(-1).status)">
													{{ row.stage2.logs.at(-1).date }} <br />
													{{ row.stage2.logs.at(-1).status }}
												</span>

												<button @click="openLog('Tahap 2', row.stage2)" class="px-3 py-1 bg-blue-600 text-white text-xs rounded">Lihat Log</button>
											</div>
										</td>

										<!-- Tahap 3 -->
										<td class="py-4 px-4">
											<div v-if="row.stage3" class="flex flex-col gap-2">
												<span class="px-3 py-1 rounded text-xs font-semibold" :class="getStageClass(row.stage3.logs.at(-1).status)">
													{{ row.stage3.logs.at(-1).date }} <br />
													{{ row.stage3.logs.at(-1).status }}
												</span>

												<button @click="openLog('Tahap 3', row.stage3)" class="px-3 py-1 bg-blue-600 text-white text-xs rounded">Lihat Log</button>
											</div>
										</td>

										<!-- Tahap 4 -->
										<td class="py-4 px-4">
											<div v-if="row.stage4" class="flex flex-col gap-2">
												<span class="px-3 py-1 rounded text-xs font-semibold" :class="getStageClass(row.stage4.logs.at(-1).status)">
													{{ row.stage4.logs.at(-1).date }} <br />
													{{ row.stage4.logs.at(-1).status }}
												</span>

												<button @click="openLog('Tahap 4', row.stage4)" class="px-3 py-1 bg-blue-600 text-white text-xs rounded">Lihat Log</button>
											</div>
										</td>
									</tr>
								</tbody>
							</table>
						</div>

						<!-- WARNING -->
						<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3 mt-6">
							<svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
							</svg>
							<p class="text-yellow-800 text-sm">Untuk Melihat Detail Surat Keputusan Login Ke Akun Anda!</p>
						</div>
					</div>
				</div>
			</div>
		</SheetContent>
	</Sheet>

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
				</div>
			</div>
		</DialogContent>
	</Dialog>
</template>
