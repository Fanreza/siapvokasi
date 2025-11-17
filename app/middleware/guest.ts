import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware(async () => {
	const auth = useAuthStore();

	await auth.ensureAuth();

	if (!auth.isAuthenticated) return;

	if (auth.isAdmin) return navigateTo("/admin");
	if (auth.isUser) return navigateTo("/user");
});
