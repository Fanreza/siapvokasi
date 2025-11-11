<!-- pages/info/berita.vue -->
<template>
	<section class="bg-white py-16 md:py-24">
		<!-- Title -->
		<AppUiPageHeader title="Galeri" :breadcrumbs="['Informasi', 'Galeri']" />

		<div class="mx-auto w-[80%]">
			<!-- Loading State -->
			<div v-if="loading" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<div v-for="i in 6" :key="i" class="animate-pulse bg-gray-100 rounded-xl h-[320px]"></div>
			</div>

			<!-- Grid -->
			<div v-else-if="newsItems.length > 0" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<AppUiGalleryCard v-for="news in newsItems" :key="news.id" :image="news.file || '/images/placeholder.jpg'" :title="news.title" :excerpt="news.description" :slug="news.id" />
			</div>

			<!-- Empty State -->
			<div v-else class="py-12 text-center">
				<p class="text-gray-500">Tidak ada berita ditemukan.</p>
			</div>

			<!-- Pagination -->
			<AppUiPagination v-if="totalPages > 1" :current-page="currentPage" :total-pages="totalPages" @update:current-page="handlePageChange" class="mt-10" />
		</div>
	</section>
</template>

<script setup lang="ts">
import { useGalleryService } from "@/services/gallery.services";
import { toast } from "vue-sonner";
import { ref, computed, onMounted } from "vue";

// 🧩 Services
const { getAll, response, loading } = useGalleryService();

// State
const newsItems = ref<any[]>([]);
const currentPage = ref(1);

// Fetch News
const params = computed(() => ({
	page: currentPage.value,
}));

const fetchNews = async () => {
	try {
		await getAll(params.value, true); // pakai endpoint public
		newsItems.value = response.value?.data || [];
	} catch {
		toast.error("Gagal memuat data berita.");
	}
};

onMounted(fetchNews);

// Pagination handler
const handlePageChange = async (page: number) => {
	currentPage.value = page;
	await fetchNews();
};

// Hitung total halaman dari API meta
const totalPages = computed(() => {
	return response.value?.meta?.totalPages || 1;
});
</script>
