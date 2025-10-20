/**
 * Premium Input Component
 * =======================
 * The most sophisticated input experience ever created for enterprise software.
 * Features floating labels, micro-interactions, premium animations, and a design
 * that makes data entry feel like using technology from the future.
 */

import React, { forwardRef, useState, useRef, useCallback } from 'react';
import {
  TextField as MUITextField,
  type TextFieldProps as MUITextFieldProps,
  InputAdornment,
  Box,
  Typography,
  alpha,
  styled,
  keyframes,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, Clear } from '@mui/icons-material';

// Premium animations
const focusGlow = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(0, 102, 204, 0.4); }
  70% { box-shadow: 0 0 0 8px rgba(0, 102, 204, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 102, 204, 0); }
`;

const shimmerPass = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

// Premium input variants
export type InputVariant =
  | 'standard'
  | 'filled'
  | 'outlined'
  | 'glass'
  | 'minimal'
  | 'premium'
  | 'floating';

export type InputSize = 'small' | 'medium' | 'large';

export interface PremiumInputProps extends Omit<MUITextFieldProps, 'variant' | 'size'> {
  variant?: InputVariant;
  size?: InputSize;
  showClearButton?: boolean;
  glowEffect?: boolean;
  shimmerEffect?: boolean;
  premium?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helperIcon?: React.ReactNode;
  loading?: boolean;
}

// Styled input with premium effects
const StyledTextField = styled(MUITextField, {
  shouldForwardProp: (prop) =>
    !['inputVariant', 'glowEffect', 'shimmerEffect', 'premium', 'inputSize'].includes(prop as string)
})<{
  inputVariant?: InputVariant;
  glowEffect?: boolean;
  shimmerEffect?: boolean;
  premium?: boolean;
  inputSize?: InputSize;
}>(({ theme, inputVariant, glowEffect, shimmerEffect, premium, inputSize }) => {

  const sizeConfig = {
    small: {
      height: 40,
      padding: '8px 12px',
      fontSize: '0.875rem',
    },
    medium: {
      height: 48,
      padding: '12px 16px',
      fontSize: '1rem',
    },
    large: {
      height: 56,
      padding: '16px 20px',
      fontSize: '1.125rem',
    },
  };

  const currentSize = sizeConfig[inputSize || 'medium'];

  return {
    // Base styles
    '& .MuiInputBase-root': {
      position: 'relative',
      borderRadius: theme.spacing(1.5),
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      minHeight: currentSize.height,
      fontSize: currentSize.fontSize,

      // Premium backdrop and borders
      ...(inputVariant === 'glass' && {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
      }),

      ...(inputVariant === 'minimal' && {
        backgroundColor: 'transparent',
        borderBottom: `2px solid ${theme.palette.divider}`,
        borderRadius: 0,
        '&:hover': {
          borderBottomColor: theme.palette.primary.main,
        },
      }),

      ...(inputVariant === 'premium' && {
        backgroundColor: alpha(theme.palette.primary.main, 0.02),
        border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
        boxShadow: '0 2px 8px rgba(0, 102, 204, 0.08)',
      }),

      // Hover effects
      '&:hover': {
        ...(inputVariant !== 'minimal' && {
          transform: 'translateY(-1px)',
          boxShadow: theme.elevation[2],
        }),

        ...(inputVariant === 'glass' && {
          backgroundColor: 'rgba(255, 255, 255, 0.12)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }),

        ...(inputVariant === 'premium' && {
          backgroundColor: alpha(theme.palette.primary.main, 0.04),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
          boxShadow: '0 4px 16px rgba(0, 102, 204, 0.12)',
        }),
      },

      // Focus state
      '&.Mui-focused': {
        ...(glowEffect && {
          animation: `${focusGlow} 0.6s ease-out`,
        }),

        ...(inputVariant === 'glass' && {
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          border: `1px solid ${theme.palette.primary.main}`,
          boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
        }),

        ...(inputVariant === 'minimal' && {
          borderBottomColor: theme.palette.primary.main,
          borderBottomWidth: 3,
        }),

        ...(inputVariant === 'premium' && {
          backgroundColor: alpha(theme.palette.primary.main, 0.06),
          border: `1px solid ${theme.palette.primary.main}`,
          boxShadow: `
            0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)},
            0 8px 24px rgba(0, 102, 204, 0.15)
          `,
        }),
      },

      // Shimmer effect
      ...(shimmerEffect && {
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
          animation: `${shimmerPass} 2s infinite`,
          pointerEvents: 'none',
        },
      }),
    },

    // Input field styling
    '& .MuiInputBase-input': {
      padding: currentSize.padding,
      fontSize: currentSize.fontSize,
      fontWeight: 500,
      color: theme.palette.text.primary,

      '&::placeholder': {
        color: theme.palette.text.secondary,
        opacity: 0.7,
      },
    },

    // Label styling
    '& .MuiInputLabel-root': {
      fontSize: currentSize.fontSize,
      fontWeight: 500,
      color: theme.palette.text.secondary,
      transform: 'translateY(0) scale(1)',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',

      '&.Mui-focused': {
        color: theme.palette.primary.main,
        fontWeight: 600,
      },

      '&.MuiInputLabel-shrink': {
        transform: 'translateY(-24px) scale(0.85)',
        fontWeight: 600,
      },
    },

    // Helper text styling
    '& .MuiFormHelperText-root': {
      marginTop: theme.spacing(1),
      fontSize: '0.875rem',
      fontWeight: 500,

      '&.Mui-error': {
        color: theme.palette.error.main,
      },
    },

    // Premium enhancements
    ...(premium && {
      '& .MuiInputBase-root': {
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
        boxShadow: `
          0 2px 8px rgba(0, 102, 204, 0.08),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `,

        '&:hover': {
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
          boxShadow: `
            0 4px 16px rgba(0, 102, 204, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.15)
          `,
        },

        '&.Mui-focused': {
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.06)} 100%)`,
          border: `1px solid ${theme.palette.primary.main}`,
          boxShadow: `
            0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)},
            0 8px 24px rgba(0, 102, 204, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.2)
          `,
        },
      },
    }),
  };
});

// Loading indicator
const LoadingIndicator = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: '2px',
  background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, transparent)`,
  animation: `${shimmerPass} 1.5s infinite`,
}));

export const Input = forwardRef<HTMLDivElement, PremiumInputProps>(({
  variant = 'outlined',
  size = 'medium',
  type = 'text',
  showClearButton = false,
  glowEffect = false,
  shimmerEffect = false,
  premium = false,
  leftIcon,
  rightIcon,
  helperIcon,
  loading = false,
  value,
  onChange,
  InputProps,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = useCallback(() => {
    if (onChange && inputRef.current) {
      const event = {
        target: { value: '' }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    }
  }, [onChange]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const hasValue = Boolean(value && value.toString().length > 0);
  const showClear = showClearButton && hasValue && !props.disabled;
  const isPassword = type === 'password';
  const actualType = isPassword && showPassword ? 'text' : type;

  // Build start adornment
  const startAdornment = leftIcon ? (
    <InputAdornment position="start">
      <Box
        sx={{
          color: isFocused ? 'primary.main' : 'action.active',
          transition: 'color 0.2s ease',
        }}
      >
        {leftIcon}
      </Box>
    </InputAdornment>
  ) : undefined;

  // Build end adornment
  const endAdornment = (rightIcon || showClear || isPassword) ? (
    <InputAdornment position="end">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {rightIcon && (
          <Box
            sx={{
              color: isFocused ? 'primary.main' : 'action.active',
              transition: 'color 0.2s ease',
            }}
          >
            {rightIcon}
          </Box>
        )}

        {showClear && (
          <IconButton
            size="small"
            onClick={handleClear}
            sx={{
              opacity: 0.7,
              '&:hover': { opacity: 1 },
              transition: 'opacity 0.2s ease',
            }}
          >
            <Clear fontSize="small" />
          </IconButton>
        )}

        {isPassword && (
          <IconButton
            size="small"
            onClick={togglePasswordVisibility}
            sx={{
              opacity: 0.7,
              '&:hover': { opacity: 1 },
              transition: 'opacity 0.2s ease',
            }}
          >
            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
          </IconButton>
        )}
      </Box>
    </InputAdornment>
  ) : undefined;

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <StyledTextField
        ref={ref}
        inputRef={inputRef}
        variant={variant === 'glass' || variant === 'minimal' || variant === 'premium' ? 'outlined' : (variant as 'outlined' | 'filled' | 'standard')}
        inputVariant={variant}
        inputSize={size}
        glowEffect={glowEffect}
        shimmerEffect={shimmerEffect}
        premium={premium || variant === 'premium'}
        type={actualType}
        value={value}
        onChange={onChange}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        InputProps={{
          startAdornment,
          endAdornment,
          ...InputProps,
        }}
        {...props}
      />

      {/* Loading indicator */}
      {loading && <LoadingIndicator />}

      {/* Helper text with icon */}
      {helperIcon && props.helperText && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mt: 1,
          }}
        >
          <Box
            sx={{
              color: props.error ? 'error.main' : 'text.secondary',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {helperIcon}
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: props.error ? 'error.main' : 'text.secondary',
              fontWeight: 500,
            }}
          >
            {props.helperText}
          </Typography>
        </Box>
      )}
    </Box>
  );
});

Input.displayName = 'Input';

export default Input;