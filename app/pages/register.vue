<template>
	<div class="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-white">
		<!-- LEFT: REGISTER FORM -->
		<div class="flex flex-col px-8 lg:px-20 py-12 justify-start bg-white overflow-y-auto">
			<!-- LOGO -->
			<div class="flex items-center gap-6 mb-10">
				<img src="/images/logo.png" class="w-32 object-contain" />
				<img src="/images/logo-vokasi.png" class="w-32 object-contain" />
				<img src="/images/logo-stankom.png" class="w-32 object-contain" />
			</div>

			<!-- TITLE -->
			<div class="text-center mb-10">
				<h2 class="text-2xl font-bold text-gray-900">BUAT AKUN SIAP VOKASI</h2>
				<p class="text-gray-500 mt-1">
					Sudah Punya Akun?
					<a href="#" class="text-blue-600 font-semibold">Login!</a>
				</p>
			</div>

			<!-- FORM WRAPPER -->
			<Card class="w-full max-w-3xl mx-auto shadow-none border-none">
				<CardContent class="space-y-8">
					<!-- EMAIL -->
					<div class="grid gap-2">
						<Label>Email</Label>
						<Input placeholder="Masukkan Email" class="bg-gray-100 border-gray-200" />
					</div>

					<hr class="border-gray-200" />

					<!-- 2 COLUMN GRID -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div class="grid gap-2">
							<Label>Nama Kementrian / Lembaga</Label>
							<Input placeholder="Kemnaker" class="bg-gray-100 border-gray-200" />
						</div>

						<div class="grid gap-2">
							<Label>Nama Lengkap</Label>
							<Input placeholder="Nama Anda" class="bg-gray-100 border-gray-200" />
						</div>

						<div class="grid gap-2">
							<Label>Provinsi</Label>
							<Input placeholder="Provinsi" class="bg-gray-100 border-gray-200" />
						</div>

						<div class="grid gap-2">
							<Label>Kota</Label>
							<Input placeholder="Kota" class="bg-gray-100 border-gray-200" />
						</div>

						<div class="grid gap-2">
							<Label>Kecamatan</Label>
							<Input placeholder="Kecamatan" class="bg-gray-100 border-gray-200" />
						</div>

						<div class="grid gap-2">
							<Label>Alamat Lengkap</Label>
							<Textarea placeholder="Masukkan alamat lengkap" class="bg-gray-100 border-gray-200" />
						</div>

						<div class="grid gap-2">
							<Label>No Telepon</Label>
							<Input placeholder="0812xxxxxx" class="bg-gray-100 border-gray-200" />
						</div>
					</div>

					<hr class="border-gray-200" />

					<!-- PASSWORD -->
					<div class="grid gap-2">
						<Label>Password</Label>
						<Input type="password" class="bg-gray-100 border-gray-200" placeholder="Masukkan Password" />
					</div>

					<div class="grid gap-2">
						<Label>Masukkan Ulang Password</Label>
						<Input type="password" class="bg-gray-100 border-gray-200" placeholder="Ulangi Password" />
					</div>

					<!-- SUBMIT -->
					<Button class="w-full bg-blue-600 text-white py-6 text-base rounded-xl hover:bg-blue-700"> Daftar </Button>
				</CardContent>
			</Card>
		</div>

		<!-- RIGHT: ILLUSTRATION (same as login) -->
		<div class="hidden lg:flex flex-col items-center justify-center bg-[#EEF3FF] relative">
			<h2 class="text-3xl font-bold text-gray-800 mb-8 text-center px-10 pt-5">Layanan Sistem Informasi Ajuan Pelacakan</h2>

			<img src="/images/sign.png" alt="Illustration" class="w-[80%] max-w-2xl object-contain" />
		</div>
	</div>
</template>
