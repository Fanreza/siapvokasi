<script setup lang="ts">
import { LogOut } from "lucide-vue-next";
import { useAuthStore } from "@/stores/auth";

const props = defineProps<{
	title?: string;
}>();

const auth = useAuthStore();

const logout = async () => {
	try {
		await auth.logout();
		navigateTo("/admin/login");
	} catch (err) {
		console.error("Logout error:", err);
	}
};
</script>

<template>
	<header class="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
		<!-- Title -->
		<div class="flex items-center gap-3">
			<!-- Slot kiri (misal: trigger + title) -->
			<slot />
		</div>

		<!-- Right Side -->
		<div class="flex items-center gap-4">
			<!-- User Info -->
			<div class="flex items-center gap-3">
				<Avatar class="h-8 w-8">
					<!-- <AvatarImage :src="auth.user?.avatar || '/images/avatar.jpg'" alt="Admin" /> -->
					<AvatarFallback>A</AvatarFallback>
				</Avatar>

				<span class="text-sm font-medium text-gray-800">
					{{ auth.user?.name || "ADMIN" }}
				</span>
			</div>

			<!-- Logout Button -->
			<button @click="logout" class="rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800" title="Logout">
				<LogOut class="h-5 w-5" />
			</button>
		</div>
	</header>
</template>
