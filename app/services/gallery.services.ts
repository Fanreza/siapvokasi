import type { ApiResponse } from "~/models/response-wrapper.model";
import type { Gallery, CreateGalleryDto, UpdateGalleryDto } from "~/models/gallery.model";

export const useGalleryService = () => {
	const { $apiFetch } = useNuxtApp();

	// 🔄 Reactive state utama
	const response = ref<ApiResponse<Gallery[]> | null>(null); // wrapped
	const responseGet = ref<Gallery | null>(null); // plain (tidak wrapped)
	const loading = ref(false);
	const error = ref<Error | null>(null);

	// 🧩 Get All (wrapped response)
	// Helper untuk endpoint public/admin
	const endpoint = (isPublic = false) => (isPublic ? "/public/galleries" : "/gallery");

	// 🧩 Get All
	const getAll = async (params?: { page?: number; search?: string }, isPublic = false) => {
		loading.value = true;
		error.value = null;
		try {
			const res = await $apiFetch<ApiResponse<Gallery[]>>(endpoint(isPublic), {
				params,
			});
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
	const get = async (id: number, isPublic = false) => {
		loading.value = true;
		error.value = null;
		try {
			const res = await $apiFetch<Gallery>(`${endpoint(isPublic)}/${id}`);
			// @ts-ignore

			responseGet.value = res.data;
			return res;
		} catch (err: any) {
			error.value = err;
			throw err;
		} finally {
			loading.value = false;
		}
	};

	// 🧩 Create
	const create = async (payload: CreateGalleryDto) => {
		loading.value = true;
		error.value = null;

		try {
			const formData = new FormData();
			formData.append("title", payload.title);
			if (payload.description) formData.append("description", payload.description);

			if (payload.files?.length) {
				payload.files.forEach((file) => formData.append("files", file));
			}

			const res = await $apiFetch<Gallery>("/gallery", {
				method: "POST",
				body: formData,
			});

			return res;
		} catch (err: any) {
			error.value = err;
			throw err;
		} finally {
			loading.value = false;
		}
	};

	// 🧩 Update (PUT, non-wrapped)
	const update = async (id: number, payload: UpdateGalleryDto) => {
		loading.value = true;
		error.value = null;

		try {
			const formData = new FormData();
			if (payload.title) formData.append("title", payload.title);
			if (payload.description) formData.append("description", payload.description);

			if (payload.files?.length) {
				payload.files.forEach((file) => formData.append("files", file));
			}

			const res = await $apiFetch<Gallery>(`/gallery/${id}`, {
				method: "PUT",
				body: formData,
			});

			// update cache (jika ada)
			if (response.value?.data) {
				const idx = response.value.data.findIndex((g) => g.id === id);
				if (idx !== -1) response.value.data[idx] = res;
			}

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
			await $apiFetch(`/gallery/${id}`, { method: "DELETE" });
		} catch (err: any) {
			error.value = err;
			throw err;
		} finally {
			loading.value = false;
		}
	};

	return {
		response, // wrapped (ApiResponse<Gallery[]>)
		responseGet, // plain (Gallery)
		loading,
		error,
		getAll,
		get,
		create,
		update,
		remove,
	};
};
