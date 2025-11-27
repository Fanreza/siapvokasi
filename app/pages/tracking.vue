<template>
	<div class="min-h-screen bg-gray-50 py-12">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="bg-white rounded-2xl shadow-xl p-8">
				<!-- Header -->
				<div class="text-center mb-8">
					<div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
						</svg>
					</div>
					<h2 class="text-xl font-bold text-blue-600">Tracking Pengajuan Layanan</h2>
				</div>

				<!-- Search -->
				<div class="mb-8">
					<div class="flex gap-3">
						<input v-model="ticketNumber" type="text" placeholder="Masukkan Nomor Tiket" class="flex-1 px-5 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700" />

						<button @click="handleTracking" class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold shadow-lg" :disabled="loading">
							<span v-if="loading">Memuat...</span>
							<span v-else>Tracking</span>
						</button>
					</div>
				</div>

				<!-- LOADING SKELETON -->
				<div v-if="loading" class="py-10 flex justify-center">
					<div class="flex flex-col items-center gap-3">
						<svg class="w-10 h-10 animate-spin text-blue-600" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
						</svg>
						<p class="text-gray-600">Mengambil data...</p>
					</div>
				</div>

				<!-- Result container -->
				<div v-if="!loading && trackingData" id="tracking-section" class="space-y-6">
					<UserTrackingSKKNI v-if="trackingData?.service?.name === 'SKKNI'" :detail="trackingData" :logs="trackingData.logs || []" />
					<UserTrackingSKKK v-else-if="trackingData?.service?.name === 'SKKK/SKKI'" :detail="trackingData" :logs="trackingData.logs || []" />
					<UserTrackingCLSP v-else-if="trackingData?.service?.name === 'CLSP'" :detail="trackingData" :logs="trackingData.logs || []" />

					<div v-else class="text-center text-gray-500 py-10">
						Tracking untuk layanan
						<b>{{ trackingData?.service?.name }}</b> belum tersedia.
					</div>
				</div>

				<!-- Jika tidak loading dan tidak ada data tapi pencarian dilakukan -->
				<div v-if="!loading && trackingData === null && ticketNumber" class="text-center py-10 text-gray-500">Data tidak ditemukan.</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getPublicApplications } from "~/services/application.services";

definePageMeta({
	layout: "tracking",
});

const route = useRoute();
const router = useRouter();

const ticketNumber = ref((route.query.ticket as string) || "");
const trackingData = ref<any>(null);
const loading = ref(false);

const fetchTrackingData = async (ticket: string) => {
	loading.value = true;
	trackingData.value = null;

	try {
		trackingData.value = await getPublicApplications(ticket);
	} catch (e) {
		trackingData.value = null;
	} finally {
		loading.value = false;
	}
};

const handleTracking = () => {
	if (!ticketNumber.value) return;

	router.replace({
		query: { ticket: ticketNumber.value },
	});

	fetchTrackingData(ticketNumber.value);
};

onMounted(async () => {
	if (ticketNumber.value) {
		await fetchTrackingData(ticketNumber.value);
	}
});
</script>
