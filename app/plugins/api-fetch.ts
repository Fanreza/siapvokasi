import { toast } from "vue-sonner";

export default defineNuxtPlugin((nuxtApp) => {
	const config = useRuntimeConfig();

	// Handle base URL secara aman
	const rawApiBase = (config.public as Record<string, unknown>)?.apiBase;
	const apiBase = typeof rawApiBase === "string" ? rawApiBase : String(rawApiBase ?? "http://localhost:3000/v1/");

	// Buat instance global
	const apiFetch = $fetch.create({
		baseURL: apiBase,
		credentials: "include",

		onResponseError: async ({ request, response }) => {
			const status = response.status;
			const message = (response._data as any)?.message || response.statusText || "Terjadi kesalahan pada server";

			// 401 Unauthorized → redirect ke login
			if (status === 401) {
				toast.error(message);
				await navigateTo("/login");
				return;
			}

			// 403 Forbidden
			if (status === 403) {
				toast.error(message);
				return;
			}

			// 404 Not Found
			if (status === 404) {
				toast.error(message);

				return;
			}

			// 400–499
			if (status >= 400 && status < 500) {
				toast.error(`Request gagal: ${message}`);
				return;
			}

			// 500–599
			if (status >= 500) {
				toast.error(message);
				return;
			}
		},

		onRequestError: ({ error }) => {
			toast.error(`Gagal mengirim request: ${error.message}`);
		},
	});

	return {
		provide: {
			apiFetch,
		},
	};
});
