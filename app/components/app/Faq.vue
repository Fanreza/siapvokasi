<template>
	<section id="faq" class="bg-gradient-to-br from-gray-50 to-blue-50 py-20 relative overflow-hidden">
		<!-- Decorative blur circle -->
		<div class="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>

		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
			<!-- Header -->
			<div class="text-center mb-12">
				<div class="text-blue-600 font-semibold mb-3 uppercase text-xs tracking-wide">FAQ</div>
				<h2 class="text-3xl lg:text-4xl font-bold text-gray-900">Frequesntly Asked<br />Questions</h2>
			</div>

			<!-- Accordion -->
			<Accordion type="single" collapsible class="space-y-4">
				<AccordionItem v-for="(faq, index) in faqs" :key="index" :value="`item-${index}`" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
					<AccordionTrigger class="px-6 py-4 hover:bg-gray-50 transition-colors [&[data-state=open]]:bg-gray-50">
						<div class="flex items-center gap-3 text-left w-full">
							<span class="text-blue-600 font-bold text-lg flex-shrink-0">Q</span>
							<span class="font-semibold text-gray-900 text-base">{{ faq.question }}</span>
						</div>
					</AccordionTrigger>
					<AccordionContent class="px-6 pb-4 pt-2">
						<p class="text-gray-600 text-sm leading-relaxed pl-8">
							{{ faq.answer }}
						</p>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	</section>
</template>

<script setup lang="ts">
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
	{
		question: "Bagaimana Penggunaan?",
		answer: "It's a disclaimer - the entire process of writing a blog post often takes more than a couple of hours, even if you can type eighty words as per minute and your writing skills are sharp.",
	},
	{
		question: "Persyaratan apa saja yang dibutuhkan?",
		answer: "Anda memerlukan dokumen identitas, formulir pendaftaran yang telah diisi, dan dokumen pendukung lainnya sesuai jenis layanan yang diajukan.",
	},
	{
		question: "Bagaimana cara melakukan pelacakan layanan yang sudah didaftarkan?",
		answer: "Anda dapat melacak layanan menggunakan nomor tiket yang diberikan saat pendaftaran melalui fitur tracking di halaman utama.",
	},
	{
		question: "Bagaimana cara memiliki akun?",
		answer: 'Klik tombol "Login Akun" atau "Buat Pengajuan Baru", kemudian pilih opsi registrasi dan isi formulir pendaftaran dengan data yang valid.',
	},
];
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
