import type { LoginRequest, LoginResponse, ProfileResponse, RegisterRequest, RegisterResponse } from "~/models/auth.models";

export const loginService = async (payload: LoginRequest) => {
	const { $apiFetch } = useNuxtApp();

	return await $apiFetch<ProfileResponse>("auth/login", {
		method: "POST",
		body: payload,
	});
};

export const getProfileService = async () => {
	const { $apiFetch } = useNuxtApp();

	return await $apiFetch<ProfileResponse>("profile/me");
};

export const registerService = async (payload: RegisterRequest) => {
	const { $apiFetch } = useNuxtApp();

	return await $apiFetch<RegisterResponse>("auth/register", {
		method: "POST",
		body: payload,
	});
};

export const forgotPasswordService = async (payload: { email: string }) => {
	const { $apiFetch } = useNuxtApp();

	return await $apiFetch("auth/forgot-password", {
		method: "POST",
		body: payload,
	});
};

export const resetPasswordService = async (payload: { token: string; password: string; passwordConfirmation: string }) => {
	const { $apiFetch } = useNuxtApp();

	return await $apiFetch("auth/reset-password", {
		method: "POST",
		body: payload,
	});
};

export const logoutService = async () => {
	const { $apiFetch } = useNuxtApp();

	return await $apiFetch<{ message: string }>("auth/logout", {
		method: "POST",
	});
};
