<template>
	<!-- Navbar -->
	<nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-300" :class="isScrolled ? 'py-2' : 'py-4'">
		<div class="container mx-auto px-4">
			<div class="flex items-center justify-between rounded-3xl bg-white px-5 lg:px-20 py-4 shadow-lg transition-all duration-300" :class="isScrolled ? 'shadow-xl' : 'shadow-lg'">
				<!-- Logo -->
				<div class="flex items-center gap-3">
					<img src="/images/logo.png" alt="Logo Kementerian Ketenagakerjaan" class="w-36" />
				</div>

				<!-- Desktop Menu -->
				<div class="hidden items-center gap-8 lg:flex">
					<template v-for="(item, i) in menuItems" :key="i">
						<!-- Dropdown -->
						<DropdownMenu v-if="item.children">
							<DropdownMenuTrigger class="flex items-center gap-1 text-sm font-medium text-gray-700 transition-colors hover:text-primary">
								{{ item.label }}
								<ChevronDown class="h-4 w-4" />
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<NuxtLink v-for="(child, j) in item.children" :key="j" :to="child.to || '#'" class="cursor-pointer" :target="child.external ? '_blank' : '_self'">
									<DropdownMenuItem class="cursor-pointer">
										{{ child.label }}
									</DropdownMenuItem>
								</NuxtLink>
							</DropdownMenuContent>
						</DropdownMenu>

						<!-- Single link -->
						<NuxtLink v-else :to="item.to" :target="item.external ? '_blank' : '_self'" class="text-sm font-medium text-gray-700 transition-colors hover:text-primary">
							{{ item.label }}
						</NuxtLink>
					</template>
				</div>

				<!-- Mobile Toggle -->
				<Button variant="ghost" size="icon" class="lg:hidden" @click="mobileMenuOpen = !mobileMenuOpen">
					<Menu v-if="!mobileMenuOpen" class="h-6 w-6" />
					<X v-else class="h-6 w-6" />
				</Button>
			</div>
		</div>
	</nav>

	<!-- Mobile Menu -->
	<Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 -translate-y-4" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-4">
		<div v-if="mobileMenuOpen" class="fixed top-24 left-0 right-0 z-40 mx-4 rounded-2xl bg-white p-6 shadow-xl lg:hidden">
			<div class="flex flex-col gap-4">
				<template v-for="(item, i) in menuItems" :key="i">
					<!-- Dropdown Accordion -->
					<Accordion v-if="item.children" type="single" collapsible>
						<AccordionItem :value="item.label">
							<AccordionTrigger class="text-base font-medium text-gray-700">{{ item.label }}</AccordionTrigger>
							<AccordionContent>
								<div class="flex flex-col gap-2 pl-4">
									<a v-for="(child, j) in item.children" :key="j" :href="child.to || '#'" class="text-sm text-gray-600 hover:text-primary" target="_blank">
										{{ child.label }}
									</a>
								</div>
							</AccordionContent>
						</AccordionItem>
					</Accordion>

					<!-- Single link -->
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
import { useServicesService } from "@/services/service.services";
import { onMounted, ref } from "vue";

const isScrolled = ref(false);
const mobileMenuOpen = ref(false);

// 🔹 Scroll effect
const handleScroll = () => {
	isScrolled.value = window.scrollY > 50;
};

onMounted(() => {
	window.addEventListener("scroll", handleScroll);
	fetchServices();
});

onUnmounted(() => {
	window.removeEventListener("scroll", handleScroll);
});

// 🔹 Ambil data services (untuk bagian "Tautan")
const { getAll, response, loading, error } = useServicesService();
const services = ref<any[]>([]);

const fetchServices = async () => {
	try {
		const res = await getAll(true); // public
		services.value = (res.data as any[]) || ([] as any[]);
	} catch (err) {
		console.error("Gagal memuat services:", err);
	}
};

// 🔹 Menu utama
const menuItems = computed(() => [
	{ label: "Home", to: "/", external: false },
	{
		label: "Profil",
		children: [
			{ label: "Sejarah", to: "/history" },
			{ label: "Tugas - Fungsi", to: "/function" },
			{ label: "Struktur Organisasi", to: "/organization" },
			{ label: "Profil Direktur", to: "/director" },
		],
	},
	{
		label: "Info",
		children: [
			{ label: "Berita", to: "/news" },
			{ label: "Pengumuman", to: "/announcement" },
			{ label: "Regulasi", to: "https://jdih.kemnaker.go.id/", external: true },
		],
	},
	{
		label: "Tautan",
		children: services.value.map((s: any) => ({
			label: s.title,
			to: s.link || "#",
			external: true,
		})),
	},
	{ label: "Galeri", to: "/gallery" },
]);
</script>
