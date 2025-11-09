<script setup lang="ts">
import { UploadCloud } from "lucide-vue-next";

definePageMeta({
	layout: "admin",
	middleware: "admin",
});

const form = ref({
	title: "",
	image: null as File | null,
	category: "",
	status: "",
	detail: "",
});

const imagePreview = ref<string | null>(null);
const categories = ["SKKNI", "Pelatihan", "Sertifikasi"];
const statuses = ["Publish", "Draft"];
const maxChars = 500;
const remainingChars = computed(() => maxChars - form.value.detail.length);

// file handling
const fileInput = ref<HTMLInputElement | null>(null);

const handleFileUpload = (e: Event) => {
	const file = (e.target as HTMLInputElement).files?.[0];
	if (!file) return;
	form.value.image = file;
	imagePreview.value = URL.createObjectURL(file);
};

const handleDrop = (e: DragEvent) => {
	e.preventDefault();
	const file = e.dataTransfer?.files?.[0];
	if (file) {
		form.value.image = file;
		imagePreview.value = URL.createObjectURL(file);
	}
};

const handleDragOver = (e: DragEvent) => e.preventDefault();

// actions
const handleSubmit = () => {
	console.log("Form data:", form.value);
	// TODO: post to API
};

const handleCancel = () => {
	history.back();
};
</script>

<template>
	<div class="space-y-8 p-6">
		<!-- Judul -->
		<div class="space-y-2">
			<label class="block text-sm font-medium text-gray-800">Judul Berita</label>
			<Input v-model="form.title" placeholder="Masukkan Judul Berita" />
		</div>

		<!-- Gambar -->
		<div class="space-y-2">
			<label class="block text-sm font-medium text-gray-800">Gambar</label>

			<!-- Preview -->
			<div v-if="imagePreview" class="mb-2">
				<img :src="imagePreview" alt="Preview" class="h-32 w-auto rounded-md object-cover border" />
			</div>

			<!-- Upload -->
			<div class="flex flex-col items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center text-gray-600 transition hover:bg-gray-100" @drop="handleDrop" @dragover="handleDragOver" @click="fileInput?.click()">
				<UploadCloud class="mb-2 h-6 w-6 text-gray-400" />
				<p class="text-sm font-medium">Click to upload <span class="font-normal">or drag and drop</span></p>
				<p class="text-xs text-gray-400">SVG, PNG, JPG or GIF (max. 800×400px)</p>
				<input ref="fileInput" type="file" class="hidden" accept="image/*" @change="handleFileUpload" />
			</div>
		</div>

		<!-- Kategori -->
		<div class="space-y-2">
			<label class="block text-sm font-medium text-gray-800">Kategori</label>
			<Select v-model="form.category">
				<SelectTrigger>
					<SelectValue placeholder="Pilih kategori" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem v-for="cat in categories" :key="cat" :value="cat">
						{{ cat }}
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
					<SelectItem v-for="st in statuses" :key="st" :value="st">
						{{ st }}
					</SelectItem>
				</SelectContent>
			</Select>
		</div>

		<!-- Detail Berita -->
		<div class="space-y-2">
			<label class="block text-sm font-medium text-gray-800">Detail Berita</label>

			<!-- Toolbar bisa ditambah nanti -->
			<AdminAppEditor v-model="form.detail" />

			<p class="text-xs text-gray-400 text-right">{{ remainingChars }} characters left</p>
		</div>

		<!-- Actions -->
		<div class="flex justify-end gap-3 pt-4 border-t">
			<Button variant="outline" @click="handleCancel">Batal</Button>
			<Button class="bg-blue-900 hover:bg-blue-800 text-white font-medium" @click="handleSubmit">Simpan</Button>
		</div>
	</div>
</template>
