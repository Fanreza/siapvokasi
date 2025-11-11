<script setup lang="ts">
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";
import { UploadCloud } from "lucide-vue-next";
import { useAnnouncementsService } from "@/services/announcement.services";

definePageMeta({
	layout: "admin",
	middleware: "admin",
	title: "Buat Pengumuman",
});

const router = useRouter();
const { create, loading } = useAnnouncementsService();

const form = ref({
	title: "",
	description: "",
	file: null as File | null,
});

const previewFile = ref<string | null>(null);

const handleFileChange = (event: Event) => {
	const target = event.target as HTMLInputElement;
	if (!target.files?.length) return;

	form.value.file = target.files[0]!;
	previewFile.value = form.value.file.name!;
};

const handleSubmit = async () => {
	try {
		if (!form.value.title || !form.value.description) {
			toast.error("Semua field wajib diisi.");
			return;
		}

		await create(form.value);
		toast.success("Pengumuman berhasil dibuat.");
		router.push("/admin/announcement");
	} catch {
		toast.error("Gagal membuat pengumuman.");
	}
};

const handleCancel = () => router.back();
</script>

<template>
	<div class="flex-1 space-y-6 p-6">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-semibold text-gray-900">Buat Pengumuman Baru</h1>
			<Button class="bg-blue-900 hover:bg-blue-800 text-white font-medium px-6" @click="handleCancel"> Kembali </Button>
		</div>

		<!-- Form -->
		<div class="space-y-8">
			<!-- Judul -->
			<div class="space-y-2">
				<label class="block text-sm font-medium text-gray-800">Judul Pengumuman</label>
				<Input v-model="form.title" placeholder="Masukkan Judul Pengumuman" />
			</div>

			<!-- Deskripsi -->
			<div class="space-y-2">
				<label class="block text-sm font-medium text-gray-800">Deskripsi</label>
				<AdminAppEditor v-model="form.description" />
			</div>

			<!-- Upload File -->
			<div class="space-y-2">
				<label class="block text-sm font-medium text-gray-800">Lampiran (PDF)</label>

				<div v-if="!previewFile" class="relative flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-gray-500 hover:border-blue-400 transition">
					<UploadCloud class="h-8 w-8 mb-2 text-gray-400" />
					<span class="text-sm font-medium">Klik untuk upload atau drag & drop</span>
					<span class="text-xs text-gray-400">PDF (max. 5MB)</span>
					<input type="file" accept=".pdf" class="absolute inset-0 opacity-0 cursor-pointer" @change="handleFileChange" />
				</div>

				<!-- Preview -->
				<div v-else class="flex items-center justify-between border rounded-md p-3 bg-gray-50">
					<div class="flex items-center gap-2 text-gray-700 text-sm">
						<UploadCloud class="h-4 w-4 text-blue-600" />
						{{ previewFile }}
					</div>
					<Button
						variant="ghost"
						size="sm"
						@click="
							previewFile = null;
							form.file = null;
						"
						>Hapus</Button
					>
				</div>
			</div>

			<!-- Actions -->
			<div class="flex justify-end gap-3 pt-4 border-t">
				<Button variant="outline" @click="handleCancel">Batal</Button>
				<AdminAppLoadingButton :loading="loading" class="bg-blue-900 hover:bg-blue-800 text-white font-medium" @click="handleSubmit"> Simpan </AdminAppLoadingButton>
			</div>
		</div>
	</div>
</template>
