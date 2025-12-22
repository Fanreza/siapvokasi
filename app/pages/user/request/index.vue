<script setup lang="ts">
definePageMeta({
	layout: "user",
	middleware: "user",
});

import { ref, onMounted } from "vue";
import { usePersyaratanService } from "~/services/service.services";

const { getServices } = usePersyaratanService();

const currentTab = ref("pilih-layanan");
const selectedService = ref();

const services = ref<{ value: string; label: string }[]>([]);
const loadingServices = ref(false);

const goNext = (to?: string) => {
	if (to) currentTab.value = to;
	else if (currentTab.value === "pilih-layanan") currentTab.value = "daftar";
	else if (currentTab.value === "daftar") currentTab.value = "selesai";
};

const goPrev = () => {
	if (currentTab.value === "selesai") currentTab.value = "daftar";
	else if (currentTab.value === "daftar") currentTab.value = "pilih-layanan";
};

onMounted(async () => {
	loadingServices.value = true;

	try {
		const res = await getServices();

		// 🔥 mapping API → Select UI model
		services.value = res.data.map((s) => ({
			value: s.id.toString(), // ID service untuk submit
			label: s.name, // label untuk tampil di dropdown
		}));
	} catch (err) {
		console.error("Failed fetching services:", err);
	} finally {
		loadingServices.value = false;
	}
});
</script>

<template>
	<div class="bg-white p-10 rounded">
		<!-- Header -->
		<div class="flex flex-col items-center mb-8">
			<Icon name="streamline-color:user-circle-single-flat" class="text-7xl" />
			<h1 class="text-2xl font-semibold text-blue-500 mt-5">Pengajuan Layanan Baru</h1>
		</div>

		<Tabs v-model="currentTab" class="w-full">
			<TabsList class="grid w-full grid-cols-3 mb-8 bg-transparent h-auto p-0 gap-4">
				<TabsTrigger :disabled="true" value="pilih-layanan" class="bg-none border-none shadow-none flex flex-col data-disabled:opacity-100 data-disabled:text-inherit">
					<span class="text-sm" :class="currentTab === 'pilih-layanan' ? 'font-bold text-[#6D6D80]' : 'text-gray-500'">PILIH LAYANAN</span>
					<div class="w-full h-4 rounded-2xl bg-blue-500" :class="currentTab === 'pilih-layanan' ? 'opacity-100' : 'opacity-30'"></div>
				</TabsTrigger>

				<TabsTrigger :disabled="true" value="daftar" class="bg-none border-none shadow-none flex flex-col data-disabled:opacity-100 data-disabled:text-inherit">
					<span class="text-sm" :class="currentTab === 'daftar' ? 'font-bold text-[#6D6D80]' : 'text-gray-500'">DAFTAR LAYANAN</span>
					<div class="w-full h-4 rounded-2xl bg-blue-500" :class="currentTab === 'daftar' ? 'opacity-100' : 'opacity-30'"></div>
				</TabsTrigger>

				<TabsTrigger :disabled="true" value="selesai" class="bg-none border-none shadow-none flex flex-col data-disabled:opacity-100 data-disabled:text-inherit">
					<span class="text-sm" :class="currentTab === 'selesai' ? 'font-bold text-[#6D6D80]' : 'text-gray-500'">SELESAI</span>
					<div class="w-full h-4 rounded-2xl bg-blue-500" :class="currentTab === 'selesai' ? 'opacity-100' : 'opacity-30'"></div>
				</TabsTrigger>
			</TabsList>

			<!-- CONTENT: Pilih Layanan -->
			<TabsContent value="pilih-layanan">
				<UserPageFormSelect :services="services" v-model:selected="selectedService" @next="goNext" />
			</TabsContent>

			<!-- CONTENT: Daftar (form) -->
			<TabsContent value="daftar">
				<UserPageFormRequest :selectedService="selectedService" @previous="goPrev" @submit="(payload) => console.log(payload)" @next="goNext" />
			</TabsContent>

			<!-- CONTENT: Selesai -->
			<TabsContent value="selesai">
				<UserPageFormFinish @previous="goPrev" />
			</TabsContent>
		</Tabs>
	</div>
</template>
