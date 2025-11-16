<script setup lang="ts">
import { toast } from "vue-sonner";

const emit = defineEmits<{
	(e: "previous"): void;
	(e: "submit", payload: any): void;
}>();

const form = reactive({
	namaBerkas: "",
	nomorSurat: "",
	namaInstansi: "Kemnaker",
	namaLengkap: "",
	provinsi: "Sulawesi Selatan",
	kota: "Makassar",
	kecamatan: "Makassar",
	alamat: "",
	noTelp: "0812191919",
	suratPermohonan: "",
	dokumen: "",
	lainnya: "",
});

const handleSubmit = () => {
	if (!form.suratPermohonan || !form.dokumen || !form.lainnya) {
		toast.error("Mohon lengkapi semua field wajib (Surat Permohonan, Dokumen, Lainnya).");
		return;
	}
	emit("submit", { service: "skkni", ...form });
};
</script>

<template>
	<div class="space-y-6">
		<p class="text-center text-gray-600 text-sm mb-4 font-bold">Form SKKNI</p>
		<p class="text-center text-gray-600 text-sm mb-4">Silahkan Lengkapi Data dan Berkas untuk Daftar Layanan!</p>

		<div class="grid grid-cols-2 gap-6 mt-10">
			<div>
				<label class="text-sm text-gray-600">Nama Berkas</label>
				<Input v-model="form.namaBerkas" placeholder="Masukkan Nama Berkas" class="bg-gray-50" />
			</div>

			<div>
				<label class="text-sm text-gray-600">Nomor Surat</label>
				<Input v-model="form.nomorSurat" placeholder="Masukkan Nomor Surat" class="bg-gray-50" />
			</div>

			<div>
				<label class="text-sm text-gray-600">Nama Instansi</label>
				<Input v-model="form.namaInstansi" placeholder="Nama Instansi" class="bg-gray-50" />
			</div>

			<div>
				<label class="text-sm text-gray-600">Nama Lengkap</label>
				<Input v-model="form.namaLengkap" placeholder="Nama Lengkap" class="bg-gray-50" />
			</div>

			<div>
				<label class="text-sm text-gray-600">Provinsi</label>
				<Input v-model="form.provinsi" class="bg-gray-50" />
			</div>

			<div>
				<label class="text-sm text-gray-600">Kota</label>
				<Input v-model="form.kota" class="bg-gray-50" />
			</div>

			<div>
				<label class="text-sm text-gray-600">Kecamatan</label>
				<Input v-model="form.kecamatan" class="bg-gray-50" />
			</div>

			<div>
				<label class="text-sm text-gray-600">Alamat Lengkap</label>
				<Textarea v-model="form.alamat" rows="4" class="bg-gray-50" />
			</div>

			<div>
				<label class="text-sm text-gray-600">No Telp</label>
				<Input v-model="form.noTelp" placeholder="0812xxxx" class="bg-gray-50" />
			</div>

			<div></div>
			<!-- empty cell for spacing alignment -->
		</div>

		<!-- Links -->
		<div class="space-y-4">
			<div>
				<label class="text-sm text-gray-600 flex items-center justify-between"> Surat Permohonan <Badge class="ml-2">Wajib</Badge> </label>
				<Input v-model="form.suratPermohonan" placeholder="Masukkan Link Google Drive" class="bg-gray-50" />
			</div>

			<div>
				<label class="text-sm text-gray-600 flex items-center justify-between"> Dokumen <Badge class="ml-2">Wajib</Badge> </label>
				<Input v-model="form.dokumen" placeholder="Masukkan Link Google Drive" class="bg-gray-50" />
			</div>

			<div>
				<label class="text-sm text-gray-600 flex items-center justify-between"> Lainnya <Badge class="ml-2">Wajib</Badge> </label>
				<Input v-model="form.lainnya" placeholder="Masukkan Link Google Drive" class="bg-gray-50" />
			</div>

			<div class="p-4 bg-yellow-50 rounded-md text-sm text-yellow-800">Pastikan Link Google Drive yang dilampirkan benar dan Akses untuk berbagi/lihatnya untuk dapat dilihat.</div>
		</div>

		<div class="flex justify-between pt-8">
			<Button @click="$emit('previous')" variant="secondary" class="px-6">Sebelumnya</Button>
			<div class="flex gap-3">
				<Button @click="handleSubmit" class="bg-blue-500 text-white px-6">Ajukan</Button>
			</div>
		</div>
	</div>
</template>
