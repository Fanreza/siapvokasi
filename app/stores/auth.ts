import { defineStore } from "pinia";
import type { AuthUser, LoginRequest } from "~/models/auth.models";
import { loginService, getProfileService, logoutService } from "~/services/auth.services";

export const useAuthStore = defineStore("auth", {
	state: () => ({
		user: null as AuthUser | null,
		loading: false,
	}),

	getters: {
		isAuthenticated: (state) => !!state.user,
		roles: (state): string[] => state.user?.roles?.map((r) => r.name) ?? [],
		isAdmin() {
			console.log(this.roles);

			return this.roles.some((r) => r.includes("ADMIN"));
		},
		isSuperadmin() {
			return this.roles.includes("SUPERADMIN");
		},
		isUser() {
			return this.roles.includes("USER");
		},
	},

	actions: {
		async ensureAuth() {
			if (!this.user) {
				console.log(this.user);

				try {
					const res = await getProfileService();
					this.user = res;
				} catch {
					this.user = null;
				}
			}
		},

		// refresh user
		async refreshUser() {
			const res = await getProfileService();
			this.user = res;
		},

		async login(payload: LoginRequest) {
			this.loading = true;
			try {
				const res = await loginService(payload);

				console.log(res);

				this.user = res;

				return res;
			} finally {
				this.loading = false;
			}
		},

		async logout() {
			await logoutService();
			this.user = null;
		},

		clearAuth() {
			this.user = null;
		},
	},
});
