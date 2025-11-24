<script setup lang="ts">
definePageMeta({
	middleware: "admin",
	layout: "admin",
});
</script>

<template>
	<AdminListRequest status="PROCESSING" stage="1" />
</template>
