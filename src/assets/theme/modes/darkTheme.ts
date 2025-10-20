/**
 * Dark Theme Configuration
 * ========================
 * A sophisticated dark theme that maintains the same visual hierarchy
 * and beauty as the light theme, perfect for modern travel operators
 * who work in various lighting conditions.
 */

import { createTheme, type ThemeOptions } from '@mui/material/styles';
import { colors } from '../tokens/colors';
import { typography } from '../tokens/typography';
import { layout } from '../tokens/layout';
import { elevationSystem } from '../tokens/elevation';

// Dark theme configuration
const darkThemeOptions: ThemeOptions = {
    // Color palette
    palette: {
        mode: 'dark',

        // Primary brand colors (slightly adjusted for dark mode)
        primary: {
            main: colors.brand.primary[400], // Lighter for better contrast
            light: colors.brand.primary[200],
            dark: colors.brand.primary[600],
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
            main: colors.brand.secondary[400],
            light: colors.brand.secondary[200],
            dark: colors.brand.secondary[600],
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

        // Tertiary colors
        tertiary: {
            main: colors.brand.tertiary[400],
            light: colors.brand.tertiary[200],
            dark: colors.brand.tertiary[600],
            contrastText: colors.neutral.gray[900],
        },

        // Semantic colors (adjusted for dark mode)
        error: {
            main: colors.semantic.error[400],
            light: colors.semantic.error[200],
            dark: colors.semantic.error[600],
            contrastText: colors.neutral.white,
        },

        warning: {
            main: colors.semantic.warning[400],
            light: colors.semantic.warning[200],
            dark: colors.semantic.warning[600],
            contrastText: colors.neutral.gray[900],
        },

        info: {
            main: colors.semantic.info[400],
            light: colors.semantic.info[200],
            dark: colors.semantic.info[600],
            contrastText: colors.neutral.white,
        },

        success: {
            main: colors.semantic.success[400],
            light: colors.semantic.success[200],
            dark: colors.semantic.success[600],
            contrastText: colors.neutral.white,
        },

        // Neutral colors (inverted for dark mode)
        grey: {
            50: colors.neutral.gray[900],
            100: colors.neutral.gray[800],
            200: colors.neutral.gray[700],
            300: colors.neutral.gray[600],
            400: colors.neutral.gray[500],
            500: colors.neutral.gray[400],
            600: colors.neutral.gray[300],
            700: colors.neutral.gray[200],
            800: colors.neutral.gray[100],
            900: colors.neutral.gray[50],
        },

        // Background colors (dark surfaces)
        background: {
            default: colors.neutral.gray[900],
            paper: colors.neutral.gray[800],
        },

        // Text colors (light text on dark backgrounds)
        text: {
            primary: colors.neutral.gray[50],
            secondary: colors.neutral.gray[200],
            disabled: colors.neutral.gray[500],
        },

        // Divider color
        divider: colors.neutral.gray[700],

        // Action colors
        action: {
            active: colors.neutral.gray[300],
            hover: colors.neutral.gray[800],
            selected: colors.brand.primary[900],
            disabled: colors.neutral.gray[600],
            disabledBackground: colors.neutral.gray[800],
            focus: colors.brand.primary[800],
        },
    },

    // Typography (same as light theme but with different colors)
    typography: {
        fontFamily: typography.fontFamilies.primary,

        h1: {
            ...typography.textStyles.display.lg,
            color: colors.neutral.gray[50],
            fontWeight: typography.fontWeights.bold,
        },

        h2: {
            ...typography.textStyles.display.md,
            color: colors.neutral.gray[50],
            fontWeight: typography.fontWeights.semiBold,
        },

        h3: {
            ...typography.textStyles.heading.xl,
            color: colors.neutral.gray[50],
            fontWeight: typography.fontWeights.semiBold,
        },

        h4: {
            ...typography.textStyles.heading.lg,
            color: colors.neutral.gray[50],
            fontWeight: typography.fontWeights.medium,
        },

        h5: {
            ...typography.textStyles.heading.md,
            color: colors.neutral.gray[50],
            fontWeight: typography.fontWeights.medium,
        },

        h6: {
            ...typography.textStyles.heading.sm,
            color: colors.neutral.gray[50],
            fontWeight: typography.fontWeights.medium,
        },

        subtitle1: {
            ...typography.textStyles.body.lg,
            color: colors.neutral.gray[200],
            fontWeight: typography.fontWeights.medium,
        },

        subtitle2: {
            ...typography.textStyles.body.md,
            color: colors.neutral.gray[200],
            fontWeight: typography.fontWeights.medium,
        },

        body1: {
            ...typography.textStyles.body.md,
            color: colors.neutral.gray[200],
        },

        body2: {
            ...typography.textStyles.body.sm,
            color: colors.neutral.gray[300],
        },

        caption: {
            ...typography.textStyles.body.xs,
            color: colors.neutral.gray[400],
        },

        overline: {
            ...typography.textStyles.label.sm,
            color: colors.neutral.gray[400],
            textTransform: 'uppercase',
            letterSpacing: typography.letterSpacing.wider,
        },

        button: {
            ...typography.textStyles.button.md,
            textTransform: 'none',
        },
    },

    // Spacing configuration
    spacing: layout.BASE_UNIT,

    // Breakpoints
    breakpoints: {
        values: layout.breakpoints.values,
    },

    // Shape
    shape: {
        borderRadius: parseInt(layout.borderRadius.md),
    },

    // Dark mode shadows
    shadows: [
        'none',
        elevationSystem.shadows.dark.elevation[1],
        elevationSystem.shadows.dark.elevation[2],
        elevationSystem.shadows.dark.elevation[3],
        elevationSystem.shadows.dark.elevation[4],
        elevationSystem.shadows.dark.elevation[5],
        elevationSystem.shadows.dark.elevation[5],
        elevationSystem.shadows.dark.elevation[5],
        elevationSystem.shadows.dark.elevation[5],
        elevationSystem.shadows.special.floating,
        elevationSystem.shadows.special.glass,
        elevationSystem.shadows.dark.glow.primary,
        elevationSystem.shadows.dark.glow.primary,
        elevationSystem.shadows.dark.glow.primary,
        elevationSystem.shadows.dark.glow.primary,
        elevationSystem.shadows.dark.glow.accent,
        elevationSystem.shadows.dark.elevation[5],
        elevationSystem.shadows.dark.elevation[5],
        elevationSystem.shadows.dark.elevation[5],
        elevationSystem.shadows.dark.elevation[5],
        elevationSystem.shadows.dark.elevation[5],
        elevationSystem.shadows.dark.elevation[5],
        elevationSystem.shadows.dark.elevation[5],
        elevationSystem.shadows.dark.elevation[5],
        elevationSystem.shadows.dark.elevation[5],
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

    // Custom additions for dark mode
    customShadows: {
        card: elevationSystem.shadows.dark.elevation[2],
        cardHover: elevationSystem.shadows.dark.elevation[4],
        button: elevationSystem.shadows.dark.elevation[2],
        buttonHover: elevationSystem.shadows.dark.elevation[3],
        glass: elevationSystem.shadows.special.glass,
        glow: elevationSystem.shadows.dark.glow.primary,
    },

    gradients: colors.gradients,

    elevation: elevationSystem.elevation,
};

// Create the dark theme
export const darkTheme = createTheme(darkThemeOptions);

export default darkTheme;