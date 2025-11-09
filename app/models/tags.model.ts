// models/newsTag.model.ts
export interface Tag {
	id: number;
	name: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateTagDto {
	name: string;
}

export interface UpdateTagDto {
	name?: string;
}
