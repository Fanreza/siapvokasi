<script setup lang="ts">
import { Pencil, Trash2 } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { useStatisticCategoryService } from "@/services/stats-scategory.services";

definePageMeta({
	layout: "admin",
	middleware: "admin",
	title: "Kategori Statistik",
});

const { getAll, remove, response, loading } = useStatisticCategoryService();

const currentPage = ref(1);
const selectedToDelete = ref<number | null>(null);
const showDeleteDialog = ref(false);

const params = computed(() => ({
	page: currentPage.value,
}));

const fetchCategories = async () => {
	try {
		await getAll(false, params.value);
	} catch {
		toast.error("Gagal memuat kategori statistik.");
	}
};

onMounted(fetchCategories);

const confirmDelete = (id: number) => {
	selectedToDelete.value = id;
	showDeleteDialog.value = true;
};

const handleDelete = async () => {
	if (!selectedToDelete.value) return;
	try {
		await remove(selectedToDelete.value);
		toast.success("Kategori berhasil dihapus.");
		await fetchCategories();
	} catch {
		toast.error("Gagal menghapus kategori.");
	} finally {
		showDeleteDialog.value = false;
	}
};

const onCreate = () => navigateTo("/admin/stats/categories/create");
const onEdit = (id: number) => navigateTo(`/admin/stats/categories/${id}/edit`);

const onPageChange = (page: number) => {
	currentPage.value = page;

	fetchCategories();
};
</script>

<template>
	<div class="flex-1 space-y-6 p-6">
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-semibold text-gray-900">Daftar Kategori Statistik</h1>
			<Button @click="onCreate" class="bg-blue-900 hover:bg-blue-800 text-white font-medium px-6"> Tambah </Button>
		</div>

		<div class="relative overflow-x-auto rounded-lg border border-gray-200 bg-white">
			<Table>
				<TableHeader class="bg-gray-50">
					<TableRow>
						<TableHead class="w-[50px]">No</TableHead>
						<TableHead>Nama</TableHead>
						<TableHead>Link</TableHead>
						<TableHead class="text-center w-[120px]">Aksi</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					<TableRow v-if="loading">
						<TableCell colspan="4" class="text-center py-8 text-gray-500">
							<span class="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></span>
							Memuat data...
						</TableCell>
					</TableRow>

					<TableRow v-for="(cat, index) in response?.data" :key="cat.id" class="hover:bg-gray-50 transition">
						<TableCell>{{ (currentPage - 1) * 10 + index + 1 }}</TableCell>
						<TableCell class="font-medium text-gray-900">{{ cat.name }}</TableCell>
						<TableCell>
							<a :href="cat.link" target="_blank" class="text-blue-600 hover:underline">
								{{ cat.link }}
							</a>
						</TableCell>
						<TableCell class="text-center">
							<div class="flex items-center justify-center gap-2">
								<Button variant="ghost" size="icon" @click="onEdit(cat.id)">
									<Pencil class="h-4 w-4 text-gray-600" />
								</Button>
								<Button variant="ghost" size="icon" @click="confirmDelete(cat.id)">
									<Trash2 class="h-4 w-4 text-gray-600" />
								</Button>
							</div>
						</TableCell>
					</TableRow>

					<TableRow v-if="!loading && (!response?.data || response.data.length === 0)">
						<TableCell colspan="4" class="text-center py-8 text-gray-500"> Belum ada kategori statistik. </TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</div>

		<AdminAppPagination v-if="response?.meta" @update:page="onPageChange" :total="response.meta.totalItems" :per-page="response.meta.perPage" />

		<Dialog v-model:open="showDeleteDialog">
			<DialogContent class="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Hapus Kategori</DialogTitle>
					<DialogDescription>Apakah kamu yakin ingin menghapus kategori ini?</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" @click="showDeleteDialog = false">Batal</Button>
					<Button class="bg-red-600 text-white" @click="handleDelete">Hapus</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	</div>
</template>
