import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware(async () => {
	const token = useCookie("access_token");

	console.log(token);

	const auth = useAuthStore();

	await auth.ensureAuth();

	if (!auth.isAuthenticated) return;

	if (auth.isAdmin) return navigateTo("/admin");
	if (auth.isUser) return navigateTo("/user");
});
