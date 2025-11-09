<script setup lang="ts">
import { useNewsCategoriesService } from "@/services/categories.services";
import { useRouter } from "vue-router";

definePageMeta({
	layout: "admin",
	middleware: "admin",
});

const router = useRouter();

const { loading, create } = useNewsCategoriesService();

// Reactive form
const form = ref({
	title: "",
});

// Submit form
const handleSubmit = async () => {
	await create({
		title: form.value.title,
	});

	await router.push("/admin/news/categories");
};

// Cancel & go back
const handleCancel = () => router.back();
</script>

<template>
	<div class="flex-1 space-y-6 p-6">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-semibold text-gray-900">Buat Kategori</h1>
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
				<label class="block text-sm font-medium text-gray-800">Judul</label>
				<Input v-model="form.title" placeholder="Masukkan Judul Kategori" />
			</div>

			<!-- Actions -->
			<div class="flex justify-end gap-3 pt-4 border-t">
				<Button variant="outline" @click="handleCancel">Batal</Button>
				<AdminAppLoadingButton :loading="loading" class="bg-blue-900 hover:bg-blue-800 text-white font-medium" @click="handleSubmit">Simpan</AdminAppLoadingButton>
			</div>
		</div>
	</div>
</template>
