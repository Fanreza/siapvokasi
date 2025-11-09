<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";
import { UploadCloud } from "lucide-vue-next";

import { useNewsService } from "@/services/news.services";
import { useNewsCategoriesService } from "@/services/categories.services";
import AppEditor from "~/components/admin/AppEditor.vue";

definePageMeta({
	layout: "admin",
	middleware: "admin",
});

const route = useRoute();
const router = useRouter();

const { get, update, loading, responseGet } = useNewsService();
const { getAll: getCategories, response: categories } = useNewsCategoriesService();

const form = ref({
	title: "",
	excerpt: "",
	description: "",
	status: "draft",
	categoryId: null as number | null,
	file: null as File | null,
});
const previewUrl = ref<string | null>(null);
const existingImage = ref<string | null>(null);

// 🔹 Fetch existing news by ID
onMounted(async () => {
	try {
		await getCategories();

		const id = Number(route.params.id);
		await get(id);

		form.value = {
			title: responseGet.value!.title,
			excerpt: responseGet.value!.excerpt,
			description: responseGet.value!.description,
			status: responseGet.value!.status,
			categoryId: responseGet.value!.categoryId,
			file: null,
		};

		existingImage.value = responseGet.value!.file ?? null;
	} catch (err) {
		toast.error("Gagal memuat data berita.");
	}
});

// 🔹 File upload preview
const handleFileChange = (event: Event) => {
	const target = event.target as HTMLInputElement;
	if (!target.files?.length) return;

	form.value.file = target.files[0]!;
	previewUrl.value = URL.createObjectURL(form.value.file!);
};

// 🔹 Submit (Update)
const handleSubmit = async () => {
	try {
		const id = Number(route.params.id);

		if (form.value.categoryId == null) {
			toast.error("Pilih kategori berita.");
			return;
		}

		const payload = {
			title: form.value.title,
			excerpt: form.value.excerpt,
			description: form.value.description,
			status: form.value.status,
			categoryId: form.value.categoryId,
			file: form.value.file,
		};

		await update(id, payload);
		toast.success("Berita berhasil diperbarui!");
		router.push("/admin/news");
	} catch (err: any) {
		toast.error("Gagal memperbarui berita.");
	}
};

const handleCancel = () => router.back();
</script>

<template>
	<div class="flex-1 space-y-6 p-6">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-semibold text-gray-900">Edit Berita</h1>
			</div>
			<Button class="bg-blue-900 hover:bg-blue-800 text-white font-medium px-6" @click="handleCancel"> Kembali </Button>
		</div>

		<!-- Form -->
		<div v-if="responseGet || !loading" class="space-y-10">
			<!-- Judul -->
			<div class="space-y-2">
				<label class="block text-sm font-medium text-gray-800">Judul Berita</label>
				<Input v-model="form.title" placeholder="Masukkan Judul Berita" />
			</div>

			<!-- Excerpt -->
			<div class="space-y-2">
				<label class="block text-sm font-medium text-gray-800">Excerpt</label>
				<Input v-model="form.excerpt" placeholder="Masukkan ringkasan berita" />
			</div>

			<!-- Deskripsi -->
			<div class="space-y-2">
				<label class="block text-sm font-medium text-gray-800">Deskripsi</label>
				<AppEditor v-model="form.description" />
			</div>

			<!-- Upload Gambar -->
			<div class="space-y-2">
				<label class="block text-sm font-medium text-gray-800">Gambar</label>

				<!-- Default state (no new upload yet) -->
				<div v-if="!previewUrl && existingImage" class="relative w-64 h-40 border rounded-lg overflow-hidden group">
					<img :src="existingImage" class="object-cover w-full h-full" />
					<button
						type="button"
						class="absolute top-2 right-2 bg-white/80 text-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
						@click="
							existingImage = null;
							form.file = null;
						"
					>
						✕
					</button>
				</div>

				<!-- Upload dropzone -->
				<div v-else-if="!previewUrl && !existingImage" class="relative flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-gray-500 hover:border-blue-400 transition">
					<UploadCloud class="h-8 w-8 mb-2 text-gray-400" />
					<span class="text-sm font-medium">Klik untuk upload atau drag & drop</span>
					<span class="text-xs text-gray-400">SVG, PNG, JPG, GIF (max. 2MB)</span>
					<input type="file" class="absolute inset-0 opacity-0 cursor-pointer" @change="handleFileChange" />
				</div>

				<!-- New Preview -->
				<div v-else class="relative w-64 h-40 border rounded-lg overflow-hidden group">
					<img :src="previewUrl!" class="object-cover w-full h-full" />
					<button
						type="button"
						class="absolute top-2 right-2 bg-white/80 text-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
						@click="
							previewUrl = null;
							form.file = null;
						"
					>
						✕
					</button>
				</div>
			</div>

			<!-- Kategori -->
			<div class="space-y-2">
				<label class="block text-sm font-medium text-gray-800">Kategori</label>
				<Select v-model="form.categoryId">
					<SelectTrigger>
						<SelectValue placeholder="Pilih kategori" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem v-for="cat in categories?.data" :key="cat.id" :value="cat.id">
							{{ cat.title }}
						</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<!-- Status -->
			<div class="space-y-2">
				<label class="block text-sm font-medium text-gray-800">Status</label>
				<Select v-model="form.status">
					<SelectTrigger>
						<SelectValue placeholder="Pilih status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="draft">Draft</SelectItem>
						<SelectItem value="published">Publish</SelectItem>
						<SelectItem value="archived">Arsip</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<!-- Actions -->
			<div class="flex justify-end gap-3 pt-4 border-t">
				<Button variant="outline" @click="handleCancel">Batal</Button>
				<AdminAppLoadingButton :loading="loading" class="bg-blue-900 hover:bg-blue-800 text-white font-medium" @click="handleSubmit"> Perbarui </AdminAppLoadingButton>
			</div>
		</div>

		<!-- Loading state -->
		<div v-else class="py-20 text-center text-gray-500">
			<div class="flex items-center justify-center gap-2">
				<span class="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></span>
				Memuat data berita...
			</div>
		</div>
	</div>
</template>
