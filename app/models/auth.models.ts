export interface Role {
	id: number;
	name: "ADMIN" | "SUPERADMIN" | "USER";
	permissions: string[];
}

export interface AuthUser {
	id: number;
	name: string;
	email: string;

	avatar: string | null;
	instanceName: string | null;
	instanceEmail: string | null;
	province: string | null;
	district: string | null;
	subDistrict: string | null;
	address: string | null;
	phone: string | null;

	status: boolean;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;

	roles: Role[];
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface LoginResponse {
	message: string;
	user: AuthUser;
}

export type ProfileResponse = AuthUser;
