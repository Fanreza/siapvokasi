<script setup lang="ts">
import { Loader2 } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { computed } from "vue";

const props = defineProps<{
	loading?: boolean;
	disabled?: boolean;
}>();

// emit click agar tetap bisa digunakan seperti <Button>
const emit = defineEmits<{
	(e: "click", event: MouseEvent): void;
}>();

// disable button kalau sedang loading
const isDisabled = computed(() => props.loading || props.disabled);
</script>

<template>
	<Button :disabled="isDisabled" @click="emit('click', $event)">
		<Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
		<slot v-if="!loading" />
		<span v-else>Please wait</span>
	</Button>
</template>
