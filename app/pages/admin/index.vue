<template>
	<div class="bg-white p-6 rounded-xl shadow-sm">
		<h2 class="text-lg font-semibold mb-1">Overview</h2>
		<p class="text-gray-400 text-sm mb-6">Tahun {{ year }}</p>

		<div class="grid grid-cols-4 gap-4">
			<div v-for="item in stats" :key="item.label" class="p-5 rounded-xl text-white" :style="{ background: item.color }">
				<LayoutDashboard class="mb-3" />
				<p class="text-2xl font-bold">{{ item.value.toLocaleString() }}</p>
				<p class="text-sm">{{ item.label }}</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { LayoutDashboard } from "lucide-vue-next";
import { getDashboardStats } from "~/services/dashboard.services";

definePageMeta({
	layout: "admin",
	title: "Admin Dashboard",
	middleware: "admin",
});

const year = new Date().getFullYear();

// initial state
const stats = ref([
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
]);

// Fetch dashboard statistics
const fetchDashboardStats = async () => {
	try {
		const response = await getDashboardStats();
		const summary = response.summary;

		// Update card stats
		stats.value = [
			{
				label: "Pengajuan Baru",
				value: summary.new,
				color: "#1ea7fd",
			},
			{
				label: "Pengajuan Proses",
				value: summary.processing,
				color: "#333a56",
			},
			{
				label: "Pengajuan Perbaikan",
				value: summary.fixing,
				color: "#feb633",
			},
			{
				label: "Pengajuan Selesai",
				value: summary.completed,
				color: "#2ecc71",
			},
		];
	} catch (err) {
		console.error("Error loading dashboard stats:", err);
	}
};

onMounted(() => {
	fetchDashboardStats();
});
</script>
