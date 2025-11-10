<script setup lang="ts">
import { UploadCloud } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { useHeroService } from "@/services/hero.services";

definePageMeta({
	layout: "admin",
	middleware: "admin",
	title: "Hero Section",
});

const { get, update, responseGet, loading } = useHeroService();

const form = ref({
	heading: "",
	subHeading: "",
	pathVideo: "",
	banner: "",
});

const previewUrl = ref<string | null>(null);

onMounted(async () => {
	try {
		await get();
		if (responseGet.value) {
			form.value.heading = responseGet.value.heading;
			form.value.subHeading = responseGet.value.subHeading;
			form.value.pathVideo = responseGet.value.pathVideo ?? "";
			form.value.banner = responseGet.value.banner ?? "";
			previewUrl.value = responseGet.value.banner ?? null;
		}
	} catch {
		toast.error("Gagal memuat data hero section.");
	}
});

// 🧩 Update handler
const handleSubmit = async () => {
	try {
		await update({
			heading: form.value.heading,
			subHeading: form.value.subHeading,
			pathVideo: form.value.pathVideo || null,
			banner: form.value.banner || null,
		});
		toast.success("Hero section berhasil diperbarui.");
	} catch {
		toast.error("Gagal memperbarui hero section.");
	}
};

// 🧩 Image preview update
const handleFileChange = async (e: Event) => {
	const target = e.target as HTMLInputElement;
	if (!target.files?.length) return;
	const file = target.files[0];
	form.value.banner = URL.createObjectURL(file!);
	previewUrl.value = form.value.banner;
};
</script>

<template>
	<div class="flex-1 space-y-6 p-6">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-semibold text-gray-900">Hero Section</h1>
			<Button @click="handleSubmit" class="bg-blue-900 hover:bg-blue-800 text-white font-medium px-6" :disabled="loading">
				{{ loading ? "Menyimpan..." : "Simpan Perubahan" }}
			</Button>
		</div>

		<!-- Loading -->
		<div v-if="loading && !responseGet" class="flex justify-center py-20 text-gray-500">
			<span class="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></span>
			Memuat hero section...
		</div>

		<!-- Form -->
		<div v-else class="space-y-10">
			<!-- Heading -->
			<div class="space-y-2">
				<label class="block text-sm font-medium text-gray-800">Heading</label>
				<Input v-model="form.heading" placeholder="Masukkan heading utama" />
			</div>

			<!-- Sub Heading -->
			<div class="space-y-2">
				<label class="block text-sm font-medium text-gray-800">Sub Heading</label>
				<Input v-model="form.subHeading" placeholder="Masukkan sub heading" />
			</div>

			<!-- Path Video -->
			<div class="space-y-2">
				<label class="block text-sm font-medium text-gray-800">Path Video (Opsional)</label>
				<Input v-model="form.pathVideo" placeholder="https://cdn.example.com/video.mp4" />
			</div>

			<!-- Banner -->
			<div class="space-y-2">
				<label class="block text-sm font-medium text-gray-800">Banner</label>

				<div v-if="!previewUrl" class="relative flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-gray-500 hover:border-blue-400 transition">
					<UploadCloud class="h-8 w-8 mb-2 text-gray-400" />
					<span class="text-sm font-medium">Klik untuk upload atau drag & drop</span>
					<span class="text-xs text-gray-400">PNG, JPG, WEBP (max. 2MB)</span>
					<input type="file" class="absolute inset-0 opacity-0 cursor-pointer" @change="handleFileChange" />
				</div>

				<!-- Preview -->
				<div v-else class="relative w-full max-w-lg h-56 border rounded-lg overflow-hidden group">
					<img :src="previewUrl" class="object-cover w-full h-full" />
					<button
						type="button"
						class="absolute top-2 right-2 bg-white/80 text-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
						@click="
							previewUrl = null;
							form.banner = '';
						"
					>
						✕
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
