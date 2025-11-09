<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
	<SidebarProvider>
		<AdminAppSidebar />

		<SidebarInset>
			<main>
				<AdminAppNavbar>
					<SidebarTrigger />
					<h1 class="text-lg font-semibold text-gray-800">
						{{ route.meta.title }}
					</h1>
				</AdminAppNavbar>

				<slot />
			</main>
		</SidebarInset>
	</SidebarProvider>
</template>
