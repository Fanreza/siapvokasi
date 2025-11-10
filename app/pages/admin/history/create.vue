<script setup lang="ts">
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";
import { useHistoryService } from "@/services/history.services";

definePageMeta({
	layout: "admin",
	middleware: "admin",
	title: "Tambah Sejarah",
});

const router = useRouter();
const { create, loading } = useHistoryService();

// 🧩 Form
const form = ref({
	year: undefined,
	description: "",
	detail: "",
});

const handleSubmit = async () => {
	if (!form.value.year || !form.value.description) {
		toast.error("Tahun dan deskripsi wajib diisi.");
		return;
	}

	try {
		await create({
			year: form.value.year!,
			description: form.value.description,
			detail: form.value.detail,
		});

		toast.success("Data sejarah berhasil ditambahkan.");
		router.push("/admin/history");
	} catch {
		toast.error("Gagal menambahkan data sejarah.");
	}
};

const handleCancel = () => router.back();
</script>

<template>
	<div class="flex-1 space-y-6 p-6">
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-semibold text-gray-900">Tambah Sejarah</h1>
			<Button variant="outline" @click="handleCancel">Batal</Button>
		</div>

		<div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-8">
			<!-- Tahun -->
			<div class="space-y-2">
				<label class="block text-sm font-medium text-gray-800">Tahun</label>
				<Input type="number" v-model="form.year" placeholder="Masukkan tahun" />
			</div>

			<!-- Deskripsi -->
			<div class="space-y-2">
				<label class="block text-sm font-medium text-gray-800">Deskripsi Singkat</label>
				<Input v-model="form.description" placeholder="Masukkan deskripsi singkat" />
			</div>

			<!-- Detail -->
			<div class="space-y-2">
				<label class="block text-sm font-medium text-gray-800">Detail Lengkap</label>
				<Textarea v-model="form.detail" placeholder="Masukkan detail sejarah" rows="5" />
			</div>

			<!-- Actions -->
			<div class="flex justify-end gap-3 border-t pt-4">
				<Button variant="outline" @click="handleCancel">Batal</Button>
				<AdminAppLoadingButton :loading="loading" class="bg-blue-900 hover:bg-blue-800 text-white font-medium px-6" @click="handleSubmit"> Simpan </AdminAppLoadingButton>
			</div>
		</div>
	</div>
</template>
