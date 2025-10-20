/**
 * Light Theme Configuration
 * =========================
 * The primary light theme that combines all design tokens into a cohesive,
 * beautiful theme that screams "future of travel technology"
 */

import { createTheme, type ThemeOptions } from '@mui/material/styles';
import { colors } from '../tokens/colors';
import { typography } from '../tokens/typography';
import { layout } from '../tokens/layout';
import { elevationSystem } from '../tokens/elevation';

// Custom theme interface extensions
declare module '@mui/material/styles' {
    interface Theme {
        customShadows: {
            card: string;
            cardHover: string;
            button: string;
            buttonHover: string;
            glass: string;
            glow: string;
        };
        gradients: typeof colors.gradients;
        elevation: typeof elevationSystem.elevation;
    }

    interface ThemeOptions {
        customShadows?: {
            card?: string;
            cardHover?: string;
            button?: string;
            buttonHover?: string;
            glass?: string;
            glow?: string;
        };
        gradients?: typeof colors.gradients;
        elevation?: typeof elevationSystem.elevation;
    }

    interface Palette {
        tertiary: {
            main: string;
            light: string;
            dark: string;
            contrastText: string;
        };
    }

    interface PaletteOptions {
        tertiary?: {
            main: string;
            light: string;
            dark: string;
            contrastText: string;
        };
    }
}

// Base theme configuration
const baseTheme: ThemeOptions = {
    // Color palette
    palette: {
        mode: 'light',

        // Primary brand colors
        primary: {
            main: colors.brand.primary[500],
            light: colors.brand.primary[300],
            dark: colors.brand.primary[700],
            contrastText: colors.neutral.white,
            50: colors.brand.primary[50],
            100: colors.brand.primary[100],
            200: colors.brand.primary[200],
            300: colors.brand.primary[300],
            400: colors.brand.primary[400],
            500: colors.brand.primary[500],
            600: colors.brand.primary[600],
            700: colors.brand.primary[700],
            800: colors.brand.primary[800],
            900: colors.brand.primary[900],
        },

        // Secondary colors
        secondary: {
            main: colors.brand.secondary[500],
            light: colors.brand.secondary[300],
            dark: colors.brand.secondary[700],
            contrastText: colors.neutral.white,
            50: colors.brand.secondary[50],
            100: colors.brand.secondary[100],
            200: colors.brand.secondary[200],
            300: colors.brand.secondary[300],
            400: colors.brand.secondary[400],
            500: colors.brand.secondary[500],
            600: colors.brand.secondary[600],
            700: colors.brand.secondary[700],
            800: colors.brand.secondary[800],
            900: colors.brand.secondary[900],
        },

        // Tertiary colors (custom)
        tertiary: {
            main: colors.brand.tertiary[500],
            light: colors.brand.tertiary[300],
            dark: colors.brand.tertiary[700],
            contrastText: colors.neutral.white,
        },

        // Semantic colors
        error: {
            main: colors.semantic.error[500],
            light: colors.semantic.error[300],
            dark: colors.semantic.error[700],
            contrastText: colors.neutral.white,
        },

        warning: {
            main: colors.semantic.warning[500],
            light: colors.semantic.warning[300],
            dark: colors.semantic.warning[700],
            contrastText: colors.neutral.white,
        },

        info: {
            main: colors.semantic.info[500],
            light: colors.semantic.info[300],
            dark: colors.semantic.info[700],
            contrastText: colors.neutral.white,
        },

        success: {
            main: colors.semantic.success[500],
            light: colors.semantic.success[300],
            dark: colors.semantic.success[700],
            contrastText: colors.neutral.white,
        },

        // Neutral colors
        grey: {
            50: colors.neutral.gray[50],
            100: colors.neutral.gray[100],
            200: colors.neutral.gray[200],
            300: colors.neutral.gray[300],
            400: colors.neutral.gray[400],
            500: colors.neutral.gray[500],
            600: colors.neutral.gray[600],
            700: colors.neutral.gray[700],
            800: colors.neutral.gray[800],
            900: colors.neutral.gray[900],
        },

        // Background colors
        background: {
            default: colors.neutral.gray[50],
            paper: colors.neutral.white,
        },

        // Text colors
        text: {
            primary: colors.neutral.gray[900],
            secondary: colors.neutral.gray[700],
            disabled: colors.neutral.gray[400],
        },

        // Divider color
        divider: colors.neutral.gray[200],

        // Action colors
        action: {
            active: colors.neutral.gray[600],
            hover: colors.neutral.gray[100],
            selected: colors.brand.primary[50],
            disabled: colors.neutral.gray[300],
            disabledBackground: colors.neutral.gray[100],
            focus: colors.brand.primary[100],
        },
    },

    // Typography configuration
    typography: {
        fontFamily: typography.fontFamilies.primary,

        // Font sizes and styles
        h1: {
            ...typography.textStyles.display.lg,
            color: colors.neutral.gray[900],
            fontWeight: typography.fontWeights.bold,
        },

        h2: {
            ...typography.textStyles.display.md,
            color: colors.neutral.gray[900],
            fontWeight: typography.fontWeights.semiBold,
        },

        h3: {
            ...typography.textStyles.heading.xl,
            color: colors.neutral.gray[900],
            fontWeight: typography.fontWeights.semiBold,
        },

        h4: {
            ...typography.textStyles.heading.lg,
            color: colors.neutral.gray[900],
            fontWeight: typography.fontWeights.medium,
        },

        h5: {
            ...typography.textStyles.heading.md,
            color: colors.neutral.gray[900],
            fontWeight: typography.fontWeights.medium,
        },

        h6: {
            ...typography.textStyles.heading.sm,
            color: colors.neutral.gray[900],
            fontWeight: typography.fontWeights.medium,
        },

        subtitle1: {
            ...typography.textStyles.body.lg,
            color: colors.neutral.gray[700],
            fontWeight: typography.fontWeights.medium,
        },

        subtitle2: {
            ...typography.textStyles.body.md,
            color: colors.neutral.gray[700],
            fontWeight: typography.fontWeights.medium,
        },

        body1: {
            ...typography.textStyles.body.md,
            color: colors.neutral.gray[700],
        },

        body2: {
            ...typography.textStyles.body.sm,
            color: colors.neutral.gray[600],
        },

        caption: {
            ...typography.textStyles.body.xs,
            color: colors.neutral.gray[500],
        },

        overline: {
            ...typography.textStyles.label.sm,
            color: colors.neutral.gray[500],
            textTransform: 'uppercase',
            letterSpacing: typography.letterSpacing.wider,
        },

        button: {
            ...typography.textStyles.button.md,
            textTransform: 'none', // Remove uppercase transformation
        },
    },

    // Spacing configuration
    spacing: layout.BASE_UNIT,

    // Breakpoints
    breakpoints: {
        values: layout.breakpoints.values,
    },

    // Shape (border radius)
    shape: {
        borderRadius: parseInt(layout.borderRadius.md),
    },

    // Shadows
    shadows: [
        'none',
        elevationSystem.elevation[1],
        elevationSystem.elevation[2],
        elevationSystem.elevation[3],
        elevationSystem.elevation[4],
        elevationSystem.elevation[5],
        elevationSystem.elevation[6],
        elevationSystem.elevation[7],
        elevationSystem.elevation[8],
        elevationSystem.shadows.special.floating,
        elevationSystem.shadows.special.glass,
        elevationSystem.shadows.glow.subtle,
        elevationSystem.shadows.glow.medium,
        elevationSystem.shadows.glow.strong,
        elevationSystem.shadows.brand.primary,
        elevationSystem.shadows.brand.secondary,
        elevationSystem.elevation[8],
        elevationSystem.elevation[8],
        elevationSystem.elevation[8],
        elevationSystem.elevation[8],
        elevationSystem.elevation[8],
        elevationSystem.elevation[8],
        elevationSystem.elevation[8],
        elevationSystem.elevation[8],
        elevationSystem.elevation[8],
    ],

    // Z-index configuration
    zIndex: {
        mobileStepper: layout.zIndex.content,
        speedDial: layout.zIndex.raised,
        appBar: layout.zIndex.fixed,
        drawer: layout.zIndex.modal,
        modal: layout.zIndex.modal,
        snackbar: layout.zIndex.toast,
        tooltip: layout.zIndex.tooltip,
    },

    // Custom additions
    customShadows: {
        card: elevationSystem.componentElevation.card,
        cardHover: elevationSystem.shadows.interactive.card.hover,
        button: elevationSystem.componentElevation.button,
        buttonHover: elevationSystem.componentElevation.buttonHover,
        glass: elevationSystem.shadows.special.glass,
        glow: elevationSystem.shadows.glow.subtle,
    },

    gradients: colors.gradients,
    elevation: elevationSystem.elevation,
};

// Create the light theme
export const lightTheme = createTheme(baseTheme);

export default lightTheme;