<!-- components/Pagination.vue -->
<template>
	<div class="mt-8 flex items-center justify-center gap-2">
		<!-- Previous Button -->
		<button v-if="currentPage !== 1" @click="goToPage(currentPage - 1)" class="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50" aria-label="Previous page">
			<ChevronLeft class="h-5 w-5" />
		</button>

		<!-- Page Numbers -->
		<template v-for="page in visiblePages" :key="page">
			<button v-if="page !== '...'" @click="goToPage(page as number)" :class="['flex h-10 w-10 items-center justify-center rounded-full transition-colors', currentPage === page ? 'bg-primary text-white hover:bg-primary-dark' : 'border border-gray-300 text-gray-700 hover:bg-gray-50']">
				{{ page }}
			</button>
			<span v-else class="flex h-10 w-10 items-center justify-center text-gray-400"> ... </span>
		</template>

		<!-- Next Button -->
		<button v-if="currentPage !== totalPages" @click="goToPage(currentPage + 1)" class="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50" aria-label="Next page">
			<ChevronRight class="h-5 w-5" />
		</button>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";

const props = defineProps<{
	currentPage: number;
	totalPages: number;
	maxVisible?: number;
}>();

const emit = defineEmits<{
	"update:currentPage": [page: number];
}>();

const maxVisible = props.maxVisible || 5;

const visiblePages = computed(() => {
	const pages: (number | string)[] = [];

	if (props.totalPages <= maxVisible) {
		// Show all pages if total is less than max
		for (let i = 1; i <= props.totalPages; i++) {
			pages.push(i);
		}
	} else {
		// Always show first page
		pages.push(1);

		const start = Math.max(2, props.currentPage - 1);
		const end = Math.min(props.totalPages - 1, props.currentPage + 1);

		// Add ellipsis after first page if needed
		if (start > 2) {
			pages.push("...");
		}

		// Add middle pages
		for (let i = start; i <= end; i++) {
			pages.push(i);
		}

		// Add ellipsis before last page if needed
		if (end < props.totalPages - 1) {
			pages.push("...");
		}

		// Always show last page
		pages.push(props.totalPages);
	}

	return pages;
});

const goToPage = (page: number) => {
	if (page >= 1 && page <= props.totalPages) {
		emit("update:currentPage", page);
	}
};
</script>
