<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";
import { Eye, EyeOff } from "lucide-vue-next";
import { createUserService } from "~/services/user.services";

definePageMeta({
	layout: "admin",
	middleware: "admin",
});

const router = useRouter();
const loading = ref(false);
const isConfirmOpen = ref(false);

const showPassword = ref(false);
const showPasswordConfirmation = ref(false);

const form = reactive({
	name: "",
	email: "",
	password: "",
	passwordConfirmation: "",
	roleId: 3,

	instanceName: "",
	instanceEmail: "",
	instanceProvince: "",
	instanceDistrict: "",
	instanceSubDistrict: "",
	instanceAddress: "",
	instancePhone: "",
});

const openConfirm = () => {
	if (!form.name || !form.email || !form.password || !form.passwordConfirmation) {
		return toast.error("Harap lengkapi semua field wajib");
	}

	if (form.password !== form.passwordConfirmation) {
		return toast.error("Password dan konfirmasi tidak sama");
	}

	isConfirmOpen.value = true;
};

const handleSubmit = async () => {
	loading.value = true;
	try {
		await createUserService(form);
		router.push("/admin/user");
	} finally {
		loading.value = false;
	}
};
</script>

<template>
	<div class="space-y-8 bg-white p-10 rounded-lg h-full">
		<h2 class="text-xl font-semibold">Tambah User</h2>

		<!-- EMAIL -->
		<div class="grid gap-2">
			<Label>Email</Label>
			<Input v-model="form.email" type="email" placeholder="Masukkan Email" class="bg-gray-50" />
		</div>

		<hr />

		<!-- GRID DATA -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div class="grid gap-2">
				<Label>Nama Lengkap</Label>
				<Input v-model="form.name" placeholder="Nama Lengkap" class="bg-gray-50" />
			</div>

			<div class="grid gap-2">
				<Label>Role</Label>
				<Select v-model="form.roleId">
					<SelectTrigger class="bg-gray-50 w-full">
						<SelectValue placeholder="Pilih Role" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem :value="1">SUPERADMIN</SelectItem>
						<SelectItem :value="2">ADMIN</SelectItem>
						<SelectItem :value="3">USER</SelectItem>
						<SelectItem :value="4">ADMIN SKKNI</SelectItem>
						<SelectItem :value="5">ADMIN SKKNK</SelectItem>
						<SelectItem :value="6">ADMIN CLSP</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div class="grid gap-2">
				<Label>Nama Instansi</Label>
				<Input v-model="form.instanceName" placeholder="Kemnaker" class="bg-gray-50" />
			</div>

			<div class="grid gap-2">
				<Label>Email Instansi</Label>
				<Input v-model="form.instanceEmail" type="email" placeholder="email@instansi.go.id" class="bg-gray-50" />
			</div>

			<div class="grid gap-2">
				<Label>Provinsi</Label>
				<Input v-model="form.instanceProvince" class="bg-gray-50" />
			</div>

			<div class="grid gap-2">
				<Label>Kota</Label>
				<Input v-model="form.instanceDistrict" class="bg-gray-50" />
			</div>

			<div class="grid gap-2">
				<Label>Kecamatan</Label>
				<Input v-model="form.instanceSubDistrict" class="bg-gray-50" />
			</div>

			<div class="grid gap-2">
				<Label>No Telepon</Label>
				<Input v-model="form.instancePhone" class="bg-gray-50" />
			</div>

			<div class="grid gap-2 md:col-span-2">
				<Label>Alamat Lengkap</Label>
				<Textarea v-model="form.instanceAddress" class="bg-gray-50" />
			</div>
		</div>

		<hr />

		<!-- PASSWORD -->
		<div class="grid gap-2">
			<Label>Password</Label>
			<div class="relative">
				<Input :type="showPassword ? 'text' : 'password'" v-model="form.password" class="bg-gray-50 pr-10" />
				<button type="button" class="absolute inset-y-0 right-3 flex items-center" @click="showPassword = !showPassword">
					<Eye v-if="!showPassword" class="w-4 h-4" />
					<EyeOff v-else class="w-4 h-4" />
				</button>
			</div>
		</div>

		<!-- PASSWORD CONFIRM -->
		<div class="grid gap-2">
			<Label>Konfirmasi Password</Label>
			<div class="relative">
				<Input :type="showPasswordConfirmation ? 'text' : 'password'" v-model="form.passwordConfirmation" class="bg-gray-50 pr-10" />
				<button type="button" class="absolute inset-y-0 right-3 flex items-center" @click="showPasswordConfirmation = !showPasswordConfirmation">
					<Eye v-if="!showPasswordConfirmation" class="w-4 h-4" />
					<EyeOff v-else class="w-4 h-4" />
				</button>
			</div>
		</div>

		<!-- ACTION -->
		<div class="flex justify-between pt-6">
			<NuxtLink to="/admin/user">
				<Button variant="secondary">Batal</Button>
			</NuxtLink>
			<Button @click="openConfirm" class="bg-blue-600 text-white">Simpan</Button>
		</div>

		<!-- CONFIRM MODAL (TIDAK DIHAPUS) -->
		<Dialog v-model:open="isConfirmOpen">
			<DialogContent class="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Konfirmasi</DialogTitle>
					<DialogDescription>Yakin membuat user dengan data ini?</DialogDescription>
				</DialogHeader>

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
