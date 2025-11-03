<!-- pages/info/berita.vue -->
<template>
	<section class="bg-white py-16 md:py-24">
		<!-- Title -->
		<AppUiPageHeader title="Berita Terbaru" :breadcrumbs="['Info', 'Berita']" />

		<div class="mx-auto w-[80%]">
			<!-- Filter/Category Tabs (Optional) -->
			<div class="mb-8 flex flex-wrap gap-2">
				<button v-for="cat in categories" :key="cat" @click="selectedCategory = cat" :class="['rounded-full px-4 py-2 text-sm font-medium transition-colors', selectedCategory === cat ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']">
					{{ cat }}
				</button>
			</div>

			<!-- Grid -->
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<AppUiNewsCard v-for="news in filteredNews" :key="news.id" :image="news.image" :date="news.date" :category="news.category" :title="news.title" :excerpt="news.excerpt" :slug="news.slug" />
			</div>

			<!-- Empty State -->
			<div v-if="filteredNews.length === 0" class="py-12 text-center">
				<p class="text-gray-500">Tidak ada berita untuk kategori ini</p>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface NewsItem {
	id: number;
	image: string;
	date: string;
	category: string;
	title: string;
	excerpt: string;
	slug: string;
}

// Categories
const categories = ["Semua", "SKKNI", "Proglat", "InaSkill", "E-Training"];
const selectedCategory = ref("Semua");

// Pagination
const currentPage = ref(1);
const itemsPerPage = 6;

// Sample news data (replace with API call)
const newsItems = ref<NewsItem[]>([
	{
		id: 1,
		image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
		date: "23 Apr 2025",
		category: "SKKNI",
		title: "Peluncuran Program Sertifikasi Baru",
		excerpt: "Organisasi meluncurkan program sertifikasi terbaru untuk meningkatkan kompetensi profesional...",
		slug: "peluncuran-program-sertifikasi-baru",
	},
	{
		id: 2,
		image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
		date: "23 Apr 2025",
		category: "Proglat",
		title: "Workshop Pelatihan Nasional 2025",
		excerpt: "Workshop pelatihan nasional akan diadakan di berbagai kota besar Indonesia...",
		slug: "workshop-pelatihan-nasional-2025",
	},
	// Add more news items...
]);

// Filtered news by category
const filteredNews = computed(() => {
	const filtered = selectedCategory.value === "Semua" ? newsItems.value : newsItems.value.filter((news) => news.category === selectedCategory.value);

	const start = (currentPage.value - 1) * itemsPerPage;
	const end = start + itemsPerPage;
	return filtered.slice(start, end);
});

// Total pages
const totalPages = computed(() => {
	const filtered = selectedCategory.value === "Semua" ? newsItems.value : newsItems.value.filter((news) => news.category === selectedCategory.value);
	return Math.ceil(filtered.length / itemsPerPage);
});

// Reset page when category changes
watch(selectedCategory, () => {
	currentPage.value = 1;
});
</script>
