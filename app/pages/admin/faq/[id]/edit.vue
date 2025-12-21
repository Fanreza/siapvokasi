<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";
import { useFaqService } from "~/services/faq.services";

definePageMeta({
	layout: "admin",
	middleware: "admin",
});

const route = useRoute();
const router = useRouter();
const id = Number(route.params.id);

const loading = ref(true);
const saving = ref(false);

const form = reactive({ question: "", answer: "", order: 1 });

const { get, update } = useFaqService();

const fetchFaq = async () => {
	try {
		const res = await get(id);
		form.question = res.question;
		form.answer = res.answer;
		form.order = res.order ?? 1;
	} catch (err) {
		toast.error("Gagal memuat data FAQ");
	} finally {
		loading.value = false;
	}
};

onMounted(fetchFaq);

const handleSubmit = async () => {
	saving.value = true;
	try {
		await update(id, { question: form.question, answer: form.answer, order: Number(form.order) });
		toast.success("Perubahan FAQ disimpan");
		router.push("/admin/faq");
	} catch (err) {
		toast.error("Gagal menyimpan perubahan");
	} finally {
		saving.value = false;
	}
};
</script>

<template>
	<div class="space-y-6 bg-white p-10 rounded-lg min-h-[60vh]">
		<h2 class="text-xl font-semibold">Edit FAQ</h2>

		<div v-if="loading" class="text-center text-gray-400 py-10">Memuat data...</div>

		<template v-else>
			<div class="grid gap-2">
				<Label>Pertanyaan</Label>
				<Input v-model="form.question" placeholder="Masukkan pertanyaan" class="bg-gray-50" />
			</div>

			<div class="grid gap-2">
				<Label>Jawaban</Label>
				<Textarea v-model="form.answer" placeholder="Masukkan jawaban" rows="6" class="bg-gray-50" />
			</div>

			<div class="grid gap-2">
				<Label>Urutan</Label>
				<Input v-model.number="form.order" type="text" inputmode="numeric" pattern="[0-9]*" class="bg-gray-50 w-36" />
			</div>

			<div class="flex justify-between pt-6">
				<NuxtLink to="/admin/faq">
					<Button variant="secondary">Batal</Button>
				</NuxtLink>

				<Button @click="handleSubmit" class="bg-blue-600 text-white">{{ saving ? "Menyimpan..." : "Simpan Perubahan" }}</Button>
			</div>
		</template>
	</div>
</template>
