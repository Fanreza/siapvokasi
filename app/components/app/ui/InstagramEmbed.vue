<template>
	<div class="overflow-hidden rounded-2xl bg-white">
		<iframe v-if="embedUrl" :src="embedUrl" class="w-full aspect-[3/4]" frameborder="0" scrolling="no" allowtransparency="true" allowfullscreen></iframe>
		<p v-else class="p-4 text-center text-sm text-gray-500">Invalid Instagram link</p>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
	url: string;
}

const props = defineProps<Props>();

// Extract kode post dari URL (misal: https://www.instagram.com/p/DQT0bBBEl3i/?hl=en → DQT0bBBEl3i)
const embedUrl = computed(() => {
	try {
		const match = props.url.match(/instagram\.com\/p\/([^/]+)/);
		return match ? `https://www.instagram.com/p/${match[1]}/embed` : null;
	} catch {
		return null;
	}
});
</script>
