export interface DashboardSummary {
	total: number;
	new: number;
	newDocuments: number;
	processing: number;
	fixing: number;
	fixed: number;
	rejected: number;
	completed: number;
}

export interface DashboardByServiceItem {
	serviceId: number;
	serviceName: string;
	count: number;
}

export type ApplicationStatus = "NEW" | "NEW_DOCUMENTS" | "PROCESSING" | "FIXING" | "FIXED" | "REJECTED" | "COMPLETED";

export interface DashboardRecentApplicationService {
	id: number;
	name: string;
}

export interface DashboardRecentApplication {
	id: number;
	code: string;
	applicationName: string;
	status: ApplicationStatus;
	createdAt: string; // ISO date string dari API
	service: DashboardRecentApplicationService;
}

export interface DashboardStats {
	summary: DashboardSummary;
	byService: DashboardByServiceItem[];
	recentApplications: DashboardRecentApplication[];
}
