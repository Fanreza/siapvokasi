export enum RequestStatus {
	NEW = "NEW",
	NEW_DOCUMENTS = "NEW_DOCUMENTS",
	PROCESSING = "PROCESSING",
	FIXING = "FIXING",
	FIXED = "FIXED",
	COMPLETED = "COMPLETED",
	REJECTED = "REJECTED",
}

export type RequestStatusType = `${RequestStatus}`;
