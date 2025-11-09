export interface News {
	id: number;
	title: string;
	excerpt: string;
	description: string;
	status: "draft" | "publish";
	file: string | null;
	categoryId: number;
	category?: {
		id: number;
		title: string;
		slug: string;
	};
	createdAt: string;
	updatedAt: string;
}

// DTOs (Data Transfer Objects)
export interface CreateNewsDto {
	title: string;
	excerpt: string;
	description: string;
	status: string;
	file?: File | string | null;
	categoryId: number;
}

export interface UpdateNewsDto extends Partial<CreateNewsDto> {}
