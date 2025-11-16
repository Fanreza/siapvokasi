<template>
	<NuxtLink :to="to" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all border hover:bg-blue-50 bg-white border-gray-100 shadow-sm" activeClass=" font-bold bg-blue-500! text-white!" exactActiveClass="   bg-blue-500! text-white!">
		<Icon :name="`lucide:${icon}`" class="w-5 h-5" />
		<span class="font-medium text-sm">{{ label }}</span>
	</NuxtLink>
</template>

<script setup>
import { useRoute } from "vue-router";

const props = defineProps({
	to: String,
	label: String,
	icon: String,
});

const route = useRoute();
const isActive = computed(() => route.path === props.to);
</script>
