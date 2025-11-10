import type { ApiResponse } from "~/models/response-wrapper.model";
import type { Hero, UpdateHeroDto } from "~/models/hero.model";

export const useHeroService = () => {
	const { $apiFetch } = useNuxtApp();

	const response = ref<ApiResponse<Hero> | null>(null);
	const responseGet = ref<Hero | null>(null);
	const loading = ref(false);
	const error = ref<Error | null>(null);

	// 🧩 GET hero data
	const get = async () => {
		loading.value = true;
		error.value = null;

		try {
			const res = await $apiFetch<ApiResponse<Hero>>("/hero");
			response.value = res;
			responseGet.value = res.data;
			return res;
		} catch (err: any) {
			error.value = err;
			throw err;
		} finally {
			loading.value = false;
		}
	};

	// 🧩 UPDATE hero data
	const update = async (payload: UpdateHeroDto) => {
		loading.value = true;
		error.value = null;

		try {
			const res = await $apiFetch<Hero>("/hero", {
				method: "PUT",
				body: payload,
			});
			responseGet.value = res;
			return res;
		} catch (err: any) {
			error.value = err;
			throw err;
		} finally {
			loading.value = false;
		}
	};

	return {
		response,
		responseGet,
		loading,
		error,
		get,
		update,
	};
};
