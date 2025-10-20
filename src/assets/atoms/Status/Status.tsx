/**
 * Premium Status Components
 * =========================
 * The most beautiful status components for enterprise travel software.
 * Features premium alerts, sophisticated chips, elegant badges, and status indicators
 * that communicate information with style and clarity.
 */

import { forwardRef } from 'react';
import {
    Alert as MUIAlert,
    type AlertProps as MUIAlertProps,
    Chip as MUIChip,
    type ChipProps as MUIChipProps,
    Badge as MUIBadge,
    type BadgeProps as MUIBadgeProps,
    Box,
    Typography,
    alpha,
    styled,
    keyframes,
} from '@mui/material';

// Premium animations
const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(0, 102, 204, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(0, 102, 204, 0); }
`;

const bounceAnimation = keyframes`
  0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
  40%, 43% { transform: translateY(-8px); }
  70% { transform: translateY(-4px); }
  90% { transform: translateY(-2px); }
`;

const shimmerAnimation = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// Premium Alert Component
export interface PremiumAlertProps extends Omit<MUIAlertProps, 'variant'> {
    variant?: 'filled' | 'outlined' | 'glass' | 'minimal' | 'premium';
    glow?: boolean;
    shimmer?: boolean;
    dismissible?: boolean;
    premium?: boolean;
}

const StyledAlert = styled(MUIAlert, {
    shouldForwardProp: (prop) =>
        !['alertVariant', 'glow', 'shimmer', 'premium'].includes(prop as string)
})<{
    alertVariant?: string;
    glow?: boolean;
    shimmer?: boolean;
    premium?: boolean;
}>(({ theme, alertVariant, glow, shimmer }) => ({
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2, 3),
    border: 'none',

    // Glass variant
    ...(alertVariant === 'glass' && {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
    }),

    // Minimal variant
    ...(alertVariant === 'minimal' && {
        backgroundColor: 'transparent',
        borderLeft: `4px solid ${theme.palette.primary.main}`,
        borderRadius: 0,
        paddingLeft: theme.spacing(2),
    }),

    // Premium variant
    ...(alertVariant === 'premium' && {
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
        boxShadow: '0 4px 16px rgba(0, 102, 204, 0.08)',
    }),

    // Glow effect
    ...(glow && {
        animation: `${pulseGlow} 2s infinite`,
    }),

    // Shimmer effect
    ...(shimmer && {
        background: `linear-gradient(90deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.1)} 50%, ${theme.palette.background.paper} 100%)`,
        backgroundSize: '200% auto',
        animation: `${shimmerAnimation} 3s linear infinite`,
    }),

    '& .MuiAlert-icon': {
        fontSize: '1.5rem',
        marginRight: theme.spacing(1.5),
    },

    '& .MuiAlert-message': {
        fontSize: '1rem',
        fontWeight: 500,
        lineHeight: 1.5,
    },
}));

export const Alert = forwardRef<HTMLDivElement, PremiumAlertProps>(({
    variant = 'filled',
    glow = false,
    shimmer = false,
    dismissible = false,
    premium = false,
    children,
    onClose,
    ...props
}, ref) => {
    return (
        <StyledAlert
            ref={ref}
            variant={variant === 'glass' || variant === 'minimal' || variant === 'premium' ? 'outlined' : variant}
            alertVariant={variant}
            glow={glow}
            shimmer={shimmer}
            premium={premium || variant === 'premium'}
            onClose={dismissible ? onClose : undefined}
            {...props}
        >
            {children}
        </StyledAlert>
    );
});

Alert.displayName = 'Alert';

// Premium Chip Component
export interface PremiumChipProps extends Omit<MUIChipProps, 'variant'> {
    variant?: 'filled' | 'outlined' | 'glass' | 'gradient' | 'premium';
    glow?: boolean;
    shimmer?: boolean;
    premium?: boolean;
    interactive?: boolean;
}

const StyledChip = styled(MUIChip, {
    shouldForwardProp: (prop) =>
        !['chipVariant', 'glow', 'shimmer', 'premium', 'interactive'].includes(prop as string)
})<{
    chipVariant?: string;
    glow?: boolean;
    shimmer?: boolean;
    premium?: boolean;
    interactive?: boolean;
}>(({ theme, chipVariant, glow, shimmer, interactive }) => ({
    borderRadius: theme.spacing(3),
    height: 32,
    fontSize: '0.875rem',
    fontWeight: 600,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: 'none',

    // Glass variant
    ...(chipVariant === 'glass' && {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        color: theme.palette.text.primary,
    }),

    // Gradient variant
    ...(chipVariant === 'gradient' && {
        background: theme.gradients.brandPrimary,
        color: theme.palette.common.white,
        '&:hover': {
            background: theme.gradients.brandSecondary,
        },
    }),

    // Premium variant
    ...(chipVariant === 'premium' && {
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        color: theme.palette.primary.main,
        boxShadow: '0 2px 8px rgba(0, 102, 204, 0.1)',
    }),

    // Interactive effects
    ...(interactive && {
        cursor: 'pointer',
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0, 102, 204, 0.15)',
        },
        '&:active': {
            transform: 'translateY(0)',
        },
    }),

    // Glow effect
    ...(glow && {
        boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.3)}`,
    }),

    // Shimmer effect
    ...(shimmer && {
        background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 50%, ${theme.palette.primary.main} 100%)`,
        backgroundSize: '200% auto',
        animation: `${shimmerAnimation} 3s linear infinite`,
        color: theme.palette.common.white,
    }),
}));

export const Chip = forwardRef<HTMLDivElement, PremiumChipProps>(({
    variant = 'filled',
    glow = false,
    shimmer = false,
    premium = false,
    interactive = false,
    onClick,
    ...props
}, ref) => {
    return (
        <StyledChip
            ref={ref}
            variant={variant === 'glass' || variant === 'gradient' || variant === 'premium' ? 'filled' : variant}
            chipVariant={variant}
            glow={glow}
            shimmer={shimmer}
            premium={premium || variant === 'premium'}
            interactive={interactive || Boolean(onClick)}
            onClick={onClick}
            {...props}
        />
    );
});

Chip.displayName = 'Chip';

// Premium Badge Component
export interface PremiumBadgeProps extends Omit<MUIBadgeProps, 'variant'> {
    variant?: 'standard' | 'dot' | 'premium' | 'glow';
    pulse?: boolean;
    bounce?: boolean;
    premium?: boolean;
}

const StyledBadge = styled(MUIBadge, {
    shouldForwardProp: (prop) =>
        !['badgeVariant', 'pulse', 'bounce', 'premium'].includes(prop as string)
})<{
    badgeVariant?: string;
    pulse?: boolean;
    bounce?: boolean;
    premium?: boolean;
}>(({ theme, badgeVariant, pulse, bounce, premium }) => ({
    '& .MuiBadge-badge': {
        fontSize: '0.75rem',
        fontWeight: 600,
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        border: `2px solid ${theme.palette.background.paper}`,

        // Premium styling
        ...(premium && {
            background: theme.gradients.brandPrimary,
            boxShadow: '0 2px 8px rgba(0, 102, 204, 0.3)',
        }),

        // Glow variant
        ...(badgeVariant === 'glow' && {
            boxShadow: `0 0 16px ${alpha(theme.palette.primary.main, 0.6)}`,
        }),

        // Pulse animation
        ...(pulse && {
            animation: `${pulseGlow} 1.5s infinite`,
        }),

        // Bounce animation
        ...(bounce && {
            animation: `${bounceAnimation} 2s infinite`,
        }),
    },

    // Dot variant styling
    '& .MuiBadge-dot': {
        width: 12,
        height: 12,
        borderRadius: '50%',

        ...(premium && {
            background: theme.gradients.brandPrimary,
            boxShadow: '0 0 8px rgba(0, 102, 204, 0.4)',
        }),
    },
}));

export const Badge = forwardRef<HTMLSpanElement, PremiumBadgeProps>(({
    variant = 'standard',
    pulse = false,
    bounce = false,
    premium = false,
    ...props
}, ref) => {
    return (
        <StyledBadge
            ref={ref}
            variant={variant === 'premium' || variant === 'glow' ? 'standard' : variant}
            badgeVariant={variant}
            pulse={pulse}
            bounce={bounce}
            premium={premium || variant === 'premium'}
            {...props}
        />
    );
});

Badge.displayName = 'Badge';

// Status Indicator Component
export interface StatusIndicatorProps {
    status: 'online' | 'offline' | 'away' | 'busy' | 'success' | 'warning' | 'error' | 'info';
    size?: 'small' | 'medium' | 'large';
    pulse?: boolean;
    showLabel?: boolean;
    label?: string;
}

const statusConfig = {
    online: { color: '#12B76A', label: 'Online' },
    offline: { color: '#667085', label: 'Offline' },
    away: { color: '#F79009', label: 'Away' },
    busy: { color: '#F04438', label: 'Busy' },
    success: { color: '#12B76A', label: 'Success' },
    warning: { color: '#F79009', label: 'Warning' },
    error: { color: '#F04438', label: 'Error' },
    info: { color: '#0EA5E9', label: 'Info' },
};

const StatusDot = styled(Box, {
    shouldForwardProp: (prop) => !['statusColor', 'dotSize', 'pulse'].includes(prop as string)
})<{
    statusColor: string;
    dotSize: number;
    pulse?: boolean;
}>(({ statusColor, dotSize, pulse }) => ({
    width: dotSize,
    height: dotSize,
    borderRadius: '50%',
    backgroundColor: statusColor,
    boxShadow: `0 0 0 2px ${alpha(statusColor, 0.2)}`,

    ...(pulse && {
        animation: `${pulseGlow} 2s infinite`,
        animationName: keyframes`
      0%, 100% { 
        transform: scale(1);
        opacity: 1;
      }
      50% { 
        transform: scale(1.2);
        opacity: 0.8;
      }
    `,
    }),
}));

export const StatusIndicator = forwardRef<HTMLDivElement, StatusIndicatorProps>(({
    status,
    size = 'medium',
    pulse = false,
    showLabel = false,
    label,
    ...props
}, ref) => {
    const config = statusConfig[status];
    const sizeMap = { small: 8, medium: 12, large: 16 };
    const dotSize = sizeMap[size];

    return (
        <Box
            ref={ref}
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
            }}
            {...props}
        >
            <StatusDot
                statusColor={config.color}
                dotSize={dotSize}
                pulse={pulse}
            />
            {showLabel && (
                <Typography
                    variant="body2"
                    sx={{
                        fontSize: size === 'small' ? '0.75rem' : '0.875rem',
                        fontWeight: 500,
                        color: 'text.secondary',
                    }}
                >
                    {label || config.label}
                </Typography>
            )}
        </Box>
    );
});

StatusIndicator.displayName = 'StatusIndicator';

export default {
    Alert,
    Chip,
    Badge,
    StatusIndicator,
};