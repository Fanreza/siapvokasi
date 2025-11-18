// models/api-response.model.ts

/** Generic API Response Wrapper */
export interface ApiResponse<T> {
	data: T;
	meta: ApiMeta;
	links: ApiLinks;
}

/** Pagination Metadata */
export interface ApiMeta {
	currentPage: number;
	perPage: number;
	totalItems: number;
	totalPages: number;
}

/** Pagination Links */
export interface ApiLinks {
	first: string | null;
	previous: string | null;
	next: string | null;
	last: string | null;
}
