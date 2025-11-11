<template>
	<section class="bg-white py-16 md:py-24">
		<!-- Title -->
		<AppUiPageHeader title="Struktur Stankomproglat" :breadcrumbs="['Profil', 'Struktur']" />

		<!-- Content -->
		<div class="mx-auto mt-12 max-w-4xl px-6">
			<!-- Loading -->
			<div v-if="loading" class="text-gray-500 text-center py-12">Memuat struktur organisasi...</div>

			<!-- Error -->
			<div v-else-if="error" class="text-red-500 text-center py-12">Terjadi kesalahan: {{ error.message }}</div>

			<!-- Image -->
			<div v-else-if="structure?.image" class="flex justify-center">
				<img :src="structure.image" alt="Struktur Organisasi" class="rounded-lg shadow-md max-w-full" />
			</div>

			<!-- Empty State -->
			<div v-else class="text-center text-gray-400 py-12">Belum ada gambar struktur organisasi.</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useStructureService } from "@/services/structure.services"; // sesuaikan path bila beda

// 🧩 Service
const { get, responseGet, loading, error } = useStructureService();

const structure = ref(responseGet.value?.data || null);

onMounted(async () => {
	try {
		const res = await get();
		structure.value = res.data;
	} catch (err) {
		console.error(err);
	}
});
</script>
