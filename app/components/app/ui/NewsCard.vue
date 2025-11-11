<template>
	<NuxtLink :to="`/news/${slug}`" class="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
		<!-- Image Container -->
		<div class="relative aspect-4/3 overflow-hidden bg-gray-200">
			<!-- <img :src="image" :alt="title" class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" /> -->
			<ImagePreview :src="image" alt="Preview Banner" />

			<!-- Overlay Gradient -->
			<div class="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>

			<!-- Arrow Button (visible on hover only) -->
			<div class="absolute right-0 bottom-0 flex w-24 h-24 rounded-tl-full items-center justify-center bg-[#2452B5] text-white opacity-0 translate-x-2 translate-y-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0">
				<Icon name="ion:ios-arrow-round-forward" class="ml-5 mt-4 text-4xl" />
			</div>
		</div>

		<!-- Content -->
		<div class="flex grow flex-col p-6">
			<!-- Date & Category -->
			<div class="mb-3 flex items-center justify-between">
				<span class="text-sm text-gray-500">{{ date }}</span>
				<span class="rounded-full bg-[#C4D7FF] px-3 py-1 text-xs font-medium text-[#1F20A4]">
					{{ category }}
				</span>
			</div>

			<!-- Title -->
			<h3 class="mb-2 text-2xl font-bold text-primary line-clamp-2 transition-colors duration-300 group-hover:text-[#2452B5]">
				{{ title }}
			</h3>

			<!-- Excerpt -->
			<p class="mb-4 grow text-sm text-gray-600 line-clamp-2">
				{{ excerpt }}
			</p>

			<!-- Read More Link -->
			<div class="flex items-center gap-2 text-base font-medium text-primary">
				<span>Lanjutkan Baca</span>
			</div>
		</div>
	</NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
	image: string;
	date: string;
	category: string;
	title: string;
	excerpt: string;
	slug: string;
}>();
</script>
