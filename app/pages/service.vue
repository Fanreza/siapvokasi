<!-- components/DocumentList.vue -->
<template>
	<section class="bg-white py-16 md:py-24">
		<!-- Title -->
		<AppUiPageHeader title="Tautan" :breadcrumbs="['Tautan', 'Semua Tautan']" />

		<section class="py-16 md:py-24">
			<div class="container mx-auto px-4">
				<div class="grid gap-5 xl:gap-12 md:grid-cols-3 xl:grid-cols-3 justify-items-center">
					<div v-for="(card, i) in cards" :key="i" class="flex flex-col items-center rounded-2xl bg-white w-[80%] md:w-full py-12 px-5 xl:px-16 shadow-sm transition-shadow hover:shadow-md">
						<div class="relative mb-6">
							<Icon name="streamline-color:quality-education-flat" class="text-6xl" />
						</div>

						<h3 class="mb-4 text-xl xl:text-3xl font-bold text-primary text-center">{{ card.title }}</h3>
						<p class="mb-6 text-center text-sm xl:text-base leading-relaxed text-gray-600 flex-1">
							{{ card.description }}
						</p>

						<a :href="card.link" target="_blank" rel="noopener noreferrer" class="group flex w-full items-center justify-center gap-2 rounded-lg bg-[#163E93] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 mt-auto">
							<span>Kunjungi Website</span>
							<ArrowRight class="h-5 w-5 transition-transform group-hover:translate-x-1" />
						</a>
					</div>
				</div>
			</div>
		</section>
	</section>
</template>

<script setup lang="ts">
import { BookOpen, GraduationCap, Award, ArrowRight } from "lucide-vue-next";

const cards = [
	{
		title: "SKKNI",
		description: "Standar Kompetensi Kerja Nasional Indonesia - Portal resmi untuk standar kompetensi profesi.",
		link: "https://skkni.kemnaker.go.id",
		icon: BookOpen,
	},
	{
		title: "Proglat",
		description: "Program Pelatihan - Platform resmi untuk pengembangan kompetensi kerja.",
		link: "https://proglat.kemnaker.go.id",
		icon: GraduationCap,
	},
	{
		title: "InaSkill",
		description: "Portal sertifikasi keterampilan nasional untuk tenaga kerja Indonesia.",
		link: "https://inaskill.kemnaker.go.id",
		icon: Award,
	},
];
</script>
