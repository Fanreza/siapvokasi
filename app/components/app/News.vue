<template>
	<section class="bg-gray-50 py-16 md:py-24">
		<div class="container mx-auto px-4">
			<!-- Section Title -->
			<h2 class="mb-12 text-center font-semibold text-gray-900 text-xl md:text-3xl lg:text-4xl">Berita Terbaru</h2>

			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<AppUiNewsCard v-for="news in newsItems" :key="news.id" :image="news.image" :date="news.date" :category="news.category" :title="news.title" :excerpt="news.excerpt" :slug="news.slug" />
			</div>

			<!-- Other Button -->
			<div class="text-center mt-10">
				<Button variant="ghost" class="border-[#00384C] border-solid border cursor-pointer" @click="onNavigateNews">
					<span> Lainnya </span>

					<Icon name="ion:arrow-forward" class="text-xl" />
				</Button>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { BookOpen, GraduationCap, Award, ArrowRight } from "lucide-vue-next";

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

const onNavigateNews = () => {
	navigateTo("/news");
};
</script>
