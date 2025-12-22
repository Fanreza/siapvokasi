<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";
import { useRequirementService } from "~/services/requirement.services";

definePageMeta({ layout: "admin", middleware: "superadmin" });

const route = useRoute();
const router = useRouter();
const serviceId = Number(route.params.id);

const form = reactive({ order: 1, description: "" });
const saving = ref(false);

const { create } = useRequirementService(serviceId);

const handleSubmit = async () => {
	saving.value = true;
	try {
		await create({ order: Number(form.order), description: form.description });
		toast.success("Detail requirement dibuat");
		router.push(`/admin/services/${serviceId}/requirements`);
	} catch (err) {
		toast.error("Gagal membuat detail requirement");
	} finally {
		saving.value = false;
	}
};
</script>

<template>
	<div class="space-y-6 bg-white p-8 rounded">
		<h2 class="text-lg font-semibold">Tambah Detail Persyaratan</h2>

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
				<Button @click="handleSubmit">{{ saving ? "Menyimpan..." : "Buat" }}</Button>
			</div>
		</div>
	</div>
</template>
