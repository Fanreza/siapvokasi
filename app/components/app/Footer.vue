<template>
	<footer id="kontak" class="bg-white border-t border-gray-200 py-12">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="grid md:grid-cols-4 gap-8 mb-8">
				<!-- Logo & Description -->
				<div class="md:col-span-2">
					<!-- Logos -->
					<div class="flex items-center gap-4 mb-6">
						<div class="mb-6 flex items-center flex-wrap gap-4">
							<img src="/images/logo.png" alt="Logo Kementerian" class="w-36 object-contain" />
							<img src="/images/logo-vokasi.png" alt="Logo Kementerian" class="w-36 object-contain" />
							<img src="/images/logo-stankom.png" alt="Logo Kementerian" class="w-36 object-contain" />
						</div>
					</div>

					<!-- Description -->
					<p class="text-sm text-gray-600 leading-relaxed mb-6 max-w-lg">Siap Vokasi adalah sistem informasi dalam pengajuan dan pelacakan layanan pada Direktorat Jenderal Pembinaan.</p>
				</div>

				<!-- SIAP VOKASI Links -->
				<div>
					<h3 class="font-bold text-gray-900 mb-4 text-base">SIAP VOKASI</h3>
					<ul class="space-y-3 text-sm text-gray-600">
						<li>
							<a href="#" class="hover:text-blue-600 transition-colors">Home</a>
						</li>
						<li>
							<a href="#" class="hover:text-blue-600 transition-colors">Persyaratan</a>
						</li>
						<li>
							<a href="#" class="hover:text-blue-600 transition-colors">FAQ</a>
						</li>
						<li>
							<a href="#" class="hover:text-blue-600 transition-colors">Kontak</a>
						</li>
					</ul>
				</div>

				<!-- Contact -->
				<div>
					<h3 class="font-bold text-gray-900 mb-4 text-base">KONTAK</h3>
					<div class="text-sm text-gray-600 space-y-3">
						<p class="leading-relaxed">
							Gedung Aneka Bhakti I Lantai 4 dan 5<br />
							Jl. Jendral Gatot Subroto Kav. 51, Jakarta Selatan
						</p>
						<div class="space-y-1">
							<a href="tel:0411588201" class="block text-blue-600 font-semibold hover:text-blue-700 transition-colors"> (0411) 588201 </a>
							<a href="tel:0411586202" class="block text-blue-600 font-semibold hover:text-blue-700 transition-colors"> (0411) 586202 </a>
						</div>
					</div>
				</div>
			</div>

			<!-- Copyright -->
			<div class="border-t border-gray-200 pt-8 text-center">
				<p class="text-sm text-gray-600">Copyright @SIMKASJI © 2025. All Rights Reserved.</p>
			</div>
		</div>
	</footer>
</template>

<script setup lang="ts">
// No reactive data needed for this component
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
