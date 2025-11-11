<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useGalleryService } from "@/services/gallery.services";
import type { Gallery } from "@/models/gallery.model";

const route = useRoute();
const { get, responseGet, loading, error } = useGalleryService();

const gallery = ref<Gallery | null>(null);

onMounted(async () => {
	try {
		const id = Number(route.params.id);
		if (!id) return;

		await get(id, true); // true = pakai endpoint publik
	} catch (err) {
		console.error("Gagal memuat galeri:", err);
	}
});
</script>

<template>
	<section class="bg-white py-16 md:py-24">
		<AppUiPageHeader title="Detail Galeri" :breadcrumbs="['Galeri', responseGet?.title || 'Galeri']" />

		<div class="container mx-auto px-4 py-10">
			<!-- Loading -->
			<div v-if="loading" class="flex justify-center py-20">
				<p class="text-gray-500 animate-pulse">Memuat detail galeri...</p>
			</div>

			<!-- Error -->
			<div v-else-if="error" class="text-red-600 text-center py-20">Terjadi kesalahan saat memuat galeri.</div>

			<!-- Data -->
			<div v-else-if="responseGet" class="fade-in">
				<!-- Hero -->
				<!-- <div class="rounded-2xl overflow-hidden shadow-sm">
					<img :src="responseGet.images?.[0]?.image || 'https://placehold.co/800x400?text=No+Image'" :alt="responseGet.title" class="w-full h-[500px] object-cover" />
				</div> -->

				<!-- Judul & Deskripsi -->
				<div class="mt-8">
					<h1 class="text-4xl font-bold text-[#163E93] mb-4">
						{{ responseGet.title }}
					</h1>
					<p class="text-sm text-gray-700 leading-relaxed">
						{{ responseGet.description }}
					</p>
				</div>

				<!-- Grid Gambar -->
				<div v-if="responseGet.images && responseGet.images.length > 1" class="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					<div v-for="(img, idx) in responseGet.images.slice(1)" :key="img.id || idx" class="group rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
						<img :src="img.image" :alt="`Foto ${idx + 1} dari ${responseGet.title}`" class="h-60 w-full object-cover transition-transform duration-300 group-hover:scale-105" />
					</div>
				</div>
			</div>

			<!-- Kosong -->
			<div v-else class="text-gray-600 text-center py-20">Galeri tidak ditemukan.</div>
		</div>
	</section>
</template>

<style scoped>
.fade-in {
	animation: fadeIn 0.5s ease-in-out;
}
@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}
</style>
