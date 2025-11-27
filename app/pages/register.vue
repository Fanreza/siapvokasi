<script setup lang="ts">
import { reactive, ref } from "vue";
import { registerService } from "~/services/auth.services";
import { toast } from "vue-sonner";
import { useRouter } from "vue-router";
import { Eye, EyeOff } from "lucide-vue-next";

definePageMeta({
	layout: false,
});

const router = useRouter();
const loading = ref(false);

// FORM DATA
const form = reactive({
	email: "",
	name: "",
	password: "",
	passwordConfirmation: "",

	instanceName: "",
	instanceEmail: "",
	instanceProvince: "",
	instanceDistrict: "",
	instanceSubDistrict: "",
	instanceAddress: "",
	instancePhone: "",
});

const showSuccess = ref(false);

// Toggle password visibility
const showPassword = ref(false);
const showPasswordConfirmation = ref(false);

// SUBMIT
const submit = async () => {
	if (!form.email || !form.name || !form.password || !form.passwordConfirmation) {
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
		<!-- LEFT FORM -->
		<div class="flex flex-col px-8 lg:px-20 py-12 bg-white overflow-y-auto">
			<div class="flex items-center justify-center gap-6 mb-10">
				<img src="/images/logo.png" class="w-32 object-contain" />
				<img src="/images/logo-vokasi.png" class="w-32 object-contain" />
				<img src="/images/logo-stankom.png" class="w-32 object-contain" />
			</div>

			<div class="text-center mb-10">
				<h2 class="text-2xl font-bold text-gray-900">BUAT AKUN SIAP VOKASI</h2>
				<p class="text-gray-500 mt-1">
					Sudah Punya Akun?
					<NuxtLink to="/login" class="text-blue-600 font-semibold">Login!</NuxtLink>
				</p>
			</div>

			<Card v-if="!showSuccess" class="w-full max-w-3xl mx-auto shadow-none border-none">
				<CardContent class="space-y-8">
					<!-- EMAIL -->
					<div class="grid gap-2">
						<Label>Email</Label>
						<Input v-model="form.email" type="email" placeholder="Masukkan Email" class="bg-gray-100 border-gray-200" />
					</div>

					<hr class="border-gray-200" />

					<!-- 2 COLUMN GRID -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div class="grid gap-2">
							<Label>Nama Kementrian / Lembaga</Label>
							<Input v-model="form.instanceName" placeholder="Kemnaker" class="bg-gray-100 border-gray-200" />
						</div>

						<div class="grid gap-2">
							<Label>Email Lembaga</Label>
							<Input v-model="form.instanceEmail" type="email" placeholder="Kemnaker" class="bg-gray-100 border-gray-200" />
						</div>

						<div class="grid gap-2">
							<Label>Nama Lengkap</Label>
							<Input v-model="form.name" placeholder="Nama Anda" class="bg-gray-100 border-gray-200" />
						</div>

						<div class="grid gap-2">
							<Label>Provinsi</Label>
							<Input v-model="form.instanceProvince" placeholder="Provinsi" class="bg-gray-100 border-gray-200" />
						</div>

						<div class="grid gap-2">
							<Label>Kota</Label>
							<Input v-model="form.instanceDistrict" placeholder="Kota" class="bg-gray-100 border-gray-200" />
						</div>

						<div class="grid gap-2">
							<Label>Kecamatan</Label>
							<Input v-model="form.instanceSubDistrict" placeholder="Kecamatan" class="bg-gray-100 border-gray-200" />
						</div>

						<div class="grid gap-2">
							<Label>Alamat Lengkap</Label>
							<Textarea v-model="form.instanceAddress" placeholder="Masukkan alamat lengkap" class="bg-gray-100 border-gray-200" />
						</div>

						<div class="grid gap-2">
							<Label>No Telepon</Label>
							<Input v-model="form.instancePhone" placeholder="0812xxxxxx" class="bg-gray-100 border-gray-200" />
						</div>
					</div>

					<hr class="border-gray-200" />

					<!-- PASSWORD -->
					<div class="grid gap-2">
						<Label>Password</Label>
						<div class="relative">
							<Input :type="showPassword ? 'text' : 'password'" v-model="form.password" placeholder="Masukkan Password" class="bg-gray-100 border-gray-200 pr-10" />
							<button type="button" class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600" @click="showPassword = !showPassword">
								<Eye v-if="!showPassword" class="w-4 h-4" />
								<EyeOff v-else class="w-4 h-4" />
							</button>
						</div>
					</div>

					<!-- PASSWORD CONFIRM -->
					<div class="grid gap-2">
						<Label>Masukkan Ulang Password</Label>
						<div class="relative">
							<Input :type="showPasswordConfirmation ? 'text' : 'password'" v-model="form.passwordConfirmation" placeholder="Ulangi Password" class="bg-gray-100 border-gray-200 pr-10" />
							<button type="button" class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600" @click="showPasswordConfirmation = !showPasswordConfirmation">
								<Eye v-if="!showPasswordConfirmation" class="w-4 h-4" />
								<EyeOff v-else class="w-4 h-4" />
							</button>
						</div>
					</div>

					<!-- SUBMIT -->
					<Button @click="submit" :disabled="loading" class="w-full bg-blue-600 text-white py-6 text-base rounded-xl hover:bg-blue-700">
						<span v-if="!loading">Daftar</span>
						<span v-else>Memproses...</span>
					</Button>
				</CardContent>
			</Card>

			<!-- Success -->
			<CommonSuccessPage v-if="showSuccess" title="Berhasil Mendaftarkan Akun Anda" route="/login" />
		</div>

		<!-- RIGHT IMAGE -->
		<div class="hidden lg:flex flex-col items-center justify-center bg-[#EEF3FF]">
			<h2 class="text-3xl font-bold text-gray-800 mb-8 text-center px-10 pt-5">Layanan Standar, Inovasi, dan Akselerasi Pelayanan Vokasi</h2>
			<img src="/images/sign.png" class="w-[80%] max-w-2xl object-contain" />
		</div>
	</div>
</template>
