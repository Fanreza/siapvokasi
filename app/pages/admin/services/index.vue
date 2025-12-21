<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { usePersyaratanService } from "~/services/service.services";
import { toast } from "vue-sonner";

definePageMeta({ layout: "admin", middleware: "superadmin" });

const page = ref(1);
const perPage = 10;
const search = ref("");

const items = ref<any[]>([]);
const totalItems = ref(0);

const { getAll, remove, response, loading } = usePersyaratanService();

const params = computed(() => ({ page: page.value, perPage, search: search.value || undefined }));

const fetchData = async () => {
	try {
		await getAll(params.value);
		const raw = response.value as any;
		items.value = raw?.items || raw?.data || [];
		totalItems.value = raw?.meta?.totalItems ?? 0;
	} catch (err) {
		toast.error("Gagal memuat persyaratan");
	}
};

watch(params, fetchData);
onMounted(fetchData);

const openDelete = ref(false);
const selected = ref<any>(null);

const openDeleteModal = (f: any) => {
	selected.value = f;
	openDelete.value = true;
};

const confirmDelete = async () => {
	if (!selected.value) return;
	try {
		await remove(selected.value.id);
		toast.success("Persyaratan berhasil dihapus");
		openDelete.value = false;
		selected.value = null;
		await fetchData();
	} catch (err) {
		toast.error("Gagal menghapus persyaratan");
	}
};
</script>

<template>
	<div class="space-y-6 bg-white p-10 rounded">
		<div class="flex justify-between items-center">
			<div>
				<h2 class="text-xl font-semibold">Manajemen Persyaratan</h2>
				<p class="text-gray-400 text-sm">Total {{ totalItems || 0 }} persyaratan</p>
			</div>

			<div class="flex items-center gap-2">
				<CommonDebouncedSearch v-model="search" :debounce="300" placeholder="Cari persyaratan..." />
				<NuxtLink to="/admin/services/create">
					<Button>Tambah Persyaratan</Button>
				</NuxtLink>
			</div>
		</div>

		<Table class="[&_th]:border-none [&_td]:border-none [&_tr]:border-none">
			<TableHeader class="bg-[#F3F6F9]">
				<TableRow>
					<TableHead>ID</TableHead>
					<TableHead>Nama</TableHead>
					<TableHead>Waktu</TableHead>
					<TableHead>Dokumen</TableHead>
					<TableHead>Aksi</TableHead>
				</TableRow>
			</TableHeader>

			<TableBody>
				<TableRow v-if="loading">
					<TableCell colspan="5" class="text-center py-10 text-gray-400"> Mengambil data... </TableCell>
				</TableRow>

				<TableRow v-if="!loading && items.length === 0">
					<TableCell colspan="5" class="text-center py-10 text-gray-400">
						<div class="flex flex-col items-center justify-center gap-2">
							<div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
								<Icon name="lucide:inbox" class="w-6 h-6 text-gray-400" />
							</div>
							<p class="text-sm text-gray-500">Tidak ada data ditemukan</p>
						</div>
					</TableCell>
				</TableRow>

				<TableRow v-for="it in items" :key="it.id">
					<TableCell>{{ it.id }}</TableCell>
					<TableCell>{{ it.name }}</TableCell>
					<TableCell>{{ it.workingTime }}</TableCell>
					<TableCell>
						<div v-if="it.documentPath">
							<a :href="it.documentPath" target="_blank" class="text-blue-600">Lihat</a>
						</div>
						<div v-else>-</div>
					</TableCell>
					<TableCell class="flex gap-2">
						<NuxtLink :to="`/admin/services/${it.id}/services`">
							<Button size="sm">Detail</Button>
						</NuxtLink>
						<NuxtLink :to="`/admin/services/${it.id}/edit`">
							<Button size="sm">Edit</Button>
						</NuxtLink>
						<Button variant="destructive" size="sm" @click="openDeleteModal(it)"> Hapus </Button>
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>

		<UserPagination :page="page" :total="totalItems" :perPage="perPage" @update:page="page = $event" />

		<AlertDialog v-model:open="openDelete">
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Hapus Persyaratan</AlertDialogTitle>
					<AlertDialogDescription>
						Yakin ingin menghapus persyaratan
						<strong>{{ selected?.name }}</strong
						>?
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel>Batal</AlertDialogCancel>
					<AlertDialogAction class="bg-red-600 hover:bg-red-700" @click="confirmDelete"> Hapus </AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	</div>
</template>
