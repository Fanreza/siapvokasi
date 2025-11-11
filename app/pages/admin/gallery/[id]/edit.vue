<script setup lang="ts">
import { UploadCloud, X, Trash2 } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { useRoute, useRouter } from "vue-router";
import { useGalleryService } from "@/services/gallery.services";

definePageMeta({
	layout: "admin",
	middleware: "admin",
});

const route = useRoute();
const router = useRouter();
const { get, update, addImages, deleteImage, loading } = useGalleryService();

// 🧩 Reactive state
const form = ref({
	title: "",
	description: "",
});

const existingImages = ref<{ id: number; image: string }[]>([]);
const newPreviews = ref<string[]>([]);

const showDeleteDialog = ref(false);
const imageToDelete = ref<number | null>(null);

// 🧩 Load gallery data
const loadGallery = async () => {
	try {
		const data = await get(Number(route.params.id));
		if (data) {
			form.value.title = data.title;
			form.value.description = data.description || "";
			existingImages.value = data.images || [];
		}
	} catch {
		toast.error("Gagal memuat data galeri.");
	}
};

onMounted(loadGallery);

// 🧩 Total gambar (existing + baru)
const totalImages = computed(() => existingImages.value.length);

// 🧩 Upload file baru → langsung upload ke server
const handleFileChange = async (event: Event) => {
	const target = event.target as HTMLInputElement;
	if (!target.files?.length) return;

	const selected = Array.from(target.files);
	const availableSlots = 4 - totalImages.value;

	if (availableSlots <= 0) {
		toast.error("Maksimal 4 gambar dalam satu galeri.");
		target.value = "";
		return;
	}

	if (selected.length > availableSlots) {
		toast.error(`Kamu hanya bisa menambahkan ${availableSlots} gambar lagi.`);
	}

	const allowedFiles = selected.slice(0, availableSlots);

	try {
		toast.info("Mengupload gambar...");
		await addImages(Number(route.params.id), allowedFiles);
		toast.success("Gambar berhasil ditambahkan!");
		await loadGallery(); // 🔄 reload data galeri setelah upload
		newPreviews.value = [];
	} catch {
		toast.error("Gagal menambahkan gambar.");
	} finally {
		target.value = "";
	}
};

// 🧩 Open dialog hapus
const openDeleteDialog = (imageId: number) => {
	imageToDelete.value = imageId;
	showDeleteDialog.value = true;
};

// 🧩 Konfirmasi hapus gambar
const confirmDelete = async () => {
	if (!imageToDelete.value) return;
	try {
		await deleteImage(Number(route.params.id), imageToDelete.value);
		toast.success("Gambar berhasil dihapus.");
		await loadGallery(); // reload setelah hapus
	} catch {
		toast.error("Gagal menghapus gambar.");
	} finally {
		showDeleteDialog.value = false;
		imageToDelete.value = null;
	}
};

// 🧩 Submit update (title + desc)
const handleSubmit = async () => {
	if (!form.value.title) {
		toast.error("Judul wajib diisi");
		return;
	}

	try {
		await update(Number(route.params.id), {
			title: form.value.title,
			description: form.value.description,
		});
		toast.success("Galeri berhasil diperbarui!");
		router.push("/admin/gallery");
	} catch {
		toast.error("Gagal memperbarui galeri.");
	}
};

const handleCancel = () => router.back();
</script>

<template>
	<div class="flex-1 space-y-6 p-6">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-semibold text-gray-900">Edit Galeri</h1>
			<Button @click="handleCancel" class="bg-blue-900 hover:bg-blue-800 text-white font-medium px-6"> Kembali </Button>
		</div>

		<!-- Form -->
		<div class="space-y-10">
			<!-- Judul -->
			<div class="space-y-2">
				<label class="block text-sm font-medium text-gray-800">Judul</label>
				<Input v-model="form.title" placeholder="Masukkan judul galeri" />
			</div>

			<!-- Deskripsi -->
			<div class="space-y-2">
				<label class="block text-sm font-medium text-gray-800">Deskripsi</label>
				<Textarea v-model="form.description" placeholder="Tuliskan deskripsi galeri..." />
			</div>

			<!-- Gambar saat ini -->
			<div class="space-y-2">
				<label class="block text-sm font-medium text-gray-800">Gambar Saat Ini</label>

				<div v-if="existingImages.length" class="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div v-for="img in existingImages" :key="img.id" class="relative group border rounded-lg overflow-hidden">
						<img :src="img.image" class="object-cover w-full h-32" />
						<button type="button" class="absolute top-2 right-2 bg-white/80 text-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition" @click="openDeleteDialog(img.id)">
							<Trash2 class="h-4 w-4" />
						</button>
					</div>
				</div>

				<div v-else class="text-gray-400 text-sm">Belum ada gambar di galeri ini.</div>
			</div>

			<!-- Upload baru -->
			<div v-if="totalImages < 4" class="space-y-2">
				<label class="block text-sm font-medium text-gray-800">Tambah Gambar Baru</label>

				<!-- Dropzone -->
				<div class="relative flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-gray-500 hover:border-blue-400 transition">
					<UploadCloud class="h-8 w-8 mb-2 text-gray-400" />
					<span class="text-sm font-medium">Klik untuk upload atau drag & drop</span>
					<span class="text-xs text-gray-400">PNG, JPG, WEBP (maks. 4 gambar total)</span>
					<input type="file" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer" @change="handleFileChange" />
				</div>
			</div>

			<!-- Jika sudah 4 gambar -->
			<div v-else class="text-gray-400 text-sm">Maksimal 4 gambar. Hapus salah satu gambar untuk menambah yang baru.</div>

			<!-- Actions -->
			<div class="flex justify-end gap-3 pt-4 border-t">
				<Button variant="outline" @click="handleCancel">Batal</Button>
				<AdminAppLoadingButton :loading="loading" class="bg-blue-900 hover:bg-blue-800 text-white font-medium" @click="handleSubmit"> Simpan Perubahan </AdminAppLoadingButton>
			</div>
		</div>

		<!-- 🗑️ Delete Dialog -->
		<Dialog v-model:open="showDeleteDialog">
			<DialogContent class="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Hapus Gambar</DialogTitle>
					<DialogDescription> Apakah kamu yakin ingin menghapus gambar ini? Tindakan ini tidak dapat dibatalkan. </DialogDescription>
				</DialogHeader>

				<div class="flex justify-end gap-3 mt-6">
					<Button variant="outline" @click="showDeleteDialog = false">Batal</Button>
					<Button class="bg-red-600 hover:bg-red-700 text-white" @click="confirmDelete"> Hapus </Button>
				</div>
			</DialogContent>
		</Dialog>
	</div>
</template>
