import type { DashboardStats } from "~/models/dashboard.model";
import type { ApiResponse } from "~/models/response-wrapper.model";

export const getDashboardStats = async () => {
	const { $apiFetch } = useNuxtApp();

	return await $apiFetch<DashboardStats>("/applications/dashboard/stats");
};
