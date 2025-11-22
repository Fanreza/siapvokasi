<script setup lang="ts">
definePageMeta({
	middleware: "admin",
	layout: "admin",
});
</script>

<template>
	<AdminListRequest status="processing" stage="2" />
</template>
