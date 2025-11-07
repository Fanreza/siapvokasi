<template>
	<footer class="border-t border-gray-200 bg-white">
		<div class="mx-auto py-12 w-[80%]">
			<div class="grid gap-8 md:grid-cols-12">
				<!-- Left Section - Logo & Info -->
				<div class="md:col-span-6">
					<!-- Logos -->
					<div class="mb-6 flex items-center flex-wrap gap-4">
						<img src="/images/logo.png" alt="Logo Kementerian" class="w-36 object-contain" />
						<img src="/images/logo-vokasi.png" alt="Logo Kementerian" class="w-36 object-contain" />
						<img src="/images/logo-stankom.png" alt="Logo Kementerian" class="w-36 object-contain" />
					</div>

					<!-- Organization Name -->
					<div class="mb-4">
						<p class="text-[#1A1A1A] text-xl">Direktorat Bina Standardisasi Kompetensi dan Program Pelatihan</p>
					</div>

					<!-- Social Media Links -->
					<div class="flex gap-3">
						<a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="flex h-8 w-8 items-center justify-center rounded bg-[#163E93] text-white transition-colors hover:bg-blue-700">
							<Icon name="ion:social-facebook" />
						</a>
						<a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="flex h-8 w-8 items-center justify-center rounded bg-[#EEF4FB] text-[#163E93] transition-colors hover:bg-pink-700">
							<Icon name="ion:logo-instagram" />
						</a>
						<a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="flex h-8 w-8 items-center justify-center rounded bg-[#EEF4FB] text-[#163E93] transition-colors hover:bg-blue-800">
							<Icon name="ion:logo-linkedin" />
						</a>
						<a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" class="flex h-8 w-8 items-center justify-center rounded bg-[#EEF4FB] text-[#163E93] transition-colors hover:bg-black">
							<Icon name="ion:logo-tiktok" />
						</a>
						<a href="https://youtube.com" target="_blank" rel="noopener noreferrer" class="flex h-8 w-8 items-center justify-center rounded bg-[#EEF4FB] text-[#163E93] transition-colors hover:bg-red-700">
							<Icon name="ion:logo-youtube" />
						</a>
					</div>
				</div>

				<!-- Navigation Columns -->
				<div class="md:col-span-6">
					<div class="grid grid-cols-2 gap-8 md:grid-cols-4">
						<!-- Profil -->
						<div>
							<h4 class="mb-4 text-lg xl:text-2xl font-bold text-[#1A1A1A]">Profil</h4>
							<ul class="space-y-2 text-sm md:text-base text-[#4E4E4E]">
								<li><NuxtLink to="/history">Sejarah</NuxtLink></li>
								<li><NuxtLink to="/function">Tugas & Fungsi</NuxtLink></li>
								<li><NuxtLink to="/organization">Struktur Organisasi</NuxtLink></li>
								<li><NuxtLink to="/director">Profil Direktur</NuxtLink></li>
							</ul>
						</div>

						<!-- Info -->
						<div>
							<h4 class="mb-4 text-lg xl:text-2xl font-bold text-[#1A1A1A]">Info</h4>
							<ul class="space-y-2 text-sm md:text-base text-[#4E4E4E]">
								<li><NuxtLink to="/announcement">Pengumuman</NuxtLink></li>
								<li><NuxtLink to="/news">Berita</NuxtLink></li>
							</ul>
						</div>

						<!-- Tautan -->
						<div>
							<h4 class="mb-4 text-lg xl:text-2xl font-bold text-[#1A1A1A]">Tautan</h4>
							<ul class="space-y-2 text-sm md:text-base text-[#4E4E4E]">
								<li><a target="_blank" href="https://skkni.kemnaker.go.id/">SKKNI</a></li>
								<li><a target="_blank" href="https://proglat.kemnaker.go.id/">PROGLAT</a></li>
								<li><a target="_blank" href="https://e-training.kemnaker.go.id/">E-Training</a></li>
								<li><a target="_blank" href="https://inaskills.kemnaker.go.id/">InaSkill</a></li>
							</ul>
						</div>

						<!-- Lainnya -->
						<div>
							<h4 class="mb-4 text-lg xl:text-2xl font-bold text-[#1A1A1A]">Lainnya</h4>
							<ul class="space-y-2 text-sm md:text-base text-[#4E4E4E]">
								<li><NuxtLink to="/gallery">Galeri</NuxtLink></li>
							</ul>
						</div>
					</div>
				</div>
			</div>

			<!-- Bottom Section - Copyright -->
			<div class="mt-8 flex flex-col items-center justify-between border-t border-gray-200 pt-8 text-sm text-[#111111] md:flex-row">
				<p class="font-semibold">Copyright @2025 Direktorat Standardisasi Kompetensi dan Program Pelatihan. Semua hak dilindungi.</p>
				<div class="mt-4 flex gap-6 md:mt-0">
					<a href="#faq" class="text-[#B4B4B4]">FAQ</a>
					<a href="#contact" class="text-[#163E93] font-medium">Kontak Kami</a>
				</div>
			</div>
		</div>
	</footer>
</template>

<script setup lang="ts"></script>
