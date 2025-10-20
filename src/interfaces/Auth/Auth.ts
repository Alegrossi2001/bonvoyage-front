import type { Organisation } from "./License";

export type Role = 'user' | 'operator' | 'admin';
export type Status = 'online' | 'offline' | 'busy' | 'away';
export type Permission = 'read' | 'write' | 'delete' | 'modify';

export interface AuthUser {
    name: string;
    email: string;
    role: Role;
    status: Status;
    avatar?: string;
}

/**
 * User interface: used for the majority of the application stuff.
 */
export interface User extends AuthUser {
    id: string;
    firstName: string;
    lastName: string;
    permissions: Permission[];
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;

    // organizational context
    organisationId: string;

    preferences: {
        language: string;
        timezone: string;
        notifications: {
            email: boolean;
            sms: boolean;
            push: boolean;
        }
    }

    sessionId: string;
    deviceId?: string;
    ipAddress?: string;
}

/**
 * AuthTokens interface: Represents authentication tokens for a user. 
 * This is used for managing user sessions and API access.
 * =========================
 * 
 */
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    tokenType: 'Bearer';
    expiresIn: number;
    expiresAt: Date;
}

export interface LoginResponse {
    user: User;
    tokens: AuthTokens;
    organization: Organisation;
    requiresTwoFactor?: boolean;
    twoFactorToken?: string;
}

export interface RefreshTokenResponse {
    tokens: AuthTokens;
}

export interface AuthError {
    code: string;
    message: string;
    field?: string;
    details?: Record<string, string | number | boolean>;
}

export interface LoginCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
    deviceName?: string;
}