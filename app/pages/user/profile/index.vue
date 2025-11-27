<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { useAuthStore } from "~/stores/auth";
import { updateProfileService, changePasswordService, uploadAvatarService } from "~/services/profile.services";
import { toast } from "vue-sonner";
import { Eye, EyeOff } from "lucide-vue-next";

definePageMeta({
	layout: "user",
	middleware: "user",
});

const auth = useAuthStore();
const isEditing = ref(false);

// Toggle show/hide password
const showOldPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

// FORM DATA
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

// Load user data
onMounted(() => {
	if (auth.user) {
		Object.assign(user, {
			name: auth.user.name,
			email: auth.user.email,
			instanceName: auth.user.instanceName ?? "",
			instanceEmail: auth.user.instanceEmail ?? "",
			instanceProvince: auth.user.instanceProvince ?? "",
			instanceDistrict: auth.user.instanceDistrict ?? "",
			instanceSubDistrict: auth.user.instanceSubDistrict ?? "",
			instanceAddress: auth.user.instanceAddress ?? "",
			instancePhone: auth.user.instancePhone ?? "",
			password: "",
		});
	}
});

// toggle edit mode
const toggleEdit = () => (isEditing.value = !isEditing.value);

// save profile
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
		await auth.refreshUser();
		isEditing.value = false;
	} catch (err) {}
};

// PASSWORD FORM
const passwordForm = reactive({
	oldPassword: "",
	newPassword: "",
	confirmPassword: "",
});

// change password
const changePassword = async () => {
	if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
		return toast.error("Semua password wajib diisi");
	}

	if (passwordForm.newPassword !== passwordForm.confirmPassword) {
		return toast.error("Password baru dan konfirmasi tidak sama");
	}

	if (passwordForm.oldPassword === passwordForm.newPassword) {
		return toast.error("Password baru tidak boleh sama dengan password lama");
	}

	try {
		await changePasswordService({
			oldPassword: passwordForm.oldPassword,
			newPassword: passwordForm.newPassword,
			confirmPassword: passwordForm.confirmPassword,
		});

		passwordForm.oldPassword = "";
		passwordForm.newPassword = "";
		passwordForm.confirmPassword = "";
	} catch (err) {}
};

// AVATAR
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
	if (!avatarFile.value) return toast.warning("Pilih file terlebih dahulu");

	try {
		await uploadAvatarService(avatarFile.value);
		avatarFile.value = null;
		await auth.refreshUser();
	} catch (err) {}
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
						<img :src="auth.user?.avatar || '/images/default-avatar.png'" class="w-28 h-28 rounded-full object-cover border shadow" />

						<label class="absolute bottom-1 right-1 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-blue-700 transition">
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

			<div class="flex items-center gap-3">
				<Button v-if="!isEditing" size="sm" class="bg-blue-500 text-white" @click="toggleEdit">Edit Profil</Button>

				<template v-else>
					<Button size="sm" variant="secondary" @click="toggleEdit">Batal</Button>
					<Button size="sm" class="bg-blue-500 text-white" @click="saveProfile">Simpan</Button>
				</template>
			</div>
		</div>

		<hr class="border-gray-200 mb-6" />

		<!-- PROFILE FORM -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div><label class="text-sm text-gray-600 mb-2 block">Nama Lengkap</label><Input v-model="user.name" :readonly="!isEditing" class="bg-gray-50" /></div>
			<div><label class="text-sm text-gray-600 mb-2 block">Email</label><Input v-model="user.email" :readonly="!isEditing" class="bg-gray-50" /></div>

			<div><label class="text-sm text-gray-600 mb-2 block">Nama Instansi</label><Input v-model="user.instanceName" :readonly="!isEditing" class="bg-gray-50" /></div>
			<div><label class="text-sm text-gray-600 mb-2 block">Email Instansi</label><Input v-model="user.instanceEmail" :readonly="!isEditing" class="bg-gray-50" /></div>

			<div><label class="text-sm text-gray-600 mb-2 block">Provinsi</label><Input v-model="user.instanceProvince" :readonly="!isEditing" class="bg-gray-50" /></div>
			<div><label class="text-sm text-gray-600 mb-2 block">Kota</label><Input v-model="user.instanceDistrict" :readonly="!isEditing" class="bg-gray-50" /></div>

			<div><label class="text-sm text-gray-600 mb-2 block">Kecamatan</label><Input v-model="user.instanceSubDistrict" :readonly="!isEditing" class="bg-gray-50" /></div>

			<div class="md:col-span-2">
				<label class="text-sm text-gray-600 mb-2 block">Alamat Lengkap</label>
				<Textarea v-model="user.instanceAddress" rows="3" :readonly="!isEditing" class="bg-gray-50" />
			</div>

			<div><label class="text-sm text-gray-600 mb-2 block">No Telp</label><Input v-model="user.instancePhone" :readonly="!isEditing" class="bg-gray-50" /></div>
		</div>

		<hr class="border-gray-200 my-6" />

		<!-- PASSWORD SECTION -->
		<div class="bg-gray-50 p-6 rounded-lg mt-8 border border-gray-200">
			<h3 class="text-lg font-semibold text-gray-800 mb-4">Ganti Password</h3>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<!-- PASSWORD LAMA -->
				<div>
					<label class="text-sm text-gray-600 mb-2 block">Password Lama</label>
					<div class="relative">
						<Input :type="showOldPassword ? 'text' : 'password'" v-model="passwordForm.oldPassword" class="bg-white pr-10" />
						<button type="button" class="absolute inset-y-0 right-3 text-gray-400 hover:text-gray-600" @click="showOldPassword = !showOldPassword">
							<Eye v-if="!showOldPassword" class="w-4 h-4" />
							<EyeOff v-else class="w-4 h-4" />
						</button>
					</div>
				</div>

				<!-- PASSWORD BARU -->
				<div>
					<label class="text-sm text-gray-600 mb-2 block">Password Baru</label>
					<div class="relative">
						<Input :type="showNewPassword ? 'text' : 'password'" v-model="passwordForm.newPassword" class="bg-white pr-10" />
						<button type="button" class="absolute inset-y-0 right-3 text-gray-400 hover:text-gray-600" @click="showNewPassword = !showNewPassword">
							<Eye v-if="!showNewPassword" class="w-4 h-4" />
							<EyeOff v-else class="w-4 h-4" />
						</button>
					</div>
				</div>

				<!-- CONFIRM PASSWORD -->
				<div>
					<label class="text-sm text-gray-600 mb-2 block">Konfirmasi Password Baru</label>
					<div class="relative">
						<Input :type="showConfirmPassword ? 'text' : 'password'" v-model="passwordForm.confirmPassword" class="bg-white pr-10" />
						<button type="button" class="absolute inset-y-0 right-3 text-gray-400 hover:text-gray-600" @click="showConfirmPassword = !showConfirmPassword">
							<Eye v-if="!showConfirmPassword" class="w-4 h-4" />
							<EyeOff v-else class="w-4 h-4" />
						</button>
					</div>
				</div>
			</div>

			<div class="flex justify-end mt-6">
				<Button class="bg-blue-600 text-white" @click="changePassword">Update Password</Button>
			</div>
		</div>
	</div>
</template>
