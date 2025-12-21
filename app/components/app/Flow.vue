<template>
	<section class="bg-gradient-to-b from-white to-gray-50 py-24 relative overflow-hidden">
		<!-- Soft blue glow -->
		<div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-200 rounded-full opacity-20 blur-3xl"></div>

		<div class="max-w-7xl mx-auto px-4 relative z-10">
			<!-- Heading -->
			<div class="text-center mb-20">
				<p class="text-blue-600 font-semibold mb-3 uppercase text-xs tracking-wide">Tahapan Layanan</p>
				<h2 class="text-3xl lg:text-4xl font-bold text-gray-900 leading-snug">
					Berikut Alur Layanan <br />
					SIAP VOKASI
				</h2>
			</div>

			<!-- STEPPER -->
			<div class="max-w-6xl mx-auto">
				<Stepper v-model="currentStep" class="flex flex-wrap justify-center items-center gap-12 p-10">
					<StepperItem v-for="item in steps" :key="item.step" :step="item.step" class="relative flex-1 flex flex-col items-center">
						<!-- IMAGE BOX (fixed height) -->

						<StepperTrigger as-child>
							<div class="flex flex-col items-center text-center w-full cursor-default">
								<div class="relative w-[170px] h-[170px] flex items-center justify-center">
									<!-- Number on top right -->
									<div class="absolute -top-3 -right-10 text-[70px] font-bold text-gray-800 select-none">
										{{ item.step }}
									</div>

									<img :src="item.image" :alt="item.title" class="w-full h-full object-contain" />
								</div>

								<!-- Title -->
								<StepperTitle class="text-2xl font-bold text-gray-900 mt-6">
									{{ item.title }}
								</StepperTitle>

								<!-- Description -->
								<StepperDescription class="text-sm text-gray-600 mt-4 leading-relaxed min-h-[80px]">
									<div>
										<template v-if="Array.isArray(item.description) && item.description.length > 1">
											<ul class="space-y-1">
												<li v-for="(desc, idx) in item.description" :key="idx" class="flex items-start justify-center">{{ desc }}</li>
											</ul>
										</template>
										<template v-else>
											<p>{{ Array.isArray(item.description) ? item.description[0] : item.description }}</p>
										</template>
									</div>
								</StepperDescription>
							</div>
						</StepperTrigger>
					</StepperItem>
				</Stepper>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Stepper, StepperItem, StepperTrigger, StepperTitle, StepperDescription } from "@/components/ui/stepper";

const currentStep = ref(1);

const steps = [
	{
		step: 1,
		title: "Pendaftaran",
		description: ["Mengisi Formulir", "Melengkapi Dokumen Persyaratan"],
		image: "/images/flow1.png",
	},
	{
		step: 2,
		title: "Pengecekan",
		description: ["Melakukan Pengecekan dan melakukan verifikasi serta memberitahukan dokumen"],
		image: "/images/flow2.png",
	},
	{
		step: 3,
		title: "Persetujuan",
		description: ["Apabila dokumen yang disubmit telah, maka akan disetujui"],
		image: "/images/flow3.png",
	},
];
</script>
