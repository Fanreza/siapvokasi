import type { AuthUser } from "~/models/auth.models";
import { Subject } from "~/enum/permission.enum";

export function can(user: AuthUser | null, action: string, subject: Subject): boolean {
	if (!user) return false;

	for (const role of user.roles ?? []) {
		for (const perm of role.permissions ?? []) {
			if (perm.action === action && perm.subject === subject) {
				return true;
			}
		}
	}

	return false;
}
