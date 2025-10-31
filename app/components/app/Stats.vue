<template>
	<section class="relative overflow-hidden bg-primary py-16 md:py-20">
		<!-- Decorative SVG Background -->
		<!-- Left Side -->
		<div class="absolute left-0 bottom-[50%] h-full">
			<svg width="175" height="357" viewBox="0 0 175 357" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path opacity="0.05" d="M-155.77 356.958H-56.3248L160.358 194.999C180.828 180.157 180.108 140.314 156.471 123.176L0.0348969 14.1778C-23.6019 -2.96069 -59.3586 -4.82227 -79.8287 10.0198L-155.77 65.0831V356.958Z" fill="url(#paint0_linear_91_2567)" />
				<defs>
					<linearGradient id="paint0_linear_91_2567" x1="457.353" y1="93.1475" x2="-340.012" y2="177.548" gradientUnits="userSpaceOnUse">
						<stop offset="0.000460737" stop-color="white" />
						<stop offset="1" stop-color="#E4FFFF" />
					</linearGradient>
				</defs>
			</svg>
		</div>
		<div class="absolute left-0 top-0 h-full">
			<svg width="175" height="357" viewBox="0 0 175 357" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path opacity="0.05" d="M-155.77 356.958H-56.3248L160.358 194.999C180.828 180.157 180.108 140.314 156.471 123.176L0.0348969 14.1778C-23.6019 -2.96069 -59.3586 -4.82227 -79.8287 10.0198L-155.77 65.0831V356.958Z" fill="url(#paint0_linear_91_2567)" />
				<defs>
					<linearGradient id="paint0_linear_91_2567" x1="457.353" y1="93.1475" x2="-340.012" y2="177.548" gradientUnits="userSpaceOnUse">
						<stop offset="0.000460737" stop-color="white" />
						<stop offset="1" stop-color="#E4FFFF" />
					</linearGradient>
				</defs>
			</svg>
		</div>
		<!-- Right Side -->
		<div class="absolute right-0 top-[50%] h-full transform rotate-180">
			<svg width="175" height="357" viewBox="0 0 175 357" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path opacity="0.05" d="M-155.77 356.958H-56.3248L160.358 194.999C180.828 180.157 180.108 140.314 156.471 123.176L0.0348969 14.1778C-23.6019 -2.96069 -59.3586 -4.82227 -79.8287 10.0198L-155.77 65.0831V356.958Z" fill="url(#paint0_linear_91_2567)" />
				<defs>
					<linearGradient id="paint0_linear_91_2567" x1="457.353" y1="93.1475" x2="-340.012" y2="177.548" gradientUnits="userSpaceOnUse">
						<stop offset="0.000460737" stop-color="white" />
						<stop offset="1" stop-color="#E4FFFF" />
					</linearGradient>
				</defs>
			</svg>
		</div>
		<div class="absolute right-0 bottom-0 h-full transform rotate-180">
			<svg width="175" height="357" viewBox="0 0 175 357" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path opacity="0.05" d="M-155.77 356.958H-56.3248L160.358 194.999C180.828 180.157 180.108 140.314 156.471 123.176L0.0348969 14.1778C-23.6019 -2.96069 -59.3586 -4.82227 -79.8287 10.0198L-155.77 65.0831V356.958Z" fill="url(#paint0_linear_91_2567)" />
				<defs>
					<linearGradient id="paint0_linear_91_2567" x1="457.353" y1="93.1475" x2="-340.012" y2="177.548" gradientUnits="userSpaceOnUse">
						<stop offset="0.000460737" stop-color="white" />
						<stop offset="1" stop-color="#E4FFFF" />
					</linearGradient>
				</defs>
			</svg>
		</div>

		<!-- Carousel -->
		<div class="container relative z-10 mx-auto px-4">
			<Carousel class="mx-auto w-full" :opts="{ align: 'start', loop: true }" @init-api="(api) => (emblaApi = api)" :plugins="[autoplay]">
				<CarouselContent>
					<CarouselItem v-for="(slide, sIndex) in slides" :key="sIndex">
						<h2 class="mb-12 text-center text-3xl font-bold text-white md:text-4xl">
							{{ slide.title }}
						</h2>

						<div class="grid gap-8" :class="`md:grid-cols-${slide.items.length}`">
							<div v-for="(item, iIndex) in slide.items" :key="iIndex" class="text-center">
								<div class="mb-2 text-5xl font-bold text-white md:text-6xl lg:text-7xl">
									{{ item.value }}
								</div>
								<div class="text-lg text-blue-100 md:text-xl">{{ item.label }}</div>
							</div>
						</div>
					</CarouselItem>
				</CarouselContent>

				<div class="mt-8 flex items-center justify-center gap-4">
					<button v-for="(_, index) in slides.length" :key="index" @click="scrollTo(index)" class="h-2 rounded-full transition-all duration-300" :class="current === index ? 'w-36 scale-110 bg-white' : 'w-2 scale-100 bg-white/40 hover:bg-white/60'" :aria-label="`Slide ${index + 1}`"></button>
				</div>
			</Carousel>
		</div>
	</section>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const slides = ref([
	{
		title: "Rekapitulasi SKKNI",
		items: [
			{ value: 1212, label: "SKKNI Ditetapkan" },
			{ value: 937, label: "SKKNI Berlaku" },
			{ value: 275, label: "SKKNI Dicabut" },
		],
	},
	{
		title: "Rekapitulasi KKNI",
		items: [
			{ value: 166, label: "KKNI Berlaku" },
			{ value: 16, label: "KKNI Dicabut" },
		],
	},
	{
		title: "Rekapitulasi SKKK/SKKI",
		items: [
			{ value: 246, label: "SKKK Berlaku" },
			{ value: 0, label: "SKKK Dicabut" },
		],
	},
	{
		title: "Rekapitulasi Program",
		items: [
			{ value: 103, label: "Program Latihan" },
			{ value: 288, label: "Materi Pelatihan" },
		],
	},
	{
		title: "The 14th WordSkills Asean",
		items: [
			{ value: 38, label: "Kompetitor" },
			{ value: 19, label: "Bidang Kompetisi" },
			{ value: 28, label: "Medali" },
		],
	},
]);

const emblaApi = ref<CarouselApi>();
const current = ref(0);

const autoplay = Autoplay({
	delay: 5000,
	stopOnInteraction: false,
});

watch(emblaApi, (api) => {
	if (!api) return;
	api.on("select", () => {
		current.value = api.selectedScrollSnap();
	});
	const autoplayPlugin = api.plugins().autoplay;
	if (autoplayPlugin) autoplayPlugin.play();
});

const scrollTo = (index: number) => {
	emblaApi.value?.scrollTo(index);
};

onMounted(() => {
	if (emblaApi.value) current.value = emblaApi.value.selectedScrollSnap();
});
</script>
