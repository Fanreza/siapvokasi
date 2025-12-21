<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useFaqService } from "~/services/faq.services";
import { toast } from "vue-sonner";

definePageMeta({
	layout: "admin",
	middleware: "admin",
});

const page = ref(1);
const perPage = 10;
const search = ref("");

const faqs = ref<any[]>([]);
const totalItems = ref(0);

const { getAll, remove, response, loading } = useFaqService();

const params = computed(() => ({ page: page.value, perPage, search: search.value || undefined }));

const fetchData = async () => {
	try {
		const res = await getAll(params.value);
		faqs.value = res.data || response.value?.data || [];
		totalItems.value = res.meta?.totalItems ?? response.value?.meta?.totalItems ?? 0;
	} catch (err) {
		toast.error("Gagal memuat FAQ");
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
		toast.success("FAQ berhasil dihapus");
		openDelete.value = false;
		selected.value = null;
		await fetchData();
	} catch (err) {
		toast.error("Gagal menghapus FAQ");
	}
};
</script>

<template>
	<div class="space-y-6 bg-white p-10 rounded">
		<div class="flex justify-between items-center">
			<div>
				<h2 class="text-xl font-semibold">Manajemen FAQ</h2>
				<p class="text-gray-400 text-sm">Total {{ totalItems || 0 }} FAQ</p>
			</div>

			<div class="flex items-center gap-2">
				<NuxtLink to="/admin/faq/create">
					<Button>Tambah FAQ</Button>
				</NuxtLink>
			</div>
		</div>

		<Table class="[&_th]:border-none [&_td]:border-none [&_tr]:border-none">
			<TableHeader class="bg-[#F3F6F9]">
				<TableRow>
					<TableHead>ID</TableHead>
					<TableHead>Urutan</TableHead>
					<TableHead>Pertanyaan</TableHead>
					<TableHead>Jawaban</TableHead>
					<TableHead>Aksi</TableHead>
				</TableRow>
			</TableHeader>

			<TableBody>
				<!-- Loading -->
				<TableRow v-if="loading">
					<TableCell colspan="5" class="text-center py-10 text-gray-400"> Mengambil data... </TableCell>
				</TableRow>

				<!-- Empty State -->
				<TableRow v-if="!loading && faqs.length === 0">
					<TableCell colspan="5" class="text-center py-10 text-gray-400">
						<div class="flex flex-col items-center justify-center gap-2">
							<div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
								<Icon name="lucide:inbox" class="w-6 h-6 text-gray-400" />
							</div>
							<p class="text-sm text-gray-500">Tidak ada data ditemukan</p>
						</div>
					</TableCell>
				</TableRow>

				<!-- Data Rows -->
				<TableRow v-for="f in faqs" :key="f.id">
					<TableCell>{{ f.id }}</TableCell>
					<TableCell>{{ f.order }}</TableCell>
					<TableCell class="max-w-md">{{ f.question }}</TableCell>
					<TableCell class="max-w-lg text-sm text-gray-600">{{ f.answer.length > 120 ? f.answer.substring(0, 120) + "..." : f.answer }}</TableCell>
					<TableCell class="flex gap-2">
						<NuxtLink :to="`/admin/faq/${f.id}/edit`">
							<Button size="sm">Edit</Button>
						</NuxtLink>
						<Button variant="destructive" size="sm" @click="openDeleteModal(f)"> Hapus </Button>
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>

		<UserPagination :page="page" :total="totalItems" :perPage="perPage" @update:page="page = $event" />

		<AlertDialog v-model:open="openDelete">
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Hapus FAQ</AlertDialogTitle>
					<AlertDialogDescription> Yakin ingin menghapus FAQ? </AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel>Batal</AlertDialogCancel>
					<AlertDialogAction class="bg-red-600 hover:bg-red-700" @click="confirmDelete"> Hapus </AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	</div>
</template>
