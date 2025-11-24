<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

import { createUserService } from "~/services/user.services";

definePageMeta({
	layout: "admin",
	middleware: "admin",
});

const router = useRouter();
const loading = ref(false);
const isConfirmOpen = ref(false);

const form = reactive({
	name: "",
	email: "",
	password: "",
	roleId: 3,
});

// open modal confirm
const openConfirm = () => {
	if (!form.name || !form.email || !form.password) {
		return toast.error("Harap lengkapi semua field");
	}
	isConfirmOpen.value = true;
};

const handleSubmit = async () => {
	loading.value = true;

	try {
		await createUserService(form);

		router.push("/admin/users");
	} finally {
		loading.value = false;
	}
};
</script>

<template>
	<div class="space-y-6 bg-white p-10 rounded-lg h-full">
		<!-- FORM GRID -->
		<div class="grid grid-cols-2 gap-6 mt-10">
			<div>
				<Label class="text-sm text-gray-600">Nama Lengkap</Label>
				<Input v-model="form.name" placeholder="Nama Lengkap" class="bg-gray-50" />
			</div>

			<div>
				<Label class="text-sm text-gray-600">Email</Label>
				<Input v-model="form.email" type="email" placeholder="Email" class="bg-gray-50" />
			</div>

			<div>
				<Label class="text-sm text-gray-600">Password</Label>
				<Input v-model="form.password" type="password" placeholder="Password" class="bg-gray-50" />
			</div>

			<div>
				<Label class="text-sm text-gray-600">Role</Label>

				<Select v-model="form.roleId">
					<SelectTrigger class="bg-gray-50 w-full">
						<SelectValue placeholder="Pilih Role" />
					</SelectTrigger>

					<SelectContent>
						<SelectGroup>
							<SelectItem :value="1">SUPERADMIN</SelectItem>
							<SelectItem :value="2">ADMIN</SelectItem>
							<SelectItem :value="3">USER</SelectItem>
							<SelectItem :value="4">ADMIN SKKNI</SelectItem>
							<SelectItem :value="5">ADMIN SKKNK</SelectItem>
							<SelectItem :value="6">ADMIN CLSP</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
		</div>

		<!-- FOOTER BUTTONS -->
		<div class="flex justify-between pt-8">
			<NuxtLink to="/admin/user">
				<Button variant="secondary" class="px-6">Batal</Button>
			</NuxtLink>

			<Button @click="openConfirm" class="px-6 bg-blue-600 text-white"> Simpan </Button>
		</div>

		<!-- CONFIRM DIALOG -->
		<Dialog v-model:open="isConfirmOpen">
			<DialogContent class="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Konfirmasi</DialogTitle>
					<DialogDescription> Apakah Anda yakin ingin membuat user baru dengan data ini? </DialogDescription>
				</DialogHeader>

				<div class="mt-4 text-sm space-y-1 text-gray-700 border rounded p-4 bg-gray-50">
					<p><b>Nama:</b> {{ form.name }}</p>
					<p><b>Email:</b> {{ form.email }}</p>
					<p><b>Role:</b> {{ form.roleId }}</p>
				</div>

				<DialogFooter class="mt-4 flex justify-end gap-3">
					<Button variant="secondary" @click="isConfirmOpen = false">Batal</Button>

					<Button @click="handleSubmit" :disabled="loading" class="bg-blue-600 text-white">
						{{ loading ? "Memproses..." : "Ya, Simpan" }}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	</div>
</template>
