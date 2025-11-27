<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { useAuthStore } from "~/stores/auth";
import { updateProfileService, changePasswordService, uploadAvatarService } from "~/services/profile.services";
import { toast } from "vue-sonner";

definePageMeta({
	layout: "user",
	middleware: "user",
});

const auth = useAuthStore();
const isEditing = ref(false);

// FORM DATA (reactive)
const user = reactive({
	name: "",
	email: "",
	instanceName: "",
	instanceEmail: "",
	instanceProvince: "",
	instanceDistrict: "",
	instanceSubDistrict: "",
	instanceAddress: "",
	instancePhone: "",
	password: "",
});

// Load data dari auth store ketika page masuk
onMounted(() => {
	if (auth.user) {
		user.name = auth.user.name;
		user.email = auth.user.email;

		user.instanceName = auth.user.instanceName ?? "";
		user.instanceEmail = auth.user.instanceEmail ?? "";
		user.instanceProvince = auth.user.instanceProvince ?? "";
		user.instanceDistrict = auth.user.instanceDistrict ?? "";
		user.instanceSubDistrict = auth.user.instanceSubDistrict ?? "";
		user.instanceAddress = auth.user.instanceAddress ?? "";
		user.instancePhone = auth.user.instancePhone ?? "";
		user.password = "";
	}
});

// toggle edit / cancel
const toggleEdit = () => (isEditing.value = !isEditing.value);

// SAVE TO BACKEND
const saveProfile = async () => {
	try {
		const payload = {
			name: user.name,
			email: user.email,
			instanceName: user.instanceName,
			instanceEmail: user.instanceEmail,
			instanceProvince: user.instanceProvince,
			instanceDistrict: user.instanceDistrict,
			instanceSubDistrict: user.instanceSubDistrict,
			instanceAddress: user.instanceAddress,
			instancePhone: user.instancePhone,
			password: user.password || undefined,
		};

		await updateProfileService(payload);

		// refresh store
		await auth.refreshUser();

		isEditing.value = false;
	} catch (err: any) {}
};

const passwordForm = reactive({
	oldPassword: "",
	newPassword: "",
});

const changePassword = async () => {
	if (!passwordForm.oldPassword || !passwordForm.newPassword) {
		return toast.error("Password lama dan baru wajib diisi");
	}

	if (passwordForm.oldPassword === passwordForm.newPassword) {
		return toast.error("Password baru tidak boleh sama dengan password lama");
	}

	try {
		await changePasswordService({
			oldPassword: passwordForm.oldPassword,
			newPassword: passwordForm.newPassword,
		});

		passwordForm.oldPassword = "";
		passwordForm.newPassword = "";
	} catch (err: any) {}
};

const avatarPreview = ref<string | null>(null);
const avatarFile = ref<File | null>(null);

const handleAvatarSelect = (e: Event) => {
	const target = e.target as HTMLInputElement;
	if (!target.files?.length) return;

	const file = target.files[0];
	avatarFile.value = file!;
	avatarPreview.value = URL.createObjectURL(file!);
};

const uploadAvatar = async () => {
	if (!avatarFile.value) {
		toast.warning("Silakan pilih file terlebih dahulu.");
		return;
	}

	try {
		await uploadAvatarService(avatarFile.value);

		avatarFile.value = null;

		// Refresh user data
		await auth.refreshUser();
	} catch (err: any) {}
};
</script>

<template>
	<div class="bg-white rounded-xl shadow-sm p-6 md:p-8" v-if="auth.user">
		<!-- HEADER -->
		<div class="flex items-start justify-between mb-6">
			<div>
				<!-- AVATAR -->
				<div class="flex flex-col items-center mb-6">
					<div class="relative">
						<img :src="auth.user?.avatar" class="w-28 h-28 rounded-full object-cover border shadow" />

						<label class="absolute bottom-1 right-1 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-blue-700 transition" title="Ubah Foto">
							<Icon name="lucide:camera" class="w-5 h-5" />
							<input type="file" class="hidden" accept="image/*" @change="handleAvatarSelect" />
						</label>
					</div>

					<Button v-if="avatarFile" class="mt-4 bg-blue-600 text-white" @click="uploadAvatar"> Upload Avatar </Button>
				</div>

				<h2 class="text-xl font-semibold text-gray-800">{{ user.name }}</h2>
				<div class="text-sm text-gray-500 flex items-center gap-2 mt-2">
					<Icon name="mail" class="w-4 h-4 opacity-70" />
					<span>{{ user.email }}</span>
				</div>

				<div class="text-sm text-gray-400 flex items-center gap-2 mt-2">
					<Icon name="lock" class="w-4 h-4 opacity-70" />
					<span>********</span>
				</div>
			</div>

			<!-- EDIT BUTTONS -->
			<div class="flex items-center gap-3">
				<Button v-if="!isEditing" size="sm" class="bg-blue-500 hover:bg-blue-600 text-white" @click="toggleEdit"> Edit Profil </Button>

				<template v-else>
					<Button size="sm" variant="secondary" @click="toggleEdit">Batal</Button>
					<Button size="sm" class="bg-blue-500 text-white" @click="saveProfile">Simpan</Button>
				</template>
			</div>
		</div>

		<hr class="border-gray-200 mb-6" />

		<!-- FORM SECTION -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div>
				<label class="text-sm text-gray-600 mb-2 block">Nama Lengkap</label>
				<Input v-model="user.name" :readonly="!isEditing" class="bg-gray-50" />
			</div>

			<div>
				<label class="text-sm text-gray-600 mb-2 block">Email</label>
				<Input v-model="user.email" :readonly="!isEditing" class="bg-gray-50" />
			</div>

			<div>
				<label class="text-sm text-gray-600 mb-2 block">Nama Instansi</label>
				<Input v-model="user.instanceName" :readonly="!isEditing" class="bg-gray-50" />
			</div>

			<div>
				<label class="text-sm text-gray-600 mb-2 block">Email Instansi</label>
				<Input v-model="user.instanceEmail" :readonly="!isEditing" class="bg-gray-50" />
			</div>

			<div>
				<label class="text-sm text-gray-600 mb-2 block">Provinsi</label>
				<Input v-model="user.instanceProvince" :readonly="!isEditing" class="bg-gray-50" />
			</div>

			<div>
				<label class="text-sm text-gray-600 mb-2 block">Kota</label>
				<Input v-model="user.instanceDistrict" :readonly="!isEditing" class="bg-gray-50" />
			</div>

			<div>
				<label class="text-sm text-gray-600 mb-2 block">Kecamatan</label>
				<Input v-model="user.instanceSubDistrict" :readonly="!isEditing" class="bg-gray-50" />
			</div>

			<div class="md:col-span-2">
				<label class="text-sm text-gray-600 mb-2 block">Alamat Lengkap</label>
				<Textarea v-model="user.instanceAddress" rows="3" :readonly="!isEditing" class="bg-gray-50" />
			</div>

			<div>
				<label class="text-sm text-gray-600 mb-2 block">No Telp</label>
				<Input v-model="user.instancePhone" :readonly="!isEditing" class="bg-gray-50" />
			</div>
		</div>

		<hr class="border-gray-200 my-6" />

		<!-- PASSWORD SECTION -->
		<div class="bg-gray-50 p-6 rounded-lg mt-8 border border-gray-200">
			<h3 class="text-lg font-semibold text-gray-800 mb-4">Ganti Password</h3>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div>
					<label class="text-sm text-gray-600 mb-2 block">Password Lama</label>
					<Input v-model="passwordForm.oldPassword" type="password" class="bg-white" />
				</div>

				<div>
					<label class="text-sm text-gray-600 mb-2 block">Password Baru</label>
					<Input v-model="passwordForm.newPassword" type="password" class="bg-white" />
				</div>
			</div>

			<div class="flex justify-end mt-6">
				<Button class="bg-blue-600 text-white" @click="changePassword">Update Password</Button>
			</div>
		</div>
	</div>
</template>
