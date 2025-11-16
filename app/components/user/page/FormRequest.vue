<script setup lang="ts">
const props = defineProps({
	selectedService: { type: String, default: "" },
});

const emit = defineEmits<{
	(e: "previous"): void;
	(e: "submit", payload: any): void;
	(e: "next"): void;
}>();

// terpanggil oleh child ketika user submit
const onSubmit = (payload: any) => {
	emit("submit", payload);
	emit("next");
};
</script>

<template>
	<div>
		<!-- jika layanan 1 dipilih -->
		<UserPageFormSKKNI v-if="props.selectedService === 'skkni'" @previous="$emit('previous')" @submit="onSubmit" />

		<!-- layanan 2 -->
		<UserPageFormCLSP v-else-if="props.selectedService === 'clsp'" @previous="$emit('previous')" @submit="onSubmit" />

		<!-- default / belum pilih -->
		<div v-else class="p-6 text-center text-gray-500">Silakan pilih layanan terlebih dahulu.</div>
	</div>
</template>
