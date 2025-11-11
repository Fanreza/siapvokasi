<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useStatisticCategoryService } from "@/services/stats-scategory.services";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Skeleton } from "@/components/ui/skeleton";

const { getAll, response, loading } = useStatisticCategoryService();
const emblaApi = ref<CarouselApi>();
const current = ref(0);

const autoplay = Autoplay({
	delay: 5000,
	stopOnInteraction: true,
	stopOnMouseEnter: true,
});

const slides = computed(() => response.value?.data || []);

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

onMounted(async () => {
	try {
		await getAll(true);
		if (emblaApi.value) current.value = emblaApi.value.selectedScrollSnap();
	} catch {
		console.warn("Gagal memuat statistik publik.");
	}
});
</script>

<template>
	<section class="relative overflow-hidden bg-primary py-16 md:py-20">
		<!-- SVG Backgrounds (sama seperti versi kamu sebelumnya) -->
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

		<div class="container relative z-10 mx-auto px-4">
			<!-- Loading Skeleton -->
			<div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
				<div v-for="i in 4" :key="i" class="text-center">
					<Skeleton class="h-10 w-3/4 mx-auto mb-2 rounded-lg" />
					<Skeleton class="h-6 w-1/2 mx-auto" />
				</div>
			</div>

			<!-- Carousel -->
			<Carousel v-if="!loading && slides.length > 0" class="mx-auto w-full" :opts="{ align: 'start', loop: true }" @init-api="(api) => (emblaApi = api)" :plugins="[autoplay]">
				<CarouselContent>
					<CarouselItem v-for="(category, sIndex) in slides" :key="sIndex">
						<!-- 🔗 Hanya tampilkan kategori yang punya data statistik -->
						<NuxtLink v-if="category?.statistics?.length" :to="category.link || '#'" target="_blank" class="block cursor-pointer">
							<h2 class="mb-12 text-center text-3xl font-bold text-white md:text-4xl">
								{{ category.name }}
							</h2>

							<div class="grid gap-8 md:grid-cols-3 justify-items-center">
								<div v-for="stat in category.statistics" :key="stat.id" class="text-center">
									<div class="mb-2 text-5xl font-bold text-white md:text-6xl lg:text-7xl">
										{{ stat.number }}
									</div>
									<div class="text-lg text-blue-100 md:text-xl">
										{{ stat.name }}
									</div>
								</div>
							</div>
						</NuxtLink>
					</CarouselItem>
				</CarouselContent>

				<!-- Indicator -->
				<div v-if="slides.length > 1" class="mt-8 flex items-center justify-center gap-4">
					<button v-for="(_, index) in slides.length" :key="index" @click="scrollTo(index)" class="h-2 rounded-full transition-all duration-300" :class="current === index ? 'w-36 scale-110 bg-white' : 'w-2 scale-100 bg-white/40 hover:bg-white/60'" :aria-label="`Slide ${index + 1}`"></button>
				</div>
			</Carousel>

			<!-- 🔸 Kondisi ketika data kosong -->
			<div v-else-if="!loading" class="text-center text-blue-100 py-16">
				<p>Tidak ada data statistik yang tersedia saat ini.</p>
			</div>
		</div>
	</section>
</template>
