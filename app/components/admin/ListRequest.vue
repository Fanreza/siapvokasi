<script setup lang="ts">
import type { RequestStatusType } from "~/enum/requestStatus.enum";
import getClassStatus from "~/helper/getClassStatus";
import getTranslateStatus from "~/helper/getTranslateStatus";
import { getApplications } from "~/services/application.services";

const props = defineProps<{
	status: RequestStatusType;
	stage?: "1" | "2" | "3" | "4";
}>();

const page = ref(1);
const perPage = ref(10);
const search = ref("");
const loading = ref(false);

const data = ref<any[]>([]);
const totalItems = ref(0);

const stageParams = props.stage ? `stage:${props.stage}` : undefined;

const params = computed(() => ({
	page: page.value,
	limit: perPage.value,
	search: search.value || undefined,
	filter: `status:${props.status.toUpperCase()}${stageParams ? `&${stageParams}` : ""}`,
}));

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

watch(params, fetchData);

onMounted(fetchData);

const onNavigateDetail = (item: any) => {
	navigateTo(`/admin/request/${item.id}`);
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
				<!-- Loading -->
				<TableRow v-if="loading">
					<TableCell colspan="6" class="text-center py-10 text-gray-400"> Mengambil data... </TableCell>
				</TableRow>

				<!-- Empty State -->
				<TableRow v-if="!loading && data.length === 0">
					<TableCell colspan="6" class="text-center py-10 text-gray-400">
						<div class="flex flex-col items-center justify-center gap-2">
							<div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
								<Icon name="lucide:inbox" class="w-6 h-6 text-gray-400" />
							</div>
							<p class="text-sm text-gray-500">Tidak ada data ditemukan</p>
						</div>
					</TableCell>
				</TableRow>

				<!-- Data Rows -->
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
						<span :class="getClassStatus(item.status)" class="px-2 py-1 rounded-full text-xs font-medium">
							{{ getTranslateStatus(item.status) }}
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
