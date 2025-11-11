<script setup lang="ts">
import { Pencil, Trash2 } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { useDirectorProfileService } from "@/services/director.services";

definePageMeta({
	layout: "admin",
	middleware: "admin",
	title: "Profil Direktur",
});

const { getAll, remove, response, loading } = useDirectorProfileService();

const showDeleteDialog = ref(false);
const selectedToDelete = ref<number | null>(null);
const currentPage = ref(1);

const params = computed(() => ({
	page: currentPage.value,
}));

const fetchProfiles = async () => {
	try {
		await getAll(false, params.value);
	} catch {
		toast.error("Gagal memuat data direktur.");
	}
};

onMounted(fetchProfiles);

const confirmDelete = (id: number) => {
	selectedToDelete.value = id;
	showDeleteDialog.value = true;
};

const handleDelete = async () => {
	if (!selectedToDelete.value) return;
	try {
		await remove(selectedToDelete.value);
		toast.success("Profil direktur berhasil dihapus.");
		await fetchProfiles();
	} catch {
		toast.error("Gagal menghapus data.");
	} finally {
		showDeleteDialog.value = false;
	}
};

const onCreate = () => navigateTo("/admin/director/create");
const onEdit = (id: number) => navigateTo(`/admin/director/${id}/edit`);

const onPageChange = (page: number) => {
	currentPage.value = page;

	fetchProfiles();
};
</script>

<template>
	<div class="flex-1 space-y-6 p-6">
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-semibold text-gray-900">Daftar Profil Direktur</h1>
			<Button @click="onCreate" class="bg-blue-900 hover:bg-blue-800 text-white font-medium px-6">Tambah</Button>
		</div>

		<div class="relative overflow-x-auto rounded-lg border border-gray-200 bg-white">
			<Table>
				<TableHeader class="bg-gray-50">
					<TableRow>
						<TableHead>No</TableHead>
						<TableHead>Nama</TableHead>
						<TableHead>Masa Jabatan</TableHead>
						<TableHead>Urutan</TableHead>
						<TableHead class="text-center w-[120px]">Aksi</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					<TableRow v-if="loading">
						<TableCell colspan="5" class="py-8 text-center text-gray-500">
							<span class="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></span>
							Memuat data...
						</TableCell>
					</TableRow>

					<TableRow v-for="(item, index) in response?.data" :key="item.id">
						<TableCell>{{ index + 1 }}</TableCell>
						<TableCell>{{ item.name }}</TableCell>
						<TableCell>{{ item.beginYear }} - {{ item.endYear || "Sekarang" }}</TableCell>
						<TableCell>{{ item.order }}</TableCell>
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
						<TableCell colspan="5" class="text-center py-8 text-gray-500">Belum ada data direktur.</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</div>

		<AdminAppPagination v-if="response?.meta" @update:page="onPageChange" :total="response.meta.totalItems" :per-page="response.meta.perPage" />

		<!-- Delete Dialog -->
		<Dialog v-model:open="showDeleteDialog">
			<DialogContent class="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Hapus Profil Direktur</DialogTitle>
					<DialogDescription>Apakah kamu yakin ingin menghapus profil ini?</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" @click="showDeleteDialog = false">Batal</Button>
					<Button class="bg-red-600 text-white" @click="handleDelete">Hapus</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	</div>
</template>
