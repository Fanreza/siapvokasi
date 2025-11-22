<script setup lang="ts">
const emit = defineEmits<{
	(e: "previous"): void;
}>();

const navigateToHistory = () => {
	navigateTo("/user/history");
};
</script>

<template>
	<div class="space-y-6">
		<CommonSuccessPage title="Berhasil Mengajukan Layanan" />

		<div class="flex justify-between pt-8">
			<Button @click="$emit('previous')" variant="secondary" class="px-6">Sebelumnya</Button>

			<Button class="bg-blue-500 text-white px-8 rounded-lg" @click="navigateToHistory">Selesai</Button>
		</div>
	</div>
</template>
