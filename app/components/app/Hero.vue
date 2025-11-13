<template>
	<div class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 relative overflow-hidden">
		<!-- Decorative Background Elements -->
		<div class="absolute top-20 left-10 w-3 h-3 bg-blue-400 rounded-full"></div>
		<div class="absolute top-40 left-32 w-16 h-16 border-2 border-blue-300 rounded-full opacity-30"></div>
		<div class="absolute bottom-32 left-20 w-12 h-12 bg-purple-300 rounded-full opacity-40"></div>
		<div class="absolute top-1/3 left-1/4 w-20 h-1 bg-blue-400 transform -rotate-45 opacity-30"></div>

		<!-- Header/Navbar -->
		<header class="relative z-50">
			<nav class="mx-auto px-4 sm:px-6 lg:px-14 py-10">
				<div class="flex justify-between items-center">
					<!-- Logo -->
					<div class="flex items-center space-x-3">
						<img src="/images/logo.png" alt="" class="w-40" />
					</div>

					<!-- Desktop Menu -->
					<div class="hidden md:flex items-center space-x-20">
						<a href="#" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</a>
						<a href="#" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">Persyaratan</a>
						<a href="#" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">FAQ</a>
						<a href="#" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">Kontak</a>
						<button class="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-all font-medium shadow-lg hover:shadow-xl">Login Akun</button>
					</div>

					<!-- Mobile Menu Button -->
					<button class="md:hidden p-2" @click="mobileMenuOpen = !mobileMenuOpen">
						<svg v-if="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
						</svg>
						<svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				<!-- Mobile Menu -->
				<div v-if="mobileMenuOpen" class="md:hidden mt-4 bg-white rounded-xl shadow-xl p-4 space-y-3">
					<a href="#" class="block text-gray-700 hover:text-blue-600 font-medium py-2">Home</a>
					<a href="#" class="block text-gray-700 hover:text-blue-600 font-medium py-2">Persyaratan</a>
					<a href="#" class="block text-gray-700 hover:text-blue-600 font-medium py-2">FAQ</a>
					<a href="#" class="block text-gray-700 hover:text-blue-600 font-medium py-2">Kontak</a>
					<button class="w-full bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium">Login Akun</button>
				</div>
			</nav>
		</header>

		<!-- Hero Section -->
		<section class="relative w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
			<div class="grid lg:grid-cols-2 gap-12 items-center">
				<!-- Left Content -->
				<div class="relative z-10">
					<div class="text-blue-600 font-bold mb-4 uppercase text-xs tracking-widest">PENGELOLAAN SIAP VOKASI</div>
					<h1 class="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6 leading-tight">Layanan Sistem Informasi Ajuan Pelacakan</h1>
					<p class="text-gray-600 mb-10 text-base lg:text-lg leading-relaxed max-w-xl">Kemudahan Ketenagakerjaan Republik Indonesia menyediakan sistem informasi dalam pengajuan layanan.</p>

					<!-- Search/Tracking Box -->
					<div class="bg-white rounded-2xl shadow-2xl p-6 w-full" v-if="layout === 'default'">
						<div class="flex gap-3">
							<input v-model="ticketNumber" type="text" placeholder="Masukan Nomor Tiket" class="flex-1 px-5 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black font-bold" />
							<Button @click="onNavigateTicket" :disabled="!ticketNumber" class="bg-blue-600 text-white px-8 py-3.5 rounded-xl hover:bg-blue-700 transition-all font-semibold whitespace-nowrap shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">Tracking</Button>
						</div>
					</div>
				</div>

				<!-- Right Illustration -->
				<div class="relative lg:block hidden">
					<!-- Main illustration container with 3D isometric elements -->
					<div class="relative w-full h-[500px]">
						<img src="/images/hero.png" alt="Hero Illustration" class="w-full h-full object-contain" />
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const mobileMenuOpen = ref(false);
const ticketNumber = ref("");

withDefaults(
	defineProps<{
		layout?: "default" | "tracking";
	}>(),
	{
		layout: "default",
	}
);

const onNavigateTicket = () => {
	navigateTo({
		path: "/tracking",
		query: {
			ticket: ticketNumber.value,
		},
	});
};
</script>

<style scoped>
@keyframes pulse {
	0%,
	100% {
		opacity: 0.2;
	}
	50% {
		opacity: 0.3;
	}
}

.animate-pulse {
	animation: pulse 3s ease-in-out infinite;
}
</style>
