<script setup lang="ts">
import { Pencil, Trash2, Search, FileText } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { useAnnouncementsService } from "@/services/announcement.services";

definePageMeta({
	layout: "admin",
	middleware: "admin",
	title: "Pengumuman",
});

const { getAll, remove, response, loading } = useAnnouncementsService();

const searchQuery = ref("");
const currentPage = ref(1);

const params = computed(() => ({
	search: searchQuery.value,
	page: currentPage.value,
}));

const fetchData = async () => {
	try {
		await getAll(params.value);
	} catch (err) {
		toast.error("Gagal memuat data pengumuman");
	}
};

onMounted(fetchData);

const handleEdit = (id: number) => navigateTo(`/admin/announcement/${id}/edit`);

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
		toast.success("Pengumuman berhasil dihapus");
		await fetchData();
	} catch {
		toast.error("Gagal menghapus pengumuman");
	} finally {
		showDeleteDialog.value = false;
	}
};

const onCreate = () => navigateTo("/admin/announcement/create");

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
				<h1 class="text-2xl font-semibold text-gray-900">Daftar Pengumuman</h1>
			</div>
			<Button @click="onCreate" class="bg-blue-900 hover:bg-blue-800 text-white font-medium px-6"> Tambah </Button>
		</div>

		<!-- Search -->
		<div class="flex items-center justify-between">
			<CommonDebouncedSearch v-model="searchQuery" placeholder="Cari pengumuman..." @search="fetchData" />
		</div>

		<!-- Table -->
		<div class="relative overflow-x-auto rounded-lg border border-gray-200 bg-white">
			<Table>
				<TableHeader class="bg-gray-50">
					<TableRow>
						<TableHead class="w-[50px] text-gray-700 text-sm font-medium">No</TableHead>
						<TableHead class="text-gray-700 text-sm font-medium">Judul Pengumuman</TableHead>
						<TableHead class="text-gray-700 text-sm font-medium w-[350px]">Deskripsi</TableHead>
						<TableHead class="text-gray-700 text-sm font-medium text-center w-[200px]">Lampiran</TableHead>
						<TableHead class="text-center text-gray-700 text-sm font-medium w-[120px]">Aksi</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					<!-- Loading -->
					<TableRow v-if="loading">
						<TableCell colspan="5" class="py-8 text-center text-gray-500">
							<div class="flex items-center justify-center gap-2">
								<span class="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></span>
								Memuat data...
							</div>
						</TableCell>
					</TableRow>

					<!-- Data -->
					<TableRow v-for="(item, index) in response?.data" :key="item.id" class="hover:bg-gray-50 transition-colors">
						<TableCell class="text-gray-700">
							{{ (currentPage - 1) * (response?.meta?.perPage || 10) + index + 1 }}
						</TableCell>

						<TableCell class="font-medium text-gray-900">{{ item.title }}</TableCell>
						<TableCell class="text-gray-700 truncate max-w-[350px]">{{ item.description }}</TableCell>

						<TableCell class="text-center">
							<div v-if="item.file" class="flex flex-col items-center gap-1">
								<a :href="item.file" target="_blank" class="flex items-center gap-2 text-blue-600 hover:underline text-sm">
									<FileText class="h-4 w-4" />
									{{ item.file.split("/").pop() }}
								</a>
							</div>
							<span v-else class="text-gray-400 text-sm">Tidak ada file</span>
						</TableCell>

						<TableCell class="text-center">
							<div class="flex items-center justify-center gap-3">
								<button class="p-1.5 rounded-md text-gray-600 hover:text-blue-700 transition-colors" @click="handleEdit(item.id)">
									<Pencil class="h-4 w-4" />
								</button>
								<button class="p-1.5 rounded-md text-gray-600 hover:text-red-700 transition-colors" @click="confirmDelete(item.id)">
									<Trash2 class="h-4 w-4" />
								</button>
							</div>
						</TableCell>
					</TableRow>

					<!-- Empty -->
					<TableRow v-if="!loading && (!response?.data || response.data.length === 0)">
						<TableCell colspan="5" class="text-center py-8 text-gray-500">Belum ada pengumuman.</TableCell>
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
					<DialogTitle>Hapus Pengumuman</DialogTitle>
					<DialogDescription> Apakah kamu yakin ingin menghapus pengumuman ini? Tindakan ini tidak dapat dibatalkan. </DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" @click="showDeleteDialog = false">Batal</Button>
					<Button class="bg-red-600 text-white" @click="handleDelete">Hapus</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	</div>
</template>
