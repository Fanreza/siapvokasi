<template>
	<section class="relative bg-gradient-to-r from-blue-600 via-blue-600 to-blue-500 py-20 overflow-hidden">
		<!-- Decorative geometric shapes -->
		<div class="absolute top-12 left-1/4 w-4 h-4 bg-blue-800 transform rotate-45"></div>
		<div class="absolute top-20 right-1/4 w-6 h-6 border-2 border-blue-400 transform rotate-12"></div>
		<div class="absolute bottom-16 left-1/3 w-3 h-3 bg-blue-400 rounded-full"></div>

		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
			<div class="grid lg:grid-cols-2 gap-12 items-center">
				<!-- Left Side - Text and CTA Button -->
				<div>
					<h2 class="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-8 leading-tight">Ingin Mengajukan<br />Layanan SIAP VOKASI?</h2>

					<button class="bg-gray-900 text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-all font-semibold text-base shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5">Buat Pengajuan Baru</button>
				</div>

				<!-- Right Side - Illustration -->
				<div class="relative h-64 lg:h-80 flex items-end justify-end">
					<img src="/images/ask.png" alt="Person with laptop" class="object-cover object-top rounded-2xl" />
				</div>
			</div>
		</div>

		<!-- Background decorative wave/shape bottom -->
		<div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-700 to-transparent opacity-30"></div>
	</section>
</template>

<script setup lang="ts">
// No reactive data needed for this component
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
