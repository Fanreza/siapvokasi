<template>
	<section class="text-center py-10 px-4">
		<!-- IMAGE -->
		<img :src="image" alt="success" class="w-48 mx-auto mb-6" />

		<!-- TITLE -->
		<h2 class="text-xl font-semibold text-gray-800 mb-2">
			{{ title }}
		</h2>

		<!-- DESCRIPTION -->
		<p class="text-blue-500 mb-8 whitespace-pre-line">
			{{ desc }}
		</p>

		<!-- BUTTON (if route provided) -->
		<NuxtLink v-if="route" :to="route" class="block w-full max-w-xs mx-auto bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"> Masuk Kembali </NuxtLink>
	</section>
</template>

<script setup lang="ts">
interface Props {
	image?: string;
	title: string;
	desc?: string;
	route?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
	image: "/images/success.png",
	route: null,
});
</script>
