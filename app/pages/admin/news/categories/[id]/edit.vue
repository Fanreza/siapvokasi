<script setup lang="ts">
import { useNewsCategoriesService } from "@/services/categories.services";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

definePageMeta({
	layout: "admin",
	middleware: "admin",
});

const router = useRouter();
const route = useRoute();

const { loading, get, update } = useNewsCategoriesService();
const id = Number(route.params.id);

const form = ref({
	title: "",
});

const fetchCategory = async () => {
	try {
		const res = await get(id);
		if (res?.data) {
			form.value.title = res.data.title;
		}
	} catch (err) {
		toast.error("Gagal memuat data kategori");
		await router.push("/admin/news/categories");
	}
};

onMounted(fetchCategory);

const handleSubmit = async () => {
	try {
		await update(id, { title: form.value.title });
		toast.success("Kategori berhasil diperbarui");
		await router.push("/admin/news/categories");
	} catch (err) {
		toast.error("Gagal menyimpan perubahan");
	}
};

const handleCancel = () => router.back();
</script>

<template>
	<div class="flex-1 space-y-6 p-6">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-semibold text-gray-900">Edit Kategori</h1>
			</div>

			<div class="flex items-center gap-2">
				<Button @click="handleCancel" class="bg-blue-900 hover:bg-blue-800 text-white font-medium px-6"> Kembali </Button>
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
				<AdminAppLoadingButton :loading="loading" class="bg-blue-900 hover:bg-blue-800 text-white font-medium" @click="handleSubmit"> Simpan Perubahan </AdminAppLoadingButton>
			</div>
		</div>
	</div>
</template>
