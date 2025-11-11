<script setup lang="ts">
import { Pencil, Trash2, Search } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { useSocialMediaService } from "@/services/sosmed.services";

definePageMeta({
	layout: "admin",
	middleware: "admin",
	title: "Media Sosial",
});

const { getAll, remove, response, loading } = useSocialMediaService();

const searchQuery = ref("");
const currentPage = ref(1);
const selectedToDelete = ref<number | null>(null);
const showDeleteDialog = ref(false);

const params = computed(() => ({
	page: currentPage.value,
}));

// 🧩 Fetch Data
const fetchData = async () => {
	try {
		await getAll(params.value);
	} catch {
		toast.error("Gagal memuat data media sosial.");
	}
};

onMounted(fetchData);

// 🧩 Delete
const confirmDelete = (id: number) => {
	selectedToDelete.value = id;
	showDeleteDialog.value = true;
};

const handleDelete = async () => {
	if (!selectedToDelete.value) return;

	try {
		await remove(selectedToDelete.value);
		toast.success("Media sosial berhasil dihapus.");
		await fetchData();
	} catch {
		toast.error("Gagal menghapus media sosial.");
	} finally {
		showDeleteDialog.value = false;
	}
};

// 🧭 Navigation
const onCreate = () => navigateTo("/admin/social/create");
const onEdit = (id: number) => navigateTo(`/admin/social/${id}/edit`);

const onPageChange = (page: number) => {
	currentPage.value = page;

	fetchData();
};
</script>

<template>
	<div class="flex-1 space-y-6 p-6">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-semibold text-gray-900">Daftar Media Sosial</h1>
			<Button @click="onCreate" class="bg-blue-900 hover:bg-blue-800 text-white font-medium px-6"> Tambah </Button>
		</div>

		<!-- Search -->
		<div class="relative w-full sm:w-1/3">
			<Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
			<Input v-model="searchQuery" placeholder="Cari media sosial..." class="pl-9" />
		</div>

		<!-- Table -->
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
					<!-- Loading -->
					<TableRow v-if="loading">
						<TableCell colspan="4" class="py-8 text-center text-gray-500">
							<div class="flex justify-center items-center gap-2">
								<span class="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></span>
								Memuat data...
							</div>
						</TableCell>
					</TableRow>

					<!-- Data -->
					<TableRow v-for="(sm, index) in response?.data" :key="sm.id" class="hover:bg-gray-50">
						<TableCell>{{ index + 1 }}</TableCell>
						<TableCell class="font-medium text-gray-900">{{ sm.name }}</TableCell>
						<TableCell>
							<a :href="sm.link" target="_blank" class="text-blue-600 hover:underline truncate max-w-[300px] block">
								{{ sm.link }}
							</a>
						</TableCell>
						<TableCell class="text-center">
							<div class="flex items-center justify-center gap-2">
								<Button variant="ghost" size="icon" @click="onEdit(sm.id)">
									<Pencil class="h-4 w-4 text-gray-600" />
								</Button>
								<Button variant="ghost" size="icon" @click="confirmDelete(sm.id)">
									<Trash2 class="h-4 w-4 text-gray-600" />
								</Button>
							</div>
						</TableCell>
					</TableRow>

					<!-- Kosong -->
					<TableRow v-if="!loading && (!response?.data || response.data.length === 0)">
						<TableCell colspan="4" class="text-center py-8 text-gray-500">Belum ada data media sosial.</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</div>

		<!-- Pagination -->
		<AdminAppPagination v-if="response?.meta" @update:page="onPageChange" :total="response.meta.totalItems" :per-page="response.meta.perPage" />

		<!-- Dialog Delete -->
		<Dialog v-model:open="showDeleteDialog">
			<DialogContent class="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Hapus Media Sosial</DialogTitle>
					<DialogDescription>Apakah kamu yakin ingin menghapus media sosial ini? Tindakan ini tidak bisa dibatalkan.</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" @click="showDeleteDialog = false">Batal</Button>
					<Button class="bg-red-600 text-white" @click="handleDelete">Hapus</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	</div>
</template>
