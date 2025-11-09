// models/categories.model.ts
export interface Category {
	id: number;
	title: string;
	slug: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateCategoryDto {
	title: string;
}

export interface UpdateCategoryDto {
	title?: string;
}
