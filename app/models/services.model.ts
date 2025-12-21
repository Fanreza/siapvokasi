// Requirements model (Persyaratan) - file name in English, exported types kept as-is
export interface Persyaratan {
	id: number;
	name: string;
	workingTime: string;
	documentPath?: string | null;
	createdAt: string;
	updatedAt: string;
	deletedAt?: string | null;
}

export interface CreatePersyaratanDto {
	name: string;
	workingTime: string;
	document?: File | string | null;
}

export interface UpdatePersyaratanDto {
	name?: string;
	workingTime?: string;
	document?: File | string | null;
}
