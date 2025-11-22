<script setup lang="ts">
definePageMeta({
	middleware: "admin",
	layout: "admin",
});
</script>

<template>
	<AdminListRequest status="NEW_DOCUMENTS" />
</template>
