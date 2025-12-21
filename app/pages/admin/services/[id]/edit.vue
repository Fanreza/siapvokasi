<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";
import { usePersyaratanService } from "~/services/service.services";

definePageMeta({ layout: "admin", middleware: "superadmin" });

const route = useRoute();
const router = useRouter();
const id = Number(route.params.id);

const loading = ref(true);
const saving = ref(false);

const form = reactive({ name: "", workingTime: "", document: null as File | null, documentPath: null as string | null });
const fileName = ref<string | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const pickFile = () => fileInput.value?.click();

const { get, update } = usePersyaratanService();

const fetchItem = async () => {
	try {
		const res = await get(id);
		form.name = res.name;
		form.workingTime = res.workingTime;
		form.documentPath = (res as any).documentPath ?? null;
	} catch (err) {
		toast.error("Gagal memuat data persyaratan");
	} finally {
		loading.value = false;
	}
};

onMounted(fetchItem);

const handleFile = (e: Event) => {
	const input = e.target as HTMLInputElement;
	const f = input.files && input.files[0] ? input.files[0] : null;
	form.document = f;
	fileName.value = f ? f.name : null;
};
const clearFile = () => {
	if (fileInput.value) fileInput.value.value = "";
	form.document = null;
	fileName.value = null;
};

const handleSubmit = async () => {
	saving.value = true;
	try {
		await update(id, { name: form.name, workingTime: form.workingTime, document: form.document });
		toast.success("Perubahan persyaratan disimpan");
		router.push("/admin/services");
	} catch (err) {
		toast.error("Gagal menyimpan perubahan");
	} finally {
		saving.value = false;
	}
};
</script>

<template>
	<div class="space-y-6 bg-white p-10 rounded-lg min-h-[60vh]">
		<h2 class="text-xl font-semibold">Edit Persyaratan</h2>

		<div v-if="loading" class="text-center text-gray-400 py-10">Memuat data...</div>

		<template v-else>
			<div class="grid gap-2">
				<Label>Nama</Label>
				<Input v-model="form.name" placeholder="Nama persyaratan" class="bg-gray-50" />
			</div>

			<div class="grid gap-2">
				<Label>Waktu Pengerjaan</Label>
				<Input v-model="form.workingTime" placeholder="Contoh: 20 hari" class="bg-gray-50" />
			</div>

			<div class="grid gap-2">
				<Label>Dokumen (opsional)</Label>
				<div class="flex items-center gap-3">
					<input ref="fileInput" type="file" class="hidden" @change="handleFile" />
					<button type="button" @click="pickFile" class="inline-flex items-center gap-2 px-3 py-2 border rounded-md bg-white hover:bg-gray-50">
						<Icon name="lucide:paperclip" class="w-4 h-4 text-gray-600" />
						<span class="text-sm">Pilih Dokumen</span>
					</button>
					<div class="flex items-center gap-2">
						<span class="text-sm text-gray-600 max-w-xs truncate">{{ fileName || form.documentPath || "Tidak ada file dipilih" }}</span>
						<button v-if="fileName" type="button" @click="clearFile" aria-label="Hapus file" class="p-1 rounded-full hover:bg-gray-100">
							<Icon name="lucide:x" class="w-4 h-4 text-gray-500" />
						</button>
						<div v-if="form.documentPath">
							<a :href="form.documentPath" target="_blank" class="text-blue-600 ml-2">(lihat)</a>
						</div>
					</div>
				</div>
			</div>

			<div class="flex justify-between pt-6">
				<NuxtLink to="/admin/services">
					<Button variant="secondary">Batal</Button>
				</NuxtLink>

				<Button @click="handleSubmit" class="bg-blue-600 text-white">{{ saving ? "Menyimpan..." : "Simpan Perubahan" }}</Button>
			</div>
		</template>
	</div>
</template>
