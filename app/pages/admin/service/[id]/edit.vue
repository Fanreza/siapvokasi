<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";
import { useServicesService } from "@/services/service.services";

definePageMeta({
	layout: "admin",
	middleware: "admin",
	title: "Edit Layanan",
});

const router = useRouter();
const route = useRoute();
const { get, update, responseGet, loading } = useServicesService();

const form = ref({
	title: "",
	description: "",
	link: "",
	icon: "",
});

// 🧩 Fetch existing data
onMounted(async () => {
	try {
		await get(Number(route.params.id));

		form.value.title = responseGet.value?.title || "";
		form.value.description = responseGet.value?.description || "";
		form.value.link = responseGet.value?.link || "";
		form.value.icon = responseGet.value?.icon || "";
	} catch {
		toast.error("Gagal memuat data layanan.");
	}
});

// 🧩 Submit update
const handleSubmit = async () => {
	try {
		await update(Number(route.params.id), {
			title: form.value.title,
			description: form.value.description,
			link: form.value.link,
			icon: form.value.icon,
		});

		toast.success("Layanan berhasil diperbarui.");
		router.push("/admin/service");
	} catch {
		toast.error("Gagal memperbarui layanan.");
	}
};

// 🧩 Cancel
const handleCancel = () => router.back();
</script>

<template>
	<div class="flex-1 space-y-6 p-6">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-semibold text-gray-900">Edit Layanan</h1>
			<Button class="bg-blue-900 hover:bg-blue-800 text-white font-medium px-6" @click="handleCancel">Kembali</Button>
		</div>

		<!-- Form -->
		<div class="space-y-10" v-if="responseGet || !loading">
			<!-- Judul -->
			<div class="space-y-2">
				<label class="block text-sm font-medium text-gray-800">Judul Layanan</label>
				<Input v-model="form.title" placeholder="Masukkan judul layanan" />
			</div>

			<!-- Deskripsi -->
			<div class="space-y-2">
				<label class="block text-sm font-medium text-gray-800">Deskripsi</label>
				<Textarea v-model="form.description" placeholder="Masukkan deskripsi layanan" />
			</div>

			<!-- Link -->
			<div class="space-y-2">
				<label class="block text-sm font-medium text-gray-800">Link (opsional)</label>
				<Input v-model="form.link" placeholder="https://example.com" />
			</div>

			<!-- Icon -->
			<div class="space-y-2">
				<label class="block text-sm font-medium text-gray-800">Icon (opsional)</label>
				<Input v-model="form.icon" placeholder="fa-solid fa-user" />
				<p class="text-xs text-gray-500">
					Masukkan class icon, misal: <code>lucide-home</code> atau <code>fa-solid fa-book</code>.

					<span class="text-primary underline">List Icon: <a href="https://icones.js.org/collection/" target="_blank">icones.js.org</a></span>
				</p>
			</div>

			<!-- Actions -->
			<div class="flex justify-end gap-3 pt-4 border-t">
				<Button variant="outline" @click="handleCancel">Batal</Button>
				<AdminAppLoadingButton :loading="loading" class="bg-blue-900 hover:bg-blue-800 text-white font-medium" @click="handleSubmit"> Perbarui </AdminAppLoadingButton>
			</div>
		</div>

		<!-- Loading state -->
		<div v-else class="flex justify-center py-20 text-gray-500">
			<span class="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></span>
			Memuat data layanan...
		</div>
	</div>
</template>
