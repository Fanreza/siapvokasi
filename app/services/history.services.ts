import type { ApiResponse } from "~/models/response-wrapper.model";
import type { History, CreateHistoryDto, UpdateHistoryDto } from "~/models/history.model";

export const useHistoryService = () => {
	const { $apiFetch } = useNuxtApp();

	const response = ref<ApiResponse<History[]> | null>(null);
	const responseGet = ref<History | null>(null);
	const loading = ref(false);
	const error = ref<Error | null>(null);

	// 🧩 Get All
	const endpoint = (isPublic = false) => (isPublic ? "/public/histories" : "/histories");

	// 🧩 Get All
	const getAll = async (isPublic = false, params: any) => {
		loading.value = true;
		error.value = null;
		try {
			const res = await $apiFetch<ApiResponse<History[]>>(endpoint(isPublic), { params });
			response.value = res;
			return res;
		} catch (err: any) {
			error.value = err;
			throw err;
		} finally {
			loading.value = false;
		}
	};

	// 🧩 Get One
	const get = async (id: number) => {
		loading.value = true;
		error.value = null;

		try {
			const res = await $apiFetch<History>(`/histories/${id}`);
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
	const create = async (payload: CreateHistoryDto) => {
		loading.value = true;
		error.value = null;

		try {
			const res = await $apiFetch<History>("/histories", {
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
	const update = async (id: number, payload: UpdateHistoryDto) => {
		loading.value = true;
		error.value = null;

		try {
			const res = await $apiFetch<History>(`/histories/${id}`, {
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

	// 🧩 Delete
	const remove = async (id: number) => {
		loading.value = true;
		error.value = null;

		try {
			await $apiFetch(`/histories/${id}`, { method: "DELETE" });
		} catch (err: any) {
			error.value = err;
			throw err;
		} finally {
			loading.value = false;
		}
	};

	return { response, responseGet, loading, error, getAll, get, create, update, remove };
};
