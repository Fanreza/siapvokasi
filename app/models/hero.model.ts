export interface Hero {
	id: number;
	heading: string;
	subHeading: string;
	pathVideo: string | null;
	banner: string | null;
	updatedAt: string;
}

export interface UpdateHeroDto {
	heading?: string;
	subHeading?: string;
	pathVideo?: string | null;
	banner?: string | null;
}
