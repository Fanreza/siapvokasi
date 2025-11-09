<script setup lang="ts">
import { ref } from "vue";
import { BarChart3, Newspaper, Megaphone, Images, UserRound, Link2, Share2, ChevronDown, ChevronRight, List, Tag, Layers } from "lucide-vue-next";

const route = useRoute();
const openDropdown = ref<string | null>(null);

const toggleDropdown = (label: string) => {
	openDropdown.value = openDropdown.value === label ? null : label;
};

const navItems = [
	{ label: "Informasi Umum", to: "/admin", icon: BarChart3 },
	{
		label: "Berita",
		icon: Newspaper,
		children: [
			{ label: "List Berita", to: "/admin/news" },
			{ label: "Kategori", to: "/admin/news/categories" },
			// { label: "Tag", to: "/admin/news/tags" },
		],
	},
	{ label: "Pengumuman", to: "/admin/announcement", icon: Megaphone },
	{ label: "Galeri", to: "/admin/gallery", icon: Images },
	{ label: "Profil", to: "/admin/profile", icon: UserRound },
	{ label: "Tautan", to: "/admin/links", icon: Link2 },
	{ label: "Sosial Media", to: "/admin/social", icon: Share2 },
];
</script>

<template>
	<Sidebar collapsible="icon" class="border-r border-gray-200 bg-[#FBFCFE]">
		<!-- Header -->
		<SidebarHeader class="flex items-center justify-center border-b border-gray-200 py-6 bg-[#FBFCFE]">
			<img src="/images/logo.png" alt="Kemnaker" class="w-40" />
		</SidebarHeader>

		<!-- Content -->
		<SidebarContent class="bg-[#FBFCFE]">
			<SidebarGroup>
				<SidebarMenu>
					<template v-for="item in navItems" :key="item.label">
						<template v-if="item.children">
							<Collapsible :key="item.label" as-child class="group/collapsible">
								<SidebarMenuItem>
									<CollapsibleTrigger as-child>
										<SidebarMenuButton :tooltip="item.label">
											<component :is="item.icon" v-if="item.icon" />
											<span>{{ item.label }}</span>
											<ChevronRight class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
										</SidebarMenuButton>
									</CollapsibleTrigger>
									<CollapsibleContent>
										<SidebarMenuSub>
											<SidebarMenuSubItem v-for="subItem in item.children" :key="subItem.label">
												<SidebarMenuSubButton as-child>
													<NuxtLink :to="subItem.to">
														<span>{{ subItem.label }}</span>
													</NuxtLink>
												</SidebarMenuSubButton>
											</SidebarMenuSubItem>
										</SidebarMenuSub>
									</CollapsibleContent>
								</SidebarMenuItem>
							</Collapsible>
						</template>

						<SidebarMenuItem v-else>
							<SidebarMenuButton as-child>
								<NuxtLink class="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors" :to="item.to" :class="[route.path === item.to ? 'bg-blue-50 text-blue-900' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-800']">
									<component :is="item.icon" class="h-4 w-4" />
									<span>{{ item.label }}</span>
								</NuxtLink>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</template>
				</SidebarMenu>
			</SidebarGroup>
		</SidebarContent>
	</Sidebar>
</template>
