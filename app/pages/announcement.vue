<!-- components/DocumentList.vue -->
<template>
	<section class="bg-white py-16 md:py-24">
		<!-- Title -->
		<AppUiPageHeader title="Pengumuman Resmi" :breadcrumbs="['Info', 'Pengumuman']" />

		<div class="mx-auto w-[80%]">
			<!-- Document List -->
			<div class="space-y-10">
				<AppUiDocumentItem v-for="document in paginatedDocuments" :key="document.id" :title="document.title" :description="document.description" :date="document.date" :attachment="document.attachment" />
			</div>

			<!-- Pagination -->
			<AppUiPagination v-if="totalPages > 1" :current-page="currentPage" :total-pages="totalPages" @update:current-page="currentPage = $event" />
		</div>
	</section>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface Document {
	id: number;
	title: string;
	description: string;
	date: string;
	attachment: string;
}

const props = defineProps<{
	documents?: Document[];
	itemsPerPage?: number;
}>();

const currentPage = ref(1);
const itemsPerPage = props.itemsPerPage || 5;

const defaultDocuments: Document[] = [
	{
		id: 1,
		title: "PENTING: Perpanjangan Batas Waktu Pendaftaran",
		description: "Batas waktu pendaftaran untuk Workshop Sertifikasi Profesi diperpanjang hingga 25 Desember 2024. Jangan lewatkan kesempatan ini!",
		date: "01 Des 2024",
		attachment: "/files/document-1.pdf",
	},
	{
		id: 2,
		title: "PENTING: Perpanjangan Batas Waktu Pendaftaran",
		description: "Batas waktu pendaftaran untuk Workshop Sertifikasi Profesi diperpanjang hingga 25 Desember 2024. Jangan lewatkan kesempatan ini!",
		date: "01 Des 2024",
		attachment: "/files/document-2.pdf",
	},
	{
		id: 3,
		title: "PENTING: Perpanjangan Batas Waktu Pendaftaran",
		description: "Batas waktu pendaftaran untuk Workshop Sertifikasi Profesi diperpanjang hingga 25 Desember 2024. Jangan lewatkan kesempatan ini!",
		date: "01 Des 2024",
		attachment: "/files/document-3.pdf",
	},
	{
		id: 4,
		title: "PENTING: Perpanjangan Batas Waktu Pendaftaran",
		description: "Batas waktu pendaftaran untuk Workshop Sertifikasi Profesi diperpanjang hingga 25 Desember 2024. Jangan lewatkan kesempatan ini!",
		date: "01 Des 2024",
		attachment: "/files/document-4.pdf",
	},
	{
		id: 5,
		title: "Pengumuman Workshop Sertifikasi",
		description: "Workshop sertifikasi profesi akan diadakan pada bulan Januari 2025",
		date: "28 Nov 2024",
		attachment: "/files/document-5.pdf",
	},
	{
		id: 6,
		title: "Jadwal Pelatihan Bulan Desember",
		description: "Informasi jadwal pelatihan untuk bulan Desember 2024",
		date: "25 Nov 2024",
		attachment: "/files/document-6.pdf",
	},
];

const documents = computed(() => props.documents || defaultDocuments);

const totalPages = computed(() => Math.ceil(documents.value.length / itemsPerPage));

const paginatedDocuments = computed(() => {
	const start = (currentPage.value - 1) * itemsPerPage;
	const end = start + itemsPerPage;
	return documents.value.slice(start, end);
});
</script>
