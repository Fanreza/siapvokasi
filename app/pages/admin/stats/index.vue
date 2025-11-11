<script setup lang="ts">
import { Pencil, Trash2 } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { useStatisticService } from "@/services/stats.services";

definePageMeta({
	layout: "admin",
	middleware: "admin",
	title: "Statistik",
});

const { getAll, remove, response, loading } = useStatisticService();
const currentPage = ref(1);
const showDeleteDialog = ref(false);
const selectedToDelete = ref<number | null>(null);

const params = computed(() => ({
	page: currentPage.value,
}));

const fetchStats = async () => {
	try {
		await getAll(false, params.value);
	} catch {
		toast.error("Gagal memuat data statistik.");
	}
};

onMounted(fetchStats);

const confirmDelete = (id: number) => {
	selectedToDelete.value = id;
	showDeleteDialog.value = true;
};

const handleDelete = async () => {
	if (!selectedToDelete.value) return;
	try {
		await remove(selectedToDelete.value);
		toast.success("Statistik berhasil dihapus.");
		await fetchStats();
	} catch {
		toast.error("Gagal menghapus data statistik.");
	} finally {
		showDeleteDialog.value = false;
	}
};

const onCreate = () => navigateTo("/admin/stats/create");
const onEdit = (id: number) => navigateTo(`/admin/stats/${id}/edit`);

const onPageChange = (page: number) => {
	currentPage.value = page;

	fetchStats();
};
</script>

<template>
	<div class="flex-1 space-y-6 p-6">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-semibold text-gray-900">Daftar Statistik</h1>
			<Button @click="onCreate" class="bg-blue-900 hover:bg-blue-800 text-white font-medium px-6"> Tambah </Button>
		</div>

		<div class="relative overflow-x-auto rounded-lg border border-gray-200 bg-white">
			<Table>
				<TableHeader class="bg-gray-50">
					<TableRow>
						<TableHead class="w-[50px]">No</TableHead>
						<TableHead>Nama</TableHead>
						<TableHead>Angka</TableHead>
						<TableHead>Link</TableHead>
						<TableHead>Kategori ID</TableHead>
						<TableHead class="text-center w-[120px]">Aksi</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					<TableRow v-if="loading">
						<TableCell colspan="6" class="text-center py-8 text-gray-500">
							<span class="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></span>
							Memuat data...
						</TableCell>
					</TableRow>

					<TableRow v-for="(stat, index) in response?.data" :key="stat.id" class="hover:bg-gray-50 transition">
						<TableCell>{{ (currentPage - 1) * 10 + index + 1 }}</TableCell>
						<TableCell>{{ stat.name }}</TableCell>
						<TableCell>{{ stat.number }}</TableCell>
						<TableCell>
							<a :href="stat.link" target="_blank" class="text-blue-600 hover:underline">
								{{ stat.link }}
							</a>
						</TableCell>
						<TableCell>{{ stat.category.name }}</TableCell>
						<TableCell class="text-center">
							<div class="flex justify-center gap-2">
								<Button variant="ghost" size="icon" @click="onEdit(stat.id)">
									<Pencil class="h-4 w-4 text-gray-600" />
								</Button>
								<Button variant="ghost" size="icon" @click="confirmDelete(stat.id)">
									<Trash2 class="h-4 w-4 text-gray-600" />
								</Button>
							</div>
						</TableCell>
					</TableRow>

					<TableRow v-if="!loading && (!response?.data || response.data.length === 0)">
						<TableCell colspan="6" class="text-center py-8 text-gray-500"> Belum ada data statistik. </TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</div>

		<AdminAppPagination v-if="response?.meta" @update:page="onPageChange" :total="response.meta.totalItems" :per-page="response.meta.perPage" />

		<Dialog v-model:open="showDeleteDialog">
			<DialogContent class="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Hapus Statistik</DialogTitle>
					<DialogDescription>Apakah kamu yakin ingin menghapus data ini?</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" @click="showDeleteDialog = false">Batal</Button>
					<Button class="bg-red-600 text-white" @click="handleDelete">Hapus</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	</div>
</template>
