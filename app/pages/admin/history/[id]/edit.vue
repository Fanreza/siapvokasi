<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { toast } from "vue-sonner";
import { useHistoryService } from "@/services/history.services";

definePageMeta({
	layout: "admin",
	middleware: "admin",
	title: "Edit Sejarah",
});

const router = useRouter();
const route = useRoute();
const id = Number(route.params.id);

const { get, update, responseGet, loading } = useHistoryService();

const form = ref({
	year: undefined as number | undefined,
	description: "",
	detail: "",
});

// 🧩 Fetch data
onMounted(async () => {
	try {
		await get(id);
		if (responseGet.value) {
			form.value.year = responseGet.value.year;
			form.value.description = responseGet.value.description;
			form.value.detail = responseGet.value.detail;
		}
	} catch {
		toast.error("Gagal memuat data sejarah.");
	}
});

// 🧩 Update data
const handleSubmit = async () => {
	if (!form.value.year || !form.value.description) {
		toast.error("Tahun dan deskripsi wajib diisi.");
		return;
	}

	try {
		await update(id, {
			year: form.value.year!,
			description: form.value.description,
			detail: form.value.detail,
		});

		toast.success("Data sejarah berhasil diperbarui.");
		router.push("/admin/history");
	} catch {
		toast.error("Gagal memperbarui data sejarah.");
	}
};

const handleCancel = () => router.back();
</script>

<template>
	<div class="flex-1 space-y-6 p-6">
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-semibold text-gray-900">Edit Sejarah</h1>
			<Button variant="outline" @click="handleCancel">Kembali</Button>
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
				<AdminAppLoadingButton :loading="loading" class="bg-blue-900 hover:bg-blue-800 text-white font-medium px-6" @click="handleSubmit"> Perbarui </AdminAppLoadingButton>
			</div>
		</div>
	</div>
</template>
