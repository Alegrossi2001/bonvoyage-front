import { useCallback, useState } from "react";
import type { SigninFormFields, SigninFormState } from "../interfaces/FormFields"
import { useForm } from 'react-hook-form';
import { useAuthStore } from "../../../../stores/AuthStore";
import useBonVoyageNavigate from "../../../../routes/navigate";

const defaultValues: SigninFormFields = {
    email: '',
    password: '',
    rememberMe: false,
};

const useAuthForm = () => {
    const [formState, setFormState] = useState<SigninFormState>({
        isSubmitting: false,
        error: null,
        success: false,
    });
    const { login } = useAuthStore()
    const { quickNav } = useBonVoyageNavigate();

    const form = useForm<SigninFormFields>({ defaultValues });

    const {
        control,
        handleSubmit: rhfHandleSubmit,
        formState: { errors, isValid, isDirty },
    } = form;

    const onFormSubmit = useCallback(async (data: SigninFormFields) => {
        //First we try to login. Return if the data is empty
        if (!data.email || !data.password) {
            setFormState((prev) => ({ ...prev, error: "Please enter email and password." }));
            return;
        }

        try {
            setFormState((prev) => ({ ...prev, isSubmitting: true, error: null }));

            await login(
                {
                    email: data.email,
                    password: data.password,
                    rememberMe: data.rememberMe,
                }
            )
            await new Promise(resolve => setTimeout(resolve, 1000));

            setFormState((prev) => ({ ...prev, isSubmitting: false, success: true }));
            quickNav.dashboard();

        } catch (error) {
            setFormState((prev) => ({
                ...prev,
                isSubmitting: false,
                error: (error as Error).message || 'An unexpected error occurred.',
            }));
        }
    }, [login, quickNav]);

    const clearError = useCallback(() => {
        setFormState((prev) => ({ ...prev, error: null }));
    }, []);

    const handleSubmit = rhfHandleSubmit(onFormSubmit);

    return {
        control,
        formState: {
            errors: errors || {},
            isValid,
            isDirty,
        },
        handleSubmit,
        isSubmitting: formState.isSubmitting,
        error: formState.error,
        success: formState.success,
        clearError,
    };
}

export default useAuthForm;