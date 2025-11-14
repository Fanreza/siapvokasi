<template>
	<header class="w-full z-50">
		<nav class="mx-auto px-4 sm:px-6 lg:px-14 py-2">
			<div class="flex justify-between items-center">
				<!-- Logo -->
				<div class="flex items-center space-x-3">
					<img src="/images/logo.png" alt="" class="w-40" />
				</div>

				<!-- Desktop Menu -->
				<div class="hidden md:flex items-center space-x-14 text-center">
					<a v-for="item in menus" :key="item.label" :href="item.to" class="text-center relative font-medium transition-colors" :class="activeMenu === item.to ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'" @click="setActive(item.to)">
						{{ item.label }}

						<!-- underline -->
						<span class="absolute left-1/2 -bottom-1 h-[3px] bg-blue-600 rounded transition-all duration-300 transform -translate-x-1/2" :class="activeMenu === item.to ? 'w-[50%] opacity-100' : 'w-0 opacity-0 group-hover:w-[50%]'"></span>
					</a>

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
				<a
					v-for="item in menus"
					:key="item.label"
					:href="item.to"
					class="block font-medium py-2 transition-colors"
					:class="activeMenu === item.to ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'"
					@click="
						setActive(item.to);
						mobileMenuOpen = false;
					"
				>
					{{ item.label }}
				</a>

				<button class="w-full bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium">Login Akun</button>
			</div>
		</nav>
	</header>
</template>

<script setup lang="ts">
import { ref } from "vue";

// menu dinamis
const menus = ref([
	{ label: "Home", to: "#home" },
	{ label: "Persyaratan", to: "#terms" },
	{ label: "FAQ", to: "#faq" },
	{ label: "Kontak", to: "#kontak" },
]);

const mobileMenuOpen = ref(false);

// store active menu
const activeMenu = ref("#home");

// update active state
const setActive = (to: string) => {
	activeMenu.value = to;
};
</script>

<style scoped></style>
