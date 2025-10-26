import { create } from 'zustand';
import { persist, createJSONStorage, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type {
    LoginResponse,
    Role,
    Permission,
    LoginCredentials,
} from '../interfaces/Auth/Auth';
import type { AuthState } from '../interfaces/Auth/AuthState';
import { adminAuthState, managerAuthState, operatorAuthState } from '../DEMO/SampleAuthState';


interface AuthActions {
    // Core authentication
    login: (credentials: LoginCredentials) => Promise<LoginResponse>;
    logout: () => Promise<void>;

    // Utilities
    clearError: () => void;
    initialize: () => Promise<void>;

    // Permissions & roles
    hasPermission: (permission: Permission | Permission[]) => boolean;
    hasRole: (role: Role | Role[]) => boolean;
    isOnboarded: () => boolean;
}

interface AuthStore extends AuthState, AuthActions { }

/**
 * Simulated Auth API Service for demo purposes.
 * Remove this and replace with real API calls in production.
 */
class AuthAPIService {
    static async login(credentials: LoginCredentials): Promise<LoginResponse> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Demo credentials
        if (credentials.email === 'admin@bonvoyage.com' && credentials.password === 'pw') {
            return {
                user: adminAuthState.user,
                organization: adminAuthState.organization,
                tokens: adminAuthState.token, // Fixed: was adminAuthState.token
            } as LoginResponse;
        }
        if (credentials.email === 'manager@bonvoyage.com' && credentials.password === 'pw') {
            return {
                user: managerAuthState.user,
                organization: managerAuthState.organization,
                tokens: managerAuthState.token, // Fixed: was managerAuthState.token
            } as LoginResponse;
        }
        if (credentials.email === 'operator@bonvoyage.com' && credentials.password === 'pw') {
            return {
                user: operatorAuthState.user,
                organization: operatorAuthState.organization,
                tokens: operatorAuthState.token, // Fixed: was operatorAuthState.token
            } as LoginResponse;
        }

        throw new Error('Invalid credentials. Try admin@bonvoyage.com / pw, manager@bonvoyage.com / pw, or operator@bonvoyage.com / pw');
    }

    static async logout(): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 300));
    }
}

export const useAuthStore = create<AuthStore>()(
    devtools(
        persist(
            immer((set, get) => ({
                // Initial state
                user: null,
                organization: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                isInitialized: false,
                error: null,
                sessionExpiresAt: null,
                lastActivity: new Date(),
                isInitialised: false,

                // Initialize the store
                initialize: async () => {
                    set(draft => {
                        draft.isLoading = true;
                    });

                    try {
                        const state = get();

                        // Check if we have valid stored auth
                        if (state.token && state.user) { // Fixed: was state.token
                            set(draft => {
                                draft.isAuthenticated = true;
                            });
                        }
                    } catch (error) {
                        console.warn('Failed to initialize auth session:', error);
                        await get().logout();
                    } finally {
                        set(draft => {
                            draft.isLoading = false;
                            draft.isInitialised = true;
                        });
                    }
                },

                // Login with demo credentials
                login: async (credentials: LoginCredentials) => {
                    set(draft => {
                        draft.isLoading = true;
                        draft.error = null;
                    });

                    try {
                        const response = await AuthAPIService.login(credentials);

                        set(draft => {
                            draft.user = response.user;
                            draft.organization = response.organization;
                            draft.token = response.tokens;
                            draft.isAuthenticated = true;
                            draft.isLoading = false;
                            draft.error = null;
                            draft.sessionExpiresAt = response.tokens.expiresAt;
                        });

                        return response;

                    } catch (error) {
                        set(draft => {
                            draft.isLoading = false;
                            draft.error = "LOGIN FAILED"
                        });
                        throw error;
                    }
                },

                // Logout with cleanup
                logout: async () => {
                    set(draft => {
                        draft.isLoading = true;
                    });

                    try {
                        await AuthAPIService.logout();
                    } catch (error) {
                        console.warn('Logout API call failed:', error);
                    } finally {
                        set(draft => {
                            draft.user = null;
                            draft.organization = null;
                            draft.token = null;
                            draft.isAuthenticated = false;
                            draft.isLoading = false;
                            draft.error = null;
                            draft.sessionExpiresAt = null;
                        });
                    }
                },

                // Clear error state
                clearError: () => {
                    set(draft => {
                        draft.error = null;
                    });
                },

                // Permission checking
                hasPermission: (permission: Permission | Permission[]) => {
                    const user = get().user;
                    if (!user) return false;

                    const permissions = Array.isArray(permission) ? permission : [permission];
                    return permissions.every(p => user.permissions.includes(p));
                },

                // Role checking
                hasRole: (role: Role | Role[]) => {
                    const user = get().user;
                    if (!user) return false;

                    const roles = Array.isArray(role) ? role : [role];
                    return roles.includes(user.role);
                },
                isOnboarded: () => {
                    const user = get().user;
                    if (!user) return false;
                    return user.isOnboarded;
                }
            })),
            {
                name: 'bonvoyage-demo-auth',
                storage: createJSONStorage(() => localStorage),

                // Only persist essential data
                partialize: (state) => ({
                    user: state.user,
                    organization: state.organization,
                    tokens: state.token,
                    isAuthenticated: state.isAuthenticated
                }),

                // Handle rehydration
                onRehydrateStorage: () => (state, error) => {
                    if (error) {
                        console.error('Failed to rehydrate auth store:', error);
                        return;
                    }

                    if (state) {
                        state.initialize();
                    }
                }
            }
        ),
        {
            name: 'bonvoyage-demo-auth-store',
            enabled: true,
        }
    )
);