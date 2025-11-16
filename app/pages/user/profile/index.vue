<script setup lang="ts">
import { reactive, ref } from "vue";
import { Icon } from "#components";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

definePageMeta({
	layout: "user",
});

const isEditing = ref(false);

const user = reactive({
	name: "Sean Andrian",
	email: "sean@gmail.com",
	password: "********",
	instansi: "Kemnaker",
	namaLengkap: "Sean Andrian",
	provinsi: "Sulawesi Selatan",
	kota: "Makassar",
	kecamatan: "Makassar",
	alamat: "Jln Merdeka",
	noTelp: "0812191919",
});

const toggleEdit = () => (isEditing.value = !isEditing.value);

const saveProfile = () => {
	// TODO: Simpan ke API
	isEditing.value = false;
};
</script>

<template>
	<div class="bg-white rounded-xl shadow-sm p-6 md:p-8">
		<!-- HEADER -->
		<div class="flex items-start justify-between mb-6">
			<div>
				<h2 class="text-xl font-semibold text-gray-800">{{ user.name }}</h2>
				<div class="text-sm text-gray-500 flex items-center gap-2 mt-2">
					<Icon name="mail" class="w-4 h-4 opacity-70" />
					<span>{{ user.email }}</span>
				</div>

				<div class="text-sm text-gray-400 flex items-center gap-2 mt-2">
					<Icon name="lock" class="w-4 h-4 opacity-70" />
					<span>{{ user.password }}</span>
				</div>
			</div>

			<!-- BUTTON GROUP (edit or save/cancel) -->
			<div class="flex items-center gap-3">
				<Button v-if="!isEditing" size="sm" class="bg-blue-500 hover:bg-blue-600 text-white" @click="toggleEdit"> Edit Profil </Button>

				<template v-else>
					<Button size="sm" variant="secondary" @click="toggleEdit">Batal</Button>
					<Button size="sm" class="bg-blue-500 text-white" @click="saveProfile">Simpan</Button>
				</template>
			</div>
		</div>

		<hr class="border-gray-200 mb-6" />

		<!-- FORM SECTION (ATAS) -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div>
				<label class="text-sm text-gray-600 mb-2 block">Nama Instansi</label>
				<Input v-model="user.instansi" :readonly="!isEditing" class="bg-gray-50" />
			</div>

			<div>
				<label class="text-sm text-gray-600 mb-2 block">Nama Lengkap</label>
				<Input v-model="user.namaLengkap" :readonly="!isEditing" class="bg-gray-50" />
			</div>

			<div>
				<label class="text-sm text-gray-600 mb-2 block">Provinsi</label>
				<Input v-model="user.provinsi" :readonly="!isEditing" class="bg-gray-50" />
			</div>

			<div>
				<label class="text-sm text-gray-600 mb-2 block">Kota</label>
				<Input v-model="user.kota" :readonly="!isEditing" class="bg-gray-50" />
			</div>

			<div>
				<label class="text-sm text-gray-600 mb-2 block">Kecamatan</label>
				<Input v-model="user.kecamatan" :readonly="!isEditing" class="bg-gray-50" />
			</div>

			<div>
				<label class="text-sm text-gray-600 mb-2 block">Alamat Lengkap</label>
				<Textarea v-model="user.alamat" rows="4" :readonly="!isEditing" class="bg-gray-50" />
			</div>

			<div>
				<label class="text-sm text-gray-600 mb-2 block">No Telp</label>
				<Input v-model="user.noTelp" :readonly="!isEditing" class="bg-gray-50" />
			</div>

			<div></div>
		</div>

		<hr class="border-gray-200 my-6" />

		<!-- FORM SECTION (BAWAH) -->
		<div class="grid grid-cols-1 gap-6">
			<div>
				<label class="text-sm text-gray-600 mb-2 block">Email</label>
				<Input v-model="user.email" :readonly="!isEditing" class="bg-gray-50" />
			</div>

			<div>
				<label class="text-sm text-gray-600 mb-2 block">Password</label>
				<Input v-model="user.password" type="password" :readonly="!isEditing" class="bg-gray-50" />
			</div>
		</div>
	</div>
</template>
