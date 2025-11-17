<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
	<SidebarProvider>
		<AdminAppSidebar />

		<SidebarInset>
			<main class="bg-[#F1F5FF] h-full w-full">
				<AdminAppNavbar>
					<SidebarTrigger />
					<h1 class="text-lg font-semibold text-gray-800">
						{{ route.meta.title }}
					</h1>
				</AdminAppNavbar>

				<div class="p-10">
					<slot />
				</div>
			</main>
		</SidebarInset>
	</SidebarProvider>
</template>
