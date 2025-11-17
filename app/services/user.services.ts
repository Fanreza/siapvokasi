import type { User, UserListResponse, UserDetailResponse, CreateUserPayload, UpdateUserPayload, ListUsersParams } from "~/models/user.model";

/**
 * GET /users
 */
export const listUsersService = async (params: ListUsersParams = {}) => {
	const { $apiFetch } = useNuxtApp();

	return await $apiFetch<UserListResponse>("users", {
		method: "GET",
		params,
	});
};

/**
 * GET /users/:id
 */
export const getUserByIdService = async (id: number) => {
	const { $apiFetch } = useNuxtApp();

	return await $apiFetch<UserDetailResponse>(`users/${id}`);
};

/**
 * POST /users
 */
export const createUserService = async (payload: CreateUserPayload) => {
	const { $apiFetch } = useNuxtApp();

	return await $apiFetch<UserDetailResponse>("users", {
		method: "POST",
		body: payload,
	});
};

/**
 * PATCH /users/:id
 */
export const updateUserService = async (id: number, payload: UpdateUserPayload) => {
	const { $apiFetch } = useNuxtApp();

	return await $apiFetch<UserDetailResponse>(`users/${id}`, {
		method: "PATCH",
		body: payload,
	});
};

/**
 * PATCH /users/:id/verify
 */
export const verifyUserService = async (id: number) => {
	const { $apiFetch } = useNuxtApp();

	return await $apiFetch<UserDetailResponse>(`users/${id}/verify`, {
		method: "PATCH",
	});
};

/**
 * DELETE /users/:id
 */
export const deleteUserService = async (id: number) => {
	const { $apiFetch } = useNuxtApp();

	return await $apiFetch<{ message: string }>(`users/${id}`, {
		method: "DELETE",
	});
};
