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
						<Select v-model="selectedService" @update:modelValue="handleServiceChange">
							<SelectTrigger class="w-full h-12 px-4 text-gray-700 bg-transparent border-none shadow-none focus:ring-0">
								<SelectValue placeholder="Pilih Layanan" />
							</SelectTrigger>

							<SelectContent>
								<SelectGroup>
									<SelectItem value="skkni"> Penetapan SKKNI </SelectItem>

									<SelectItem value="skk">Penetapan SKK</SelectItem>
									<SelectItem value="clsp">Pengajuan CLSP</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
				</div>

				<!-- Right Side - Requirements List and Buttons -->
				<div v-if="selectedService" class="space-y-6">
					<!-- Action Buttons -->
					<div class="flex flex-col sm:flex-row gap-3">
						<a :href="downloadUrl" download class="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg">
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
							Download Dokumen
						</a>

						<button class="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-lg">
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							{{ workingDays }} Hari Kerja
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
	skkni: {
		requirements: ["Surat usulan/permohonan penetapan (pdf).", "RSKKNI-3 (word).", "Berita Acara hasil konvensi (pdf).", "Daftar hadir peserta konvensi (pdf)."],
		workingDays: 12,
		downloadUrl: "/docs/skkni.zip",
	},

	skk: {
		requirements: ["Surat usulan/permohonan penetapan (pdf).", "RSKKNI-3 (word).", "Berita Acara hasil konvensi (pdf).", "Daftar hadir peserta konvensi (pdf)."],
		workingDays: 12,
		downloadUrl: "/docs/skk.zip",
	},

	clsp: {
		requirements: [
			"Gambaran umum CLSP.",
			"Visi, Misi dan Strategi.",
			"Kondisi tenaga kerja/SDM yang akan disertifikasi oleh CLSP.",
			"Maksud dan tujuan.",
			"Judul/nama SKKNI yang dijadikan acuan.",
			"Landasan hukum pendirian.",
			"Struktur Organisasi CLSP (dilengkapi dengan SK kepengurusan).",
			"Dukungan sarana dan fasilitas.",
			"Alamat dan No. telepon sekretariat.",
			"Lingkup sertifikasi (termasuk standar kompetensi yang dijadikan acuan/rujukan).",
			"Target/jumlah yang akan disertifikasi.",
			"Program kerja sertifikasi.",
			"Pernyataan kesanggupan menyampaikan laporan kepada Dirjen Pembinaan Pelatihan Vokasi dan Produktivitas secara berkala.",
			"Dukungan dari pemangku kepentingan terkait lainnya (sangat disarankan).",
		],
		workingDays: 5,
		downloadUrl: "/docs/clsp.zip",
	},
};

const requirements = computed(() => {
	if (!selectedService.value) return [];
	return requirementsData[selectedService.value].requirements;
});

const workingDays = computed(() => {
	if (!selectedService.value) return null;
	return requirementsData[selectedService.value].workingDays;
});

const downloadUrl = computed(() => {
	if (!selectedService.value) return null;
	return requirementsData[selectedService.value].downloadUrl;
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
