// services/application.services.ts
import type { ApplicationRequest, ApplicationResponse, ApplicationItem } from "~/models/application.model";

export const createApplication = async (payload: ApplicationRequest) => {
	const { $apiFetch } = useNuxtApp();
	return await $apiFetch<ApplicationResponse>("applications", {
		method: "POST",
		body: payload,
	});
};

export const getApplications = async () => {
	const { $apiFetch } = useNuxtApp();
	return await $apiFetch<ApplicationItem[]>("/applications");
};

export const getApplicationDetail = async (id: number) => {
	const { $apiFetch } = useNuxtApp();
	return await $apiFetch(`/applications/${id}`);
};

export const getApplicationLogs = async (id: number) => {
	const { $apiFetch } = useNuxtApp();
	return await $apiFetch(`/applications/${id}/logs`);
};
