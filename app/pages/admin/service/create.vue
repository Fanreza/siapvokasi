<script setup lang="ts">
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";
import { useServicesService } from "@/services/service.services";

definePageMeta({
	layout: "admin",
	middleware: "admin",
	title: "Tambah Layanan",
});

const router = useRouter();
const { create, loading } = useServicesService();

// 🧩 Form reactive
const form = ref({
	title: "",
	description: "",
	link: "",
	icon: "",
});

// 🧩 Submit
const handleSubmit = async () => {
	try {
		if (!form.value.title.trim()) {
			toast.error("Judul layanan wajib diisi.");
			return;
		}

		await create({
			title: form.value.title,
			description: form.value.description,
			link: form.value.link,
			icon: form.value.icon,
		});

		toast.success("Layanan berhasil dibuat.");
		router.push("/admin/service");
	} catch {
		toast.error("Gagal membuat layanan.");
	}
};

// 🧩 Cancel
const handleCancel = () => router.back();
</script>

<template>
	<div class="flex-1 space-y-6 p-6">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-semibold text-gray-900">Tambah Layanan</h1>
			<Button class="bg-blue-900 hover:bg-blue-800 text-white font-medium px-6" @click="handleCancel">Kembali</Button>
		</div>

		<!-- Form -->
		<div class="space-y-10">
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
				<AdminAppLoadingButton :loading="loading" class="bg-blue-900 hover:bg-blue-800 text-white font-medium" @click="handleSubmit"> Simpan </AdminAppLoadingButton>
			</div>
		</div>
	</div>
</template>
