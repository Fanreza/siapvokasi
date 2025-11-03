<!-- components/DocumentItem.vue -->
<template>
	<div class="group flex gap-4 rounded-lg border-l-4 border-[#163E93] bg-gray-50 p-6 transition-shadow hover:shadow-md">
		<div class="shrink-0">
			<div class="flex h-12 w-12 items-center justify-center">
				<Icon name="streamline-plump-color:announcement-megaphone-flat" class="h-12 w-12 text-[#163E93]" />
			</div>
		</div>

		<div class="grow">
			<div class="mb-2 flex items-start justify-between gap-4">
				<h3 class="text-2xl font-bold text-[#163E93]">{{ title }}</h3>
				<span class="shrink-0 text-sm text-gray-500">{{ date }}</span>
			</div>
			<p class="mb-4 text-base text-gray-600">{{ description }}</p>

			<a :href="attachment" download class="inline-flex items-center gap-2 rounded-lg bg-[#163E93] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
				<Download class="h-4 w-4" />
				Download Attachment
			</a>
		</div>
	</div>
</template>

<script setup lang="ts">
import { FileText, Download } from "lucide-vue-next";

defineProps<{
	title: string;
	description: string;
	date: string;
	attachment: string;
}>();
</script>
