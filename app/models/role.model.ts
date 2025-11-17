// models/role.model.ts

export interface Role {
	id: number;
	name: string;
	createdAt?: string | null;
	updatedAt?: string | null;
	deletedAt?: string | null;
}
