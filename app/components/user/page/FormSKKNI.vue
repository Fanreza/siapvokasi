<script setup lang="ts">
import { reactive, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";
import { createApplication } from "~/services/application.services";
import type { ApplicationRequest } from "~/models/application.model";
import { useAuthStore } from "~/stores/auth";

const props = defineProps<{
	serviceId: number;
	serviceName: string;
}>();

const emit = defineEmits<{
	(e: "previous"): void;
	(e: "next"): void;
}>();

const router = useRouter();
const authStore = useAuthStore();
const loading = ref(false);

const form = reactive({
	namaBerkas: "",
	nomorSurat: "",
	namaInstansi: authStore.user?.instanceName || "",
	namaLengkap: authStore.user?.name || "",
	provinsi: authStore.user?.instanceProvince || "",
	kota: authStore.user?.instanceDistrict || "",
	kecamatan: authStore.user?.instanceSubDistrict || "",
	alamat: authStore.user?.instanceAddress || "",
	noTelp: authStore.user?.instancePhone || "",
	suratPermohonan: "",
	email: authStore.user?.instanceEmail || "",
});

// 🔥 Payload reactive yang langsung mengikuti form
const payload = computed<ApplicationRequest>(() => ({
	applicationName: form.namaBerkas || "Pengajuan CLSP",
	applicationNumber: form.nomorSurat || null,
	applicationDate: new Date().toISOString(),

	instanceName: form.namaInstansi,
	applicantName: form.namaLengkap,
	applicantEmail: form.email, // bisa isi user.email dari Pinia
	applicantPhone: form.noTelp,
	applicantProvince: form.provinsi,
	applicantDistrict: form.kota,
	applicantSubDistrict: form.kecamatan,
	applicantAddress: form.alamat,

	requestLetterDocument: form.suratPermohonan,

	serviceId: props.serviceId,
}));

const handleSubmit = async () => {
	if (!form.suratPermohonan) {
		toast.error("Mohon lengkapi semua berkas wajib.");
		return;
	}

	loading.value = true;

	try {
		await createApplication(payload.value);

		emit("next");
	} catch (err: any) {
		console.error(err);
	} finally {
		loading.value = false;
	}
};
</script>

<template>
	<div class="space-y-6">
		<p class="text-center text-gray-600 text-sm mb-4 font-bold">Form {{ serviceName }}</p>
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
				<label class="text-sm text-gray-600">No Telp Lembaga</label>
				<Input v-model="form.noTelp" placeholder="0812xxxx" class="bg-gray-50" />
			</div>

			<div>
				<label class="text-sm text-gray-600">Email Lembaga</label>
				<Input v-model="form.email" type="email" placeholder="example@mail.com" class="bg-gray-50" />
			</div>

			<div></div>
		</div>

		<!-- Links -->
		<div class="space-y-4">
			<div>
				<label class="text-sm text-gray-600 flex items-center justify-between"> Surat Permohonan <Badge class="ml-2">Wajib</Badge> </label>
				<Input v-model="form.suratPermohonan" placeholder="Link Google Drive" class="bg-gray-50" />
			</div>

			<div class="p-4 bg-yellow-50 rounded-md text-sm text-yellow-800">Pastikan Link Google Drive yang dilampirkan benar dan aksesnya publik.</div>
		</div>

		<div class="flex justify-between pt-8">
			<Button @click="$emit('previous')" variant="secondary" class="px-6">Sebelumnya</Button>

			<Button @click="handleSubmit" :disabled="loading" class="bg-blue-500 text-white px-6">
				{{ loading ? "Memproses..." : "Ajukan" }}
			</Button>
		</div>
	</div>
</template>
