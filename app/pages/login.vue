<script setup lang="ts">
import { reactive, ref } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";
import { Eye, EyeOff } from "lucide-vue-next"; // 👈 icon password toggle

definePageMeta({
	middleware: "guest",
	layout: false,
	ssr: false,
});

const router = useRouter();
const auth = useAuthStore();

const form = reactive({
	email: "",
	password: "",
});

const loading = ref(false);
const showPassword = ref(false); // 👈 toggle password visibility

const submit = async () => {
	if (!form.email || !form.password) {
		toast.error("Email dan password wajib diisi");
		return;
	}

	loading.value = true;

	try {
		await auth.login(form);

		// Redirect berdasarkan role
		if (auth.isAdmin || auth.isSuperadmin) return router.push("/admin");
		if (auth.isUser) return router.push("/user");

		router.push("/");
	} catch (err) {
		// silent error
	} finally {
		loading.value = false;
	}
};
</script>

<template>
	<div class="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
		<!-- LEFT: FORM -->
		<div class="flex flex-col justify-evenly px-8 lg:px-20 py-12 bg-white">
			<!-- LOGO -->
			<div class="flex items-center justify-center gap-6 mb-10">
				<img src="/images/logo.png" alt="Logo Kementerian" class="w-36 object-contain" />
				<img src="/images/logo-vokasi.png" alt="Logo Vokasi" class="w-36 object-contain" />
				<img src="/images/logo-stankom.png" alt="Logo Stankom" class="w-36 object-contain" />
			</div>

			<!-- TITLE -->
			<div class="text-center mb-8">
				<h2 class="text-2xl font-bold text-gray-900">SIAP VOKASI</h2>
				<p class="text-gray-500 mt-1">
					Belum Punya Akun?
					<NuxtLink to="/register" class="text-blue-600 font-semibold"> Silahkan Daftar! </NuxtLink>
				</p>
			</div>

			<!-- FORM (ENTER SUBMIT FIXED) -->
			<form @submit.prevent="submit" class="w-full max-w-md mx-auto">
				<Card class="bg-transparent shadow-none border-none">
					<CardHeader>
						<CardTitle class="text-lg">Masuk ke Akun</CardTitle>
					</CardHeader>

					<CardContent class="space-y-5">
						<!-- Email -->
						<div class="grid gap-2">
							<Label for="email">Email</Label>
							<Input id="email" type="email" v-model="form.email" placeholder="Masukkan Email" />
						</div>

						<!-- Password -->
						<div class="grid gap-2">
							<Label for="password">Password</Label>
							<div class="relative">
								<Input id="password" :type="showPassword ? 'text' : 'password'" v-model="form.password" placeholder="Masukkan Password" class="pr-10" />

								<!-- Icon untuk lihat password -->
								<button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700" @click="showPassword = !showPassword">
									<Eye v-if="showPassword" class="w-5 h-5" />
									<EyeOff v-else class="w-5 h-5" />
								</button>
							</div>
						</div>

						<!-- Forgot Password -->
						<div class="flex items-center justify-end text-sm">
							<NuxtLink to="/auth/forgot-password" class="text-blue-600 font-medium">Lupa Password?</NuxtLink>
						</div>

						<!-- Submit Button -->
						<Button type="submit" class="w-full bg-blue-600 text-white hover:bg-blue-700" :disabled="loading">
							{{ loading ? "Memproses..." : "Masuk" }}
						</Button>
					</CardContent>
				</Card>
			</form>
		</div>

		<!-- RIGHT: ILLUSTRATION -->
		<div class="hidden lg:flex flex-col items-center justify-between bg-[#EEF3FF] relative">
			<h2 class="text-3xl font-bold text-gray-800 mb-8 text-center px-10 pt-20">Layanan Standar, Inovasi, dan Akselerasi Pelayanan Vokasi</h2>

			<div class="w-[80%]">
				<img src="/images/sign.png" alt="Illustration" class="object-contain w-full" />
			</div>
		</div>
	</div>
</template>
