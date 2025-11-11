<script setup lang="ts">
import { Pencil, Trash2, Search } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { useFaqService } from "@/services/faq.services";

definePageMeta({
	layout: "admin",
	middleware: "admin",
	title: "FAQ",
});

const { getAll, remove, response, loading } = useFaqService();

const searchQuery = ref("");
const currentPage = ref(1);
const perPage = ref(10);

const selectedToDelete = ref<number | null>(null);
const showDeleteDialog = ref(false);

// 🧩 Fetch FAQ
const params = computed(() => ({
	page: currentPage.value,
	search: searchQuery.value || undefined,
}));

const fetchFaq = async () => {
	try {
		await getAll(params.value);
	} catch {
		toast.error("Gagal memuat data FAQ.");
	}
};

onMounted(fetchFaq);

// 🧩 Delete
const confirmDelete = (id: number) => {
	selectedToDelete.value = id;
	showDeleteDialog.value = true;
};

const handleDelete = async () => {
	if (!selectedToDelete.value) return;
	try {
		await remove(selectedToDelete.value);
		toast.success("FAQ berhasil dihapus.");
		await fetchFaq();
	} catch {
		toast.error("Gagal menghapus FAQ.");
	} finally {
		showDeleteDialog.value = false;
	}
};

// 🧭 Navigation
const onCreate = () => navigateTo("/admin/faq/create");
const onEdit = (id: number) => navigateTo(`/admin/faq/${id}/edit`);

const onPageChange = (page: number) => {
	currentPage.value = page;

	fetchFaq();
};
</script>

<template>
	<div class="flex-1 space-y-6 p-6">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-semibold text-gray-900">Daftar FAQ</h1>
			<Button @click="onCreate" class="bg-blue-900 hover:bg-blue-800 text-white font-medium px-6"> Tambah </Button>
		</div>

		<!-- Search -->
		<div class="relative w-full sm:w-1/3">
			<CommonDebouncedSearch v-model="searchQuery" placeholder="Cari pertanyaan..." @search="fetchFaq" />
		</div>

		<!-- Table -->
		<div class="relative overflow-x-auto rounded-lg border border-gray-200 bg-white">
			<Table>
				<TableHeader class="bg-gray-50">
					<TableRow>
						<TableHead class="w-[50px]">No</TableHead>
						<TableHead>Pertanyaan</TableHead>
						<TableHead>Jawaban</TableHead>
						<TableHead class="text-center w-[120px]">Aksi</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					<!-- Loading -->
					<TableRow v-if="loading">
						<TableCell colspan="4" class="py-8 text-center text-gray-500">
							<div class="flex justify-center items-center gap-2">
								<span class="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></span>
								Memuat data...
							</div>
						</TableCell>
					</TableRow>

					<!-- Data -->
					<TableRow v-for="(faq, index) in response?.data" :key="faq.id" class="hover:bg-gray-50 transition-colors">
						<TableCell class="text-gray-700">
							{{ (currentPage - 1) * (response?.meta?.perPage || 10) + index + 1 }}
						</TableCell>
						<TableCell class="font-medium text-gray-900">
							{{ faq.question }}
						</TableCell>
						<TableCell class="text-gray-700">
							{{ faq.answer }}
						</TableCell>
						<TableCell class="text-center">
							<div class="flex items-center justify-center gap-2">
								<Button variant="ghost" size="icon" @click="onEdit(faq.id)">
									<Pencil class="h-4 w-4 text-gray-600" />
								</Button>
								<Button variant="ghost" size="icon" @click="confirmDelete(faq.id)">
									<Trash2 class="h-4 w-4 text-gray-600" />
								</Button>
							</div>
						</TableCell>
					</TableRow>

					<!-- Kosong -->
					<TableRow v-if="!loading && (!response?.data || response.data.length === 0)">
						<TableCell colspan="4" class="text-center py-8 text-gray-500"> Belum ada data FAQ. </TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</div>

		<AdminAppPagination v-if="response?.meta" @update:page="onPageChange" :total="response.meta.totalItems" :per-page="response.meta.perPage" />

		<!-- Dialog Delete -->
		<Dialog v-model:open="showDeleteDialog">
			<DialogContent class="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Hapus FAQ</DialogTitle>
					<DialogDescription> Apakah kamu yakin ingin menghapus FAQ ini? Tindakan ini tidak bisa dibatalkan. </DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" @click="showDeleteDialog = false"> Batal </Button>
					<Button class="bg-red-600 text-white" @click="handleDelete"> Hapus </Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	</div>
</template>
