import type { AuthUser } from "~/models/auth.models";

export const updateProfileService = async (payload: Partial<AuthUser>) => {
	const { $apiFetch } = useNuxtApp();

	return await $apiFetch("/profile/update", {
		method: "PUT",
		body: payload,
	});
};

export const changePasswordService = async (payload: { oldPassword: string; newPassword: string }) => {
	const { $apiFetch } = useNuxtApp();

	return await $apiFetch("/profile/change-password", {
		method: "PUT",
		body: payload,
	});
};

export const uploadAvatarService = async (file: File) => {
	const { $apiFetch } = useNuxtApp();

	const form = new FormData();
	form.append("avatar", file);

	return await $apiFetch("/profile/avatar", {
		method: "POST",
		body: form,
	});
};
