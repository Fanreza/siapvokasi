<template>
	<section class="bg-white py-16 md:py-24">
		<!-- Title -->
		<AppUiPageHeader title="Tautan" :breadcrumbs="['Tautan', 'Semua Tautan']" />

		<section class="py-16 md:py-24">
			<div class="container mx-auto px-4">
				<!-- Loading -->
				<div v-if="loading" class="text-center text-gray-500 py-20">Memuat data tautan...</div>

				<!-- Error -->
				<div v-else-if="error" class="text-center text-red-500 py-20">Gagal memuat tautan: {{ error.message }}</div>

				<!-- Data -->
				<div v-else-if="response && response?.data?.length > 0" class="grid gap-5 xl:gap-12 md:grid-cols-3 xl:grid-cols-3 justify-items-center">
					<div v-for="(card, i) in response?.data" :key="i" class="flex flex-col items-center rounded-2xl bg-white w-[80%] md:w-full py-12 px-5 xl:px-16 shadow-sm transition-shadow hover:shadow-md">
						<!-- Icon -->
						<div class="relative mb-6">
							<Icon :name="card.icon || 'streamline-color:internet-browser-flat'" class="text-6xl" />
						</div>

						<!-- Title -->
						<h3 class="mb-4 text-xl xl:text-3xl font-bold text-primary text-center">
							{{ card.title }}
						</h3>

						<!-- Description -->
						<p class="mb-6 text-center text-sm xl:text-base leading-relaxed text-gray-600 flex-1">
							{{ card.description || "Tidak ada deskripsi." }}
						</p>

						<!-- Button -->
						<NuxtLink :href="card.link || '#'" target="_blank" rel="noopener noreferrer" class="group flex w-full items-center justify-center gap-2 rounded-lg bg-[#163E93] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 mt-auto">
							<span>Kunjungi Website</span>
							<ArrowRight class="h-5 w-5 transition-transform group-hover:translate-x-1" />
						</NuxtLink>
					</div>
				</div>

				<!-- Empty -->
				<div v-else class="text-center text-gray-400 py-20">Belum ada tautan yang tersedia.</div>
			</div>
		</section>
	</section>
</template>

<script setup lang="ts">
import { ArrowRight } from "lucide-vue-next";
import { useServicesService } from "@/services/service.services"; // sesuaikan path
import { ref, onMounted } from "vue";

const { getAll, loading, error, response } = useServicesService();
const cards = ref([]);

onMounted(async () => {
	try {
		await getAll(true);
	} catch (err) {
		console.error("Gagal memuat tautan:", err);
	}
});
</script>
