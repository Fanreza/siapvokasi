// Requirement model for items under a service
export interface Requirement {
	id: number;
	order: number;
	description: string;
	createdAt?: string;
	updatedAt?: string;
	deletedAt?: string | null;
	serviceId?: number;
}

export interface CreateRequirementDto {
	order: number;
	description: string;
}

export interface UpdateRequirementDto {
	order?: number;
	description?: string;
}
