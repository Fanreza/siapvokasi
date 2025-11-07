<template>
	<!-- Navbar -->
	<nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-300" :class="isScrolled ? 'py-2' : 'py-4'">
		<div class="container mx-auto px-4">
			<div class="flex items-center justify-between rounded-3xl bg-white px-5 lg:px-20 py-4 shadow-lg transition-all duration-300" :class="isScrolled ? 'shadow-xl' : 'shadow-lg'">
				<div class="flex items-center gap-3">
					<img src="/images/logo.png" alt="Logo Kementerian Ketenagakerjaan" class="w-36" />
				</div>

				<div class="hidden items-center gap-8 lg:flex">
					<template v-for="(item, i) in menuItems" :key="i">
						<DropdownMenu v-if="item.children">
							<DropdownMenuTrigger class="flex items-center gap-1 text-sm font-medium text-gray-700 transition-colors hover:text-primary">
								{{ item.label }}
								<ChevronDown class="h-4 w-4" />
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<NuxtLink :to="child.to || '#'" v-for="(child, j) in item.children" :key="j" class="cursor-pointer" :target="child.external ? '_blank' : '_self'">
									<DropdownMenuItem class="cursor-pointer">
										{{ child.label }}
									</DropdownMenuItem>
								</NuxtLink>
							</DropdownMenuContent>
						</DropdownMenu>

						<NuxtLink v-else :to="item.to" :target="item.external ? '_blank' : '_self'" class="text-sm font-medium text-gray-700 transition-colors hover:text-primary">
							{{ item.label }}
						</NuxtLink>
					</template>
				</div>

				<Button variant="ghost" size="icon" class="lg:hidden" @click="mobileMenuOpen = !mobileMenuOpen">
					<Menu v-if="!mobileMenuOpen" class="h-6 w-6" />
					<X v-else class="h-6 w-6" />
				</Button>
			</div>
		</div>
	</nav>

	<Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 -translate-y-4" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-4">
		<div v-if="mobileMenuOpen" class="fixed top-24 left-0 right-0 z-40 mx-4 rounded-2xl bg-white p-6 shadow-xl lg:hidden">
			<div class="flex flex-col gap-4">
				<template v-for="(item, i) in menuItems" :key="i">
					<Accordion v-if="item.children" type="single" collapsible>
						<AccordionItem :value="item.label">
							<AccordionTrigger class="text-base font-medium text-gray-700">{{ item.label }}</AccordionTrigger>
							<AccordionContent>
								<div class="flex flex-col gap-2 pl-4">
									<a v-for="(child, j) in item.children" :key="j" :href="child.to || '#'" class="text-sm text-gray-600 hover:text-primary">{{ child.label }}</a>
								</div>
							</AccordionContent>
						</AccordionItem>
					</Accordion>

					<NuxtLink v-else :to="item.to" class="text-base font-medium text-gray-700 transition-colors hover:text-primary" @click="mobileMenuOpen = false">
						{{ item.label }}
					</NuxtLink>
				</template>
			</div>
		</div>
	</Transition>
</template>

<script setup lang="ts">
import { ChevronDown, Menu, X } from "lucide-vue-next";

const isScrolled = ref(false);
const mobileMenuOpen = ref(false);

const handleScroll = () => {
	isScrolled.value = window.scrollY > 50;
};

onMounted(() => {
	window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
	window.removeEventListener("scroll", handleScroll);
});

const menuItems = [
	{ label: "Home", to: "/", external: false },
	{
		label: "Profil",
		external: false,
		children: [
			{ label: "Sejarah", to: "/history", external: false },
			{ label: "Tugas - Fungsi", to: "/function", external: false },
			{ label: "Struktur Organisasi", to: "/organization", external: false },
			{ label: "Profil Direktur", to: "/director", external: false },
		],
	},
	{
		label: "Info",
		external: false,
		children: [
			{ label: "Berita", to: "/news", external: false },
			{ label: "Pengumuman", to: "/announcement", external: false },
			{ label: "Regulasi", to: "https://jdih.kemnaker.go.id/", external: true },
		],
	},
	{
		label: "Tautan",
		external: false,
		children: [
			{ label: "SKKNI", to: "https://skkni.kemnaker.go.id/", external: true },
			{ label: "Proglat", to: "https://proglat.kemnaker.go.id/", external: true },
			{ label: "InaSkill", to: "https://inaskills.kemnaker.go.id/", external: true },
			{ label: "E-Training", to: "https://e-training.kemnaker.go.id/", external: true },
		],
	},
	{ label: "Galeri", to: "/gallery", external: false },
];
</script>
