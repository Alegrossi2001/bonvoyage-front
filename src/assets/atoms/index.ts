/**
 * Premium Atomic Component Library
 * =================================
 * World-class atomic components designed for enterprise travel operations.
 * Each component is crafted with premium materials, sophisticated animations,
 * and future-tech aesthetics that make software feel like magic.
 */

// Core Atoms
export { Button, type PremiumButtonProps, type ButtonVariant, type ButtonSize } from './Button';
export { Card, type PremiumCardProps, type CardVariant } from './Card';
export { Input, type PremiumInputProps, type InputVariant, type InputSize } from './Input';

// Re-export theme for atomic components
export { useMUITheme, useTheme } from '../theme/hooks';
export type { ThemeMode } from '../theme';

// Atomic component library metadata
export const ATOMS_VERSION = '1.0.0';
export const ATOMS_NAMESPACE = '@bonvoyage/atoms';

// Quick access to premium variants
export const PremiumVariants = {
  Button: {
    PRIMARY: 'primary' as const,
    GLASS: 'glass' as const,
    PREMIUM: 'premium' as const,
    GRADIENT: 'gradient' as const,
  },
  Card: {
    PREMIUM: 'premium' as const,
    GLASS: 'glass' as const,
    FLOATING: 'floating' as const,
    HERO: 'hero' as const,
    GLOW: 'glow' as const,
  },
  Input: {
    PREMIUM: 'premium' as const,
    GLASS: 'glass' as const,
    MINIMAL: 'minimal' as const,
  },
} as const;