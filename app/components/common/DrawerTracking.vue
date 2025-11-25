<script setup lang="ts">
import { ref } from "vue";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const emit = defineEmits<{
	(event: "update:data"): void;
}>();

const open = ref(false);
const selectedId = ref<number | null>(null);
const selectedType = ref<string>("");

// METHOD DIPANGGIL DARI LIST
const openSheet = (item: any) => {
	open.value = true;

	console.log(item);

	selectedId.value = Number(item.id);

	selectedType.value = item.service.name;
};

defineExpose({ openSheet });

const onSheetClose = () => {
	open.value = false;
	selectedId.value = null;
	selectedType.value = "";

	emit("update:data");
};
</script>

<template>
	<Sheet v-model:open="open">
		<SheetContent side="right" class="w-full sm:max-w-5xl h-full overflow-y-auto p-0">
			<UserDetailSKKNI v-if="selectedId && selectedType === 'SKKNI'" :application-id="selectedId" @close="onSheetClose" />

			<UserDetailCLSP v-else-if="selectedId && selectedType === 'CLSP'" :application-id="selectedId" @close="onSheetClose" />
		</SheetContent>
	</Sheet>
</template>
