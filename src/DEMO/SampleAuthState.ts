import type { User } from "../interfaces/Auth/Auth";
import type { AuthState } from "../interfaces/Auth/AuthState";

export const managerAuthState: AuthState = {
    user: {
        id: 'manager-1',
        firstName: 'Travel',
        lastName: 'Manager',
        sessionId: 'session-12345',
        organisationId: 'org-1',
        email: 'manager@bonvoyage.com',
        name: 'Travel Manager',
        permissions: ['read', 'write', 'modify'],
        role: 'user',
        status: 'online',
        emailVerified: true,
        createdAt: new Date('2023-01-15T10:00:00Z'),
        updatedAt: new Date('2024-01-10T12:00:00Z'),
        isOnboarded: true,
        preferences: {
            language: 'en',
            timezone: 'UTC',
            notifications: {
                email: true,
                sms: false,
                push: true
            }
        }
    },
    organization: {
        id: 'org-1',
        name: 'Bon Voyage',
        slug: 'bon-voyage',
        plan: "enterprise",
        something: 'Additional org info'

    },
    token: {
        accessToken: 'access-token',
        tokenType: 'Bearer',
        expiresIn: 3600,
        refreshToken: 'refresh-token',
        expiresAt: new Date(Date.now() + 3600 * 1000) // 1 hour
    },
    isAuthenticated: true,
    isLoading: false,
    error: null,
    sessionExpiresAt: new Date(Date.now() + 3600 * 1000), // 1 hour
    isInitialised: true,
};

export const mockUser: User = {
    id: 'operator-1',
    firstName: 'Travel',
    lastName: 'Operator',
    name: 'Travel Operator',
    sessionId: 'session-67890',
    isOnboarded: true,
    organisationId: 'org-1',
    email: 'operator@bonvoyage.com',
    permissions: ['read', 'write'],
    role: "operator",
    status: 'online',
    emailVerified: true,
    createdAt: new Date('2023-06-20T14:30:00Z'),
    updatedAt: new Date('2024-10-18T16:45:00Z'),
    preferences: {
        language: 'en',
        timezone: 'America/New_York',
        notifications: {
            email: true,
            sms: true,
            push: true
        }
    },
};

export const operatorAuthState: AuthState = {
    user: mockUser,
    organization: {
        id: 'org-1',
        name: 'Bon Voyage',
        slug: 'bon-voyage',
        plan: "free",
        something: 'Additional org info'
    },
    token: {
        accessToken: 'operator_access_token_abc123',
        tokenType: 'Bearer',
        expiresIn: 3600,
        refreshToken: 'operator_refresh_token_abc123',
        expiresAt: new Date(Date.now() + 3600 * 1000) // 1 hour
    },
    isAuthenticated: true,
    isLoading: false,
    error: null,
    sessionExpiresAt: new Date(Date.now() + 3600 * 1000), // 1 hour
    isInitialised: true,
};



export const adminAuthState: AuthState = {
    user: {
        id: 'admin-1',
        name: 'System Administrator',
        firstName: 'System',
        lastName: 'Administrator',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
        sessionId: 'session-admin-999',
        organisationId: 'org-1',
        email: 'admin@bonvoyage.com',
        permissions: [
            'read',
            'write',
            'delete',
        ],
        role: 'admin',
        status: 'online',
        emailVerified: true,
        createdAt: new Date('2022-01-01T00:00:00Z'),
        updatedAt: new Date('2024-10-19T07:00:00Z'),
        isOnboarded: true,
        preferences: {
            language: 'en',
            timezone: 'UTC',
            notifications: {
                email: true,
                sms: true,
                push: true
            }
        }

    },
    organization: {
        id: 'org-1',
        name: 'Bon Voyage',
        slug: 'bon-voyage',
        plan: "enterprise",
        something: 'Additional org info'
    },
    token: {
        accessToken: 'admin_access_token_secure_xyz999',
        tokenType: 'Bearer',
        expiresIn: 7200,
        refreshToken: 'admin_refresh_token_secure_xyz999',
        expiresAt: new Date(Date.now() + 7200 * 1000) // 2 hours
    },
    isAuthenticated: true,
    isLoading: false,
    error: null,
    sessionExpiresAt: new Date(Date.now() + 7200 * 1000), // 2 hours
    isInitialised: true,
};