export interface ApplicationRequest {
	serviceId: number;
	applicationName: string;
	applicationNumber: string | null;
	applicationDate: string;
	applicantName: string;
	applicantEmail: string;
	applicantPhone: string | null;
	applicantProvince: string | null;
	applicantDistrict: string | null;
	applicantSubDistrict: string | null;
	applicantAddress: string | null;
	requestLetterDocument: string | null;
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

/** APPROVE (first time) */
export interface ApplicationApproveFirstPayload {
	note: string;
	letterLink: string;
}

/** APPROVE (next stage) */
export interface ApplicationApproveNextPayload {
	note: string;
}

/** REJECT (same as approve first time) */
export interface ApplicationRejectPayload {
	note: string;
	letterLink: string;
}

/** REQUEST FIX */
export interface ApplicationRequestFixPayload {
	requirementIds: number[];
	note: string;
}

/** SUBMIT FIX */
export interface ApplicationSubmitFixPayload {
	note: string;
}
