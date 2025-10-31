<template>
	<section class="relative bg-primary py-16 md:py-20">
		<div class="container relative z-10 mx-auto px-4">
			<h2 class="mb-12 text-center text-3xl font-bold text-white md:text-4xl">Sosial Media</h2>

			<!-- Carousel -->
			<Carousel class="mx-auto w-full" :opts="{ align: 'start', loop: true }" ref="carouselRef" @init-api="(api) => (emblaApi = api)">
				<CarouselContent class="-ml-4">
					<CarouselItem v-for="(embed, index) in embeds" :key="index" class="basis-full pl-4 md:basis-1/2 lg:basis-1/3">
						<AppUiInstagramEmbed :url="embed" />
					</CarouselItem>
				</CarouselContent>

				<!-- Dynamic Dots -->
				<div class="mt-8 flex items-center justify-center gap-4">
					<button v-for="(_, index) in embeds.length" :key="index" @click="scrollTo(index)" class="h-2 rounded-full transition-all duration-300" :class="current === index ? 'w-36 scale-110 bg-white' : 'w-2 scale-100 bg-white/40 hover:bg-white/60'" :aria-label="`Slide ${index + 1}`"></button>
				</div>
			</Carousel>
		</div>
	</section>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const embeds = ref<string[]>(["https://www.instagram.com/p/DQT0bBBEl3i/", "https://www.instagram.com/p/DQVqfIOkpfq/", "https://www.instagram.com/p/DQT0bBBEl3i/", "https://www.instagram.com/p/DQT0bBBEl3i/", "https://www.instagram.com/p/DQT0bBBEl3i/", "https://www.instagram.com/p/DQT0bBBEl3i/", "https://www.instagram.com/p/DQT0bBBEl3i/"]);
const carouselRef = ref();
const current = ref(0);
const emblaApi = ref<CarouselApi>();

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
</script>
