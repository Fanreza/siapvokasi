<script setup lang="ts">
import { reactive, ref } from "vue";
import { forgotPasswordService } from "~/services/auth.services";
import { toast } from "vue-sonner";
import { useRouter } from "vue-router";

definePageMeta({
	layout: false,
});

const router = useRouter();
const loading = ref(false);

const form = reactive({
	email: "",
});

const showSuccess = ref(false);

const submit = async () => {
	loading.value = true;
	try {
		await forgotPasswordService(form);

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
					<!-- Email -->
					<div class="grid gap-2">
						<Label>Email</Label>
						<Input v-model="form.email" placeholder="Masukkan Email" class="bg-gray-100 border-gray-200" />
					</div>

					<!-- Submit -->
					<Button class="w-full bg-blue-600 text-white py-6 text-base rounded-xl hover:bg-blue-700" @click="submit" :disabled="loading">
						{{ loading ? "Memproses..." : "Reset Password" }}
					</Button>
				</CardContent>
			</Card>

			<!-- Success -->
			<CommonSuccessPage v-if="showSuccess" desc="Silahkan cek email untuk instruksi reset password" title="Berhasil Melakukan Reset Password" route="/login" />
		</div>

		<!-- RIGHT: ILLUSTRATION -->
		<div class="hidden lg:flex flex-col items-center justify-center bg-[#EEF3FF] relative">
			<h2 class="text-3xl font-bold text-gray-800 mb-8 text-center px-10 pt-5">Layanan Standar, Inovasi, dan Akselerasi Pelayanan Vokasi</h2>

			<img src="/images/sign.png" alt="Illustration" class="w-[80%] max-w-2xl object-contain" />
		</div>
	</div>
</template>
