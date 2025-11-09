<script setup lang="ts">
import { Pencil, Trash2, Search } from "lucide-vue-next";
import { useNewsTagsService } from "@/services/tags.services";

definePageMeta({
	layout: "admin",
	middleware: "admin",
});

const { loading, error, getAll, remove, response } = useNewsTagsService();

const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = 5;

onMounted(async () => {
	await getAll();
});

const handleEdit = (item: any) => console.log("Edit:", item);
const handleDelete = (item: any) => {};

const onCreate = () => {
	navigateTo("/admin/news/tags/create");
};
</script>

<template>
	<div class="flex-1 space-y-6 p-6">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-semibold text-gray-900">Daftar Tag Berita</h1>
			</div>

			<Button @click="onCreate" class="bg-blue-900 hover:bg-blue-800 text-white font-medium px-6">Tambah</Button>
		</div>

		<!-- Search -->
		<div class="flex items-center justify-between">
			<div class="relative w-1/3">
				<Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
				<Input v-model="searchQuery" placeholder="Cari kategori..." class="pl-9" />
			</div>
		</div>

		<!-- Table -->
		<Table>
			<TableHeader class="bg-gray-50">
				<TableRow>
					<TableHead class="w-[50px] text-gray-700 text-sm font-medium">No</TableHead>
					<TableHead class="text-gray-700 text-sm font-medium">Nama</TableHead>
					<TableHead class="text-center text-gray-700 text-sm font-medium w-[120px]">Aksi</TableHead>
				</TableRow>
			</TableHeader>

			<TableBody>
				<TableRow v-for="(cat, index) in response" :key="cat.id" class="hover:bg-gray-50 transition-colors">
					<TableCell class="text-gray-700">{{ index + 1 }}</TableCell>
					<TableCell class="font-medium text-gray-900">{{ cat.name }}</TableCell>
					<TableCell class="text-center">
						<div class="flex items-center justify-center gap-3">
							<button class="p-1.5 rounded-md text-gray-600 hover:text-blue-700 transition-colors" @click="handleEdit(cat)">
								<Pencil class="h-4 w-4" />
							</button>
							<button class="p-1.5 rounded-md text-gray-600 hover:text-red-700 transition-colors" @click="handleDelete(cat)">
								<Trash2 class="h-4 w-4" />
							</button>
						</div>
					</TableCell>
				</TableRow>

				<TableRow v-if="!response || response.length === 0">
					<TableCell colspan="4" class="text-center py-8 text-gray-500">Belum ada kategori.</TableCell>
				</TableRow>
			</TableBody>
		</Table>

		<!-- Pagination -->
		<AdminAppPagination :total="100" :per-page="10" v-model:page="currentPage" />
	</div>
</template>
