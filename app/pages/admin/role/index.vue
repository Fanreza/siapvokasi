<script setup lang="ts">
import { listUsersService, deleteUserService } from "~/services/user.services";

definePageMeta({
	layout: "admin",
	middleware: "admin",
});

const page = ref(1);
const perPage = 10;
const search = ref("");

const users = ref<any[]>([]);
const meta = ref();
const loading = ref(false);

const fetchData = async () => {
	loading.value = true;

	const res = await listUsersService();

	users.value = res.data;
	meta.value = res.meta;

	loading.value = false;
};

watch([page, search], fetchData);
onMounted(fetchData);

const handlePageChange = (newPage: number) => {
	page.value = newPage;
};

const handleDelete = async (id: number) => {
	if (!confirm("Yakin hapus user ini?")) return;

	await deleteUserService(id);
	await fetchData();
};
</script>

<template>
	<div class="space-y-6 bg-white p-10 rounded">
		<!-- TITLE + SEARCH -->
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

		<!-- TABLE -->
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

					<TableCell>
						{{ user.roles?.[0]?.role?.name || "-" }}
					</TableCell>

					<TableCell>
						<span :class="user.status ? 'text-green-500' : 'text-red-500'">
							{{ user.status ? "Aktif" : "Nonaktif" }}
						</span>
					</TableCell>

					<TableCell class="flex gap-2">
						<NuxtLink :to="`/admin/user/${user.id}/edit`">
							<Button size="sm">Edit</Button>
						</NuxtLink>

						<Button variant="destructive" size="sm" @click="handleDelete(user.id)"> Hapus </Button>
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>

		<div v-else class="py-10 text-center text-gray-400">Loading...</div>

		<!-- PAGINATION -->
		<UserPagination :page="page" :total="meta?.totalItems || 0" :perPage="perPage" @update:page="handlePageChange" />
	</div>
</template>
