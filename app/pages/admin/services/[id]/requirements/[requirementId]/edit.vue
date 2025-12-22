<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";
import { useRequirementService } from "~/services/requirement.services";

definePageMeta({ layout: "admin", middleware: "superadmin" });

const route = useRoute();
const router = useRouter();
const serviceId = Number(route.params.id);
const requirementId = Number(route.params.requirementId);

const form = reactive({ order: 1, description: "" });
const loading = ref(true);
const saving = ref(false);

const { get, update } = useRequirementService(serviceId);

const fetchItem = async () => {
	loading.value = true;
	try {
		const res = await get(requirementId);
		form.order = (res as any).order ?? 1;
		form.description = (res as any).description ?? "";
	} catch (err) {
		toast.error("Gagal memuat detail requirement");
	} finally {
		loading.value = false;
	}
};

onMounted(fetchItem);

const handleSubmit = async () => {
	saving.value = true;
	try {
		await update(requirementId, { order: Number(form.order), description: form.description });
		toast.success("Detail requirement diperbarui");
		router.push(`/admin/services/${serviceId}/requirements`);
	} catch (err) {
		toast.error("Gagal memperbarui detail requirement");
	} finally {
		saving.value = false;
	}
};
</script>

<template>
	<div class="space-y-6 bg-white p-8 rounded">
		<h2 class="text-lg font-semibold">Edit Detail Persyaratan</h2>

		<div v-if="loading" class="text-center text-gray-400 py-6">Memuat data...</div>

		<template v-else>
			<div class="grid grid-cols-2 gap-4">
				<div>
					<Label>Urutan</Label>
					<Input v-model="form.order" inputmode="numeric" placeholder="1" class="bg-gray-50" />
				</div>

				<div class="col-span-2">
					<Label>Deskripsi</Label>
					<Textarea v-model="form.description" placeholder="Contoh: Fotokopi KTP" class="bg-gray-50" />
				</div>

				<div class="col-span-2 flex justify-between pt-4">
					<NuxtLink :to="`/admin/services/${serviceId}/requirements`">
						<Button variant="secondary">Batal</Button>
					</NuxtLink>
					<Button @click="handleSubmit">{{ saving ? "Menyimpan..." : "Simpan Perubahan" }}</Button>
				</div>
			</div>
		</template>
	</div>
</template>
