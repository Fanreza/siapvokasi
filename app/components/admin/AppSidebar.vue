<script setup lang="ts">
import { ref } from "vue";
import { ChevronRight, FilePlus, Home, Box, CheckCircle, RefreshCcw, Users } from "lucide-vue-next";

const route = useRoute();
const openDropdown = ref<string | null>(null);

const toggleDropdown = (label: string) => {
	openDropdown.value = openDropdown.value === label ? null : label;
};

const navItems = [
	{ label: "Dashboard", to: "/admin", icon: Home },

	{
		label: "Pengajuan Baru",
		icon: FilePlus,
		children: [
			{ label: "Permohonan Baru", to: "/admin/request/new" },
			{ label: "Verifikasi Berkas", to: "/admin/request/verification" },
		],
	},

	{
		label: "Pengajuan Proses",
		icon: Box,
		children: [
			{ label: "Tahap 1", to: "/admin/request/stage/tahap-1" },
			{ label: "Tahap 2", to: "/admin/request/stage/tahap-2" },
			{ label: "Tahap 3", to: "/admin/request/stage/tahap-3" },
			{ label: "Tahap 4", to: "/admin/request/stage/tahap-4" },
		],
	},

	{
		label: "Pengajuan Perbaikan",
		icon: RefreshCcw,
		children: [
			{ label: "Perbaikan", to: "/admin/request/fixing" },
			{ label: "Diperbaiki", to: "/admin/request/fixed" },
		],
	},

	{ label: "Pengajuan Selesai", to: "/admin/request/done", icon: CheckCircle },

	{ label: "Pengajuan Ditolak", to: "/admin/request/rejected", icon: CheckCircle },

	{
		label: "User",
		icon: Users,
		children: [
			{ label: "Data User", to: "/admin/user" },
			{ label: "Data Role", to: "/admin/role" },
		],
	},
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
										<SidebarMenuButton :tooltip="item.label" class="text-[#888C9F] py-6">
											<component :is="item.icon" v-if="item.icon" />
											<span>{{ item.label }}</span>
											<ChevronRight class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
										</SidebarMenuButton>
									</CollapsibleTrigger>
									<CollapsibleContent>
										<SidebarMenuSub>
											<SidebarMenuSubItem v-for="subItem in item.children" :key="subItem.label">
												<SidebarMenuSubButton as-child>
													<NuxtLink :to="subItem.to" class="rounded-md px-5 py-6 text-sm font-medium text-[#888C9F]!">
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
								<NuxtLink :to="item.to" class="flex items-center gap-2 rounded-md py-6 text-sm font-medium text-[#888C9F]">
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
