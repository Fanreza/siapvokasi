<script setup lang="ts">
definePageMeta({
	layout: "user",
});

const page = ref(1);
const perPage = 10;

const allData = ref([
	{
		id: "BBDA6B10-75FB",
		layanan: "CLSP",
		tanggal: "Tgl. 2022-12-06 23:04:25.000",
		statusBerkas: "Baru",
		status: "Proses",
	},
	{
		id: "BBDA6B10-75FB",
		layanan: "Rekomendasi Izin Menduduki Jabatan",
		tanggal: "Tgl. 2022-12-06 23:04:25.000",
		statusBerkas: "Perbaikan Ke 1",
		status: "Ditolak",
	},
	{
		id: "BBDA6B10-1111",
		layanan: "Akreditasi Pelatihan",
		tanggal: "Tgl. 2022-12-06 23:04:25.000",
		statusBerkas: "Baru",
		status: "Selesai",
	},
]);

const total = computed(() => allData.value.length);

const search = ref("");

const filteredData = computed(() => {
	return allData.value.filter((item) => item.layanan.toLowerCase().includes(search.value.toLowerCase()));
});

const paginatedData = computed(() => {
	const start = (page.value - 1) * perPage;
	return filteredData.value.slice(start, start + perPage);
});

const handlePageChange = (newPage: number) => {
	page.value = newPage;
};

const statusColor = (status: string) => {
	const s = status.toLowerCase();

	if (s.includes("baru")) return "text-blue-500";
	if (s.includes("diproses")) return "text-blue-500";
	if (s.includes("proses")) return "text-blue-500"; // jika kamu pakai “Proses”
	if (s.includes("perbaikan")) return "text-yellow-500";
	if (s.includes("diperbaiki")) return "text-yellow-500";
	if (s.includes("ditolak")) return "text-red-500";
	if (s.includes("selesai")) return "text-green-500";

	return "text-gray-500";
};

const drawerRef = ref();
</script>

<template>
	<div class="space-y-6 bg-white p-10 rounded">
		<div class="flex justify-between items-center">
			<!-- TITLE -->
			<div>
				<h2 class="text-xl font-semibold">Histori Pengajuan</h2>
				<p class="text-gray-400 text-sm">Ada sekitar {{ total }} pengajuan</p>
			</div>

			<!-- SEARCH -->
			<div class="flex justify-end items-center gap-2">
				<p>Cari</p>
				<Input v-model="search" placeholder="Cari layanan" class="w-80" />
			</div>
		</div>

		<!-- TABLE -->
		<Table class="[&_th]:border-none [&_td]:border-none [&_tr]:border-none">
			<TableHeader class="bg-[#F3F6F9]">
				<TableRow>
					<TableHead>ID BERKAS</TableHead>
					<TableHead>INFORMASI LAYANAN</TableHead>
					<TableHead>STATUS BERKAS</TableHead>
					<TableHead>STATUS</TableHead>
					<TableHead>AKSI</TableHead>
				</TableRow>
			</TableHeader>

			<TableBody>
				<TableRow v-for="item in paginatedData" :key="item.id">
					<TableCell>{{ item.id }}</TableCell>

					<TableCell>
						<div class="font-medium">{{ item.layanan }}</div>
						<div class="text-xs text-gray-400">{{ item.tanggal }}</div>
					</TableCell>

					<TableCell>
						<span :class="statusColor(item.statusBerkas)">
							{{ item.statusBerkas }}
						</span>
					</TableCell>

					<TableCell>
						<span :class="statusColor(item.status)">
							{{ item.status }}
						</span>
					</TableCell>

					<TableCell>
						<Button size="sm" variant="secondary" @click="drawerRef.openSheet(item)">Lihat</Button>
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>

		<!-- PAGINATION -->
		<UserPagination :page="page" :total="filteredData.length" :perPage="perPage" @updatePage="handlePageChange" />

		<CommonDrawerTracking ref="drawerRef" />
	</div>
</template>
