<script setup lang="ts">
import { useRolesResponsibilitiesService } from "@/services/function.services";
import { toast } from "vue-sonner";

definePageMeta({
	layout: "admin",
	middleware: "admin",
	title: "Tugas & Fungsi",
});

const { get, update, responseGet, loading } = useRolesResponsibilitiesService();

// 🧩 Reactive form
const form = ref({
	roles: "",
	responsibilities: "",
});

// 🧩 Ambil data awal
onMounted(async () => {
	try {
		await get();

		if (responseGet.value) {
			form.value.roles = responseGet.value.roles;
			form.value.responsibilities = responseGet.value.responsibilities;
		}
	} catch {
		toast.error("Gagal memuat data Tugas & Fungsi.");
	}
});

// 🧩 Simpan perubahan
const handleSubmit = async () => {
	try {
		await update({
			roles: form.value.roles,
			responsibilities: form.value.responsibilities,
		});
		toast.success("Tugas & Fungsi berhasil diperbarui.");
	} catch {
		toast.error("Gagal memperbarui data Tugas & Fungsi.");
	}
};
</script>

<template>
	<div class="flex-1 space-y-6 p-6">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-semibold text-gray-900">Tugas & Fungsi</h1>

			<AdminAppLoadingButton :loading="loading" class="bg-blue-900 hover:bg-blue-800 text-white font-medium px-6" @click="handleSubmit"> Simpan </AdminAppLoadingButton>
		</div>

		<!-- Loading -->
		<div v-if="loading && !responseGet" class="flex justify-center py-20 text-gray-500">
			<span class="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></span>
			Memuat data...
		</div>

		<!-- Form -->
		<div v-else class="space-y-10 bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
			<!-- Roles -->
			<div class="space-y-2">
				<label class="block text-sm font-medium text-gray-800">Peran (Roles)</label>
				<Textarea v-model="form.roles" placeholder="Tuliskan peran (roles) organisasi di sini..." rows="5" />
			</div>

			<!-- Responsibilities -->
			<div class="space-y-2">
				<label class="block text-sm font-medium text-gray-800">Tanggung Jawab (Responsibilities)</label>
				<Textarea v-model="form.responsibilities" placeholder="Tuliskan tanggung jawab (responsibilities) di sini..." rows="8" />
			</div>
		</div>
	</div>
</template>
