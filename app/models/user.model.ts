// models/user.model.ts
import type { ApiResponse, ApiMeta, ApiLinks } from "@/models/response-wrapper.model";

export interface Role {
	id: number;
	name: string;
	createdAt: string | null;
	updatedAt: string | null;
	deletedAt: string | null;
}

export interface UserRole {
	userId: number;
	roleId: number;
	role: Role;
}

export interface User {
	id: number;
	email: string;
	name: string;
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
	roles: UserRole[];
}

/** Query params for list */
export interface ListUsersParams {
	page?: number;
	limit?: number;
	q?: string;
	roleId?: number;
	status?: boolean;
	[k: string]: any;
}

/** Response: list of users (paginated) */
export interface UserListResponse extends ApiResponse<User[]> {
	meta: ApiMeta;
	links: ApiLinks;
}

/** Response: single user */
export interface UserDetailResponse extends ApiResponse<User> {}

/** Request Payloads */
export interface CreateUserPayload {
	email: string;
	name: string;
	password: string;
	roleId: number;

	phone?: string | null;
	instanceName?: string | null;
	instanceEmail?: string | null;
}

export interface UpdateUserPayload {
	email?: string;
	name?: string;
	password?: string;
	phone?: string | null;
	instanceName?: string | null;
	instanceEmail?: string | null;
	province?: string | null;
	district?: string | null;
	subDistrict?: string | null;
	address?: string | null;
	status?: boolean;
}
