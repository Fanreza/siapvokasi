<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";
import { useSocialMediaService } from "@/services/sosmed.services";

definePageMeta({
	layout: "admin",
	middleware: "admin",
	title: "Edit Media Sosial",
});

const route = useRoute();
const router = useRouter();
const { get, update, responseGet, loading } = useSocialMediaService();

const form = ref({
	name: "",
	link: "",
});

// 🧩 Fetch Data
onMounted(async () => {
	try {
		await get(Number(route.params.id));
		if (responseGet.value) {
			form.value.name = responseGet.value.name;
			form.value.link = responseGet.value.link;
		}
	} catch {
		toast.error("Gagal memuat data media sosial.");
	}
});

// 🧩 Update
const handleSubmit = async () => {
	try {
		await update(Number(route.params.id), {
			name: form.value.name,
			link: form.value.link,
		});

		toast.success("Media sosial berhasil diperbarui.");
		router.push("/admin/social");
	} catch {
		toast.error("Gagal memperbarui media sosial.");
	}
};

const handleCancel = () => router.back();
</script>

<template>
	<div class="flex-1 space-y-6 p-6">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-semibold text-gray-900">Edit Media Sosial</h1>
			<Button class="bg-blue-900 hover:bg-blue-800 text-white font-medium px-6" @click="handleCancel">Kembali</Button>
		</div>

		<!-- Loading -->
		<div v-if="loading" class="flex justify-center py-20 text-gray-500">
			<span class="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></span>
			Memuat data...
		</div>

		<!-- Form -->
		<div v-else class="space-y-10">
			<!-- Nama -->
			<div class="space-y-2">
				<label class="block text-sm font-medium text-gray-800">Nama</label>
				<Input v-model="form.name" placeholder="Contoh: Instagram" />
			</div>

			<!-- Link -->
			<div class="space-y-2">
				<label class="block text-sm font-medium text-gray-800">Link</label>
				<Input v-model="form.link" placeholder="https://instagram.com/akun" />
			</div>

			<!-- Actions -->
			<div class="flex justify-end gap-3 pt-4 border-t">
				<Button variant="outline" @click="handleCancel">Batal</Button>
				<AdminAppLoadingButton :loading="loading" class="bg-blue-900 hover:bg-blue-800 text-white font-medium" @click="handleSubmit"> Perbarui </AdminAppLoadingButton>
			</div>
		</div>
	</div>
</template>
