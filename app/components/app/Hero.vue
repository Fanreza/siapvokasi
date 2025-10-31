<template>
	<section class="relative h-screen w-full overflow-hidden">
		<!-- Background Image with Overlay -->
		<div class="absolute inset-0">
			<img src="/images/hero.png" alt="Building" class="h-full w-full object-cover" />
			<!-- Blur Overlay -->
			<div class="absolute inset-0 bg-[#171717]/60 backdrop-blur-xs"></div>
		</div>

		<!-- Content -->
		<div class="relative z-10 flex h-full items-center justify-center px-4">
			<div class="text-center">
				<!-- Main Heading -->
				<h1 class="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-7xl">
					Direktorat Bina Standardisasi<br />
					Kompetensi dan Program Pelatihan
				</h1>

				<!-- Subtitle -->
				<p class="mb-8 text-lg text-gray-100 md:text-xl lg:text-2xl">
					Membangun pelatihan untuk masa depan yang lebih baik berarti menyiapkan<br class="hidden md:block" />
					sumber daya manusia yang unggul dan adaptif terhadap perubahan.
				</p>

				<!-- CTA Button -->
				<Button size="lg" class="group px-10 py-7 text-base">
					<Icon name="iconamoon:send-fill" class="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
					Telusuri yang Terbaru
				</Button>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { Play } from "lucide-vue-next";
</script>

<style scoped>
@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

h1,
p,
button {
	animation: fadeIn 0.8s ease-out forwards;
}

p {
	animation-delay: 0.2s;
}

button {
	animation-delay: 0.4s;
}
</style>
