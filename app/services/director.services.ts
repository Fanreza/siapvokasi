import type { ApiResponse } from "~/models/response-wrapper.model";
import type { DirectorProfile, CreateDirectorProfileDto, UpdateDirectorProfileDto } from "~/models/director.model";

export const useDirectorProfileService = () => {
	const { $apiFetch } = useNuxtApp();

	const response = ref<ApiResponse<DirectorProfile[]> | null>(null);
	const responseGet = ref<DirectorProfile | null>(null);
	const loading = ref(false);
	const error = ref<Error | null>(null);

	// Get all
	const endpoint = (isPublic = false) => (isPublic ? "/public/director-profiles" : "/director-profiles");

	const getAll = async (isPublic = false, params: any) => {
		loading.value = true;
		try {
			const res = await $apiFetch<ApiResponse<DirectorProfile[]>>(endpoint(isPublic), { params });
			response.value = res;
			return res;
		} finally {
			loading.value = false;
		}
	};

	// Get one
	const get = async (id: number) => {
		loading.value = true;
		try {
			const res = await $apiFetch<DirectorProfile>(`/director-profiles/${id}`);
			responseGet.value = res;
			return res;
		} finally {
			loading.value = false;
		}
	};

	// Create
	const create = async (payload: CreateDirectorProfileDto) => {
		loading.value = true;
		try {
			const formData = new FormData();
			formData.append("order", payload.order.toString());
			formData.append("beginYear", payload.beginYear.toString());
			if (payload.endYear) formData.append("endYear", payload.endYear.toString());
			formData.append("name", payload.name);
			formData.append("detail", payload.detail);
			if (payload.file) formData.append("file", payload.file);

			const res = await $apiFetch<DirectorProfile>("/director-profiles", {
				method: "POST",
				body: formData,
			});
			return res;
		} finally {
			loading.value = false;
		}
	};

	// Update
	const update = async (id: number, payload: UpdateDirectorProfileDto) => {
		loading.value = true;
		try {
			const formData = new FormData();
			if (payload.order) formData.append("order", payload.order.toString());
			if (payload.beginYear) formData.append("beginYear", payload.beginYear.toString());
			if (payload.endYear) formData.append("endYear", payload.endYear.toString());
			if (payload.name) formData.append("name", payload.name);
			if (payload.detail) formData.append("detail", payload.detail);
			if (payload.file) formData.append("file", payload.file);

			const res = await $apiFetch<DirectorProfile>(`/director-profiles/${id}`, {
				method: "PUT",
				body: formData,
			});
			responseGet.value = res;
			return res;
		} finally {
			loading.value = false;
		}
	};

	// Delete
	const remove = async (id: number) => {
		loading.value = true;
		try {
			await $apiFetch(`/director-profiles/${id}`, { method: "DELETE" });
		} finally {
			loading.value = false;
		}
	};

	return { response, responseGet, loading, getAll, get, create, update, remove };
};
