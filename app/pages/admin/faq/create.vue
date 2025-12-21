<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";
import { useFaqService } from "~/services/faq.services";

definePageMeta({
	layout: "admin",
	middleware: "admin",
});

const router = useRouter();
const loading = ref(false);

const form = reactive({
	question: "",
	answer: "",
	order: 1,
});

const { create } = useFaqService();

const handleSubmit = async () => {
	if (!form.question || !form.answer) return toast.error("Harap lengkapi semua field");

	loading.value = true;
	try {
		await create({ question: form.question, answer: form.answer, order: Number(form.order) });
		toast.success("FAQ berhasil dibuat");
		router.push("/admin/faq");
	} catch (err) {
		toast.error("Gagal membuat FAQ");
	} finally {
		loading.value = false;
	}
};
</script>

<template>
	<div class="space-y-6 bg-white p-10 rounded-lg min-h-[60vh]">
		<h2 class="text-xl font-semibold">Tambah FAQ</h2>

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

			<Button @click="handleSubmit" class="bg-blue-600 text-white">{{ loading ? "Memproses..." : "Simpan" }}</Button>
		</div>
	</div>
</template>
