<script setup lang="ts">
defineProps<{
	services: { label: string; value: string }[];
	selected?: { label: string; value: string };
}>();

const emit = defineEmits<{
	(e: "update:selected", val: string): void;
	(e: "next"): void;
}>();

const onChange = (val: any) => {
	emit("update:selected", val);
};
</script>

<template>
	<div class="space-y-6">
		<p class="text-center text-gray-600 text-sm mb-8">Pilih layanan, lengkapi seluruh form, dan juga berkas anda agar dapat segera menindaklanjuti pengajuan anda.</p>

		<div class="flex items-center justify-center gap-x-10">
			<label class="text-sm font-medium text-gray-700 w-32">Pilih Layanan</label>

			<Select :model-value="selected" @update:model-value="onChange" class="w-[60%]">
				<SelectTrigger class="w-full bg-gray-50 border-gray-200">
					<SelectValue placeholder="Pilih Layanan" />
				</SelectTrigger>

				<SelectContent>
					<SelectItem v-for="s in services" :key="s.value" :value="s">{{ s.label }}</SelectItem>
				</SelectContent>
			</Select>
		</div>

		<div class="flex justify-end pt-8">
			<Button @click="$emit('next')" :disabled="!selected" class="bg-blue-500 hover:bg-blue-600 text-white px-8 rounded-lg">Selanjutnya</Button>
		</div>
	</div>
</template>
