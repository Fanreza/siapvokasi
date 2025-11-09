<script setup lang="ts">
import { Search, Edit, Trash2, ExternalLink } from "lucide-vue-next";

definePageMeta({
	layout: "admin",
	middleware: "admin",
	title: "Berita",
});

const search = ref("");
const selectedCategory = ref("all");

const newsList = ref([
	{
		id: 1,
		title: "Peluncuran Program Sertifikasi Baru",
		category: "SKKNI",
		status: "Publish",
		date: "23 Apr 2025",
		image: "/images/sample.jpg",
		description: "Organisasi meluncurkan program sertifikasi terbaru untuk meningkatkan kompetensi profesional...",
	},
	{
		id: 2,
		title: "Peluncuran Program Sertifikasi Baru",
		category: "SKKNI",
		status: "Publish",
		date: "23 Apr 2025",
		image: "/images/sample.jpg",
		description: "Organisasi meluncurkan program sertifikasi terbaru untuk meningkatkan kompetensi profesional...",
	},
	{
		id: 3,
		title: "Peluncuran Program Sertifikasi Baru",
		category: "SKKNI",
		status: "Draft",
		date: "23 Apr 2025",
		image: "/images/sample.jpg",
		description: "Organisasi meluncurkan program sertifikasi terbaru untuk meningkatkan kompetensi profesional...",
	},
]);

const filteredNews = computed(() => {
	return newsList.value.filter((n) => {
		const matchesSearch = n.title.toLowerCase().includes(search.value.toLowerCase());
		const matchesCategory = selectedCategory.value === "all" || n.category === selectedCategory.value;
		return matchesSearch && matchesCategory;
	});
});

const deleteNews = (id: number) => {
	newsList.value = newsList.value.filter((n) => n.id !== id);
};

const onCreate = () => {
	navigateTo("/admin/news/create");
};
</script>

<template>
	<div class="flex-1 space-y-6 p-6">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-semibold text-gray-900">Daftar Berita</h1>
			</div>

			<!-- Cancel -->
			<div class="flex items-center gap-2">
				<Button @click="onCreate" class="bg-blue-900 hover:bg-blue-800 text-white font-medium px-6"> Tambah </Button>
			</div>
		</div>

		<!-- Filters -->
		<div class="flex flex-wrap items-center justify-between gap-4">
			<div class="relative w-full md:w-1/3">
				<Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
				<Input v-model="search" placeholder="Search" class="pl-9" />
			</div>

			<Select v-model="selectedCategory">
				<SelectTrigger class="w-[200px]">
					<SelectValue placeholder="Semua Kategori" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">Semua Kategori</SelectItem>
					<SelectItem value="SKKNI">SKKNI</SelectItem>
					<SelectItem value="KKNI">KKNI</SelectItem>
					<SelectItem value="Proglat">Proglat</SelectItem>
				</SelectContent>
			</Select>
		</div>

		<!-- News Grid -->
		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			<div v-for="news in filteredNews" :key="news.id" class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition">
				<!-- Image -->
				<div class="relative">
					<img :src="news.image" alt="News Banner" class="h-40 w-full object-cover" @error="news.image = '/images/placeholder.jpg'" />
					<span class="absolute left-3 top-3 rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
						{{ news.category }}
					</span>
					<span class="absolute right-3 top-3 text-xs font-medium" :class="news.status === 'Publish' ? 'text-green-600' : 'text-gray-400'">
						{{ news.status }}
					</span>
				</div>

				<!-- Content -->
				<div class="flex flex-col justify-between p-4">
					<div>
						<h3 class="font-semibold text-gray-900 leading-snug line-clamp-2">
							{{ news.title }}
							<a href="#" target="_blank">
								<ExternalLink class="inline-block ml-1 h-3 w-3 text-gray-400" />
							</a>
						</h3>
						<p class="mt-1 text-sm text-gray-600 line-clamp-3">{{ news.description }}</p>
					</div>

					<div class="mt-4 flex items-center justify-between text-sm text-gray-500">
						<span>{{ news.date }}</span>
						<div class="flex gap-2">
							<Button variant="ghost" size="icon" class="h-8 w-8">
								<Edit class="h-4 w-4 text-gray-600" />
							</Button>
							<Button variant="ghost" size="icon" class="h-8 w-8" @click="deleteNews(news.id)">
								<Trash2 class="h-4 w-4 text-gray-600" />
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Pagination -->
		<div class="flex items-center justify-between border-t border-gray-100 pt-6">
			<Pagination v-slot="{ page }" :total="100" :sibling-count="1" :items-per-page="10" show-edges :default-page="2">
				<PaginationContent v-slot="{ items }">
					<PaginationPrevious asChild>
						<Button variant="outline">Sebelumnya</Button>
					</PaginationPrevious>

					<template v-for="(item, index) in items" :key="index">
						<PaginationItem v-if="item.type === 'page'" :value="item.value" :is-active="item.value === page">
							{{ item.value }}
						</PaginationItem>

						<PaginationEllipsis v-else :key="item.type" :index="index" />
					</template>

					<PaginationNext asChild>
						<Button variant="outline">Selanjutnya</Button>
					</PaginationNext>
				</PaginationContent>
			</Pagination>
		</div>
	</div>
</template>
