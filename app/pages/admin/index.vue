<script setup lang="ts">
import { UploadCloud, ImageOff } from "lucide-vue-next";

definePageMeta({
	layout: "admin",
	middleware: "admin",
	title: "Informasi Umum",
});

const form = ref({
	banner: "",
	heading: "Direktorat Bina Standardisasi Kompetensi dan Program Pelatihan",
	subheading: "Membangun pelatihan untuk masa depan yang lebih baik berarti menyiapkan sumber daya manusia yang unggul dan adaptif terhadap perubahan.",
});

const isEditing = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const selectedFileName = ref<string>("");

const onEdit = () => {
	isEditing.value = !isEditing.value;
};

const onFileChange = (e: Event) => {
	const target = e.target as HTMLInputElement;
	if (target.files && target.files[0]) {
		const file = target.files[0];
		selectedFileName.value = file.name;
		form.value.banner = URL.createObjectURL(file);
	}
};

const openFilePicker = () => {
	if (!isEditing.value) return;
	fileInput.value?.click();
};

const onDrop = (e: DragEvent) => {
	e.preventDefault();
	if (!isEditing.value) return;
	const file = e.dataTransfer?.files?.[0];
	if (file) {
		selectedFileName.value = file.name;
		form.value.banner = URL.createObjectURL(file);
	}
};

const onDragOver = (e: DragEvent) => {
	if (isEditing.value) e.preventDefault();
};
</script>

<template>
	<div class="flex-1 space-y-6 p-6">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-semibold text-gray-900">Section Hero</h1>
				<p class="text-gray-600">Update laman header landing page situs web.</p>
			</div>

			<!-- Cancel -->
			<div class="flex items-center gap-2">
				<Button v-if="isEditing" @click="onEdit" variant="outline"> Batal </Button>

				<Button @click="onEdit" class="bg-blue-900 hover:bg-blue-800 text-white font-medium px-6">
					{{ isEditing ? "Simpan" : "Edit" }}
				</Button>
			</div>
		</div>

		<!-- FORM -->
		<div class="divide-y divide-gray-200 rounded-lg bg-white">
			<!-- Banner -->
			<div class="flex items-start gap-6 p-4">
				<div class="w-1/4 pt-2">
					<label class="text-sm font-medium text-gray-700">Banner</label>
				</div>

				<div class="flex-1">
					<!-- Non-edit Mode -->
					<div v-if="!isEditing" class="relative flex items-center justify-center w-full max-w-md rounded-md border border-gray-200 bg-gray-50 aspect-3/1 overflow-hidden">
						<template v-if="form.banner">
							<img :src="form.banner" alt="Banner" class="w-full h-full object-cover" @error="form.banner = ''" />
						</template>

						<template v-else>
							<div class="flex flex-col items-center justify-center text-gray-400">
								<ImageOff class="h-10 w-10 mb-1" />
								<p class="text-sm text-gray-500">No Banner Available</p>
							</div>
						</template>
					</div>

					<!-- Edit Mode -->
					<div v-else class="flex flex-col items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-gray-500 hover:bg-gray-100 transition" @click="openFilePicker" @drop="onDrop" @dragover="onDragOver">
						<input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />

						<UploadCloud class="mx-auto h-6 w-6 text-gray-400" />
						<p class="mt-2 text-sm font-medium text-gray-700">
							Click to upload
							<span class="font-normal text-gray-500">or drag and drop</span>
						</p>
						<p class="text-xs text-gray-400 mb-2">SVG, PNG, JPG or GIF (max. 800×400px)</p>

						<!-- Preview (if file selected) -->
						<div v-if="form.banner" class="mt-3">
							<img :src="form.banner" class="mx-auto h-24 w-auto rounded-md border border-gray-200 object-cover" @error="form.banner = ''" />
							<p v-if="selectedFileName" class="mt-2 text-xs text-gray-600 font-medium">
								{{ selectedFileName }}
							</p>
						</div>

						<!-- Fallback if no file -->
						<div v-else class="mt-3 flex flex-col items-center justify-center text-gray-400">
							<ImageOff class="h-10 w-10 mb-1" />
							<p class="text-xs text-gray-500">No file selected</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Heading -->
			<div class="flex items-center gap-6 p-4">
				<div class="w-1/4">
					<label class="text-sm font-medium text-gray-700">Heading</label>
				</div>
				<div class="flex-1">
					<Textarea v-model="form.heading" :disabled="!isEditing" rows="6" class="disabled:bg-gray-50 text-gray-800 disabled:opacity-100" />
				</div>
			</div>

			<!-- Sub Heading -->
			<div class="flex items-start gap-6 p-4">
				<div class="w-1/4 pt-1.5">
					<label class="text-sm font-medium text-gray-700">Sub Heading</label>
				</div>
				<div class="flex-1">
					<Textarea v-model="form.subheading" :disabled="!isEditing" rows="6" class="disabled:bg-gray-50 text-gray-800 disabled:opacity-100 h-32" />
				</div>
			</div>
		</div>
	</div>
</template>
