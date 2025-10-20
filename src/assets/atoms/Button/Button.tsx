/**
 * Premium Button Component
 * ========================
 * The world's most beautiful button component designed for enterprise travel operations.
 * Features glass morphism, gradient overlays, micro-interactions, and premium animations
 * that make users feel like they're interacting with technology from the future.
 */

import React, { forwardRef, useState } from 'react';
import {
  Button as MUIButton,
  type ButtonProps as MUIButtonProps,
  CircularProgress,
  Box,
  alpha,
  styled,
  keyframes
} from '@mui/material';
import { useMUITheme } from '../../theme/hooks';

// Stunning animations
const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(0, 102, 204, 0.3); }
  50% { box-shadow: 0 0 40px rgba(0, 102, 204, 0.6); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-2px); }
`;

// Premium button variants
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'glass'
  | 'gradient'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'success'
  | 'premium';

export type ButtonSize = 'small' | 'medium' | 'large' | 'xlarge';

export interface PremiumButtonProps extends Omit<MUIButtonProps, 'variant' | 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  shimmerEffect?: boolean;
  glowEffect?: boolean;
  floatEffect?: boolean;
  premium?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

// Styled button with premium effects
const StyledButton = styled(MUIButton, {
  shouldForwardProp: (prop) =>
    !['shimmerEffect', 'glowEffect', 'floatEffect', 'premium', 'buttonVariant'].includes(prop as string)
})<{
  shimmerEffect?: boolean;
  glowEffect?: boolean;
  floatEffect?: boolean;
  premium?: boolean;
  buttonVariant?: ButtonVariant;
}>(({ theme, shimmerEffect, glowEffect, floatEffect, premium, buttonVariant }) => ({
  // Base styles for premium feel
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.spacing(1.5),
  textTransform: 'none',
  fontWeight: 600,
  letterSpacing: '0.02em',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  backdropFilter: buttonVariant === 'glass' ? 'blur(12px)' : 'none',

  // Premium spacing and proportions
  minHeight: 48,
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),

  // Hover effects
  '&:hover': {
    transform: floatEffect ? 'translateY(-2px)' : 'translateY(-1px)',
    boxShadow: theme.customShadows.buttonHover,
  },

  // Active state
  '&:active': {
    transform: 'translateY(0)',
  },

  // Focus state with premium ring
  '&:focus-visible': {
    outline: 'none',
    boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}`,
  },

  // Disabled state
  '&:disabled': {
    opacity: 0.6,
    transform: 'none',
    cursor: 'not-allowed',
  },

  // Shimmer effect overlay
  ...(shimmerEffect && {
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
      animation: `${shimmer} 2s infinite`,
    },
  }),

  // Glow effect
  ...(glowEffect && {
    animation: `${glow} 2s ease-in-out infinite`,
  }),

  // Float effect
  ...(floatEffect && {
    animation: `${float} 3s ease-in-out infinite`,
  }),

  // Premium enhanced effects
  ...(premium && {
    background: theme.gradients.brandPrimary,
    boxShadow: `
      0 8px 32px rgba(0, 102, 204, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
    '&:hover': {
      background: theme.gradients.brandSecondary,
      transform: 'translateY(-3px)',
      boxShadow: `
        0 12px 40px rgba(0, 102, 204, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.2)
      `,
    },
  }),
}));

export const Button = forwardRef<HTMLButtonElement, PremiumButtonProps>(({
  variant = 'primary',
  size = 'medium',
  loading = false,
  shimmerEffect = false,
  glowEffect = false,
  floatEffect = false,
  premium = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  sx,
  ...props
}, ref) => {
  const theme = useMUITheme();
  const [isHovered, setIsHovered] = useState(false);

  // Size configurations
  const sizeConfig = {
    small: {
      minHeight: 36,
      px: 2,
      fontSize: '0.875rem',
    },
    medium: {
      minHeight: 48,
      px: 3,
      fontSize: '1rem',
    },
    large: {
      minHeight: 56,
      px: 4,
      fontSize: '1.125rem',
    },
    xlarge: {
      minHeight: 64,
      px: 5,
      fontSize: '1.25rem',
    },
  };

  // Variant styles
  const getVariantStyles = () => {
    const variants = {
      primary: {
        background: theme.gradients.brandPrimary,
        color: theme.palette.common.white,
        border: 'none',
        '&:hover': {
          background: theme.gradients.brandSecondary,
          boxShadow: theme.customShadows.glow,
        },
      },
      secondary: {
        background: theme.gradients.brandSecondary,
        color: theme.palette.common.white,
        border: 'none',
        '&:hover': {
          background: theme.gradients.brandTertiary,
        },
      },
      tertiary: {
        background: theme.gradients.brandTertiary,
        color: theme.palette.grey[900],
        border: 'none',
        '&:hover': {
          background: theme.gradients.brandPrimary,
          color: theme.palette.common.white,
        },
      },
      glass: {
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: theme.palette.text.primary,
        '&:hover': {
          background: 'rgba(255, 255, 255, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        },
      },
      gradient: {
        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        color: theme.palette.common.white,
        border: 'none',
        '&:hover': {
          background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
        },
      },
      outline: {
        background: 'transparent',
        border: `2px solid ${theme.palette.primary.main}`,
        color: theme.palette.primary.main,
        '&:hover': {
          background: theme.palette.primary.main,
          color: theme.palette.common.white,
          borderColor: theme.palette.primary.main,
        },
      },
      ghost: {
        background: 'transparent',
        border: 'none',
        color: theme.palette.primary.main,
        '&:hover': {
          background: alpha(theme.palette.primary.main, 0.1),
        },
      },
      danger: {
        background: theme.gradients.brandPrimary.replace('0066CC', theme.palette.error.main),
        color: theme.palette.common.white,
        border: 'none',
        '&:hover': {
          background: theme.palette.error.dark,
        },
      },
      success: {
        background: theme.gradients.brandPrimary.replace('0066CC', theme.palette.success.main),
        color: theme.palette.common.white,
        border: 'none',
        '&:hover': {
          background: theme.palette.success.dark,
        },
      },
      premium: {
        background: theme.gradients.brandPrimary,
        color: theme.palette.common.white,
        border: 'none',
        boxShadow: `
          0 8px 32px rgba(0, 102, 204, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `,
        '&:hover': {
          background: theme.gradients.brandSecondary,
          boxShadow: `
            0 12px 40px rgba(0, 102, 204, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.2)
          `,
        },
      },
    };

    return variants[variant] || variants.primary;
  };

  const currentSizeConfig = sizeConfig[size];

  return (
    <StyledButton
      ref={ref}
      buttonVariant={variant}
      shimmerEffect={shimmerEffect}
      glowEffect={glowEffect}
      floatEffect={floatEffect}
      premium={premium || variant === 'premium'}
      disabled={disabled || loading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        ...getVariantStyles(),
        minHeight: currentSizeConfig.minHeight,
        px: currentSizeConfig.px,
        fontSize: currentSizeConfig.fontSize,
        ...sx,
      }}
      {...props}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Left Icon */}
        {leftIcon && !loading && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              transition: 'transform 0.2s ease',
              transform: isHovered ? 'translateX(-2px)' : 'translateX(0)',
            }}
          >
            {leftIcon}
          </Box>
        )}

        {/* Loading Spinner */}
        {loading && (
          <CircularProgress
            size={20}
            sx={{
              color: 'inherit',
              mr: leftIcon ? 0 : 1,
            }}
          />
        )}

        {/* Button Text */}
        <Box
          sx={{
            transition: 'transform 0.2s ease',
            transform: isHovered && !loading ? 'scale(1.02)' : 'scale(1)',
          }}
        >
          {children}
        </Box>

        {/* Right Icon */}
        {rightIcon && !loading && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              transition: 'transform 0.2s ease',
              transform: isHovered ? 'translateX(2px)' : 'translateX(0)',
            }}
          >
            {rightIcon}
          </Box>
        )}
      </Box>

      {/* Premium shine effect */}
      {(premium || variant === 'premium') && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
            animation: isHovered ? `${shimmer} 1.5s ease-out` : 'none',
            pointerEvents: 'none',
          }}
        />
      )}
    </StyledButton>
  );
});

Button.displayName = 'Button';

export default Button;