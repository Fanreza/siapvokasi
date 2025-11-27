<template>
	<header class="w-full px-20 bg-[#F1F5FF] py-10 relative overflow-hidden">
		<div class="flex justify-between items-start">
			<!-- LEFT: LOGO + TEXT -->
			<div>
				<div class="flex items-center gap-3 mb-8">
					<img src="/images/logo.png" alt="Logo" class="h-10" />
				</div>

				<h1 class="text-5xl font-bold text-[#202033] leading-tight">
					Selamat Datang di Siap
					<br />Vokasi
				</h1>
			</div>

			<!-- RIGHT: USER -->
			<div class="flex items-center gap-3">
				<div class="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center border border-gray-200">
					<Icon name="lucide:user" class="h-5 w-5 text-gray-500" />
				</div>

				<p class="text-gray-500">
					Hi,
					<span class="font-semibold text-blue-600">
						{{ auth.user?.name || "User" }}
					</span>
				</p>
			</div>

			<div class="absolute right-0 bottom-0 w-[30%]">
				<img src="/images/decor.png" alt="Decor Left" class="w-full" />
			</div>
		</div>
	</header>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

const auth = useAuthStore();
</script>
