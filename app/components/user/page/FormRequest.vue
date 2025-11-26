<script setup lang="ts">
import type { ServiceItem } from "~/models/services.model";

const props = defineProps<{
	selectedService: { label: string; value: string };
}>();

const emit = defineEmits<{
	(e: "previous"): void;
	(e: "submit", payload: any): void;
	(e: "next"): void;
}>();

// serviceId dari string → number
const serviceId = computed(() => Number(props.selectedService.value));
const serviceName = computed(() => String(props.selectedService.label));

const onSubmit = (payload: any) => {
	emit("submit", payload);
	emit("next");
};
</script>

<template>
	<div>
		<!-- SKKNI -->
		<UserPageFormSKKNI v-if="serviceId" @previous="$emit('previous')" @next="$emit('next')" @submit="onSubmit" :service-id="serviceId" :service-name="serviceName" />

		<!-- SKKNK -->
		<!-- <UserPageFormSKKNK v-else-if="formType === 'skknk'" @previous="$emit('previous')" @submit="onSubmit" /> -->

		<!-- CLSP -->
		<!-- <UserPageFormCLSP v-else-if="formType === 'clsp'" @previous="$emit('previous')" @submit="onSubmit" /> -->

		<!-- Default -->
		<div v-else class="p-6 text-center text-gray-500">Silakan pilih layanan terlebih dahulu.</div>
	</div>
</template>
