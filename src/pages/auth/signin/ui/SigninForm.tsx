import React from 'react';
import { Stack, Box } from '@mui/material';
import { Button } from '../../../../assets/atoms';
import { Input } from '../../../../assets/atoms';
import { Text } from '../../../../assets/atoms/Typography';
import { Controller } from 'react-hook-form';
import type { Control, FieldErrors } from 'react-hook-form';
import type { SigninFormFields } from '../interfaces/FormFields';

export interface LoginFormProps {
    error: string | null;
    submitText?: string;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    control: Control<SigninFormFields>;
    formState: {
        errors?: FieldErrors<SigninFormFields>;
        isValid?: boolean;
        isDirty?: boolean;
    };
    isSubmitting: boolean;
    clearError: () => void;
}

const SigninForm: React.FC<LoginFormProps> = ({
    submitText = 'Sign In',
    handleSubmit,
    control,
    formState,
    isSubmitting,
    error,
    clearError,
}) => {
    // Safely extract errors with fallback
    const errors = formState?.errors || {};

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Stack spacing={3}>
                {error && (
                    <Text
                        color="error"
                        textAlign="center"
                        sx={{ cursor: 'pointer' }}
                        onClick={clearError}
                    >
                        {error}
                    </Text>
                )}

                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            label="Email Address"
                            type="email"
                            variant="premium"
                            required
                            fullWidth
                            autoComplete="email"
                            placeholder="Enter your email"
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />
                    )}
                />

                <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            label="Password"
                            type="password"
                            variant="premium"
                            required
                            fullWidth
                            autoComplete="current-password"
                            placeholder="Enter your password"
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />
                    )}
                />

                <Button
                    type="submit"
                    variant="premium"
                    size="large"
                    fullWidth
                    loading={isSubmitting}
                    disabled={isSubmitting}

                >
                    {submitText}
                </Button>
            </Stack>
        </Box>
    );
};

export default SigninForm;