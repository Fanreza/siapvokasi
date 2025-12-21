<script setup lang="ts">
import { ChevronRight, FilePlus, Home, Box, CheckCircle, RefreshCcw, Users, HelpCircle } from "lucide-vue-next";
import { useAuthStore } from "~/stores/auth";
import { useRoute } from "#app";

const auth = useAuthStore();
const route = useRoute();

const isActive = (path?: string) => {
	if (!path) return false;

	if (path === "/admin") {
		return route.path === "/admin";
	}

	return route.path === path || route.path.startsWith(path + "/");
};

const isGroupActive = (children?: { to: string }[]) => {
	if (!children) return false;
	return children.some((c) => isActive(c.to));
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
];
</script>

<template>
	<Sidebar collapsible="icon" class="border-r border-gray-200 bg-[#FBFCFE]">
		<SidebarHeader class="flex items-center justify-center border-b border-gray-200 py-6 bg-[#FBFCFE]">
			<img src="/images/logo.png" alt="Kemnaker" class="w-40" />
		</SidebarHeader>

		<SidebarContent class="bg-[#FBFCFE]">
			<SidebarGroup>
				<SidebarMenu>
					<template v-for="item in navItems" :key="item.label">
						<template v-if="item.children">
							<Collapsible as-child class="group/collapsible" :default-open="isGroupActive(item.children)">
								<SidebarMenuItem>
									<CollapsibleTrigger as-child>
										<SidebarMenuButton :tooltip="item.label" class="py-6 transition" :class="isGroupActive(item.children) ? 'bg-blue-50 text-primary font-semibold' : 'text-[#888C9F]'">
											<component :is="item.icon" />
											<span>{{ item.label }}</span>
											<ChevronRight class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
										</SidebarMenuButton>
									</CollapsibleTrigger>

									<CollapsibleContent>
										<SidebarMenuSub>
											<SidebarMenuSubItem v-for="subItem in item.children" :key="subItem.label">
												<SidebarMenuSubButton as-child>
													<NuxtLink :to="subItem.to" class="rounded-md px-5 py-6 text-sm font-medium transition" :class="isActive(subItem.to) ? 'bg-blue-100 text-blue-600' : 'text-[#888C9F]! hover:text-blue-600 hover:bg-blue-50'">
														{{ subItem.label }}
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
								<NuxtLink :to="item.to" class="flex items-center gap-2 rounded-md py-6 text-sm font-medium transition" :class="isActive(item.to) ? 'bg-blue-50 text-primary font-semibold' : 'text-[#888C9F]'">
									<component :is="item.icon" class="h-4 w-4" />
									<span>{{ item.label }}</span>
								</NuxtLink>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</template>

					<SidebarMenuItem v-if="auth.isAdmin">
						<SidebarMenuButton as-child>
							<NuxtLink to="/admin/user" class="flex items-center gap-2 rounded-md py-6 text-sm font-medium transition" :class="isActive('/admin/user') ? 'bg-blue-50 text-primary font-semibold' : 'text-[#888C9F]'">
								<Users class="h-4 w-4" />
								<span>User</span>
							</NuxtLink>
						</SidebarMenuButton>
					</SidebarMenuItem>

					<SidebarMenuItem v-if="auth.isAdmin">
						<SidebarMenuButton as-child>
							<NuxtLink to="/admin/faq" class="flex items-center gap-2 rounded-md py-6 text-sm font-medium transition" :class="isActive('/admin/faq') ? 'bg-blue-50 text-primary font-semibold' : 'text-[#888C9F]'">
								<HelpCircle class="h-4 w-4" />
								<span>FAQ</span>
							</NuxtLink>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarGroup>
		</SidebarContent>
	</Sidebar>
</template>
