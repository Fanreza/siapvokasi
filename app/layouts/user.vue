<template>
	<div class="min-h-screen bg-[#F9FAFB]">
		<!-- Header -->
		<UserHeader />

		<div class="flex gap-6 p-10">
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
