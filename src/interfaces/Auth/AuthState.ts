import type { AuthTokens, User } from "./Auth";
import type { Organisation } from "./License";

/**
 * AuthState interface: Represents the authentication state of a user.
 * Used in zustand store for managing auth state.
 * =========================
 * 
 */
export interface AuthState {
    user: User | null;
    organization: Organisation | null;
    token: AuthTokens | null;

    //Status flag
    isAuthenticated: boolean;
    isLoading: boolean;
    isInitialised: boolean;
    //error handling
    error: string | null;

    //session info
    sessionExpiresAt: Date | null;
}