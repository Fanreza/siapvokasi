<template>
	<aside class="w-60 p-4 space-y-3">
		<!-- MENU LIST -->
		<nav class="space-y-3">
			<UserSidebarMenuItem icon="home" label="Beranda" to="/user" />

			<UserSidebarMenuItem icon="history" label="History Pengajuan" to="/user/history" />

			<UserSidebarMenuItem icon="file-text" label="Form Pengajuan" to="/user/request" />

			<UserSidebarMenuItem icon="user" label="Profil" to="/user/profile" />

			<UserSidebarMenuItem icon="log-out" label="Logout" to="/logout" />
		</nav>
	</aside>
</template>
