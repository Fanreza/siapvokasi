<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const props = defineProps<{
	total: number;
	perPage?: number;
	page?: number;
}>();

const emit = defineEmits<{
	(e: "update:page", value: number): void;
}>();
</script>

<template>
	<div class="flex items-center justify-center border-t border-gray-100 pt-6">
		<Pagination v-slot="{ page }" :total="props.total" :sibling-count="1" :items-per-page="props.perPage ?? 10" :default-page="props.page ?? 1" show-edges @update:page="(val) => emit('update:page', val)">
			<PaginationContent v-slot="{ items }" class="w-full">
				<PaginationPrevious asChild>
					<Button variant="outline" class="mr-auto">Sebelumnya</Button>
				</PaginationPrevious>

				<template v-for="(item, index) in items" :key="index">
					<PaginationItem v-if="item.type === 'page'" :value="item.value" :is-active="item.value === page">
						{{ item.value }}
					</PaginationItem>

					<PaginationEllipsis v-else :key="item.type" :index="index" />
				</template>

				<PaginationNext asChild>
					<Button variant="outline" class="ml-auto">Selanjutnya</Button>
				</PaginationNext>
			</PaginationContent>
		</Pagination>
	</div>
</template>
