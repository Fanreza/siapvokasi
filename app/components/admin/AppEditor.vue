<script setup lang="ts">
import StarterKit from "@tiptap/starter-kit";
import { useEditor } from "@tiptap/vue-3";

const editor = useEditor({
	content: "<p>Hello World!</p>",
	extensions: [
		StarterKit,

	],
});
</script>

<template>
	<TiptapProvider :editor="editor">
		<TiptapToolbar />
		<TiptapContent />
		<TiptapStatusBar show-word-count />
	</TiptapProvider>
</template>
