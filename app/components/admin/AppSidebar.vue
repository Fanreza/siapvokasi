<script setup lang="ts">
import { BarChart3, Newspaper, Megaphone, Images, UserRound, Link2, Share2 } from "lucide-vue-next";

const route = useRoute();

const navItems = [
	{ label: "Informasi Umum", to: "/admin", icon: BarChart3 },
	{ label: "Berita", to: "/admin/news", icon: Newspaper },
	{ label: "Pengumuman", to: "/admin/announcement", icon: Megaphone },
	{ label: "Galeri", to: "/admin/gallery", icon: Images },
	{ label: "Profil", to: "/admin/profile", icon: UserRound },
	{ label: "Tautan", to: "/admin/links", icon: Link2 },
	{ label: "Sosial Media", to: "/admin/social", icon: Share2 },
];
</script>

<template>
	<Sidebar collapsible="icon" class="bg-red-500! border-r border-gray-200">
		<!-- Header -->
		<SidebarHeader class="bg-[#FBFCFE] flex items-center justify-center py-6">
			<img src="/images/logo.png" alt="Kemnaker" class="w-40" />
		</SidebarHeader>

		<!-- Content -->
		<SidebarContent class="bg-[#FBFCFE]">
			<SidebarGroup>
				<SidebarMenu>
					<SidebarMenuItem v-for="item in navItems" :key="item.label">
						<SidebarMenuButton as-child>
							<NuxtLink class="transition-colors" :to="item.to" :class="[route.path === item.to ? 'bg-blue-50 text-blue-900' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-800']">
								<component :is="item.icon" />
								<span>{{ item.label }}</span>
							</NuxtLink>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarGroup>
		</SidebarContent>
	</Sidebar>
</template>
