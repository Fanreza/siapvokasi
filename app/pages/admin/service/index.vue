<script setup lang="ts">
import { Pencil, Trash2, Search } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { useServicesService } from "@/services/service.services";

definePageMeta({
	layout: "admin",
	middleware: "admin",
	title: "Layanan",
});

const { getAll, remove, response, loading } = useServicesService();

const searchQuery = ref("");
const currentPage = ref(1);
const perPage = ref(10);
const selectedToDelete = ref<number | null>(null);
const showDeleteDialog = ref(false);

// 🧩 Fetch Data
const params = computed(() => ({
	page: currentPage.value,
}));

const fetchServices = async () => {
	try {
		await getAll(false, params.value);
	} catch {
		toast.error("Gagal memuat data layanan.");
	}
};

onMounted(fetchServices);

// 🧩 Delete
const confirmDelete = (id: number) => {
	selectedToDelete.value = id;
	showDeleteDialog.value = true;
};

const handleDelete = async () => {
	if (!selectedToDelete.value) return;

	try {
		await remove(selectedToDelete.value);
		toast.success("Layanan berhasil dihapus.");
		await fetchServices();
	} catch {
		toast.error("Gagal menghapus layanan.");
	} finally {
		showDeleteDialog.value = false;
	}
};

// 🧭 Navigation
const onCreate = () => navigateTo("/admin/service/create");
const onEdit = (id: number) => navigateTo(`/admin/service/${id}/edit`);

const onPageChange = (page: number) => {
	currentPage.value = page;

	fetchServices();
};
</script>

<template>
	<div class="flex-1 space-y-6 p-6">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-semibold text-gray-900">Daftar Layanan</h1>
			<Button @click="onCreate" class="bg-blue-900 hover:bg-blue-800 text-white font-medium px-6"> Tambah </Button>
		</div>

		<!-- Search -->
		<div class="relative w-full sm:w-1/3">
			<Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
			<Input v-model="searchQuery" placeholder="Cari layanan..." class="pl-9" />
		</div>

		<!-- Table -->
		<div class="relative overflow-x-auto rounded-lg border border-gray-200 bg-white">
			<Table>
				<TableHeader class="bg-gray-50">
					<TableRow>
						<TableHead class="w-[50px]">No</TableHead>
						<TableHead>Judul</TableHead>
						<TableHead>Deskripsi</TableHead>
						<TableHead>Link</TableHead>
						<TableHead>Icon</TableHead>
						<TableHead class="text-center w-[120px]">Aksi</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					<!-- Loading -->
					<TableRow v-if="loading">
						<TableCell colspan="6" class="py-8 text-center text-gray-500">
							<div class="flex justify-center items-center gap-2">
								<span class="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></span>
								Memuat data layanan...
							</div>
						</TableCell>
					</TableRow>

					<!-- Data -->
					<TableRow v-for="(service, index) in response?.data" :key="service.id" class="hover:bg-gray-50 transition-colors">
						<TableCell class="text-gray-700">
							{{ (currentPage - 1) * (response?.meta?.perPage || 10) + index + 1 }}
						</TableCell>
						<TableCell class="font-medium text-gray-900">
							{{ service.title }}
						</TableCell>
						<TableCell class="text-gray-700 line-clamp-2">
							{{ service.description }}
						</TableCell>
						<TableCell class="text-blue-600 truncate max-w-[200px]">
							<a v-if="service.link" :href="service.link" target="_blank" class="underline hover:text-blue-800">
								{{ service.link }}
							</a>
							<span v-else class="text-gray-400 italic">-</span>
						</TableCell>
						<TableCell>
							<span v-if="service.icon" class="inline-flex items-center gap-1 text-gray-700 text-sm">
								<i :class="service.icon"></i>
								{{ service.icon }}
							</span>
							<span v-else class="text-gray-400 italic">-</span>
						</TableCell>

						<TableCell class="text-center">
							<div class="flex items-center justify-center gap-2">
								<Button variant="ghost" size="icon" @click="onEdit(service.id)">
									<Pencil class="h-4 w-4 text-gray-600" />
								</Button>
								<Button variant="ghost" size="icon" @click="confirmDelete(service.id)">
									<Trash2 class="h-4 w-4 text-gray-600" />
								</Button>
							</div>
						</TableCell>
					</TableRow>

					<!-- Kosong -->
					<TableRow v-if="!loading && (!response?.data || response.data.length === 0)">
						<TableCell colspan="6" class="text-center py-8 text-gray-500"> Belum ada layanan. </TableCell>
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
					<DialogTitle>Hapus Layanan</DialogTitle>
					<DialogDescription> Apakah kamu yakin ingin menghapus layanan ini? Tindakan ini tidak bisa dibatalkan. </DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" @click="showDeleteDialog = false"> Batal </Button>
					<Button class="bg-red-600 text-white" @click="handleDelete"> Hapus </Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	</div>
</template>
