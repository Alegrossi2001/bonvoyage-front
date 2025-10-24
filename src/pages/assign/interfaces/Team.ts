import type { User, AuthUser } from "../../../interfaces/Auth/Auth"

export interface Team {
    id: string; // user id (foreignKey)
    organisationId: string; // organisation id (foreignKey)
    me: User;
    teamMembers: AuthUser[];
}

