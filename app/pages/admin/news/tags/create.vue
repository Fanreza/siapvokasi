<script setup lang="ts">
import { useNewsTagsService } from "@/services/tags.services";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

definePageMeta({
	layout: "admin",
	middleware: "admin",
});

const router = useRouter();

const { loading, error, create } = useNewsTagsService();

// Reactive form
const form = ref({
	name: "",
});

// Submit form
const handleSubmit = async () => {
	if (!form.value.name.trim()) {
		toast.error("Nama tag wajib diisi!");
		return;
	}

	await create({
		name: form.value.name,
	});

	await router.push("/admin/news/tags");
};

// Cancel & go back
const handleCancel = () => router.back();
</script>

<template>
	<div class="flex-1 space-y-6 p-6">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-semibold text-gray-900">Buat Tag</h1>
			</div>

			<!-- Cancel -->
			<div class="flex items-center gap-2">
				<Button class="bg-blue-900 hover:bg-blue-800 text-white font-medium px-6"> Kembali </Button>
			</div>
		</div>

		<!-- Form -->

		<div class="space-y-10">
			<!-- Judul -->
			<div class="space-y-2">
				<label class="block text-sm font-medium text-gray-800">Nama</label>
				<Input v-model="form.name" placeholder="Masukkan Nama Tag" />
			</div>

			<!-- Actions -->
			<div class="flex justify-end gap-3 pt-4 border-t">
				<Button variant="outline" @click="handleCancel">Batal</Button>
				<AdminAppLoadingButton :loading="loading" class="bg-blue-900 hover:bg-blue-800 text-white font-medium" @click="handleSubmit">Simpan</AdminAppLoadingButton>
			</div>
		</div>
	</div>
</template>
