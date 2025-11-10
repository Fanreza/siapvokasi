export interface SocialMedia {
	id: number;
	name: string;
	link: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateSocialMediaDto {
	name: string;
	link: string;
}

export interface UpdateSocialMediaDto {
	name?: string;
	link?: string;
}
