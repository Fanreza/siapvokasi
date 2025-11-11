<script setup lang="ts">
import { Pencil, Trash2 } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { useSocialMediaPostService } from "@/services/post.services";

definePageMeta({
	layout: "admin",
	middleware: "admin",
	title: "Postingan Media Sosial",
});

const { getAll, remove, response, loading } = useSocialMediaPostService();

const currentPage = ref(1);
const selectedToDelete = ref<number | null>(null);
const showDeleteDialog = ref(false);

// 🧩 Fetch data
const params = computed(() => ({
	page: currentPage.value,
}));

const fetchPosts = async () => {
	try {
		await getAll(params.value, false);
	} catch {
		toast.error("Gagal memuat data postingan media sosial.");
	}
};

onMounted(fetchPosts);

// 🧩 Delete
const confirmDelete = (id: number) => {
	selectedToDelete.value = id;
	showDeleteDialog.value = true;
};

const handleDelete = async () => {
	if (!selectedToDelete.value) return;

	try {
		await remove(selectedToDelete.value);
		toast.success("Postingan berhasil dihapus.");
		await fetchPosts();
	} catch {
		toast.error("Gagal menghapus postingan.");
	} finally {
		showDeleteDialog.value = false;
	}
};

// 🧭 Navigation
const onCreate = () => navigateTo("/admin/post/create");
const onEdit = (id: number) => navigateTo(`/admin/post/${id}/edit`);

const onPageChange = (page: number) => {
	currentPage.value = page;

	fetchPosts();
};
</script>

<template>
	<div class="flex-1 space-y-6 p-6">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-semibold text-gray-900">Daftar Postingan Media Sosial</h1>
			<Button @click="onCreate" class="bg-blue-900 hover:bg-blue-800 text-white font-medium px-6"> Tambah </Button>
		</div>

		<!-- Table -->
		<div class="relative overflow-x-auto rounded-lg border border-gray-200 bg-white">
			<Table>
				<TableHeader class="bg-gray-50">
					<TableRow>
						<TableHead class="w-[50px]">No</TableHead>
						<TableHead>Platform</TableHead>
						<TableHead>Link Postingan</TableHead>
						<TableHead>Dibuat Oleh</TableHead>
						<TableHead>Tanggal</TableHead>
						<TableHead class="text-center w-[120px]">Aksi</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					<!-- Loading -->
					<TableRow v-if="loading">
						<TableCell colspan="6" class="py-8 text-center text-gray-500">
							<div class="flex justify-center items-center gap-2">
								<span class="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></span>
								Memuat data...
							</div>
						</TableCell>
					</TableRow>

					<!-- Data -->
					<TableRow v-for="(post, index) in response?.data" :key="post.id" class="hover:bg-gray-50 transition">
						<TableCell>{{ (currentPage - 1) * 10 + index + 1 }}</TableCell>
						<TableCell class="font-medium text-gray-900 uppercase">{{ post.platform }}</TableCell>
						<TableCell>
							<a :href="post.postLink" target="_blank" class="text-blue-600 hover:underline truncate block max-w-[240px]">
								{{ post.postLink }}
							</a>
						</TableCell>
						<TableCell>{{ post.createdById }}</TableCell>
						<TableCell>{{ new Date(post.createdAt).toLocaleDateString() }}</TableCell>
						<TableCell class="text-center">
							<div class="flex items-center justify-center gap-2">
								<Button variant="ghost" size="icon" @click="onEdit(post.id)">
									<Pencil class="h-4 w-4 text-gray-600" />
								</Button>
								<Button variant="ghost" size="icon" @click="confirmDelete(post.id)">
									<Trash2 class="h-4 w-4 text-gray-600" />
								</Button>
							</div>
						</TableCell>
					</TableRow>

					<!-- Empty -->
					<TableRow v-if="!loading && (!response?.data || response.data.length === 0)">
						<TableCell colspan="6" class="text-center py-8 text-gray-500"> Belum ada postingan media sosial. </TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</div>

		<!-- Pagination -->
		<AdminAppPagination v-if="response?.meta" @update:page="onPageChange" :total="response.meta.totalItems" :per-page="response.meta.perPage" />

		<!-- Delete Dialog -->
		<Dialog v-model:open="showDeleteDialog">
			<DialogContent class="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Hapus Postingan</DialogTitle>
					<DialogDescription> Apakah kamu yakin ingin menghapus postingan ini? </DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" @click="showDeleteDialog = false">Batal</Button>
					<Button class="bg-red-600 text-white" @click="handleDelete">Hapus</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	</div>
</template>
