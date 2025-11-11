<script setup lang="ts">
import { Pencil, Trash2, Search } from "lucide-vue-next";
import { useNewsCategoriesService } from "@/services/categories.services";
import { toast } from "vue-sonner";

definePageMeta({
	layout: "admin",
	middleware: "admin",
});

const { loading, error, getAll, remove, response } = useNewsCategoriesService();

const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(10);
const showDialog = ref(false);
const selectedId = ref<number | null>(null);
const deleting = ref(false);

const params = computed(() => ({
	search: searchQuery.value,
	page: currentPage.value,
}));

const fetchData = async () => {
	try {
		await getAll(false, params.value);
	} catch (err: any) {
		toast.error("Gagal memuat data kategori.");
	}
};

onMounted(fetchData);

const onCreate = () => navigateTo("/admin/news/categories/create");

const handleDelete = (id: number) => {
	selectedId.value = id;
	showDialog.value = true;
};

const confirmDelete = async () => {
	if (!selectedId.value) return;
	deleting.value = true;

	try {
		await remove(selectedId.value);
		toast.success("Kategori berhasil dihapus.");
		showDialog.value = false;
		await fetchData();
	} catch (err: any) {
		toast.error("Gagal menghapus kategori.");
	} finally {
		deleting.value = false;
	}
};

const handleEdit = (id: number) => navigateTo(`/admin/news/categories/${id}/edit`);

const onPageChange = (page: number) => {
	currentPage.value = page;

	fetchData();
};
</script>

<template>
	<div class="flex-1 space-y-6 p-6">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-semibold text-gray-900">Daftar Kategori Berita</h1>
			</div>

			<Button @click="onCreate" class="bg-blue-900 hover:bg-blue-800 text-white font-medium px-6"> Tambah </Button>
		</div>

		<!-- Search -->
		<div class="flex items-center justify-between">
			<CommonDebouncedSearch v-model="searchQuery" placeholder="Cari kategori..." @search="fetchData" />
		</div>

		<!-- Table -->
		<div class="relative overflow-x-auto rounded-lg border border-gray-200 bg-white">
			<Table>
				<TableHeader class="bg-gray-50">
					<TableRow>
						<TableHead class="w-[50px] text-gray-700 text-sm font-medium">No</TableHead>
						<TableHead class="text-gray-700 text-sm font-medium">Judul</TableHead>
						<TableHead class="text-gray-700 text-sm font-medium">Slug</TableHead>
						<TableHead class="text-center text-gray-700 text-sm font-medium w-[120px]">Aksi</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					<!-- 🌀 Loading -->
					<TableRow v-if="loading">
						<TableCell colspan="4" class="py-8 text-center text-gray-500">
							<div class="flex items-center justify-center gap-2">
								<span class="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></span>
								Memuat data...
							</div>
						</TableCell>
					</TableRow>

					<!-- 🧩 Data -->
					<TableRow v-for="(cat, index) in response?.data" :key="cat.id" class="hover:bg-gray-50 transition-colors">
						<TableCell class="text-gray-700">
							{{ (currentPage - 1) * (response?.meta?.perPage || 10) + index + 1 }}
						</TableCell>
						<TableCell class="font-medium text-gray-900">{{ cat.title }}</TableCell>
						<TableCell class="text-gray-700">{{ cat.slug }}</TableCell>
						<TableCell class="text-center">
							<div class="flex items-center justify-center gap-3">
								<button class="p-1.5 rounded-md text-gray-600 hover:text-blue-700 transition-colors" @click="handleEdit(cat.id)">
									<Pencil class="h-4 w-4" />
								</button>
								<button class="p-1.5 rounded-md text-gray-600 hover:text-red-700 transition-colors" @click="handleDelete(cat.id)">
									<Trash2 class="h-4 w-4" />
								</button>
							</div>
						</TableCell>
					</TableRow>

					<!-- 🚫 Kosong -->
					<TableRow v-if="!loading && (!response?.data || response.data.length === 0)">
						<TableCell colspan="4" class="text-center py-8 text-gray-500"> Belum ada kategori. </TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</div>

		<!-- Pagination -->
		<AdminAppPagination v-if="response?.meta" @update:page="onPageChange" :total="response.meta.totalItems" :per-page="response.meta.perPage" />

		<!-- 🗑️ Delete Dialog -->
		<Dialog v-model:open="showDialog">
			<DialogContent class="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Hapus Kategori?</DialogTitle>
					<DialogDescription> Tindakan ini tidak dapat dibatalkan. Data kategori akan dihapus secara permanen. </DialogDescription>
				</DialogHeader>

				<DialogFooter>
					<DialogClose as-child>
						<Button variant="outline">Batal</Button>
					</DialogClose>
					<Button class="bg-red-600 hover:bg-red-700 text-white" @click="confirmDelete" :disabled="deleting">
						<span v-if="!deleting">Hapus</span>
						<span v-else class="flex items-center gap-2">
							<span class="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
							Menghapus...
						</span>
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	</div>
</template>
