<template>
	<section class="bg-gray-50 py-16 md:py-24">
		<div class="container mx-auto px-4">
			<!-- Section Title -->
			<h2 class="mb-12 text-center text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">Kegiatan Terbaru</h2>

			<!-- Cards Grid -->
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<!-- Card 1 -->
				<div class="group flex flex-col rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-lg">
					<div class="mb-4 text-sm text-gray-500">12 Oktober 2024</div>

					<!-- Icon -->
					<div class="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
						<Eye class="h-8 w-8 text-blue-600" />
					</div>

					<!-- Title -->
					<h3 class="mb-3 text-xl font-bold text-gray-900">Siapkan SKK Khusus Badan Nasional Penanggulangan Terorisme</h3>

					<!-- Description -->
					<p class="mb-6 flex-grow text-sm leading-relaxed text-gray-600">Assesment deteksi dini dalam rangka ekstremisme berbasis kekerasan yang mengarah pada terorisme berdasarkan rencana pengembangan standar kompetensi kerja.</p>

					<!-- Link -->
					<NuxtLink to="/kegiatan/1" class="group/link inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition-all hover:gap-3">
						<span>Selengkapnya</span>
						<ArrowRight class="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
					</NuxtLink>
				</div>

				<!-- Card 2 -->
				<div class="group flex flex-col rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-lg">
					<div class="mb-4 text-sm text-gray-500">12 Oktober 2024</div>

					<!-- Icon -->
					<div class="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
						<Users class="h-8 w-8 text-blue-600" />
					</div>

					<!-- Title -->
					<h3 class="mb-3 text-xl font-bold text-gray-900">Program Pelatihan Agroforestri</h3>

					<!-- Description -->
					<p class="mb-6 flex-grow text-sm leading-relaxed text-gray-600">Assesment deteksi dini dalam rangka ekstremisme berbasis kekerasan yang mengarah pada terorisme berdasarkan rencana pengembangan standar kompetensi kerja.</p>

					<!-- Link -->
					<NuxtLink to="/kegiatan/2" class="group/link inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition-all hover:gap-3">
						<span>Selengkapnya</span>
						<ArrowRight class="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
					</NuxtLink>
				</div>

				<!-- Card 3 -->
				<div class="group flex flex-col rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-lg">
					<div class="mb-4 text-sm text-gray-500">12 Oktober 2024</div>

					<!-- Icon -->
					<div class="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
						<PlayCircle class="h-8 w-8 text-blue-600" />
					</div>

					<!-- Title -->
					<h3 class="mb-3 text-xl font-bold text-gray-900">Bimtek Penggunaan Aplikasi Open Broadcast Software (OBS)</h3>

					<!-- Description -->
					<p class="mb-6 flex-grow text-sm leading-relaxed text-gray-600">Assesment deteksi dini dalam rangka ekstremisme berbasis kekerasan yang mengarah pada terorisme berdasarkan rencana pengembangan standar kompetensi kerja.</p>

					<!-- Link -->
					<NuxtLink to="/kegiatan/3" class="group/link inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition-all hover:gap-3">
						<span>Selengkapnya</span>
						<ArrowRight class="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
					</NuxtLink>
				</div>
			</div>

			<!-- View More Button -->
			<div class="mt-12 flex justify-center">
				<Button variant="outline" size="lg" class="group gap-2 rounded-full px-8">
					<span>Lainnya</span>
					<ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
				</Button>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { Eye, Users, PlayCircle, ArrowRight } from "lucide-vue-next";
</script>
