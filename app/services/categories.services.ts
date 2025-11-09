// services/newsCategories.service.ts
import type { ApiResponse } from "~/models/response-wrapper.model";
import type { Category, CreateCategoryDto, UpdateCategoryDto } from "~/models/categories.model";

export const useNewsCategoriesService = () => {
	const { $apiFetch } = useNuxtApp();

	// ✅ Global reactive states
	const response = ref<ApiResponse<Category[]> | null>(null);
	const responseGet = ref<ApiResponse<Category> | null>(null);
	const loading = ref(false);
	const error = ref<Error | null>(null);

	// ✅ Get all (pakai 1 object parameter)
	const getAll = async (params?: any) => {
		loading.value = true;
		error.value = null;

		try {
			const res = await $apiFetch<ApiResponse<Category[]>>("news/categories", {
				params: params,
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

	// ✅ Get one
	const get = async (id: number) => {
		loading.value = true;
		error.value = null;

		try {
			const res = await $apiFetch<ApiResponse<Category>>(`news/categories/${id}`);
			responseGet.value = res;
			return res;
		} catch (err: any) {
			error.value = err;
			throw err;
		} finally {
			loading.value = false;
		}
	};

	// ✅ Create
	const create = async (payload: CreateCategoryDto) => {
		loading.value = true;
		error.value = null;

		try {
			const res = await $apiFetch<ApiResponse<Category>>("news/categories", {
				method: "POST",
				body: payload,
			});

			// tambahkan ke cache lokal
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
	const update = async (id: number, payload: UpdateCategoryDto) => {
		loading.value = true;
		error.value = null;

		try {
			const res = await $apiFetch<ApiResponse<Category>>(`news/categories/${id}`, {
				method: "PATCH",
				body: payload,
			});

			if (response.value?.data) {
				const index = response.value.data.findIndex((c) => c.id === id);
				if (index !== -1) response.value.data[index] = res.data;
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
			const res = await $apiFetch<ApiResponse<{ message: string }>>(`news/categories/${id}`, {
				method: "DELETE",
			});

			if (response.value?.data) response.value.data = response.value.data.filter((item) => item.id !== id);

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
		getAll,
		get,
		create,
		update,
		remove,
	};
};
