import type { Requirement, CreateRequirementDto, UpdateRequirementDto } from "~/models/requirement.model";

export const useRequirementService = (serviceId: number) => {
	const { $apiFetch } = useNuxtApp();

	// API may return either an array or a paginated ApiResponse; keep as any to normalize at callsites
	const response = ref<any | null>(null);
	const responseGet = ref<Requirement | null>(null);
	const loading = ref(false);
	const error = ref<Error | null>(null);

	const base = `/services/${serviceId}/requirements`;

	const getAll = async (params?: { page?: number; perPage?: number; search?: string }) => {
		loading.value = true;
		error.value = null;
		try {
			const res = await $apiFetch(base, { params });
			// res might be an array or an object containing items/data
			response.value = res;
			return res;
		} catch (err: any) {
			error.value = err;
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const get = async (id: number) => {
		loading.value = true;
		error.value = null;
		try {
			const res = await $apiFetch<Requirement>(`${base}/${id}`);
			responseGet.value = res;
			return res;
		} catch (err: any) {
			error.value = err;
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const create = async (payload: CreateRequirementDto) => {
		loading.value = true;
		error.value = null;
		try {
			const res = await $apiFetch<Requirement>(base, { method: "POST", body: payload });
			return res;
		} catch (err: any) {
			error.value = err;
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const update = async (id: number, payload: UpdateRequirementDto) => {
		loading.value = true;
		error.value = null;
		try {
			const res = await $apiFetch<Requirement>(`${base}/${id}`, { method: "PATCH", body: payload });
			responseGet.value = res;
			return res;
		} catch (err: any) {
			error.value = err;
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const remove = async (id: number) => {
		loading.value = true;
		error.value = null;
		try {
			await $apiFetch(`${base}/${id}`, { method: "DELETE" });
		} catch (err: any) {
			error.value = err;
			throw err;
		} finally {
			loading.value = false;
		}
	};

	return { response, responseGet, loading, error, getAll, get, create, update, remove };
};

export default useRequirementService;
