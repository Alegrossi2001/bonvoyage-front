/**
 * Enterprise Typography System
 * ============================
 * A sophisticated typography system designed for enterprise applications.
 * Provides consistency, hierarchy, and excellent readability across all interfaces.
 */

// Font Families - Professional and Modern
export const fontFamilies = {
    // Primary font stack - Modern, professional, highly readable
    primary: [
        '"Inter"', // Primary choice - excellent for UI
        '"SF Pro Display"', // Apple system font
        '"Segoe UI"', // Windows system font
        '"Roboto"', // Android/Google font
        '-apple-system',
        'BlinkMacSystemFont',
        'system-ui',
        'sans-serif',
    ].join(', '),

    // Secondary font stack - For headers and emphasis
    secondary: [
        '"Plus Jakarta Sans"', // Modern geometric
        '"Inter"',
        'system-ui',
        'sans-serif',
    ].join(', '),

    // Monospace stack - For code and technical content
    monospace: [
        '"JetBrains Mono"', // Excellent for code
        '"SF Mono"',
        '"Monaco"',
        '"Cascadia Code"',
        '"Roboto Mono"',
        '"Courier New"',
        'monospace',
    ].join(', '),

    // Display font - For marketing and hero sections
    display: [
        '"Plus Jakarta Sans"',
        '"Inter"',
        'system-ui',
        'sans-serif',
    ].join(', '),
} as const;

// Font Weights - Comprehensive range for hierarchy
export const fontWeights = {
    thin: 100,
    extraLight: 200,
    light: 300,
    regular: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
    extraBold: 800,
    black: 900,
} as const;

// Font Sizes - Scalable and consistent scale
export const fontSizes = {
    // Base sizes (px)
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px (base)
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem',  // 72px
    '8xl': '6rem',    // 96px
    '9xl': '8rem',    // 128px
} as const;

// Line Heights - Optimal for readability
export const lineHeights = {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
} as const;

// Letter Spacing - Subtle but effective
export const letterSpacing = {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
} as const;

// Typography Styles - Pre-configured text styles
export const textStyles = {
    // Display styles - For hero sections and marketing
    display: {
        '2xl': {
            fontFamily: fontFamilies.display,
            fontSize: fontSizes['7xl'],
            fontWeight: fontWeights.bold,
            lineHeight: lineHeights.none,
            letterSpacing: letterSpacing.tight,
        },
        xl: {
            fontFamily: fontFamilies.display,
            fontSize: fontSizes['6xl'],
            fontWeight: fontWeights.bold,
            lineHeight: lineHeights.none,
            letterSpacing: letterSpacing.tight,
        },
        lg: {
            fontFamily: fontFamilies.display,
            fontSize: fontSizes['5xl'],
            fontWeight: fontWeights.semiBold,
            lineHeight: lineHeights.tight,
            letterSpacing: letterSpacing.tight,
        },
        md: {
            fontFamily: fontFamilies.display,
            fontSize: fontSizes['4xl'],
            fontWeight: fontWeights.semiBold,
            lineHeight: lineHeights.tight,
            letterSpacing: letterSpacing.normal,
        },
        sm: {
            fontFamily: fontFamilies.display,
            fontSize: fontSizes['3xl'],
            fontWeight: fontWeights.medium,
            lineHeight: lineHeights.snug,
            letterSpacing: letterSpacing.normal,
        },
    },

    // Heading styles - For page hierarchy
    heading: {
        '2xl': {
            fontFamily: fontFamilies.secondary,
            fontSize: fontSizes['4xl'],
            fontWeight: fontWeights.bold,
            lineHeight: lineHeights.tight,
            letterSpacing: letterSpacing.tight,
        },
        xl: {
            fontFamily: fontFamilies.secondary,
            fontSize: fontSizes['3xl'],
            fontWeight: fontWeights.bold,
            lineHeight: lineHeights.tight,
            letterSpacing: letterSpacing.tight,
        },
        lg: {
            fontFamily: fontFamilies.secondary,
            fontSize: fontSizes['2xl'],
            fontWeight: fontWeights.semiBold,
            lineHeight: lineHeights.snug,
            letterSpacing: letterSpacing.normal,
        },
        md: {
            fontFamily: fontFamilies.secondary,
            fontSize: fontSizes.xl,
            fontWeight: fontWeights.semiBold,
            lineHeight: lineHeights.snug,
            letterSpacing: letterSpacing.normal,
        },
        sm: {
            fontFamily: fontFamilies.secondary,
            fontSize: fontSizes.lg,
            fontWeight: fontWeights.medium,
            lineHeight: lineHeights.normal,
            letterSpacing: letterSpacing.normal,
        },
    },

    // Body text styles - For content
    body: {
        xl: {
            fontFamily: fontFamilies.primary,
            fontSize: fontSizes.xl,
            fontWeight: fontWeights.regular,
            lineHeight: lineHeights.relaxed,
            letterSpacing: letterSpacing.normal,
        },
        lg: {
            fontFamily: fontFamilies.primary,
            fontSize: fontSizes.lg,
            fontWeight: fontWeights.regular,
            lineHeight: lineHeights.relaxed,
            letterSpacing: letterSpacing.normal,
        },
        md: {
            fontFamily: fontFamilies.primary,
            fontSize: fontSizes.base,
            fontWeight: fontWeights.regular,
            lineHeight: lineHeights.normal,
            letterSpacing: letterSpacing.normal,
        },
        sm: {
            fontFamily: fontFamilies.primary,
            fontSize: fontSizes.sm,
            fontWeight: fontWeights.regular,
            lineHeight: lineHeights.normal,
            letterSpacing: letterSpacing.normal,
        },
        xs: {
            fontFamily: fontFamilies.primary,
            fontSize: fontSizes.xs,
            fontWeight: fontWeights.regular,
            lineHeight: lineHeights.normal,
            letterSpacing: letterSpacing.wide,
        },
    },

    // Label styles - For UI components
    label: {
        lg: {
            fontFamily: fontFamilies.primary,
            fontSize: fontSizes.base,
            fontWeight: fontWeights.medium,
            lineHeight: lineHeights.normal,
            letterSpacing: letterSpacing.normal,
        },
        md: {
            fontFamily: fontFamilies.primary,
            fontSize: fontSizes.sm,
            fontWeight: fontWeights.medium,
            lineHeight: lineHeights.normal,
            letterSpacing: letterSpacing.normal,
        },
        sm: {
            fontFamily: fontFamilies.primary,
            fontSize: fontSizes.xs,
            fontWeight: fontWeights.medium,
            lineHeight: lineHeights.normal,
            letterSpacing: letterSpacing.wide,
        },
    },

    // Button styles - For interactive elements
    button: {
        lg: {
            fontFamily: fontFamilies.primary,
            fontSize: fontSizes.lg,
            fontWeight: fontWeights.semiBold,
            lineHeight: lineHeights.none,
            letterSpacing: letterSpacing.normal,
        },
        md: {
            fontFamily: fontFamilies.primary,
            fontSize: fontSizes.base,
            fontWeight: fontWeights.semiBold,
            lineHeight: lineHeights.none,
            letterSpacing: letterSpacing.normal,
        },
        sm: {
            fontFamily: fontFamilies.primary,
            fontSize: fontSizes.sm,
            fontWeight: fontWeights.medium,
            lineHeight: lineHeights.none,
            letterSpacing: letterSpacing.normal,
        },
        xs: {
            fontFamily: fontFamilies.primary,
            fontSize: fontSizes.xs,
            fontWeight: fontWeights.medium,
            lineHeight: lineHeights.none,
            letterSpacing: letterSpacing.wide,
        },
    },

    // Code styles - For technical content
    code: {
        lg: {
            fontFamily: fontFamilies.monospace,
            fontSize: fontSizes.base,
            fontWeight: fontWeights.regular,
            lineHeight: lineHeights.relaxed,
            letterSpacing: letterSpacing.normal,
        },
        md: {
            fontFamily: fontFamilies.monospace,
            fontSize: fontSizes.sm,
            fontWeight: fontWeights.regular,
            lineHeight: lineHeights.normal,
            letterSpacing: letterSpacing.normal,
        },
        sm: {
            fontFamily: fontFamilies.monospace,
            fontSize: fontSizes.xs,
            fontWeight: fontWeights.regular,
            lineHeight: lineHeights.normal,
            letterSpacing: letterSpacing.normal,
        },
    },
} as const;

// Typography utilities
export const typographyUtilities = {
    // Text decoration
    decoration: {
        none: 'none',
        underline: 'underline',
        lineThrough: 'line-through',
    },

    // Text transform
    transform: {
        none: 'none',
        uppercase: 'uppercase',
        lowercase: 'lowercase',
        capitalize: 'capitalize',
    },

    // Text align
    align: {
        left: 'left',
        center: 'center',
        right: 'right',
        justify: 'justify',
    },

    // Text overflow
    overflow: {
        clip: 'clip',
        ellipsis: 'ellipsis',
    },

    // White space
    whiteSpace: {
        normal: 'normal',
        nowrap: 'nowrap',
        pre: 'pre',
        preWrap: 'pre-wrap',
        preLine: 'pre-line',
    },
} as const;

// Export all typography tokens
export const typography = {
    fontFamilies,
    fontWeights,
    fontSizes,
    lineHeights,
    letterSpacing,
    textStyles,
    utilities: typographyUtilities,
} as const;

export default typography;