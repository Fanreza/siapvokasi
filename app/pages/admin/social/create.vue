<script setup lang="ts">
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";
import { useSocialMediaService } from "@/services/sosmed.services";

definePageMeta({
	layout: "admin",
	middleware: "admin",
	title: "Tambah Media Sosial",
});

const router = useRouter();
const { create, loading } = useSocialMediaService();

const form = ref({
	name: "",
	link: "",
});

const handleSubmit = async () => {
	try {
		if (!form.value.name.trim()) {
			toast.error("Nama media sosial wajib diisi.");
			return;
		}

		await create({
			name: form.value.name,
			link: form.value.link,
		});

		toast.success("Media sosial berhasil ditambahkan.");
		router.push("/admin/social");
	} catch {
		toast.error("Gagal menambahkan media sosial.");
	}
};

const handleCancel = () => router.back();
</script>

<template>
	<div class="flex-1 space-y-6 p-6">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-semibold text-gray-900">Tambah Media Sosial</h1>
			<Button class="bg-blue-900 hover:bg-blue-800 text-white font-medium px-6" @click="handleCancel">Kembali</Button>
		</div>

		<!-- Form -->
		<div class="space-y-10">
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
				<AdminAppLoadingButton :loading="loading" class="bg-blue-900 hover:bg-blue-800 text-white font-medium" @click="handleSubmit"> Simpan </AdminAppLoadingButton>
			</div>
		</div>
	</div>
</template>
