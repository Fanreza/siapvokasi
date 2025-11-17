import type { ServiceItem } from "~/models/services.model";
import type { ApiResponse } from "~/models/response-wrapper.model";

export const getServices = async () => {
	const { $apiFetch } = useNuxtApp();

	return await $apiFetch<ApiResponse<ServiceItem[]>>("/services");
};
