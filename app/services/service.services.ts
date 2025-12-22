// Service resource service (renamed from requirements.services.ts)
import type { ApiResponse } from "~/models/response-wrapper.model";
import type { Persyaratan, CreatePersyaratanDto, UpdatePersyaratanDto, ServiceItem } from "~/models/services.model";

export const usePersyaratanService = () => {
	const { $apiFetch } = useNuxtApp();

	const response = ref<ApiResponse<Persyaratan[]> | null>(null);
	const responseGet = ref<Persyaratan | null>(null);
	const loading = ref(false);
	const error = ref<Error | null>(null);

	const endpoint = (isPublic = false) => (isPublic ? "/public/services" : "/services");

	const getServices = async () => {
		const { $apiFetch } = useNuxtApp();

		return await $apiFetch<ApiResponse<ServiceItem[]>>("/services");
	};

	const getAll = async (params?: { page?: number; perPage?: number }, isPublic = false) => {
		loading.value = true;
		error.value = null;
		try {
			const res = await $apiFetch<ApiResponse<Persyaratan[]>>(endpoint(isPublic), { params });
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
			const res = await $apiFetch<Persyaratan>(`/services/${id}`);
			responseGet.value = res;
			return res;
		} catch (err: any) {
			error.value = err;
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const create = async (payload: CreatePersyaratanDto) => {
		loading.value = true;
		error.value = null;
		try {
			const hasFile = payload.document instanceof File;
			if (hasFile) {
				const fd = new FormData();
				fd.append("name", payload.name);
				fd.append("workingTime", payload.workingTime);
				if (payload.document) fd.append("document", payload.document as File);

				const res = await $apiFetch<Persyaratan>("/services", { method: "POST", body: fd });
				return res;
			}

			const res = await $apiFetch<Persyaratan>("/services", { method: "POST", body: payload });
			return res;
		} catch (err: any) {
			error.value = err;
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const update = async (id: number, payload: UpdatePersyaratanDto) => {
		loading.value = true;
		error.value = null;
		try {
			const hasFile = payload.document instanceof File;
			if (hasFile) {
				const fd = new FormData();
				if (payload.name) fd.append("name", payload.name);
				if (payload.workingTime) fd.append("workingTime", payload.workingTime);
				if (payload.document) fd.append("document", payload.document as File);

				const res = await $apiFetch<Persyaratan>(`/services/${id}`, { method: "PATCH", body: fd });
				responseGet.value = res;
				return res;
			}

			const res = await $apiFetch<Persyaratan>(`/services/${id}`, { method: "PATCH", body: payload });
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
			await $apiFetch(`/services/${id}`, { method: "DELETE" });
		} catch (err: any) {
			error.value = err;
			throw err;
		} finally {
			loading.value = false;
		}
	};

	return { response, responseGet, loading, error, getAll, get, create, update, remove, getServices };
};
