export interface ServiceItem {
	id: number;
	name: string;
	document: string | null;
	workingTime: string;
	hasPraStage: boolean;
	fixerType: "ADMIN" | "SUBMITTER";
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
}
