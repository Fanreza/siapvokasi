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

			<!-- Accordion (client-only) -->
			<ClientOnly>
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
			</ClientOnly>
		</div>
	</section>
</template>

<script setup lang="ts">
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ref, onMounted } from "vue";
import { useFaqService } from "~/services/faq.services";

const faqs = ref<any[]>([]);
const loading = ref(false);

const { getAll, response } = useFaqService();

const fetchFaqs = async () => {
	loading.value = true;
	try {
		// fetch public faqs; composable will set `response`
		await getAll(undefined, true);
		const raw = response.value as any;
		const items = raw?.items || raw?.data || [];
		// sort by order ascending
		faqs.value = items.sort((a: any, b: any) => Number(a.order ?? 0) - Number(b.order ?? 0));
	} catch (err) {
		faqs.value = [];
		console.error(err);
	} finally {
		loading.value = false;
	}
};

onMounted(fetchFaqs);
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
