<template>
	<div class="min-h-screen bg-gray-50 py-12">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
			<!-- Main Card -->
			<div class="bg-white rounded-2xl shadow-xl p-8">
				<!-- Icon and Title -->
				<div class="text-center mb-8">
					<div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
						</svg>
					</div>
					<h2 class="text-xl font-bold text-blue-600">Tracking Pengajuan Layanan</h2>
				</div>

				<!-- Search Box -->
				<div class="mb-8">
					<div class="flex gap-3">
						<input v-model="ticketNumber" type="text" placeholder="Masukkan Nomor Tiket" class="flex-1 px-5 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700" />
						<button @click="handleTracking" class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold whitespace-nowrap shadow-lg">Tracking</button>
					</div>
				</div>

				<!-- Tracking Results (shown when data exists) -->
				<div v-if="trackingData" class="space-y-6">
					<!-- Ticket ID -->
					<div class="flex items-center gap-2 pb-4 border-b border-gray-200">
						<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
						</svg>
						<span class="text-blue-600 font-bold text-lg">{{ trackingData.ticketId }}</span>
					</div>

					<!-- Details Grid -->
					<div class="grid md:grid-cols-2 gap-6">
						<!-- Left Column -->
						<div class="space-y-4">
							<div class="flex justify-between py-3 border-b border-gray-100">
								<span class="text-gray-600 text-sm">Jenis Layanan</span>
								<span class="text-gray-900 font-semibold text-sm">{{ trackingData.serviceType }}</span>
							</div>

							<div class="flex justify-between py-3 border-b border-gray-100">
								<span class="text-gray-600 text-sm">Nama Pengajuan</span>
								<span class="text-gray-900 font-semibold text-sm">{{ trackingData.submissionName }}</span>
							</div>

							<div class="flex justify-between py-3 border-b border-gray-100">
								<span class="text-gray-600 text-sm">Nama Pengurus</span>
								<span class="text-gray-900 font-semibold text-sm">{{ trackingData.handlerName }}</span>
							</div>

							<div class="flex justify-between py-3 border-b border-gray-100">
								<span class="text-gray-600 text-sm">Nama Instansi</span>
								<span class="text-gray-900 font-semibold text-sm">{{ trackingData.institution }}</span>
							</div>

							<div class="flex justify-between py-3">
								<span class="text-gray-600 text-sm">Alamat</span>
								<span class="text-gray-900 font-semibold text-sm">{{ trackingData.address }}</span>
							</div>

							<div class="flex justify-between py-3">
								<span class="text-gray-600 text-sm">Tanggal Surat</span>
								<span class="text-gray-900 font-semibold text-sm">{{ trackingData.letterDate }}</span>
							</div>
						</div>

						<!-- Right Column - Status -->
						<div class="bg-gray-50 rounded-xl p-6">
							<div class="text-center mb-6">
								<h3 class="text-gray-700 font-semibold mb-2">Status Berkas</h3>
								<span class="inline-block px-4 py-2 bg-red-100 text-red-600 rounded-lg font-bold text-sm">
									{{ trackingData.status }}
								</span>
							</div>

							<div class="space-y-3">
								<h4 class="text-gray-700 font-semibold text-sm mb-3">Daftar Berkas</h4>

								<div v-for="(doc, index) in trackingData.documents" :key="index" class="flex items-center justify-between p-3 bg-white rounded-lg">
									<div class="flex items-center gap-3">
										<div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
											{{ index + 1 }}
										</div>
										<span class="text-gray-700 text-sm">{{ doc.name }}</span>
									</div>
									<span class="px-3 py-1 rounded-full text-xs font-semibold" :class="doc.status === 'OK' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'">
										{{ doc.status }}
									</span>
								</div>
							</div>
						</div>
					</div>

					<!-- Progress Timeline -->
					<div class="mt-8">
						<h3 class="text-gray-900 font-bold mb-6">Posisi Berkas</h3>

						<div class="overflow-x-auto">
							<table class="w-full">
								<thead>
									<tr class="border-b border-gray-200">
										<th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Aliran Ke</th>
										<th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tahap 1</th>
										<th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tahap 2</th>
										<th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tahap 3</th>
										<th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tahap 4</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="(row, index) in trackingData.timeline" :key="index" class="border-b border-gray-100">
										<td class="py-4 px-4 text-sm text-gray-700">{{ row.step }}</td>
										<td class="py-4 px-4">
											<span v-if="row.stage1" class="inline-block px-3 py-1 rounded text-xs font-semibold" :class="getStageClass(row.stage1.status)"> {{ row.stage1.date }}<br />{{ row.stage1.status }} </span>
										</td>
										<td class="py-4 px-4">
											<span v-if="row.stage2" class="inline-block px-3 py-1 rounded text-xs font-semibold" :class="getStageClass(row.stage2.status)"> {{ row.stage2.date }}<br />{{ row.stage2.status }} </span>
										</td>
										<td class="py-4 px-4">
											<span v-if="row.stage3" class="inline-block px-3 py-1 rounded text-xs font-semibold" :class="getStageClass(row.stage3.status)"> {{ row.stage3.date }}<br />{{ row.stage3.status }} </span>
										</td>
										<td class="py-4 px-4">
											<span v-if="row.stage4" class="inline-block px-3 py-1 rounded text-xs font-semibold" :class="getStageClass(row.stage4.status)"> {{ row.stage4.date }}<br />{{ row.stage4.status }} </span>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>

					<!-- Warning Message -->
					<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
						<svg class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
						</svg>
						<p class="text-yellow-800 text-sm">Untuk Melihat Detail Surat Keputusan Login Ke Akun Anda!</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

definePageMeta({
	layout: "tracking",
});

const route = useRoute();

import { ref } from "vue";

const ticketNumber = ref((route.query.ticket as string) || "");
const trackingData = ref(null);

// Sample data - replace with actual API call
const sampleData = {
	ticketId: "IDBRKS0001",
	serviceType: "SKDII",
	submissionName: "Seeni",
	handlerName: "Seeni",
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
			stage1: { date: "7/10/2025", status: "Dikikat" },
			stage2: { date: "8/10/2025", status: "Sedang Dikerja" },
			stage3: { date: "9/10/2025", status: "Tolak" },
			stage4: null,
		},
	],
};

const handleTracking = () => {
	if (ticketNumber.value) {
		// Simulate API call
		trackingData.value = sampleData;
	}
};

watch(
	() => route.query.ticket,
	(newTicket) => {
		if (newTicket) {
			ticketNumber.value = newTicket as string;
			handleTracking();
		}
	},
	{ immediate: true }
);

const getStageClass = (status: string) => {
	if (status === "Dikikat" || status === "Dikirim") return "bg-green-100 text-green-700";
	if (status === "Sedang Dikerja" || status === "Dikerja") return "bg-yellow-100 text-yellow-700";
	if (status === "Tolak" || status === "Ditolak") return "bg-red-100 text-red-700";
	return "bg-gray-100 text-gray-700";
};
</script>
