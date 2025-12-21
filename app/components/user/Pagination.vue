<script setup lang="ts">
import { ChevronRight, ChevronLeft } from "lucide-vue-next";

const props = defineProps<{
	total: number;
	perPage?: number;
	page?: number;
}>();

const emit = defineEmits<{
	(e: "update:page", value: number): void;
}>();

const itemsPerPage = computed(() => props.perPage ?? 10);
const currentPage = computed(() => props.page ?? 1);
const startItem = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1);
const endItem = computed(() => Math.min(currentPage.value * itemsPerPage.value, props.total));

console.log("startItem", startItem.value);
</script>

<template>
	<div class="flex items-center justify-between gap-4">
		<!-- Info Text -->
		<div class="text-sm text-gray-600 w-full">Showing {{ startItem }} to {{ endItem }} of {{ total }} entries</div>

		<!-- Pagination -->
		<Pagination v-slot="{ page }" :total="props.total" :sibling-count="1" :items-per-page="props.perPage ?? 10" :default-page="props.page ?? 1" show-edges @update:page="(val) => emit('update:page', val)" class="justify-end">
			<PaginationContent v-slot="{ items }">
				<PaginationPrevious asChild>
					<Button variant="outline" size="icon">
						<ChevronLeft />
					</Button>
				</PaginationPrevious>

				<template v-for="(item, index) in items" :key="index">
					<PaginationItem
						v-if="item.type === 'page'"
						:value="item.value"
						:is-active="item.value === page"
						class="h-8 w-8 flex items-center justify-center rounded-md text-sm"
						:class="{
							'bg-blue-500 text-white': item.value === page,
							'text-gray-600 hover:bg-gray-100': item.value !== page,
						}"
					>
						{{ item.value }}
					</PaginationItem>
				</template>

				<PaginationNext asChild>
					<Button variant="outline" size="icon">
						<ChevronRight />
					</Button>
				</PaginationNext>
			</PaginationContent>
		</Pagination>
	</div>
</template>
