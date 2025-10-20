/**
 * Premium Card Component
 * ======================
 * The most beautiful card component ever created for enterprise travel software.
 * Features floating effects, glass morphism, gradient overlays, and premium animations
 * that create an immersive, future-tech experience.
 */

import React, { forwardRef, useState } from 'react';
import {
  Card as MUICard,
  type CardProps as MUICardProps,
  Box,
  alpha,
  styled,
  keyframes,
} from '@mui/material';
import { useMUITheme } from '../../theme/hooks';

// Stunning animations
const shimmerSweep = keyframes`
  0% { transform: translateX(-100%) skewX(-15deg); }
  100% { transform: translateX(200%) skewX(-15deg); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 8px 32px rgba(0, 102, 204, 0.15); }
  50% { box-shadow: 0 12px 48px rgba(0, 102, 204, 0.25); }
`;

const gradientShift = keyframes`
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
`;

// Premium card variants
export type CardVariant =
  | 'standard'
  | 'elevated'
  | 'glass'
  | 'gradient'
  | 'premium'
  | 'floating'
  | 'hero'
  | 'subtle'
  | 'glow';

export interface PremiumCardProps extends Omit<MUICardProps, 'variant'> {
  variant?: CardVariant;
  hoverable?: boolean;
  shimmerEffect?: boolean;
  glowEffect?: boolean;
  floatingEffect?: boolean;
  interactive?: boolean;
  borderGradient?: boolean;
  premium?: boolean;
}

// Styled card with premium effects
const StyledCard = styled(MUICard, {
  shouldForwardProp: (prop) =>
    !['cardVariant', 'hoverable', 'shimmerEffect', 'glowEffect', 'floatingEffect', 'interactive', 'borderGradient', 'premium'].includes(prop as string)
})<{
  cardVariant?: CardVariant;
  hoverable?: boolean;
  shimmerEffect?: boolean;
  glowEffect?: boolean;
  floatingEffect?: boolean;
  interactive?: boolean;
  borderGradient?: boolean;
  premium?: boolean;
}>(({ theme, cardVariant, hoverable, shimmerEffect, glowEffect, floatingEffect, interactive, borderGradient, premium }) => ({
  // Base premium styling
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.spacing(2),
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: interactive ? 'pointer' : 'default',

  // Premium border gradient
  ...(borderGradient && {
    background: `linear-gradient(${theme.palette.background.paper}, ${theme.palette.background.paper}) padding-box,
                 linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.primary.main}) border-box`,
    border: '2px solid transparent',
  }),

  // Hover effects
  ...((hoverable || interactive) && {
    '&:hover': {
      transform: floatingEffect ? 'translateY(-8px) scale(1.02)' : 'translateY(-4px)',
      boxShadow: cardVariant === 'glass'
        ? '0 20px 60px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
        : theme.customShadows.cardHover,
    },
  }),

  // Active state for interactive cards
  ...(interactive && {
    '&:active': {
      transform: 'translateY(-2px) scale(0.99)',
    },
  }),

  // Shimmer effect overlay
  ...(shimmerEffect && {
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent)',
      animation: `${shimmerSweep} 3s infinite`,
      zIndex: 1,
      transform: 'skewX(-15deg)',
    },
  }),

  // Glow effect
  ...(glowEffect && {
    animation: `${pulseGlow} 3s ease-in-out infinite`,
  }),

  // Premium enhanced effects
  ...(premium && {
    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    boxShadow: `
      0 8px 32px rgba(0, 102, 204, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
    '&:hover': {
      border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
      boxShadow: `
        0 16px 48px rgba(0, 102, 204, 0.12),
        inset 0 1px 0 rgba(255, 255, 255, 0.2)
      `,
    },
  }),
}));

// Glass overlay for glass variant
const GlassOverlay = styled(Box)(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: 'inherit',
  pointerEvents: 'none',
}));

// Premium shine effect
const ShineEffect = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '-50%',
  left: '-50%',
  right: '-50%',
  bottom: '-50%',
  background: `conic-gradient(from 0deg, transparent, ${alpha(theme.palette.primary.main, 0.1)}, transparent)`,
  animation: `${gradientShift} 4s ease-in-out infinite`,
  borderRadius: 'inherit',
  pointerEvents: 'none',
  opacity: 0,
  transition: 'opacity 0.3s ease',
}));

export const Card = forwardRef<HTMLDivElement, PremiumCardProps>(({
  variant = 'standard',
  hoverable = false,
  shimmerEffect = false,
  glowEffect = false,
  floatingEffect = false,
  interactive = false,
  borderGradient = false,
  premium = false,
  children,
  sx,
  onMouseEnter,
  onMouseLeave,
  ...props
}, ref) => {
  const theme = useMUITheme();
  const [isHovered, setIsHovered] = useState(false);

  // Variant styles
  const getVariantStyles = () => {
    const variants = {
      standard: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.elevation[2],
      },
      elevated: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.elevation[4],
      },
      glass: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      },
      gradient: {
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        boxShadow: theme.elevation[3],
      },
      premium: {
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
        boxShadow: `
          0 8px 32px rgba(0, 102, 204, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `,
      },
      floating: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.elevation[6],
        transform: 'translateY(-4px)',
      },
      hero: {
        background: theme.gradients.brandPrimary,
        color: theme.palette.common.white,
        boxShadow: `
          0 16px 48px rgba(0, 102, 204, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `,
      },
      subtle: {
        backgroundColor: alpha(theme.palette.grey[50], 0.5),
        border: `1px solid ${alpha(theme.palette.grey[200], 0.5)}`,
        boxShadow: theme.elevation[1],
      },
      glow: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: `
          0 8px 32px rgba(0, 102, 204, 0.15),
          0 0 0 1px ${alpha(theme.palette.primary.main, 0.1)}
        `,
      },
    };

    return variants[variant] || variants.standard;
  };

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(true);
    onMouseEnter?.(event);
  };

  const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(false);
    onMouseLeave?.(event);
  };

  return (
    <StyledCard
      ref={ref}
      cardVariant={variant}
      hoverable={hoverable}
      shimmerEffect={shimmerEffect}
      glowEffect={glowEffect}
      floatingEffect={floatingEffect}
      interactive={interactive}
      borderGradient={borderGradient}
      premium={premium || variant === 'premium'}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        ...getVariantStyles(),
        ...sx,
      }}
      {...props}
    >
      {/* Glass overlay for glass variant */}
      {variant === 'glass' && <GlassOverlay />}

      {/* Premium shine effect */}
      {(premium || variant === 'premium' || variant === 'hero') && (
        <ShineEffect
          sx={{
            opacity: isHovered ? 0.5 : 0,
          }}
        />
      )}

      {/* Content container */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </Box>

      {/* Interactive ripple effect */}
      {interactive && isHovered && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 0,
            height: 0,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
            animation: 'ripple 0.6s linear',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            '@keyframes ripple': {
              to: {
                width: '200%',
                height: '200%',
                opacity: 0,
              },
            },
          }}
        />
      )}
    </StyledCard>
  );
});

Card.displayName = 'Card';

export default Card;