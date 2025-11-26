<template>
	<div class="bg-white p-6 rounded-xl shadow-sm">
		<h2 class="text-lg font-semibold mb-1">Overview</h2>
		<p class="text-gray-400 text-sm mb-6">Tahun {{ year }}</p>

		<div class="grid grid-cols-4 gap-4">
			<div v-for="item in stats" :key="item.label" class="p-5 rounded-xl text-white" :style="{ background: item.color }">
				<LayoutDashboard />
				<p class="text-2xl font-bold">{{ item.value.toLocaleString() }}</p>
				<p class="text-sm">{{ item.label }}</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { LayoutDashboard } from "lucide-vue-next";

definePageMeta({
	layout: "admin",
	title: "Admin Dashboard",
	middleware: "admin",
});

// Data bisa kamu ganti dari API
const year = new Date().getFullYear();

const stats = [
	{
		label: "Pengajuan Baru",
		value: 0,
		color: "#1ea7fd",
	},
	{
		label: "Pengajuan Proses",
		value: 0,
		color: "#333a56",
	},
	{
		label: "Pengajuan Perbaikan",
		value: 0,
		color: "#feb633",
	},
	{
		label: "Pengajuan Selesai",
		value: 0,
		color: "#2ecc71",
	},
];
</script>
