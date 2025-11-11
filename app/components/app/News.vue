<template>
	<section class="bg-gray-50 py-16 md:py-24" id="news">
		<div class="container mx-auto px-4">
			<!-- Section Title -->
			<h2 class="mb-12 text-center font-semibold text-gray-900 text-xl md:text-3xl lg:text-4xl">Berita Terbaru</h2>

			<!-- Loading Skeleton -->
			<div v-if="loading" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<div v-for="i in 3" :key="i" class="animate-pulse rounded-xl bg-white p-4 shadow-sm">
					<div class="h-40 w-full bg-gray-200 rounded-md mb-4"></div>
					<div class="h-5 w-3/4 bg-gray-200 mb-2 rounded"></div>
					<div class="h-4 w-2/3 bg-gray-200 mb-1 rounded"></div>
					<div class="h-4 w-1/2 bg-gray-200 rounded"></div>
				</div>
			</div>

			<!-- News Grid -->
			<div v-else-if="newsItems.length > 0" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<AppUiNewsCard v-for="news in newsItems" :key="news.id" :image="news.file || '/images/placeholder.jpg'" :date="formatDate(news.createdAt)" :category="news.category?.title || '-'" :title="news.title" :excerpt="news.excerpt" :slug="news.slug" />
			</div>

			<!-- Empty State -->
			<div v-else class="text-center text-gray-500 py-12">Tidak ada berita yang tersedia saat ini.</div>

			<!-- Other Button -->
			<div class="text-center mt-10">
				<Button variant="ghost" class="border-[#00384C] border-solid border cursor-pointer" @click="onNavigateNews">
					<span>Lainnya</span>
					<Icon name="ion:arrow-forward" class="text-xl" />
				</Button>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { useNewsService } from "@/services/news.services";
import { toast } from "vue-sonner";

// 🧩 Service
const { getAll, response, loading } = useNewsService();

// 🧠 Data state
const newsItems = ref<any[]>([]);

// Fetch public news
onMounted(async () => {
	try {
		await getAll(true);
		newsItems.value = response.value?.data || [];
	} catch {
		toast.error("Gagal memuat berita terbaru.");
	}
});

// Navigate ke halaman berita
const onNavigateNews = () => navigateTo("/news");

// Format tanggal tampil cantik
const formatDate = (date: string) =>
	new Date(date).toLocaleDateString("id-ID", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
</script>
