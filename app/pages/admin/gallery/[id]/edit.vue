<script setup lang="ts">
import { UploadCloud, X } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { useRoute, useRouter } from "vue-router";
import { useGalleryService } from "@/services/gallery.services";

definePageMeta({
	layout: "admin",
	middleware: "admin",
});

const route = useRoute();
const router = useRouter();
const { get, update, loading } = useGalleryService();

const form = ref({
	title: "",
	description: "",
	files: [] as File[],
});

const previews = ref<string[]>([]);

// 🧩 Load data
onMounted(async () => {
	try {
		const data = await get(Number(route.params.id));
		if (data) {
			form.value.title = data.title;
			form.value.description = data.description || "";
			previews.value = data.files || [];
		}
	} catch {
		toast.error("Gagal memuat data galeri.");
	}
});

// 🧩 Handle file change
const handleFileChange = (event: Event) => {
	const target = event.target as HTMLInputElement;
	if (!target.files?.length) return;

	const selected = Array.from(target.files).slice(0, 4 - form.value.files.length);
	form.value.files.push(...selected);
	previews.value.push(...selected.map((f) => URL.createObjectURL(f)));
};

// 🧩 Remove preview
const removePreview = (index: number) => {
	form.value.files.splice(index, 1);
	previews.value.splice(index, 1);
};

// 🧩 Submit
const handleSubmit = async () => {
	if (!form.value.title) {
		toast.error("Judul wajib diisi");
		return;
	}

	try {
		await update(Number(route.params.id), form.value);
		toast.success("Galeri berhasil diperbarui!");
		router.push("/admin/gallery");
	} catch {
		toast.error("Gagal memperbarui galeri.");
	}
};

// 🧩 Cancel
const handleCancel = () => router.back();

const fileInput = ref<HTMLInputElement | null>(null);
</script>

<template>
	<div class="flex-1 space-y-6 p-6">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-semibold text-gray-900">Edit Galeri</h1>
			<Button @click="handleCancel" class="bg-blue-900 hover:bg-blue-800 text-white font-medium px-6">Kembali</Button>
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

			<!-- Upload -->
			<div class="space-y-2">
				<label class="block text-sm font-medium text-gray-800">Gambar (maks. 4)</label>

				<!-- Dropzone -->
				<div v-if="!previews.length" class="relative flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-gray-500 hover:border-blue-400 transition">
					<UploadCloud class="h-8 w-8 mb-2 text-gray-400" />
					<span class="text-sm font-medium">Klik untuk upload atau drag & drop</span>
					<span class="text-xs text-gray-400">PNG, JPG, WEBP (max. 4 file)</span>
					<input type="file" accept="image/*" multiple class="absolute inset-0 opacity-0 cursor-pointer" @change="handleFileChange" />
				</div>

				<!-- Preview grid -->
				<div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div v-for="(src, index) in previews" :key="index" class="relative group border rounded-lg overflow-hidden">
						<img :src="src" class="object-cover w-full h-32" />
						<button type="button" class="absolute top-2 right-2 bg-white/80 text-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition" @click="removePreview(index)">
							<X class="h-4 w-4" />
						</button>
					</div>
				</div>

				<!-- Add more -->
				<div v-if="previews.length < 4" class="mt-4">
					<Button variant="outline" size="sm" @click="fileInput!.click()">Tambah Gambar</Button>
					<input ref="fileInput" type="file" accept="image/*" multiple class="hidden" @change="handleFileChange" />
				</div>
			</div>

			<!-- Actions -->
			<div class="flex justify-end gap-3 pt-4 border-t">
				<Button variant="outline" @click="handleCancel">Batal</Button>
				<AdminAppLoadingButton :loading="loading" class="bg-blue-900 hover:bg-blue-800 text-white font-medium" @click="handleSubmit">Simpan</AdminAppLoadingButton>
			</div>
		</div>
	</div>
</template>
