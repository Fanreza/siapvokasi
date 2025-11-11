export interface StatisticCategory {
	id: number;
	name: string;
	link: string;
	createdAt: string;
	updatedAt: string;
	statistics: {
		id: number;
		number: number;
		name: string;
	}[];
}

export interface CreateStatisticCategoryDto {
	name: string;
	link: string;
}

export interface UpdateStatisticCategoryDto {
	name?: string;
	link?: string;
}
