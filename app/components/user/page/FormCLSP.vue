<script setup lang="ts">
import { toast } from "vue-sonner";

const emit = defineEmits<{
	(e: "previous"): void;
	(e: "submit", payload: any): void;
}>();

const form = reactive({
	nomorPermintaan: "",
	namaPemohon: "",
	organisasi: "",
	keterangan: "",
	fileLink: "",
});

const handleSubmit = () => {
	if (!form.fileLink) {
		toast.error("Lampirkan file/link terlebih dahulu.");
		return;
	}
	emit("submit", { service: "clsp", ...form });
};
</script>

<template>
	<div class="space-y-6">
		<p class="text-center text-gray-600 text-sm mb-4 font-bold">Form CLSP</p>
		<p class="text-center text-gray-600 text-sm mb-4">Silahkan Lengkapi Data dan Berkas untuk Daftar Layanan!</p>

		<div class="grid grid-cols-2 gap-6">
			<div>
				<label class="text-sm text-gray-600">Nomor Permintaan</label>
				<Input v-model="form.nomorPermintaan" placeholder="Masukkan nomor" class="bg-gray-50" />
			</div>

			<div>
				<label class="text-sm text-gray-600">Nama Pemohon</label>
				<Input v-model="form.namaPemohon" placeholder="Nama Pemohon" class="bg-gray-50" />
			</div>

			<div>
				<label class="text-sm text-gray-600">Organisasi</label>
				<Input v-model="form.organisasi" placeholder="Organisasi" class="bg-gray-50" />
			</div>

			<div>
				<label class="text-sm text-gray-600">Keterangan</label>
				<Textarea v-model="form.keterangan" rows="4" class="bg-gray-50" />
			</div>
		</div>

		<div>
			<label class="text-sm text-gray-600 flex items-center justify-between"> Lampiran <Badge class="ml-2">Wajib</Badge> </label>
			<Input v-model="form.fileLink" placeholder="Masukkan link Google Drive" class="bg-gray-50" />
		</div>

		<div class="flex justify-between pt-8">
			<Button @click="$emit('previous')" variant="secondary" class="px-6">Sebelumnya</Button>
			<div class="flex gap-3">
				<Button @click="handleSubmit" class="bg-blue-500 text-white px-6">Ajukan</Button>
			</div>
		</div>
	</div>
</template>
