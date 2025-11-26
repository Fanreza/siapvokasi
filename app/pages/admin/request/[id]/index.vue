<template>
	<AdminDetailSKKNI v-if="type === 'SKKNI'" />
	<AdminDetailCLSP v-if="type === 'CLSP'" />
	<AdminDetailSKKK v-if="type === 'SKKK/SKKI'" />
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
