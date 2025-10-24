import type { Team } from "../pages/assign/interfaces/Team";
import { mockUser } from "./SampleAuthState";

export const SampleTeam: Team = {
    id: 'U001',
    organisationId: 'ORG001',
    me: mockUser,
    teamMembers: [
        {
            name: 'Alice Johnson',
            email: 'alice.johnson@example.com',
            role: 'operator',
            status: 'online'
        },
        {
            name: 'Bob Smith',
            email: 'bob.smith@example.com',
            role: 'operator',
            status: 'offline'
        },
        {
            name: 'Charlie Brown',
            email: 'charlie.brown@example.com',
            role: 'operator',
            status: 'online'
        }
    ]
}