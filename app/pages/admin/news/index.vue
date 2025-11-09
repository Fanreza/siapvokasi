<script setup lang="ts">
import { Search, Edit, Trash2, ExternalLink, Image } from "lucide-vue-next";

import { toast } from "vue-sonner";
import { useNewsService } from "@/services/news.services";
import { useNewsCategoriesService } from "@/services/categories.services";

definePageMeta({
	layout: "admin",
	middleware: "admin",
	title: "Berita",
});

const { getAll, remove, loading, response } = useNewsService();
const { getAll: getCategories, response: categoryResponse } = useNewsCategoriesService();

const search = ref("");
const selectedCategory = ref("all");
const currentPage = ref(1);

// 🧩 Fetch data dari API
const fetchNews = async () => {
	try {
		await getAll();
	} catch (err) {
		toast.error("Gagal memuat data berita");
	}
};

// 🧩 Fetch kategori untuk dropdown
onMounted(async () => {
	await getCategories();
	await fetchNews();
});

watch([search, selectedCategory, currentPage], fetchNews);

// 🧩 Delete news dengan dialog konfirmasi
const selectedToDelete = ref<number | null>(null);
const showDeleteDialog = ref(false);

const confirmDelete = (id: number) => {
	selectedToDelete.value = id;
	showDeleteDialog.value = true;
};

const handleDelete = async () => {
	if (!selectedToDelete.value) return;

	try {
		await remove(selectedToDelete.value);
		toast.success("Berita berhasil dihapus");
		await fetchNews();
	} catch (err) {
		toast.error("Gagal menghapus berita");
	} finally {
		showDeleteDialog.value = false;
	}
};

// 🧩 Navigasi
const onCreate = () => navigateTo("/admin/news/create");
const onEdit = (id: number) => navigateTo(`/admin/news/${id}/edit`);
</script>

<template>
	<div class="flex-1 space-y-6 p-6">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-semibold text-gray-900">Daftar Berita</h1>
			</div>

			<Button @click="onCreate" class="bg-blue-900 hover:bg-blue-800 text-white font-medium px-6"> Tambah </Button>
		</div>

		<!-- Filters -->
		<div class="flex flex-wrap items-center justify-between gap-4">
			<!-- Search -->
			<div class="relative w-full md:w-1/3">
				<Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
				<Input v-model="search" placeholder="Cari berita..." class="pl-9" />
			</div>

			<!-- Category Filter -->
			<Select v-model="selectedCategory">
				<SelectTrigger class="w-[200px]">
					<SelectValue placeholder="Semua Kategori" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">Semua Kategori</SelectItem>
					<SelectItem v-for="cat in categoryResponse?.data" :key="cat.id" :value="cat.slug">
						{{ cat.title }}
					</SelectItem>
				</SelectContent>
			</Select>
		</div>

		<!-- News Grid -->
		<div v-if="loading" class="flex justify-center py-20 text-gray-500">
			<div class="flex items-center gap-2">
				<span class="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></span>
				Memuat data berita...
			</div>
		</div>

		<div v-else-if="response?.data?.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			<div v-for="news in response.data" :key="news.id" class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition">
				<!-- Image -->
				<div class="relative">
					<div v-if="news.file" class="relative">
						<img :src="news.file" alt="News Banner" class="h-40 w-full object-cover" @error="news.file = ''" />
					</div>

					<!-- 🧩 Fallback kalau gambar kosong -->
					<div v-else class="flex items-center justify-center h-40 w-full bg-gray-100 text-gray-400">
						<Image class="h-10 w-10" />
					</div>

					<!-- Kategori & status -->
					<span class="absolute left-3 top-3 rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
						{{ news.category?.title || "Tanpa Kategori" }}
					</span>
					<span class="absolute right-3 top-3 text-xs font-medium" :class="news.status === 'publish' ? 'text-green-600' : 'text-gray-400'">
						{{ news.status }}
					</span>
				</div>

				<!-- Content -->
				<div class="flex flex-col justify-between p-4">
					<div>
						<h3 class="font-semibold text-gray-900 leading-snug line-clamp-2">
							{{ news.title }}
							<a :href="`/berita/${news.id}`" target="_blank" class="inline-block ml-1">
								<ExternalLink class="h-3 w-3 text-gray-400" />
							</a>
						</h3>
						<p class="mt-1 text-sm text-gray-600 line-clamp-3">
							{{ news.excerpt }}
						</p>
					</div>

					<div class="mt-4 flex items-center justify-between text-sm text-gray-500">
						<span>{{ new Date(news.createdAt).toLocaleDateString() }}</span>
						<div class="flex gap-2">
							<Button variant="ghost" size="icon" class="h-8 w-8" @click="onEdit(news.id)">
								<Edit class="h-4 w-4 text-gray-600" />
							</Button>
							<Button variant="ghost" size="icon" class="h-8 w-8" @click="confirmDelete(news.id)">
								<Trash2 class="h-4 w-4 text-gray-600" />
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div v-else class="py-20 text-center text-gray-500">Belum ada berita.</div>

		<!-- Pagination -->
		<div v-if="response?.meta" class="flex items-center justify-between border-t border-gray-100 pt-6">
			<AdminAppPagination v-model:page="currentPage" :total="response.meta.totalItems" :per-page="response.meta.perPage" />
		</div>

		<!-- 🧩 Delete Dialog -->
		<Dialog v-model:open="showDeleteDialog">
			<DialogContent class="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Hapus Berita</DialogTitle>
					<DialogDescription> Apakah kamu yakin ingin menghapus berita ini? Tindakan ini tidak bisa dibatalkan. </DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" @click="showDeleteDialog = false">Batal</Button>
					<Button class="bg-red-600 text-white" @click="handleDelete">Hapus</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	</div>
</template>
