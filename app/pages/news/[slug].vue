<template>
	<section class="bg-white py-16 md:py-24">
		<!-- Title -->
		<AppUiPageHeader title="Berita Terbaru" :breadcrumbs="['Info', 'Berita']" />

		<!-- Hero / Banner -->
		<div class="container mx-auto px-4 py-10">
			<div class="rounded-2xl overflow-hidden shadow-sm">
				<img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80" alt="Peluncuran Program Sertifikasi Baru" class="w-full h-[500px] object-cover" />
			</div>

			<!-- Judul & Info -->
			<div class="mt-8">
				<h1 class="text-4xl font-bold text-[#163E93] mb-4">Peluncuran Program Sertifikasi Baru</h1>
				<div class="flex items-center gap-3 mb-6">
					<span class="text-sm text-gray-500">21 Juni 2025</span>
					<Badge class="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-xs font-medium"> SKKNI </Badge>
				</div>

				<!-- Isi Konten -->
				<div class="text-sm max-w-none text-gray-700 leading-relaxed">
					<p>Sebagai bagian dari upaya meningkatkan kompetensi tenaga kerja Indonesia, program sertifikasi baru diluncurkan dengan tujuan memberikan pengakuan resmi terhadap keterampilan dan pengalaman kerja.</p>
					<p>Acara ini dihadiri oleh pejabat kementerian dan perwakilan industri yang berkomitmen mendukung peningkatan kualitas sumber daya manusia nasional.</p>
				</div>
			</div>
		</div>

		<!-- Berita Lainnya -->
		<div class="container mx-auto px-4 py-12">
			<h2 class="text-2xl font-bold mb-6 text-gray-900">Berita Lainnya</h2>

			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				<AppUiNewsCard v-for="(item, i) in relatedNews" :key="i" :image="item.image" :title="item.title" :date="item.date" :excerpt="item.excerpt" :category="item.category" :slug="item.slug" />
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
const relatedNews = [
	{
		image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
		title: "Peluncuran Program Sertifikasi Baru",
		date: "21 Juni 2025",
		category: "Sertifikasi",
		excerpt: "Program sertifikasi baru ini diharapkan dapat meningkatkan daya saing tenaga kerja nasional...",
		slug: "peluncuran-program-sertifikasi-baru",
	},
	{
		image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80",
		title: "Peluncuran Program Sertifikasi Baru",
		date: "21 Juni 2025",
		category: "Sertifikasi",
		excerpt: "Program sertifikasi baru ini diharapkan dapat meningkatkan daya saing tenaga kerja nasional...",
		slug: "peluncuran-program-sertifikasi-baru",
	},
	{
		image: "https://images.unsplash.com/photo-1522199710521-72d69614c702?w=800&q=80",
		title: "Peluncuran Program Sertifikasi Baru",
		date: "21 Juni 2025",
		category: "Sertifikasi",
		excerpt: "Program sertifikasi baru ini diharapkan dapat meningkatkan daya saing tenaga kerja nasional...",
		slug: "peluncuran-program-sertifikasi-baru",
	},
];
</script>
