import type { ApiResponse } from "~/models/response-wrapper.model";
import type { News, CreateNewsDto, UpdateNewsDto } from "~/models/news.model";

export const useNewsService = () => {
	const { $apiFetch } = useNuxtApp();

	// ✅ Global state
	const response = ref<ApiResponse<News[]> | null>(null);
	const responseGet = ref<News | null>(null);
	const loading = ref(false);
	const error = ref<Error | null>(null);

	// ✅ Get All
	const endpoint = (isPublic = false) => (isPublic ? "/public/news" : "/news");

	const getAll = async (isPublic = false, params: { page?: number; search?: string } = {}) => {
		loading.value = true;
		error.value = null;

		try {
			const res = await $apiFetch<ApiResponse<News[]>>(endpoint(isPublic), {
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

	// ✅ Get One
	const get = async (id: number) => {
		loading.value = true;
		error.value = null;

		try {
			const res = await $apiFetch<News>(`news/${id}`);
			responseGet.value = res;
			return res;
		} catch (err: any) {
			error.value = err;
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const getBySlug = async (slug: string) => {
		loading.value = true;
		error.value = null;

		try {
			const res = await $apiFetch<News>(`public/news/slug/${slug}`);
			// @ts-ignore
			responseGet.value = res.data!;
			return res;
		} catch (err: any) {
			error.value = err;
			throw err;
		} finally {
			loading.value = false;
		}
	};

	// ✅ Create
	const create = async (payload: CreateNewsDto) => {
		loading.value = true;
		error.value = null;

		try {
			const formData = new FormData();
			formData.append("title", payload.title);
			formData.append("excerpt", payload.excerpt);
			formData.append("description", payload.description);
			formData.append("status", payload.status);
			formData.append("categoryId", String(payload.categoryId));
			if (payload.file) formData.append("file", payload.file as any);

			const res = await $apiFetch<ApiResponse<News>>("news", {
				method: "POST",
				body: formData,
			});

			if (response.value?.data) {
				response.value.data.unshift(res.data);
				response.value.meta!.totalItems++;
			}

			return res;
		} catch (err: any) {
			error.value = err;
			throw err;
		} finally {
			loading.value = false;
		}
	};

	// ✅ Update
	const update = async (id: number, payload: UpdateNewsDto) => {
		loading.value = true;
		error.value = null;

		try {
			const formData = new FormData();
			if (payload.title) formData.append("title", payload.title);
			if (payload.excerpt) formData.append("excerpt", payload.excerpt);
			if (payload.description) formData.append("description", payload.description);
			if (payload.status) formData.append("status", payload.status);
			if (payload.categoryId) formData.append("categoryId", String(payload.categoryId));
			if (payload.file) formData.append("file", payload.file as any);

			const res = await $apiFetch<News>(`news/${id}`, {
				method: "PUT",
				body: formData,
			});

			if (response.value?.data) {
				const index = response.value.data.findIndex((n) => n.id === id);
				if (index !== -1) response.value.data[index] = res;
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

	// ✅ Delete
	const remove = async (id: number) => {
		loading.value = true;
		error.value = null;

		try {
			const res = await $apiFetch<ApiResponse<{ message: string }>>(`news/${id}`, {
				method: "DELETE",
			});

			if (response.value?.data) response.value.data = response.value.data.filter((n) => n.id !== id);

			return res;
		} catch (err: any) {
			error.value = err;
			throw err;
		} finally {
			loading.value = false;
		}
	};

	return { response, responseGet, loading, error, getAll, get, create, update, remove, getBySlug };
};
