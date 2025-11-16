<script setup lang="ts"></script>

<template>
	<div class="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
		<!-- LEFT: FORM -->
		<div class="flex flex-col justify-evenly px-8 lg:px-20 py-12 bg-white">
			<!-- LOGO -->
			<div class="flex items-center justify-center gap-6 mb-10">
				<img src="/images/logo.png" alt="Logo Kementerian" class="w-36 object-contain" />
				<img src="/images/logo-vokasi.png" alt="Logo Kementerian" class="w-36 object-contain" />
				<img src="/images/logo-stankom.png" alt="Logo Kementerian" class="w-36 object-contain" />
			</div>

			<!-- Login Form -->
			<div>
				<!-- TITLE -->
				<div class="text-center mb-8">
					<h2 class="text-2xl font-bold text-gray-900">SIAP VOKASI</h2>
					<p class="text-gray-500 mt-1">
						Belum Punya Akun?
						<NuxtLink to="/register" class="text-blue-600 font-semibold">Silahkan Daftar!</NuxtLink>
					</p>
				</div>

				<!-- SHADCN FORM CARD -->
				<Card class="w-full max-w-md mx-auto bg-transparent shadow-none border-none">
					<CardHeader>
						<CardTitle class="text-lg">Masuk ke Akun</CardTitle>
					</CardHeader>

					<CardContent class="space-y-5">
						<!-- Email -->
						<div class="grid gap-2">
							<Label for="email">Email</Label>
							<Input id="email" type="email" placeholder="Masukkan Email" />
						</div>

						<!-- Password -->
						<div class="grid gap-2">
							<Label for="password">Password</Label>
							<Input id="password" type="password" placeholder="Masukkan Password" />
						</div>

						<!-- Remember + Forgot -->
						<div class="flex items-center justify-between text-sm">
							<label class="flex items-center gap-2 cursor-pointer">
								<Checkbox id="remember" />
								<span class="text-gray-600">Ingat Saya</span>
							</label>

							<a href="#" class="text-blue-600 font-medium"> Lupa Password ? </a>
						</div>

						<!-- Submit Button -->
						<Button class="w-full bg-blue-600 text-white hover:bg-blue-700"> Masuk </Button>
					</CardContent>
				</Card>
			</div>
		</div>

		<!-- RIGHT: ILLUSTRATION -->
		<div class="hidden lg:flex flex-col items-center justify-between bg-[#EEF3FF] relative">
			<h2 class="text-3xl font-bold text-gray-800 mb-8 text-center px-10 pt-20">Layanan Sistem Informasi Ajuan Pelacakan</h2>

			<div class="w-[80%]">
				<img src="/images/sign.png" alt="Illustration" class="object-contain w-full" />
			</div>
		</div>
	</div>
</template>
