export interface History {
	id: number;
	year: number;
	description: string;
	detail: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateHistoryDto {
	year: number;
	description: string;
	detail?: string;
}

export interface UpdateHistoryDto {
	year?: number;
	description?: string;
	detail?: string;
}
