/**
 * Enterprise Color Palette
 * ========================
 * A sophisticated, forward-thinking color system designed for enterprise applications.
 * Follows modern design principles with accessibility and scalability in mind.
 */

// Brand Colors - Sophisticated and Professional
export const brand = {
    // Primary Palette - Deep Blue with modern twist
    primary: {
        50: '#E8F2FF',
        100: '#B3D9FF',
        200: '#80C1FF',
        300: '#4DA8FF',
        400: '#1A8FFF',
        500: '#0066CC', // Main brand color
        600: '#0052A3',
        700: '#003D7A',
        800: '#002952',
        900: '#001429',
    },

    // Secondary Palette - Energetic Purple
    secondary: {
        50: '#F3F0FF',
        100: '#D6CCFF',
        200: '#BAA8FF',
        300: '#9D85FF',
        400: '#8061FF',
        500: '#633DFF', // Accent color
        600: '#5028E6',
        700: '#3D1FB3',
        800: '#2A1680',
        900: '#170D4D',
    },

    // Tertiary Palette - Modern Teal
    tertiary: {
        50: '#E0FFFE',
        100: '#B3FFFC',
        200: '#80FFF9',
        300: '#4DFFF6',
        400: '#1AFFF4',
        500: '#00E6D6', // Supporting color
        600: '#00B3A6',
        700: '#008075',
        800: '#004D45',
        900: '#001A15',
    },
} as const;

// Neutral Grays - Sophisticated and Balanced
export const neutral = {
    white: '#FFFFFF',
    gray: {
        50: '#FAFBFC',
        100: '#F2F4F7',
        200: '#EAECF0',
        300: '#D0D5DD',
        400: '#98A2B3',
        500: '#667085', // Primary text
        600: '#475467',
        700: '#344054', // Secondary text
        800: '#1D2939',
        900: '#101828', // Primary dark
    },
    black: '#000000',
} as const;

// Semantic Colors - Clear Communication
export const semantic = {
    // Success - Natural Green
    success: {
        50: '#ECFDF3',
        100: '#D1FADF',
        200: '#A6F4C5',
        300: '#6CE9A6',
        400: '#32D583',
        500: '#12B76A', // Main success
        600: '#039855',
        700: '#027A48',
        800: '#05603A',
        900: '#054F31',
    },

    // Warning - Vibrant Orange
    warning: {
        50: '#FFFCF5',
        100: '#FEF7C3',
        200: '#FEEE95',
        300: '#FDE047',
        400: '#FACC15',
        500: '#EAB308', // Main warning
        600: '#CA8A04',
        700: '#A16207',
        800: '#854D0E',
        900: '#713F12',
    },

    // Error - Professional Red
    error: {
        50: '#FEF3F2',
        100: '#FEE4E2',
        200: '#FECDCA',
        300: '#FDA29B',
        400: '#F97066',
        500: '#F04438', // Main error
        600: '#D92D20',
        700: '#B42318',
        800: '#912018',
        900: '#7A271A',
    },

    // Info - Cool Blue
    info: {
        50: '#F0F9FF',
        100: '#E0F2FE',
        200: '#BAE6FD',
        300: '#7DD3FC',
        400: '#38BDF8',
        500: '#0EA5E9', // Main info
        600: '#0284C7',
        700: '#0369A1',
        800: '#075985',
        900: '#0C4A6E',
    },
} as const;

// Enterprise Gradients - Modern and Professional
export const gradients = {
    // Primary gradients
    primary: {
        light: 'linear-gradient(135deg, #E8F2FF 0%, #B3D9FF 100%)',
        medium: 'linear-gradient(135deg, #4DA8FF 0%, #0066CC 100%)',
        dark: 'linear-gradient(135deg, #0066CC 0%, #003D7A 100%)',
    },

    // Brand combination gradients
    brandPrimary: 'linear-gradient(135deg, #0066CC 0%, #633DFF 100%)',
    brandSecondary: 'linear-gradient(135deg, #633DFF 0%, #00E6D6 100%)',
    brandTertiary: 'linear-gradient(135deg, #00E6D6 0%, #0066CC 100%)',

    // Neutral gradients
    neutralLight: 'linear-gradient(135deg, #FAFBFC 0%, #F2F4F7 100%)',
    neutralDark: 'linear-gradient(135deg, #344054 0%, #101828 100%)',

    // Overlay gradients
    overlay: {
        light: 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.8) 100%)',
        dark: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%)',
    },
} as const;

// Color utilities for dynamic usage
export const colorUtilities = {
    // Alpha variants
    withAlpha: (color: string, alpha: number): string => {
        // Convert hex to rgba with alpha
        const hex = color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    },

    // Hover states
    hover: {
        darken: (color: string): string => color, // Will be implemented with actual color manipulation
        lighten: (color: string): string => color,
    },
} as const;

// Export all colors as a single object for easy access
export const colors = {
    brand,
    neutral,
    semantic,
    gradients,
    utilities: colorUtilities,
} as const;

export default colors;