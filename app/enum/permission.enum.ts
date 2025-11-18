// enums/permission.enum.ts

export enum Subject {
	Faq = "Faq",
	Service = "Service",
	Requirement = "Requirement",
	Application = "Application",
	ApplicationLog = "ApplicationLog",
	User = "User",
	Role = "Role",
}

export type PermissionAction = "create" | "read" | "update" | "delete";
