<template>
	<div class="relative w-full">
		<!-- Icon Search -->
		<Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
		<Input v-model="query" :placeholder="placeholder" class="pl-9" @input="onInput" />
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useDebounceFn } from "@vueuse/core";
import { Search } from "lucide-vue-next";

const props = defineProps<{
	modelValue?: string;
	delay?: number;
	placeholder?: string;
}>();

const emit = defineEmits(["update:modelValue", "search"]);

const query = ref(props.modelValue || "");

const debouncedEmit = useDebounceFn(() => {
	emit("update:modelValue", query.value);
	emit("search", query.value);
}, props.delay ?? 500);

const onInput = () => {
	debouncedEmit();
};

watch(
	() => props.modelValue,
	(val) => {
		if (val !== query.value) query.value = val ?? "";
	}
);
</script>
