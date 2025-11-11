<script setup lang="ts">
import { Pencil, Trash2, Plus } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { useHistoryService } from "@/services/history.services";

definePageMeta({
	layout: "admin",
	middleware: "admin",
	title: "Sejarah Perusahaan",
});

const { getAll, remove, response, loading } = useHistoryService();

const currentPage = ref(1);
const selectedToDelete = ref<number | null>(null);
const showDeleteDialog = ref(false);

const params = computed(() => ({
	page: currentPage.value,
}));

const fetchHistories = async () => {
	try {
		await getAll(false, params.value);
	} catch {
		toast.error("Gagal memuat data sejarah.");
	}
};

onMounted(fetchHistories);

// Delete
const confirmDelete = (id: number) => {
	selectedToDelete.value = id;
	showDeleteDialog.value = true;
};

const handleDelete = async () => {
	if (!selectedToDelete.value) return;
	try {
		await remove(selectedToDelete.value);
		toast.success("Sejarah berhasil dihapus.");
		await fetchHistories();
	} catch {
		toast.error("Gagal menghapus sejarah.");
	} finally {
		showDeleteDialog.value = false;
	}
};

// Navigation
const onCreate = () => navigateTo("/admin/history/create");
const onEdit = (id: number) => navigateTo(`/admin/history/${id}/edit`);

const onPageChange = (page: number) => {
	currentPage.value = page;

	fetchHistories();
};
</script>

<template>
	<div class="flex-1 space-y-6 p-6">
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-semibold text-gray-900">Daftar Sejarah</h1>
			<Button @click="onCreate" class="bg-blue-900 hover:bg-blue-800 text-white font-medium px-6"> <Plus class="mr-2 h-4 w-4" /> Tambah </Button>
		</div>

		<div class="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
			<Table>
				<TableHeader class="bg-gray-50">
					<TableRow>
						<TableHead class="w-[60px]">No</TableHead>
						<TableHead>Tahun</TableHead>
						<TableHead>Deskripsi</TableHead>
						<TableHead>Detail</TableHead>
						<TableHead class="text-center w-[120px]">Aksi</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					<TableRow v-if="loading">
						<TableCell colspan="5" class="text-center py-6 text-gray-500"> Memuat data... </TableCell>
					</TableRow>

					<TableRow v-for="(item, index) in response?.data" :key="item.id" class="hover:bg-gray-50">
						<TableCell>{{ index + 1 }}</TableCell>
						<TableCell>{{ item.year }}</TableCell>
						<TableCell>{{ item.description }}</TableCell>
						<TableCell class="truncate max-w-[300px]">{{ item.detail }}</TableCell>
						<TableCell class="text-center">
							<div class="flex justify-center gap-2">
								<Button variant="ghost" size="icon" @click="onEdit(item.id)">
									<Pencil class="h-4 w-4 text-gray-600" />
								</Button>
								<Button variant="ghost" size="icon" @click="confirmDelete(item.id)">
									<Trash2 class="h-4 w-4 text-gray-600" />
								</Button>
							</div>
						</TableCell>
					</TableRow>

					<TableRow v-if="!loading && (!response?.data || response.data.length === 0)">
						<TableCell colspan="5" class="text-center py-8 text-gray-500"> Belum ada data sejarah. </TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</div>

		<!-- Pagination -->
		<AdminAppPagination v-if="response?.meta" @update:page="onPageChange" :total="response.meta.totalItems" :per-page="response.meta.perPage" />

		<!-- Delete Dialog -->
		<Dialog v-model:open="showDeleteDialog">
			<DialogContent class="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Hapus Sejarah</DialogTitle>
					<DialogDescription> Apakah kamu yakin ingin menghapus entri sejarah ini? </DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" @click="showDeleteDialog = false">Batal</Button>
					<Button class="bg-red-600 text-white" @click="handleDelete">Hapus</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	</div>
</template>
