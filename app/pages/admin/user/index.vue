<script setup lang="ts">
import { listUsersService, deleteUserService } from "~/services/user.services";

definePageMeta({
	layout: "admin",
	middleware: "admin",
});

const page = ref(1);
const perPage = 10;
const search = ref("");
const totalItems = ref(0);

const users = ref<any[]>([]);
const meta = ref();
const loading = ref(false);

const openDelete = ref(false);
const selectedUser = ref<any>(null);

const params = computed(() => ({
	page: page.value,
	search: search.value || undefined,
}));

const fetchData = async () => {
	loading.value = true;

	const res = await listUsersService(params.value);

	users.value = res.data;
	totalItems.value = res.meta.totalItems;

	loading.value = false;
};

watch(params, fetchData);

onMounted(fetchData);

const openDeleteModal = (user: any) => {
	selectedUser.value = user;
	openDelete.value = true;
};

const confirmDelete = async () => {
	if (!selectedUser.value) return;
	await deleteUserService(selectedUser.value.id);
	openDelete.value = false;
	selectedUser.value = null;
	await fetchData();
};
</script>

<template>
	<div class="space-y-6 bg-white p-10 rounded">
		<div class="flex justify-between items-center">
			<div>
				<h2 class="text-xl font-semibold">Manajemen User</h2>
				<p class="text-gray-400 text-sm">Total {{ meta?.totalItems || 0 }} user</p>
			</div>

			<div class="flex items-center gap-2">
				<Input v-model="search" placeholder="Cari email / nama" class="w-72" />
				<NuxtLink to="/admin/user/create">
					<Button>Tambah User</Button>
				</NuxtLink>
			</div>
		</div>

		<Table v-if="!loading" class="[&_th]:border-none [&_td]:border-none">
			<TableHeader class="bg-[#F3F6F9]">
				<TableRow>
					<TableHead>ID</TableHead>
					<TableHead>Nama</TableHead>
					<TableHead>Email</TableHead>
					<TableHead>Role</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>Aksi</TableHead>
				</TableRow>
			</TableHeader>

			<TableBody>
				<TableRow v-for="user in users" :key="user.id">
					<TableCell>{{ user.id }}</TableCell>
					<TableCell>{{ user.name }}</TableCell>
					<TableCell>{{ user.email }}</TableCell>
					<TableCell>{{ user.roles?.[0]?.role?.name || "-" }}</TableCell>
					<TableCell>
						<span :class="user.status ? 'text-green-500' : 'text-red-500'">
							{{ user.status ? "Aktif" : "Nonaktif" }}
						</span>
					</TableCell>
					<TableCell class="flex gap-2">
						<NuxtLink :to="`/admin/user/${user.id}/edit`">
							<Button size="sm">Edit</Button>
						</NuxtLink>
						<Button variant="destructive" size="sm" @click="openDeleteModal(user)"> Hapus </Button>
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>

		<div v-else class="py-10 text-center text-gray-400">Loading...</div>

		<UserPagination :page="page" :total="totalItems" :perPage="perPage" @update:page="page = $event" />

		<AlertDialog v-model:open="openDelete">
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Hapus User</AlertDialogTitle>
					<AlertDialogDescription>
						Yakin ingin menghapus user
						<strong>{{ selectedUser?.name }}</strong
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
