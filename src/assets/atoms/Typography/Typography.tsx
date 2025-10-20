/**
 * Premium Typography Components
 * =============================
 * The most sophisticated typography components for enterprise travel software.
 * Features perfect spacing, premium animations, gradient text effects, and
 * typography that communicates authority and forward-thinking innovation.
 */

import { forwardRef } from 'react';
import {
    Typography as MUITypography,
    type TypographyProps as MUITypographyProps,
    alpha,
    styled,
    keyframes,
} from '@mui/material';

// Premium animations
const textShimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const fadeInUp = keyframes`
  0% { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  100% { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

// Premium typography variants
export type TextVariant =
    | 'display'
    | 'headline'
    | 'title'
    | 'body'
    | 'caption'
    | 'overline'
    | 'gradient'
    | 'glow'
    | 'premium';

export type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
export type TextWeight = 'light' | 'regular' | 'medium' | 'semibold' | 'bold';

export interface PremiumTypographyProps extends Omit<MUITypographyProps, 'variant'> {
    variant?: TextVariant;
    size?: TextSize;
    weight?: TextWeight;
    gradient?: boolean;
    glow?: boolean;
    shimmer?: boolean;
    animate?: boolean;
    typewriter?: boolean;
    premium?: boolean;
    truncate?: boolean;
    maxLines?: number;
}

// Styled typography with premium effects
const StyledTypography = styled(MUITypography, {
    shouldForwardProp: (prop) =>
        !['textVariant', 'textSize', 'textWeight', 'gradient', 'glow', 'shimmer', 'animate', 'typewriter', 'premium', 'truncate', 'maxLines'].includes(prop as string)
})<{
    textVariant?: TextVariant;
    textSize?: TextSize;
    textWeight?: TextWeight;
    gradient?: boolean;
    glow?: boolean;
    shimmer?: boolean;
    animate?: boolean;
    typewriter?: boolean;
    premium?: boolean;
    truncate?: boolean;
    maxLines?: number;
}>(({ theme, textVariant, textSize, textWeight, gradient, glow, shimmer, animate, typewriter, premium, truncate, maxLines }) => {

    // Size configurations
    const sizeConfig = {
        xs: { fontSize: '0.75rem', lineHeight: 1.4 },
        sm: { fontSize: '0.875rem', lineHeight: 1.5 },
        md: { fontSize: '1rem', lineHeight: 1.5 },
        lg: { fontSize: '1.125rem', lineHeight: 1.6 },
        xl: { fontSize: '1.25rem', lineHeight: 1.6 },
        '2xl': { fontSize: '1.5rem', lineHeight: 1.4 },
        '3xl': { fontSize: '1.875rem', lineHeight: 1.3 },
        '4xl': { fontSize: '2.25rem', lineHeight: 1.2 },
        '5xl': { fontSize: '3rem', lineHeight: 1.1 },
    };

    // Weight configurations
    const weightConfig = {
        light: 300,
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    };

    const currentSize = sizeConfig[textSize || 'md'];
    const currentWeight = weightConfig[textWeight || 'regular'];

    return {
        // Base styles
        fontSize: currentSize.fontSize,
        lineHeight: currentSize.lineHeight,
        fontWeight: currentWeight,
        margin: 0,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

        // Gradient text effect
        ...(gradient && {
            background: theme.gradients.brandPrimary,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundSize: '200% auto',
        }),

        // Glow effect
        ...(glow && {
            textShadow: `
        0 0 10px ${alpha(theme.palette.primary.main, 0.5)},
        0 0 20px ${alpha(theme.palette.primary.main, 0.3)},
        0 0 30px ${alpha(theme.palette.primary.main, 0.1)}
      `,
        }),

        // Shimmer animation
        ...(shimmer && {
            background: `linear-gradient(90deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.text.primary} 100%)`,
            backgroundSize: '200% auto',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: `${textShimmer} 3s linear infinite`,
        }),

        // Fade in animation
        ...(animate && {
            animation: `${fadeInUp} 0.6s ease-out`,
        }),

        // Typewriter effect
        ...(typewriter && {
            overflow: 'hidden',
            borderRight: `2px solid ${theme.palette.primary.main}`,
            whiteSpace: 'nowrap',
            animation: `${typewriter} 3s steps(40, end), blink-caret 0.75s step-end infinite`,
            '@keyframes blink-caret': {
                'from, to': { borderColor: 'transparent' },
                '50%': { borderColor: theme.palette.primary.main },
            },
        }),

        // Text truncation
        ...(truncate && {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        }),

        // Multi-line truncation
        ...(maxLines && {
            display: '-webkit-box',
            WebkitLineClamp: maxLines,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
        }),

        // Premium enhancements
        ...(premium && {
            background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.text.primary} 100%)`,
            backgroundSize: '200% auto',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: `0 2px 4px ${alpha(theme.palette.primary.main, 0.1)}`,
            letterSpacing: '0.02em',
        }),

        // Variant-specific styles
        ...(textVariant === 'display' && {
            fontFamily: theme.typography.fontFamily,
            fontWeight: 700,
            letterSpacing: '-0.02em',
        }),

        ...(textVariant === 'headline' && {
            fontFamily: theme.typography.fontFamily,
            fontWeight: 600,
            letterSpacing: '-0.01em',
        }),

        ...(textVariant === 'title' && {
            fontFamily: theme.typography.fontFamily,
            fontWeight: 600,
        }),

        ...(textVariant === 'body' && {
            fontFamily: theme.typography.fontFamily,
            fontWeight: 400,
            lineHeight: 1.6,
        }),

        ...(textVariant === 'caption' && {
            fontFamily: theme.typography.fontFamily,
            fontWeight: 500,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            opacity: 0.8,
        }),

        ...(textVariant === 'overline' && {
            fontFamily: theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: '0.875rem',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            opacity: 0.9,
        }),
    };
});

export const Text = forwardRef<HTMLElement, PremiumTypographyProps>(({
    variant = 'body',
    size = 'md',
    weight = 'regular',
    gradient = false,
    glow = false,
    shimmer = false,
    animate = false,
    typewriter = false,
    premium = false,
    truncate = false,
    maxLines,
    children,
    sx,
    ...props
}, ref) => {
    // Map our variants to MUI variants
    const muiVariantMap = {
        display: 'h1',
        headline: 'h2',
        title: 'h6',
        body: 'body1',
        caption: 'caption',
        overline: 'overline',
        gradient: 'body1',
        glow: 'body1',
        premium: 'body1',
    } as const;

    const muiVariant = muiVariantMap[variant] || 'body1';

    return (
        <StyledTypography
            ref={ref}
            variant={muiVariant}
            textVariant={variant}
            textSize={size}
            textWeight={weight}
            gradient={gradient || variant === 'gradient'}
            glow={glow || variant === 'glow'}
            shimmer={shimmer}
            animate={animate}
            typewriter={typewriter}
            premium={premium || variant === 'premium'}
            truncate={truncate}
            maxLines={maxLines}
            sx={sx}
            {...props}
        >
            {children}
        </StyledTypography>
    );
});

Text.displayName = 'Text';

// Specialized components
export const Display = forwardRef<HTMLElement, Omit<PremiumTypographyProps, 'variant'>>((props, ref) => (
    <Text ref={ref} variant="display" size="4xl" weight="bold" {...props} />
));

export const Headline = forwardRef<HTMLElement, Omit<PremiumTypographyProps, 'variant'>>((props, ref) => (
    <Text ref={ref} variant="headline" size="2xl" weight="semibold" {...props} />
));

export const Title = forwardRef<HTMLElement, Omit<PremiumTypographyProps, 'variant'>>((props, ref) => (
    <Text ref={ref} variant="title" size="lg" weight="semibold" {...props} />
));

export const Body = forwardRef<HTMLElement, Omit<PremiumTypographyProps, 'variant'>>((props, ref) => (
    <Text ref={ref} variant="body" size="md" weight="regular" {...props} />
));

export const Caption = forwardRef<HTMLElement, Omit<PremiumTypographyProps, 'variant'>>((props, ref) => (
    <Text ref={ref} variant="caption" size="sm" weight="medium" {...props} />
));

export const Overline = forwardRef<HTMLElement, Omit<PremiumTypographyProps, 'variant'>>((props, ref) => (
    <Text ref={ref} variant="overline" size="sm" weight="semibold" {...props} />
));

// Premium text effects
export const GradientText = forwardRef<HTMLElement, Omit<PremiumTypographyProps, 'gradient'>>((props, ref) => (
    <Text ref={ref} gradient premium {...props} />
));

export const GlowText = forwardRef<HTMLElement, Omit<PremiumTypographyProps, 'glow'>>((props, ref) => (
    <Text ref={ref} glow {...props} />
));

export const ShimmerText = forwardRef<HTMLElement, Omit<PremiumTypographyProps, 'shimmer'>>((props, ref) => (
    <Text ref={ref} shimmer {...props} />
));

// Set display names
Display.displayName = 'Display';
Headline.displayName = 'Headline';
Title.displayName = 'Title';
Body.displayName = 'Body';
Caption.displayName = 'Caption';
Overline.displayName = 'Overline';
GradientText.displayName = 'GradientText';
GlowText.displayName = 'GlowText';
ShimmerText.displayName = 'ShimmerText';

export default Text;