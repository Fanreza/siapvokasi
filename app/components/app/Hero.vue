<template>
	<div id="home" class="min-h-screen relative overflow-hidden flex items-center bg-[#F1F5FF] px-10">
		<!-- Background Image -->
		<div class="absolute inset-0 pointer-events-none hidden md:block">
			<img src="/images/hero.png" alt="Hero Illustration" class="absolute right-0 top-0 h-full object-contain opacity-100 select-none" />
		</div>

		<!-- Actual Content -->
		<div class="w-full lg:w-[70%] 2xl:w-[50%] z-40">
			<div class="text-blue-600 font-bold mb-4 uppercase text-xs tracking-widest">PENELUSURAN SIAP VOKASI</div>

			<h1 class="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6 leading-tight">LAYANAN STANDAR, INOVASI, DAN AKSELERASI PELAYANAN VOKASI</h1>

			<p class="text-gray-600 mb-10 text-base lg:text-lg leading-relaxed max-w-xl">Direktorat Bina Standardisasi Kompetensi dan Program Pelatihan</p>

			<!-- Search / Tracking Box -->
			<div class="bg-white rounded-2xl shadow-2xl p-6 flex flex-wrap justify-center items-center w-full" v-if="layout === 'default'">
				<input v-model="ticketNumber" type="text" placeholder="Masukan Nomor Tiket" class="text-center md:text-left flex-1 px-5 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black font-bold" />

				<Button @click="onNavigateTicket" :disabled="!ticketNumber" class="bg-blue-600 text-white px-8 py-3.5 rounded-xl hover:bg-blue-700 transition-all font-semibold whitespace-nowrap shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"> Tracking </Button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const ticketNumber = ref("");

withDefaults(
	defineProps<{
		layout?: "default" | "tracking";
	}>(),
	{
		layout: "default",
	}
);

const onNavigateTicket = () => {
	navigateTo({
		path: "/tracking",
		query: { ticket: ticketNumber.value },
		hash: "#tracking-section",
	});
};
</script>
