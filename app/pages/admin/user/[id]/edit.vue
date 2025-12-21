<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import { getUserByIdService, updateUserService } from "~/services/user.services";

definePageMeta({
	layout: "admin",
	middleware: "admin",
});

const route = useRoute();
const router = useRouter();

const id = Number(route.params.id);

const loading = ref(true);
const saving = ref(false);
const isConfirmOpen = ref(false);

const form = reactive({
	name: "",
	email: "",
	password: "",
	roleId: "3", // select is string
	status: "false",
});

const fetchUser = async () => {
	const res = await getUserByIdService(id);

	form.name = res.name;
	form.email = res.email;
	form.roleId = res.roles?.[0]?.roleId?.toString() || "3";
	form.status = res.status ? "true" : "false";

	loading.value = false;
};

onMounted(fetchUser);

// open modal confirm
const openConfirm = () => {
	isConfirmOpen.value = true;
};

// final submit
const handleSubmit = async () => {
	saving.value = true;

	try {
		await updateUserService(id, {
			name: form.name,
			email: form.email,
			roleId: Number(form.roleId),
			status: form.status === "true",
		});

		router.push("/admin/user");
	} finally {
		saving.value = false;
	}
};
</script>

<template>
	<div class="space-y-6 bg-white p-10 rounded-lg min-h-[70vh]">
		<div v-if="loading" class="text-center text-gray-400 py-10">Memuat data...</div>

		<div v-else class="grid grid-cols-2 gap-6">
			<div>
				<Label class="text-sm text-gray-600">Nama Lengkap</Label>
				<Input v-model="form.name" placeholder="Nama Lengkap" class="bg-gray-50" />
			</div>

			<div>
				<Label class="text-sm text-gray-600">Email</Label>
				<Input v-model="form.email" type="email" placeholder="Email" class="bg-gray-50" />
			</div>

			<!-- SHADCN SELECT ROLE -->
			<div>
				<Label class="text-sm text-gray-600">Role</Label>

				<Select v-model="form.roleId">
					<SelectTrigger class="w-full bg-gray-50">
						<SelectValue placeholder="Pilih Role" />
					</SelectTrigger>

					<SelectContent>
						<SelectItem value="1">SUPERADMIN</SelectItem>
						<SelectItem value="2">ADMIN</SelectItem>
						<SelectItem value="3">USER</SelectItem>
						<SelectItem value="4">ADMIN SKKNI</SelectItem>
						<SelectItem value="5">ADMIN SKKNK</SelectItem>
						<SelectItem value="6">ADMIN CLSP</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<!-- STATUS SELECT SHADCN -->
			<div>
				<Label class="text-sm text-gray-600">Status</Label>

				<Select v-model="form.status">
					<SelectTrigger class="w-full bg-gray-50">
						<SelectValue placeholder="Pilih Status" />
					</SelectTrigger>

					<SelectContent>
						<SelectItem value="true">Aktif</SelectItem>
						<SelectItem value="false">Tidak Aktif</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>

		<!-- FOOTER -->
		<div class="flex justify-between pt-8">
			<NuxtLink to="/admin/user">
				<Button variant="secondary" class="px-6">Kembali</Button>
			</NuxtLink>

			<Button @click="openConfirm" class="px-6 bg-blue-600 text-white"> Simpan Perubahan </Button>
		</div>

		<!-- CONFIRM DIALOG -->
		<Dialog v-model:open="isConfirmOpen">
			<DialogContent class="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Konfirmasi</DialogTitle>
					<DialogDescription> Apakah Anda yakin ingin menyimpan perubahan user ini? </DialogDescription>
				</DialogHeader>

				<div class="mt-4 space-y-1 border p-4 rounded bg-gray-50 text-sm text-gray-700">
					<p><b>Nama:</b> {{ form.name }}</p>
					<p><b>Email:</b> {{ form.email }}</p>
					<p><b>Role:</b> {{ form.roleId }}</p>
					<p><b>Status:</b> {{ form.status === "true" ? "Aktif" : "Tidak Aktif" }}</p>
				</div>

				<DialogFooter class="flex justify-end gap-3">
					<Button variant="secondary" @click="isConfirmOpen = false">Batal</Button>

					<Button @click="handleSubmit" :disabled="saving" class="bg-blue-600 text-white">
						{{ saving ? "Menyimpan..." : "Ya, Simpan" }}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	</div>
</template>
