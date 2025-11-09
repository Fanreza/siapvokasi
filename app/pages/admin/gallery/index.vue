<script setup lang="ts">
import { Search, Edit, Trash2, Image as ImageIcon } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { useGalleryService } from "@/services/gallery.services";

definePageMeta({
	layout: "admin",
	middleware: "admin",
	title: "Galeri",
});

const { getAll, remove, loading, response } = useGalleryService();

const search = ref("");
const currentPage = ref(1);
const selectedToDelete = ref<number | null>(null);
const showDeleteDialog = ref(false);

// 🧩 Fetch data
const fetchGallery = async () => {
	try {
		await getAll();
	} catch (err) {
		toast.error("Gagal memuat data galeri.");
	}
};

onMounted(fetchGallery);

// 🧩 Delete dialog
const confirmDelete = (id: number) => {
	selectedToDelete.value = id;
	showDeleteDialog.value = true;
};

const handleDelete = async () => {
	if (!selectedToDelete.value) return;

	try {
		await remove(selectedToDelete.value);
		toast.success("Galeri berhasil dihapus.");
		await fetchGallery();
	} catch {
		toast.error("Gagal menghapus galeri.");
	} finally {
		showDeleteDialog.value = false;
	}
};

// 🧭 Navigation
const onCreate = () => navigateTo("/admin/gallery/create");
const onEdit = (id: number) => navigateTo(`/admin/gallery/${id}/edit`);
</script>

<template>
	<div class="flex-1 space-y-6 p-6">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-semibold text-gray-900">Daftar Galeri</h1>
			<Button @click="onCreate" class="bg-blue-900 hover:bg-blue-800 text-white font-medium px-6">Tambah</Button>
		</div>

		<!-- Search -->
		<div class="relative w-full sm:w-1/3">
			<Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
			<Input v-model="search" placeholder="Cari galeri..." class="pl-9" />
		</div>

		<!-- Loading -->
		<div v-if="loading" class="flex justify-center py-20 text-gray-500">
			<div class="flex items-center gap-2">
				<span class="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></span>
				Memuat data galeri...
			</div>
		</div>

		<!-- Data -->
		<div v-else-if="response?.data?.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			<div v-for="gallery in response.data" :key="gallery.id" class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition">
				<!-- Gambar -->
				<div class="relative">
					<img v-if="gallery.files?.length" :src="gallery.files[0]" alt="Gallery Image" class="h-40 w-full object-cover" @error="gallery.files[0] = '/images/placeholder.jpg'" />
					<div v-else class="h-40 flex items-center justify-center bg-gray-50 text-gray-400">
						<ImageIcon class="h-10 w-10" />
					</div>
				</div>

				<!-- Konten -->
				<div class="flex flex-col justify-between p-4">
					<div>
						<h3 class="font-semibold text-gray-900 leading-snug line-clamp-2">{{ gallery.title }}</h3>
						<p class="mt-1 text-sm text-gray-600 line-clamp-3">{{ gallery.description || "Tidak ada deskripsi." }}</p>
					</div>

					<div class="mt-4 flex items-center justify-between text-sm text-gray-500">
						<span>{{ new Date(gallery.createdAt).toLocaleDateString() }}</span>
						<div class="flex items-center gap-2">
							<Button variant="ghost" size="icon" class="h-8 w-8" @click="onEdit(gallery.id)">
								<Edit class="h-4 w-4 text-gray-600" />
							</Button>
							<Button variant="ghost" size="icon" class="h-8 w-8" @click="confirmDelete(gallery.id)">
								<Trash2 class="h-4 w-4 text-gray-600" />
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Kosong -->
		<div v-else class="py-20 text-center text-gray-500">Belum ada galeri.</div>

		<!-- Pagination -->
		<div v-if="response?.meta" class="flex items-center justify-between border-t border-gray-100 pt-6">
			<AdminAppPagination v-model:page="currentPage" :total="response.meta.totalItems" :per-page="response.meta.perPage" />
		</div>

		<!-- Dialog Delete -->
		<Dialog v-model:open="showDeleteDialog">
			<DialogContent class="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Hapus Galeri</DialogTitle>
					<DialogDescription> Apakah kamu yakin ingin menghapus galeri ini? Tindakan ini tidak bisa dibatalkan. </DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" @click="showDeleteDialog = false">Batal</Button>
					<Button class="bg-red-600 text-white" @click="handleDelete">Hapus</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	</div>
</template>
