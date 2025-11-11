<template>
	<section class="bg-white py-16 md:py-24">
		<!-- Title -->
		<AppUiPageHeader title="Sejarah Stankomproglat" :breadcrumbs="['Profil', 'Sejarah']" />

		<div class="mx-auto w-[85%] gap-10 mt-1 grid grid-cols-2 items-center justify-center">
			<!-- Timeline -->
			<div>
				<!-- Loading Skeleton -->
				<div v-if="loading" class="space-y-10">
					<div v-for="i in 4" :key="i" class="flex gap-4 animate-pulse">
						<div class="h-4 w-4 bg-blue-200 rounded-full mt-2"></div>
						<div class="space-y-3 flex-1">
							<div class="h-5 w-1/4 bg-gray-200 rounded"></div>
							<div class="h-4 w-3/4 bg-gray-100 rounded"></div>
						</div>
					</div>
				</div>

				<!-- Timeline Items -->
				<div class="relative pl-6 space-y-10">
					<Stepper orientation="vertical" :model-value="histories.length" class="mx-auto flex w-full max-w-md flex-col justify-start gap-10">
						<StepperItem v-for="(item, index) in histories" :key="item.id" v-slot="{ state }" class="relative flex w-full items-start gap-6" :step="index">
							<!-- Garis penghubung -->
							<StepperSeparator v-if="index !== histories.length - 1" class="absolute left-[18px] top-[38px] block h-[105%] w-[2px] rounded-full bg-blue-900" />

							<!-- Stepper Trigger -->
							<StepperTrigger as-child>
								<!-- Non-interaktif -->
								<Button size="icon" class="pointer-events-none z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-900">
									<Check class="size-5 text-white" />
								</Button>
							</StepperTrigger>

							<!-- Konten -->
							<div class="flex flex-col gap-1">
								<StepperTitle class="text-xl font-bold text-blue-900">
									{{ item.year }}
								</StepperTitle>
								<StepperDescription class="text-base font-semibold text-blue-600">
									{{ item.description }}
								</StepperDescription>
								<p class="text-gray-700 leading-relaxed">
									{{ item.detail }}
								</p>
							</div>
						</StepperItem>
					</Stepper>
				</div>
			</div>

			<!-- Illustration -->
			<div class="hidden lg:block w-[80%]">
				<NuxtImg src="/images/history.png" alt="History illustration" class="w-full" />
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useHistoryService } from "@/services/history.services";
import { toast } from "vue-sonner";

// Service
const { getAll, response, loading } = useHistoryService();
const histories = ref<any[]>([]);

onMounted(async () => {
	try {
		await getAll(true); // pakai endpoint public
		histories.value = response.value?.data || [];
	} catch {
		toast.error("Gagal memuat data sejarah.");
	}
});
</script>

<style scoped>
/* Animasi timeline muncul */
@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.relative > div {
	animation: fadeInUp 0.6s ease-out both;
}
</style>
