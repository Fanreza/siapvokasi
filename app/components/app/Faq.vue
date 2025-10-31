<template>
	<section class="bg-white py-20 md:py-24">
		<div class="container mx-auto px-4">
			<div class="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start">
				<!-- Left Side - Illustration -->
				<div class="flex items-center justify-center lg:sticky lg:top-32">
					<NuxtImg src="/images/faq.png" alt="FAQ Illustration" width="500" height="500" class="max-w-[50%] lg:max-w-[80%] xl:max-w-full h-auto" />
				</div>

				<!-- Right Side - FAQ -->
				<div class="flex flex-col justify-center">
					<h2 class="mb-8 text-center text-4xl font-bold text-gray-900 md:text-5xl">FAQ</h2>

					<Accordion type="single" collapsible class="space-y-4">
						<AccordionItem v-for="(faq, index) in faqs" :key="index" :value="`item-${index + 1}`" :class="['border-b border-gray-200', index === faqs.length - 1 ? 'border-b-0' : '']" class="rounded-lg border px-6 data-[state=open]:border-[#0C2C71] data-[state=open]:text-primary">
							<AccordionTrigger class="text-left text-base font-medium hover:no-underline text-gray-900 data-[state=open]:text-primary data-[state=open]:border-[#EDF2FF] data-[state=open]:border-b rounded-none">
								<div class="flex items-start gap-3">
									<span class="text-gray-500">{{ index + 1 }}.</span>
									<span>{{ faq.question }}</span>
								</div>
							</AccordionTrigger>

							<AccordionContent class="pl-7 pt-2 text-sm leading-relaxed text-gray-600 data-[state=open]:text-white">
								{{ faq.answer }}
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
const faqs = [
	{
		question: "Non consectetur a erat nam at lectus urna duis?",
		answer: "Feugiat pretium nibh ipsum consequat. Tempus iaculis urna id volutpat lacus laoreet non curabitur gravida. Venenatis lectus magna fringilla urna porttitor rhoncus dolor purus non.",
	},
	{
		question: "Feugiat scelerisque varius morbi enim nunc faucibus?",
		answer: "Dolor sit amet consectetur adipiscing elit pellentesque habitant morbi. Id interdum velit laoreet id donec ultrices. Fringilla phasellus faucibus scelerisque eleifend donec pretium.",
	},
	{
		question: "Dolor sit amet consectetur adipiscing elit pellentesque?",
		answer: "Eleifend mi in nulla posuere sollicitudin aliquam ultrices sagittis orci. Faucibus pulvinar elementum integer enim. Sem nulla pharetra diam sit amet nisl suscipit.",
	},
	{
		question: "Ac odio tempor orci dapibus. Aliquam eleifend mi in nulla?",
		answer: "Dolor sit amet consectetur adipiscing elit pellentesque habitant morbi. Id interdum velit laoreet id donec ultrices tincidunt arcu non sodales neque.",
	},
];
</script>
