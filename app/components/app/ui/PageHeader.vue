<!-- components/PageHeader.vue -->
<template>
	<section class="bg-gray-50 py-12 md:py-16 mb-10">
		<!-- Pattern -->

		<div class="container mx-auto px-4">
			<div class="text-center">
				<!-- Page Title -->
				<h1 class="mb-6 text-5xl font-bold text-gray-900 md:text-4xl lg:text-5xl">{{ title }}</h1>

				<!-- Breadcrumb -->
				<nav class="flex items-center justify-center gap-2 text-base text-gray-600" aria-label="Breadcrumb">
					<span class="font-medium text-primary">{{ breadcrumbs[0] }}</span>
					<span v-if="breadcrumbs[1]">/</span>
					<span class="font-medium text-primary">{{ breadcrumbs[1] }}</span>
				</nav>

				<!-- Optional Description -->
				<p v-if="description" class="mt-4 text-gray-600">{{ description }}</p>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
const props = defineProps<{
	title: string;
	breadcrumbs: string[];
	description?: string;
}>();
</script>
