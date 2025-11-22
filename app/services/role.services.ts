// services/roles.service.ts
import type { Role } from "~/models/role.model";
import type { ApiResponse } from "~/models/response-wrapper.model";

/**
 * GET /roles
 * params: page, limit, q
 */
export const listRolesService = async (params: Record<string, any> = {}) => {
	const { $apiFetch } = useNuxtApp();
	return await $apiFetch<ApiResponse<Role[]>>("roles", {
		method: "GET",
		params,
	});
};

/**
 * GET /roles/:id
 */
export const getRoleByIdService = async (id: number) => {
	const { $apiFetch } = useNuxtApp();
	return await $apiFetch<Role>(`roles/${id}`, {
		method: "GET",
	});
};

/**
 * POST /roles
 */
export const createRoleService = async (payload: { name: string }) => {
	const { $apiFetch } = useNuxtApp();
	return await $apiFetch<ApiResponse<Role>>("roles", {
		method: "POST",
		body: payload,
	});
};

/**
 * PATCH /roles/:id
 */
export const updateRoleService = async (id: number, payload: { name?: string }) => {
	const { $apiFetch } = useNuxtApp();
	return await $apiFetch<Role>(`roles/${id}`, {
		method: "PATCH",
		body: payload,
	});
};

/**
 * DELETE /roles/:id
 */
export const deleteRoleService = async (id: number) => {
	const { $apiFetch } = useNuxtApp();
	return await $apiFetch<{ message: string }>(`roles/${id}`, {
		method: "DELETE",
	});
};
