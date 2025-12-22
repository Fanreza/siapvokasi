<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useRequirementService } from "~/services/requirement.services";
import { toast } from "vue-sonner";

definePageMeta({ layout: "admin", middleware: "superadmin" });

const route = useRoute();
const serviceId = Number(route.params.id);

const page = ref(1);
const perPage = 10;
const search = ref("");

const items = ref<any[]>([]);
const totalItems = ref(0);

const { getAll, remove, response, loading } = useRequirementService(serviceId);

const params = computed(() => ({ page: page.value, perPage, search: search.value || undefined }));

const fetchData = async () => {
	try {
		await getAll(params.value);
		const raw = response.value as any;
		if (Array.isArray(raw)) {
			items.value = raw;
			totalItems.value = raw.length;
		} else {
			items.value = raw?.items || raw?.data || [];
			totalItems.value = raw?.meta?.totalItems ?? (Array.isArray(items.value) ? items.value.length : 0);
		}
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
				<NuxtLink :to="`/admin/services/${serviceId}/requirements/create`">
					<Button>Tambah Persyaratan</Button>
				</NuxtLink>
			</div>
		</div>

		<Table class="[&_th]:border-none [&_td]:border-none [&_tr]:border-none">
			<TableHeader class="bg-[#F3F6F9]">
				<TableRow>
					<TableHead>ID</TableHead>
					<TableHead>Urutan</TableHead>
					<TableHead>Deskripsi</TableHead>
					<TableHead>Aksi</TableHead>
				</TableRow>
			</TableHeader>

			<TableBody>
				<TableRow v-if="loading">
					<TableCell colspan="4" class="text-center py-10 text-gray-400"> Mengambil data... </TableCell>
				</TableRow>

				<TableRow v-if="!loading && items.length === 0">
					<TableCell colspan="4" class="text-center py-10 text-gray-400">
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
					<TableCell>{{ it.order }}</TableCell>
					<TableCell>{{ it.description }}</TableCell>
					<TableCell class="flex gap-2">
						<NuxtLink :to="`/admin/services/${serviceId}/requirements/${it.id}/edit`">
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
					<AlertDialogDescription> Yakin ingin menghapus persyaratan? </AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel>Batal</AlertDialogCancel>
					<AlertDialogAction class="bg-red-600 hover:bg-red-700" @click="confirmDelete"> Hapus </AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	</div>
</template>
