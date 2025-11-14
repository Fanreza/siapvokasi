<template>
	<section id="terms" class="bg-[#F1F5FF] py-20">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="grid lg:grid-cols-2 gap-12 items-start">
				<!-- Left Side - Title and Dropdown -->
				<div>
					<div class="text-blue-600 font-semibold mb-3 uppercase text-xs tracking-wide">Persyaratan</div>
					<h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 leading-tight">Setiap Layanan<br />Mempunyai Persyaratan</h2>

					<!-- Dropdown Select -->
					<div class="bg-white rounded-xl shadow-lg p-4">
						<select
							v-model="selectedService"
							@change="handleServiceChange"
							class="w-full px-4 py-3 text-gray-700 bg-transparent border-none focus:outline-none focus:ring-0 cursor-pointer appearance-none"
							style="background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e'); background-repeat: no-repeat; background-position: right 1rem center; background-size: 1.5em 1.5em; padding-right: 3rem"
						>
							<option value="">Pilih Layanan</option>
							<option value="operator-sk">Scan SK Operator (disesuaikan dengan format SK yang berlaku di Perguruan Tinggi Masing-masing)</option>
							<option value="layanan-b">Layanan B</option>
							<option value="layanan-c">Layanan C</option>
						</select>
					</div>
				</div>

				<!-- Right Side - Requirements List and Buttons -->
				<div v-if="selectedService" class="space-y-6">
					<!-- Action Buttons -->
					<div class="flex flex-col sm:flex-row gap-3">
						<button class="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg">
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
							Download Dokumen
						</button>

						<button class="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-lg">
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							12 Hari Waktu Kerja
						</button>
					</div>

					<!-- Requirements List -->
					<div class="bg-white rounded-xl shadow-lg p-6 space-y-4">
						<div v-for="(requirement, index) in requirements" :key="index" class="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
							<div class="flex-shrink-0 w-10 h-10 bg-gray-900 text-white rounded-lg flex items-center justify-center font-bold text-lg">
								{{ index + 1 }}
							</div>
							<p class="text-gray-700 text-sm leading-relaxed flex-1 pt-2">
								{{ requirement }}
							</p>
						</div>
					</div>
				</div>

				<!-- Placeholder when no service selected -->
				<div v-else class="flex items-center justify-center h-64 text-gray-400">
					<p class="text-center">Pilih layanan untuk melihat persyaratan</p>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const selectedService = ref("");

const requirementsData = {
	"operator-sk": ["Scan SK Operator (disesuaikan dengan format SK yang berlaku di Perguruan Tinggi Masing-masing)", "Scan SK Operator (disesuaikan dengan format SK yang berlaku di Perguruan Tinggi Masing-masing)", "Scan SK Operator (disesuaikan dengan format SK yang berlaku di Perguruan Tinggi Masing-masing)", "Scan SK Operator (disesuaikan dengan format SK yang berlaku di Perguruan Tinggi Masing-masing)"],
	"layanan-b": ["Persyaratan Layanan B item 1", "Persyaratan Layanan B item 2", "Persyaratan Layanan B item 3"],
	"layanan-c": ["Persyaratan Layanan C item 1", "Persyaratan Layanan C item 2"],
};

const requirements = computed(() => {
	return selectedService.value ? requirementsData[selectedService.value] || [] : [];
});

const handleServiceChange = () => {
	// You can add additional logic here when service changes
	console.log("Selected service:", selectedService.value);
};
</script>

<style scoped>
/* Custom select dropdown arrow */
select::-ms-expand {
	display: none;
}
</style>
