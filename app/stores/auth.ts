import { ref, computed } from "vue";
import { defineStore } from "pinia";

import type { AuthUser, LoginRequest } from "~/models/auth.models";
import { loginService, getProfileService, logoutService } from "~/services/auth.services";

export const useAuthStore = defineStore("auth", () => {
	const user = ref<AuthUser | null>(null);
	const loading = ref(false);

	const isAuthenticated = computed(() => !!user.value);
	const roles = computed<string[]>(() => user.value?.roles?.map((r) => r.name) ?? []);
	const isAdmin = computed(() => roles.value.some((r) => r.includes("ADMIN")));
	const isSuperadmin = computed(() => roles.value.includes("SUPERADMIN"));
	const isUser = computed(() => roles.value.some((r) => r.includes("USER")));

	const ensureAuth = async () => {
		if (!user.value) {
			try {
				const res = await getProfileService();
				user.value = res;
			} catch {
				user.value = null;
			}
		}
	};

	const refreshUser = async () => {
		const res = await getProfileService();
		user.value = res;
	};

	const login = async (payload: LoginRequest) => {
		loading.value = true;

		try {
			const res = await loginService(payload);

			user.value = res;

			return res;
		} finally {
			loading.value = false;
		}
	};

	const logout = async () => {
		await logoutService();
		clearAuth();
	};

	const clearAuth = () => {
		user.value = null;
	};

	return {
		user,
		loading,

		isAuthenticated,
		roles,
		isAdmin,
		isSuperadmin,
		isUser,

		ensureAuth,
		refreshUser,
		login,
		logout,
		clearAuth,
	};
});
