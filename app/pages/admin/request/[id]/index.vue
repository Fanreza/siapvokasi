<template>
	<AdminDetailSKKNI v-if="type === 'SKKNI'" />
	<AdminDetailCLSP v-if="type === 'CLSP'" />
</template>

<script setup lang="ts">
definePageMeta({
	middleware: "admin",
	layout: "admin",
});

const route = useRoute();

const type = route.query.type as string | undefined;
</script>

<style scoped></style>
