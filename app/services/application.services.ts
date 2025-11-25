// services/application.services.ts
import type { ApplicationRequest, ApplicationResponse, ApplicationItem, ApplicationApproveFirstPayload, ApplicationApproveNextPayload, ApplicationRejectPayload, ApplicationRequestFixPayload, ApplicationSubmitFixPayload } from "~/models/application.model";

import type { ApiResponse } from "~/models/response-wrapper.model";

export const createApplication = async (payload: ApplicationRequest) => {
	const { $apiFetch } = useNuxtApp();
	return await $apiFetch<ApiResponse<ApplicationResponse>>("applications", {
		method: "POST",
		body: payload,
	});
};

export const getApplications = async (params?: any) => {
	const { $apiFetch } = useNuxtApp();
	return await $apiFetch<ApiResponse<ApplicationItem[]>>("/applications", {
		params: params,
	});
};

export const getApplicationDetail = async (id: number) => {
	const { $apiFetch } = useNuxtApp();
	return await $apiFetch(`/applications/${id}`);
};

export const getApplicationLogs = async (id: number) => {
	const { $apiFetch } = useNuxtApp();
	return await $apiFetch(`/applications/${id}/logs`);
};

// APPROVE — FIRST TIME
export const approveApplicationFirst = async (applicationId: number, payload: ApplicationApproveFirstPayload) => {
	const { $apiFetch } = useNuxtApp();
	return await $apiFetch(`/applications/${applicationId}/approve`, {
		method: "POST",
		body: payload,
	});
};

// APPROVE — NEXT STAGE (TANPA letterLink)
export const approveApplicationNext = async (applicationId: number, payload?: ApplicationApproveNextPayload) => {
	const { $apiFetch } = useNuxtApp();
	return await $apiFetch(`/applications/${applicationId}/approve`, {
		method: "POST",
		body: payload,
	});
};

// REJECT (payload sama seperti approve first)
export const rejectApplication = async (applicationId: number, payload: ApplicationRejectPayload) => {
	const { $apiFetch } = useNuxtApp();
	return await $apiFetch(`/applications/${applicationId}/reject`, {
		method: "POST",
		body: payload,
	});
};

// REQUEST FIX
export const requestApplicationFix = async (applicationId: number, payload: ApplicationRequestFixPayload) => {
	const { $apiFetch } = useNuxtApp();
	return await $apiFetch(`/applications/${applicationId}/request-fix`, {
		method: "POST",
		body: payload,
	});
};

// SUBMIT FIX
export const submitApplicationFix = async (applicationId: number, payload: ApplicationSubmitFixPayload) => {
	const { $apiFetch } = useNuxtApp();
	return await $apiFetch(`/applications/${applicationId}/submit-fix`, {
		method: "POST",
		body: payload,
	});
};

// SUBMIT DOCS ( USER )
export const submitApplicationDocs = async (applicationId: number, payload: { documentLink: string }) => {
	const { $apiFetch } = useNuxtApp();
	return await $apiFetch(`/applications/${applicationId}/document`, {
		method: "PATCH",
		body: payload,
	});
};

// Toggle requirements check
export const toggleRequirementStatus = async (applicationId: number, requirementId: number, status: boolean) => {
	const { $apiFetch } = useNuxtApp();
	return await $apiFetch(`/applications/${applicationId}/requirements/${requirementId}`, {
		method: "PATCH",
		body: { status },
	});
};

// APPROVE DOCS
export const approveApplicationDocs = async (
	applicationId: number,
	payload: {
		note: string;
		letterLink: string;
		returnToSubmitter?: boolean;
	}
) => {
	const { $apiFetch } = useNuxtApp();
	return await $apiFetch(`applications/${applicationId}/approve`, {
		method: "POST",
		body: payload,
	});
};
