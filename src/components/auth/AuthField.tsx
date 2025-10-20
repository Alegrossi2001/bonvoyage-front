import React, { forwardRef } from 'react';
import { styled } from '@mui/material/styles';
import { InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Input } from '../../assets/atoms';
import type { PremiumInputProps } from '../../assets/atoms';

const StyledAuthField = styled('div')(({ theme }) => ({
    position: 'relative',
    marginBottom: theme.spacing(3),
    '& .login-field-label': {
        display: 'block',
        marginBottom: theme.spacing(1),
        fontSize: '0.875rem',
        fontWeight: 600,
        color: theme.palette.text.primary,
        opacity: 0.8,
    }
}));

export interface AuthFieldProps extends Omit<PremiumInputProps, 'type'> {
    fieldType?: 'email' | 'password' | 'text';
    label?: string;
    showPasswordToggle?: boolean;
    showPassword?: boolean;
    setShowPassword?: (show: boolean) => void;
    getIcon: () => React.ReactNode;
    getInputType: () => string;
}

export const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(({
    fieldType = 'text',
    label,
    placeholder,
    showPasswordToggle = true,
    variant = 'premium',
    showPassword,
    setShowPassword,
    getIcon,
    getInputType,
    ...props
}, ref) => (
    <StyledAuthField>
        {label && (
            <label className="login-field-label">
                {label}
            </label>
        )}
        <Input
            ref={ref}
            type={getInputType()}
            placeholder={placeholder}
            variant={variant}
            premium
            fullWidth
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        {getIcon()}
                    </InputAdornment>
                ),
                endAdornment: fieldType === 'password' && showPasswordToggle ? (
                    <InputAdornment position="end">
                        <IconButton
                            onClick={setShowPassword ? () => setShowPassword(!showPassword) : undefined}
                            edge="end"
                            sx={{
                                color: 'text.secondary',
                                '&:hover': { color: 'primary.main' }
                            }}
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                ) : undefined,
            }}
            {...props}
        />
    </StyledAuthField>
));

AuthField.displayName = 'AuthField';
