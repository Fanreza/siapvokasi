<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from "vue";
import StarterKit from "@tiptap/starter-kit";
import { useEditor } from "@tiptap/vue-3";

const props = defineProps<{
	modelValue: string;
}>();

const emit = defineEmits<{
	(e: "update:modelValue", value: string): void;
}>();

// 🧩 Buat instance editor
const editor = useEditor({
	content: props.modelValue,
	extensions: [StarterKit],
	onUpdate: ({ editor }) => {
		emit("update:modelValue", editor.getHTML());
	},
});

// 🧠 Sinkron ke editor kalau parent update modelValue
watch(
	() => props.modelValue,
	(newVal) => {
		if (!editor.value) return;
		const current = editor.value.getHTML();
		if (newVal !== current) editor.value.commands.setContent(newVal);
	}
);

// 💥 Cleanup
onBeforeUnmount(() => editor.value?.destroy());
</script>

<template>
	<!-- Pastikan TiptapProvider & Toolbar kamu terhubung ke editor -->
	<TiptapProvider :editor="editor" class="tiptap">
		<TiptapToolbar />
		<TiptapContent class="border rounded-md p-3 min-h-[200px]" />
		<TiptapStatusBar show-word-count />
	</TiptapProvider>
</template>
