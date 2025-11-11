export interface Gallery {
	id: number;
	title: string;
	description?: string | null;
	files?: string[]; // URL gambar yang sudah di-upload
	createdAt: string;
	updatedAt: string;
	images: {
		id: number;
		galleryId: number;
		image: string;
	}[];
}

export interface CreateGalleryDto {
	title: string;
	description?: string;
	files?: File[]; // upload maksimal 4 file
}

export interface UpdateGalleryDto extends Partial<CreateGalleryDto> {}
