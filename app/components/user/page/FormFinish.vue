<script setup lang="ts">
const emit = defineEmits<{
	(e: "previous"): void;
}>();
</script>

<template>
	<div class="space-y-6">
		<p class="text-center text-gray-600 text-sm mb-8">Pengajuan layanan telah berhasil dikirim.</p>

		<div class="flex justify-between pt-8">
			<Button @click="$emit('previous')" class="bg-blue-500 text-white px-8 rounded-lg">Sebelumnya</Button>
			<Button class="bg-blue-500 text-white px-8 rounded-lg">Selesai</Button>
		</div>
	</div>
</template>
