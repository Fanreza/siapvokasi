<script setup lang="ts">
const props = defineProps({
	selectedService: { type: String, default: "" }, // example: "1", "2", "3"
});

const emit = defineEmits<{
	(e: "previous"): void;
	(e: "submit", payload: any): void;
	(e: "next"): void;
}>();

// serviceId dari string → number
const serviceId = computed(() => Number(props.selectedService));

// Mapping ID → form
const FORM_MAP: Record<number, string> = {
	1: "skkni",
	2: "skknk",
	3: "clsp",
};

const formType = computed(() => FORM_MAP[serviceId.value] || null);

const onSubmit = (payload: any) => {
	emit("submit", payload);
	emit("next");
};
</script>

<template>
	<div>
		<!-- SKKNI -->
		<UserPageFormSKKNI v-if="formType === 'skkni'" @previous="$emit('previous')" @submit="onSubmit" :service-id="serviceId" />

		<!-- SKKNK -->
		<!-- <UserPageFormSKKNK v-else-if="formType === 'skknk'" @previous="$emit('previous')" @submit="onSubmit" /> -->

		<!-- CLSP -->
		<UserPageFormCLSP v-else-if="formType === 'clsp'" @previous="$emit('previous')" @submit="onSubmit" />

		<!-- Default -->
		<div v-else class="p-6 text-center text-gray-500">Silakan pilih layanan terlebih dahulu.</div>
	</div>
</template>
