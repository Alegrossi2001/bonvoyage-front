import type { LoginCredentials } from "../../../../interfaces/Auth/Auth";

export interface SigninFormFields extends Omit<LoginCredentials, 'deviceName'> {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface SigninFormState {
    isSubmitting: boolean;
    error: string | null;
    success: boolean;
}