<script setup lang="ts">
defineProps<{
	title?: string;
	description?: string;
	buttonText?: string;
	buttonTo?: string;
}>();
</script>

<template>
	<div class="py-20 text-center text-gray-500">
		<div class="mx-auto w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16h6M21 12v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6l2 2h6a2 2 0 012 2v2" />
			</svg>
		</div>

		<h3 class="mt-4 text-lg font-semibold">{{ title || "Belum ada data" }}</h3>
		<p class="text-sm text-gray-400 mt-2">{{ description || "Tidak ada item untuk ditampilkan." }}</p>

		<div v-if="buttonText && buttonTo" class="mt-5">
			<NuxtLink :to="buttonTo">
				<Button>{{ buttonText }}</Button>
			</NuxtLink>
		</div>
	</div>
</template>
