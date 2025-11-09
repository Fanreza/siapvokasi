import { ref } from "vue";
import type { Tag, CreateTagDto, UpdateTagDto } from "@/models/tags.model";
import { toast } from "vue-sonner";

export const useNewsTagsService = () => {
	const { $apiFetch } = useNuxtApp();

	const response = ref<Tag[]>();
	const reponseGet = ref<Tag>();
	const loading = ref(false);
	const error = ref<Error | null>(null);

	const handleRequest = async <T>(promise: Promise<T>, successMessage?: string) => {
		loading.value = true;
		error.value = null;

		try {
			const res = await promise;
			response.value = res as Tag[];

			if (successMessage) {
				toast.success(successMessage);
			}

			return res;
		} catch (err: any) {
			error.value = err;

			toast.error(`Error: ${err.message || "Something went wrong."}`);

			throw err;
		} finally {
			loading.value = false;
		}
	};

	const getAll = () => handleRequest($apiFetch<Tag[]>("news/tags"));

	const get = (id: number) => handleRequest($apiFetch<Tag>(`news/tags/${id}`));

	const create = (payload: CreateTagDto) =>
		handleRequest(
			$apiFetch<Tag>("news/tags", {
				method: "POST",
				body: payload,
			}),
			"Tag created successfully!"
		);

	const update = (id: number, payload: UpdateTagDto) =>
		handleRequest(
			$apiFetch<Tag>(`news/tags/${id}`, {
				method: "PATCH",
				body: payload,
			}),
			"Tag updated successfully!"
		);

	const remove = (id: number) =>
		handleRequest(
			$apiFetch<{ message: string }>(`news/tags/${id}`, {
				method: "DELETE",
			}),
			"Tag deleted successfully!"
		);

	return {
		getAll,
		get,
		create,
		update,
		remove,
		loading,
		response,
		error,
	};
};
