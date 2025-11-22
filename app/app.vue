<script setup>
import { Toaster } from "@/components/ui/sonner";
import "vue-sonner/style.css"; // vue-sonner v2 requires this import

useSeoMeta({
	title: "Stankomproglat",
	ogTitle: "Stankomproglat",
	description: "Stankomproglat adalah lembaga dibawah naungan Kementrian Ketenagakerjaan",
	ogDescription: "Stankomproglat adalah lembaga dibawah naungan Kementrian Ketenagakerjaan",
	// ogImage: "https://ogcdn.net/6064b869-74ed-4eb9-b76c-0b701ffe7e6b/v4/aethereal.my.id/%C3%A6thereal/https%3A%2F%2Faethereal.my.id%2Flogo.jpg/og.png",
	// twitterCard: "summary_large_image",
	// ogimageAlt: "Stankomproglat",
	// ogImageWidth: "226",
	// ogImageHeight: "226",
	// twitterImage: "https://ogcdn.net/6064b869-74ed-4eb9-b76c-0b701ffe7e6b/v4/aethereal.my.id/%C3%A6thereal/https%3A%2F%2Faethereal.my.id%2Flogo.jpg/og.png",
});

useHead({
	script: [
		{
			src: "https://platform.twitter.com/widgets.js",
			async: true,
			type: "text/javascript",
		},
	],
});
</script>

<template>
	<Html lang="en">
		<Toaster richColors :expand="true" position="top-right" />

		<div>
			<NuxtLayout>
				<NuxtLoadingIndicator color="#4981F9" />
				<NuxtPage />
			</NuxtLayout>
		</div>
	</Html>
</template>

<style lang="postcss">
.page-enter-active,
.page-leave-active {
	transition: all 0.1s;
}
.page-enter-from,
.page-leave-to {
	opacity: 0;
	filter: blur(1rem);
}
</style>
