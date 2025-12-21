import type { ApiResponse } from "~/models/response-wrapper.model";
import type { FAQ, CreateFaqDto, UpdateFaqDto } from "~/models/faq.model";

export const useFaqService = () => {
	const { $apiFetch } = useNuxtApp();

	// 🔄 State utama
	const response = ref<ApiResponse<FAQ[]> | null>(null); // getAll → pakai wrapper
	const responseGet = ref<FAQ | null>(null); // getOne → tanpa wrapper
	const loading = ref(false);
	const error = ref<Error | null>(null);

	// 🧩 Get All (pakai wrapper)
	const endpoint = (isPublic = false) => (isPublic ? "/public/faq" : "/faq");

	// 🧩 Get All
	const getAll = async (params?: { page?: number; perPage?: number }, isPublic = false) => {
		loading.value = true;
		error.value = null;
		try {
			const res = await $apiFetch<ApiResponse<FAQ[]>>(endpoint(isPublic), { params });
			response.value = res;
			return res;
		} catch (err: any) {
			error.value = err;
			throw err;
		} finally {
			loading.value = false;
		}
	};
	// 🧩 Get One (tanpa wrapper)
	const get = async (id: number) => {
		loading.value = true;
		error.value = null;
		try {
			const res = await $apiFetch<FAQ>(`/faq/${id}`);
			responseGet.value = res;
			return res;
		} catch (err: any) {
			error.value = err;
			throw err;
		} finally {
			loading.value = false;
		}
	};

	// 🧩 Create
	const create = async (payload: CreateFaqDto) => {
		loading.value = true;
		error.value = null;
		try {
			const res = await $apiFetch<FAQ>("/faq", {
				method: "POST",
				body: payload,
			});

			return res;
		} catch (err: any) {
			error.value = err;
			throw err;
		} finally {
			loading.value = false;
		}
	};

	// 🧩 Update
	const update = async (id: number, payload: UpdateFaqDto) => {
		loading.value = true;
		error.value = null;
		try {
			const res = await $apiFetch<FAQ>(`/faq/${id}`, {
				method: "PATCH",
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

	// 🧩 Delete
	const remove = async (id: number) => {
		loading.value = true;
		error.value = null;
		try {
			await $apiFetch(`/faq/${id}`, { method: "DELETE" });
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
		getAll,
		get,
		create,
		update,
		remove,
	};
};
