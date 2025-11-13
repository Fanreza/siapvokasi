<template>
	<header :class="['fixed top-0 left-0 w-full z-50 transition-all duration-300', isScrolled ? 'bg-white/95 shadow-md backdrop-blur' : 'bg-transparent']">
		<div class="max-w-7xl mx-auto flex items-center justify-between py-4 px-6 md:px-12">
			<!-- Logo -->
			<div class="flex items-center gap-3">
				<img src="https://upload.wikimedia.org/wikipedia/commons/1/1e/Logo_Kemnaker.png" class="h-10" alt="Logo" />
				<div class="text-[11px] font-semibold leading-tight" :class="isScrolled ? 'text-gray-700' : 'text-white'">
					KEMENTERIAN KETENAGAKERJAAN <br />
					<span class="font-normal">REPUBLIK INDONESIA</span>
				</div>
			</div>

			<!-- Desktop Menu -->
			<nav class="hidden md:flex items-center gap-10 text-[15px] font-medium">
				<a :class="linkClass('home')" href="#">Home</a>
				<a :class="linkClass('persyaratan')" href="#persyaratan">Persyaratan</a>
				<a :class="linkClass('faq')" href="#faq">FAQ</a>
				<a :class="linkClass('kontak')" href="#kontak">Kontak</a>
			</nav>

			<!-- Desktop Button -->
			<Button class="hidden md:flex bg-gradient-to-r from-[#2d6cdf] to-[#1e4eb8] text-white px-5 h-10 rounded-lg shadow-md hover:opacity-90"> Login Akun </Button>

			<!-- Mobile Menu Button -->
			<button class="md:hidden" @click="menuOpen = !menuOpen">
				<svg v-if="!menuOpen" xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
				</svg>
				<svg v-else xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>

		<!-- Mobile Menu -->
		<div v-if="menuOpen" class="md:hidden bg-white shadow-lg px-6 py-4 space-y-4 text-gray-700">
			<a href="#" class="block font-medium">Home</a>
			<a href="#persyaratan" class="block font-medium">Persyaratan</a>
			<a href="#faq" class="block font-medium">FAQ</a>
			<a href="#kontak" class="block font-medium">Kontak</a>

			<Button class="w-full bg-gradient-to-r from-[#2d6cdf] to-[#1e4eb8] text-white h-10 rounded-lg shadow-md hover:opacity-90"> Login Akun </Button>
		</div>
	</header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { Button } from "@/components/ui/button";

// apakah sudah scroll lewat hero?
const isScrolled = ref(false);

// mobile toggle
const menuOpen = ref(false);

// detect scroll
const handleScroll = () => {
	isScrolled.value = window.scrollY > 50;
};

onMounted(() => {
	window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
	window.removeEventListener("scroll", handleScroll);
});

// dynamic menu color (white ketika transparent)
const linkClass = (target: string) => {
	return ["relative transition", isScrolled.value ? "text-gray-700 hover:text-blue-600" : "text-white hover:text-blue-200", target === "home" && !isScrolled.value ? "after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px] after:bg-white" : "", target === "home" && isScrolled.value ? "text-blue-600 after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px] after:bg-blue-600" : ""];
};
</script>

<style scoped>
/* smooth underline transition */
a::after {
	content: "";
	transition: width 0.25s ease;
}
</style>
