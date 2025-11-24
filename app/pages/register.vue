<script setup lang="ts">
import { reactive, ref } from "vue";
import { registerService } from "~/services/auth.services";
import { toast } from "vue-sonner";
import { useRouter } from "vue-router";

definePageMeta({
	layout: false,
});

const router = useRouter();
const loading = ref(false);

const form = reactive({
	name: "",
	email: "",
	password: "",
	passwordConfirmation: "",
});

const showSuccess = ref(false);

const submit = async () => {
	if (!form.name || !form.email || !form.password || !form.passwordConfirmation) {
		toast.error("Semua field wajib diisi");
		return;
	}

	if (form.password !== form.passwordConfirmation) {
		toast.error("Password dan konfirmasi tidak sama");
		return;
	}

	loading.value = true;
	try {
		await registerService(form);

		showSuccess.value = true;
	} catch (err: any) {
		console.error(err);
	} finally {
		loading.value = false;
	}
};
</script>

<template>
	<div class="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-white">
		<!-- LEFT: REGISTER FORM -->
		<div class="flex flex-col px-8 lg:px-20 py-12 justify-start bg-white overflow-y-auto">
			<!-- LOGO -->
			<div class="flex items-center justify-center gap-6 mb-10">
				<img src="/images/logo.png" class="w-32 object-contain" />
				<img src="/images/logo-vokasi.png" class="w-32 object-contain" />
				<img src="/images/logo-stankom.png" class="w-32 object-contain" />
			</div>

			<!-- TITLE -->
			<div class="text-center mb-10">
				<h2 class="text-2xl font-bold text-gray-900">BUAT AKUN SIAP VOKASI</h2>
				<p class="text-gray-500 mt-1">
					Sudah Punya Akun?
					<NuxtLink to="/login" class="text-blue-600 font-semibold">Login!</NuxtLink>
				</p>
			</div>

			<!-- FORM -->
			<Card v-if="!showSuccess" class="w-full max-w-3xl mx-auto shadow-none border-none">
				<CardContent class="space-y-8">
					<!-- Nama -->
					<div class="grid gap-2">
						<Label>Nama</Label>
						<Input v-model="form.name" placeholder="Masukkan Nama" class="bg-gray-100 border-gray-200" />
					</div>

					<!-- Email -->
					<div class="grid gap-2">
						<Label>Email</Label>
						<Input v-model="form.email" placeholder="Masukkan Email" class="bg-gray-100 border-gray-200" />
					</div>

					<hr class="border-gray-200" />

					<!-- Password -->
					<div class="grid gap-2">
						<Label>Password</Label>
						<Input v-model="form.password" type="password" placeholder="Masukkan Password" class="bg-gray-100 border-gray-200" />
					</div>

					<!-- Password Confirmation -->
					<div class="grid gap-2">
						<Label>Masukkan Ulang Password</Label>
						<Input v-model="form.passwordConfirmation" type="password" placeholder="Ulangi Password" class="bg-gray-100 border-gray-200" />
					</div>

					<!-- Submit -->
					<Button class="w-full bg-blue-600 text-white py-6 text-base rounded-xl hover:bg-blue-700" @click="submit" :disabled="loading">
						{{ loading ? "Memproses..." : "Daftar" }}
					</Button>
				</CardContent>
			</Card>

			<!-- Success -->
			<CommonSuccessPage v-if="showSuccess" desc="Tunggu Verifikasi dari Admin Melalui Email Anda" title="Berhasil Mendaftarkan Akun Anda" />
		</div>

		<!-- RIGHT: ILLUSTRATION -->
		<div class="hidden lg:flex flex-col items-center justify-center bg-[#EEF3FF] relative">
			<h2 class="text-3xl font-bold text-gray-800 mb-8 text-center px-10 pt-5">Layanan Sistem Informasi Ajuan Pelacakan</h2>

			<img src="/images/sign.png" alt="Illustration" class="w-[80%] max-w-2xl object-contain" />
		</div>
	</div>
</template>
