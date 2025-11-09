<script setup lang="ts">
definePageMeta({
	layout: "admin",
	middleware: "admin",
	title: "Galeri",
});

const isEditing = ref(false);

const onEdit = () => {
	isEditing.value = !isEditing.value;
};
</script>

<template>
	<div class="flex-1 space-y-6 p-6">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-semibold text-gray-900">Daftar Galeri</h1>
			</div>

			<!-- Cancel -->
			<div class="flex items-center gap-2">
				<Button v-if="isEditing" @click="onEdit" variant="outline"> Batal </Button>

				<Button @click="onEdit" class="bg-blue-900 hover:bg-blue-800 text-white font-medium px-6">
					{{ isEditing ? "Simpan" : "Edit" }}
				</Button>
			</div>
		</div>
	</div>
</template>
