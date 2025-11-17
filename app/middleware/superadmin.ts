import { useAuthStore } from "~/stores/auth";
import { useRouter } from "#app";

export default defineNuxtRouteMiddleware(async () => {
	const auth = useAuthStore();

	await auth.ensureAuth();

	if (!auth.isAuthenticated) return navigateTo("/login");

	if (!auth.isSuperadmin) {
		return useRouter().back();
	}
});
