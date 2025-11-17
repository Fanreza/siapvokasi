// models/application.models.ts
export interface ApplicationRequest {
	applicationName: string;
	applicationNumber?: string | null;
	applicationDate?: string; // ISO string, default can be new Date().toISOString()
	applicantName: string;
	applicantEmail: string;
	applicantPhone?: string;
	applicantProvince?: string;
	applicantDistrict?: string;
	applicantSubDistrict?: string;
	applicantAddress?: string;
	requestLetterDocument?: string; // link or filename
	mainDocument?: string;
	attachmentDocument?: string;
	serviceId: number;
	// tambahan field dari form (opsional)
	metadata?: Record<string, any>;
}

export interface ApplicationResponse {
	id: number;
	applicationNumber: string;
	message?: string;
	// lengkapkan sesuai response backend jika perlu
}

export interface ApplicationItem {
	id: number;
	applicationName: string;
	applicationNumber: string;
	applicationDate: string;
	applicantName: string;
	status: string;
	currentStageNumber: number;
	serviceId: number;
}

export interface ApplicationDetail {
	id: number;
	applicationName: string;
	applicationNumber: string;
	applicationDate: string;
	applicantName: string;
	applicantEmail: string;
	applicantPhone: string;
	applicantProvince: string;
	applicantDistrict: string;
	applicantSubDistrict: string;
	applicantAddress: string;
	requestLetterDocument: string;
	mainDocument: string;
	attachmentDocument: string;
	serviceId: number;
	status: string;
	currentStageNumber: number;
	service: {
		id: number;
		name: string;
		workingTime: string;
		hasPraStage: boolean;
		fixerType: string;
	};
}

export interface ApplicationLog {
	id: number;
	applicationId: number;
	status: string;
	note: string;
	stageNumber: number;
	actorId: number;
	createdAt: string;
}
