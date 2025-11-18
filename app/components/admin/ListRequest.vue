<script setup lang="ts">
const props = defineProps<{
	status: "new" | "fixing" | "completed" | "fixed" | "rejected";
	stage?: "1" | "2" | "3" | "4";
}>();

import { ref, computed, watch, onMounted } from "vue";
import { getApplications } from "~/services/application.services";

// STATE
const page = ref(1);
const perPage = ref(10);
const search = ref("");
const loading = ref(false);

const data = ref<any[]>([]);
const totalItems = ref(0);

// PARAMS (page, limit, search)
const stageParams = props.stage;

const params = computed(() => ({
	page: page.value,
	limit: perPage.value,
	search: search.value || undefined, // kalau empty jangan dikirim
	filter: `status:${props.status.toUpperCase()}`,
}));

// FETCH API
const fetchData = async () => {
	try {
		loading.value = true;

		const res = await getApplications(params.value);

		data.value = res.data;
		totalItems.value = res.meta.totalItems;
	} catch (err) {
		console.error(err);
	} finally {
		loading.value = false;
	}
};

// AUTO RELOAD KETIKA PARAMS BERUBAH
watch(params, fetchData);

// FIRST LOAD
onMounted(fetchData);

// Navigate ke detail
const onNavigateDetail = (item: any) => {
	navigateTo(`/admin/request/${item.id}`);
};

// utils/statusWarna.ts

const colorStatus: Record<string, string> = {
	BARU: "bg-blue-100 text-blue-700",
	SEDANG_DIPROSES: "bg-blue-100 text-blue-700",
	PERBAIKAN: "bg-yellow-100 text-yellow-700",
	SUDAH_DIPERBAIKI: "bg-yellow-100 text-yellow-700",
	DITOLAK: "bg-red-100 text-red-700",
	SELESAI: "bg-green-200 text-green-800",
};

const getColorStatus = (status: string) => {
	if (!status) return "bg-gray-100 text-gray-600";
	return colorStatus[status] || "bg-gray-100 text-gray-600";
};

const translateStatus = (status: string): string => {
	const map: Record<string, string> = {
		NEW: "BARU",
		PROCESSING: "SEDANG_DIPROSES",
		FIXING: "PERBAIKAN",
		FIXED: "SUDAH_DIPERBAIKI",
		COMPLETED: "SELESAI",
		REJECTED: "DITOLAK",
	};

	return map[status] ?? status;
};
</script>

<template>
	<div class="space-y-6 bg-white p-10 rounded">
		<!-- HEADER -->
		<div class="flex justify-between items-center">
			<div>
				<h2 class="text-xl font-semibold">Histori Pengajuan</h2>
				<p class="text-gray-400 text-sm">Ada sekitar {{ totalItems }} pengajuan</p>
			</div>

			<div class="flex items-center gap-2">
				<p>Cari</p>
				<CommonDebouncedSearch v-model="search" :debounce="300" placeholder="Cari layanan..." />
			</div>
		</div>

		<!-- TABLE -->
		<Table class="[&_th]:border-none [&_td]:border-none [&_tr]:border-none">
			<TableHeader class="bg-[#F3F6F9]">
				<TableRow>
					<TableHead>KODE BERKAS</TableHead>
					<TableHead>NOMOR SURAT</TableHead>
					<TableHead>INFORMASI LAYANAN</TableHead>
					<TableHead>Pengusul</TableHead>
					<TableHead>STATUS</TableHead>
					<TableHead>AKSI</TableHead>
				</TableRow>
			</TableHeader>

			<TableBody>
				<TableRow v-if="loading">
					<TableCell colspan="5" class="text-center py-10 text-gray-400"> Mengambil data... </TableCell>
				</TableRow>

				<TableRow v-for="item in data" :key="item.id">
					<TableCell>{{ item.code }}</TableCell>
					<TableCell>{{ item.applicationNumber }}</TableCell>

					<TableCell>
						<div class="font-medium">{{ item.applicationName }}</div>
						<div class="text-xs text-gray-400">
							{{ new Date(item.applicationDate).toLocaleDateString("id-ID") }}
						</div>
					</TableCell>

					<TableCell>
						{{ item.applicantName || "-" }}
					</TableCell>

					<TableCell>
						<span :class="getColorStatus(translateStatus(item.status))" class="px-2 py-1 rounded-full text-xs font-medium">
							{{ translateStatus(item.status).replaceAll("_", " ") }}
						</span>
					</TableCell>

					<TableCell>
						<Button size="sm" variant="secondary" @click="onNavigateDetail(item)"> Lihat </Button>
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>

		<!-- PAGINATION -->
		<UserPagination :page="page" :total="totalItems" :perPage="perPage" @updatePage="page = $event" />
	</div>
</template>
