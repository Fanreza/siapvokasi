<template>
	<div class="min-h-screen bg-[#F9FAFB]">
		<!-- Header -->
		<UserHeader />

		<div class="flex gap-6 px-6 pt-6">
			<!-- Sidebar -->
			<UserSidebar />

			<!-- PAGE CONTENT -->
			<main class="flex-1">
				<slot />
			</main>
		</div>
	</div>
</template>

<script setup></script>
