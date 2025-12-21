export interface FAQ {
	id: number;
	question: string;
	answer: string;
	order: number;
	createdById: number;
	createdAt: string;
	updatedAt: string;
	items: FAQ;
}

export interface CreateFaqDto {
	question: string;
	answer: string;
	order?: number;
	createdById?: number;
}

export interface UpdateFaqDto {
	question?: string;
	answer?: string;
	order?: number;
}
