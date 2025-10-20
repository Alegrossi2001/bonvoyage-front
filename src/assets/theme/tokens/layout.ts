/**
 * Spacing and Layout System
 * =========================
 * A comprehensive spacing and layout system for consistent design across the application.
 * Based on an 8px grid system for perfect pixel alignment and mathematical harmony.
 */

// Base unit - 8px grid system (industry standard)
export const BASE_UNIT = 8;

// Spacing Scale - Mathematical progression based on 8px
export const spacing = {
    // Micro spacing (for fine adjustments)
    px: '1px',
    0.5: `${BASE_UNIT * 0.5}px`, // 4px

    // Standard spacing scale
    1: `${BASE_UNIT * 1}px`,      // 8px
    1.5: `${BASE_UNIT * 1.5}px`,  // 12px
    2: `${BASE_UNIT * 2}px`,      // 16px
    2.5: `${BASE_UNIT * 2.5}px`,  // 20px
    3: `${BASE_UNIT * 3}px`,      // 24px
    3.5: `${BASE_UNIT * 3.5}px`,  // 28px
    4: `${BASE_UNIT * 4}px`,      // 32px
    5: `${BASE_UNIT * 5}px`,      // 40px
    6: `${BASE_UNIT * 6}px`,      // 48px
    7: `${BASE_UNIT * 7}px`,      // 56px
    8: `${BASE_UNIT * 8}px`,      // 64px
    9: `${BASE_UNIT * 9}px`,      // 72px
    10: `${BASE_UNIT * 10}px`,    // 80px
    11: `${BASE_UNIT * 11}px`,    // 88px
    12: `${BASE_UNIT * 12}px`,    // 96px
    14: `${BASE_UNIT * 14}px`,    // 112px
    16: `${BASE_UNIT * 16}px`,    // 128px
    20: `${BASE_UNIT * 20}px`,    // 160px
    24: `${BASE_UNIT * 24}px`,    // 192px
    28: `${BASE_UNIT * 28}px`,    // 224px
    32: `${BASE_UNIT * 32}px`,    // 256px
    36: `${BASE_UNIT * 36}px`,    // 288px
    40: `${BASE_UNIT * 40}px`,    // 320px
    44: `${BASE_UNIT * 44}px`,    // 352px
    48: `${BASE_UNIT * 48}px`,    // 384px
    52: `${BASE_UNIT * 52}px`,    // 416px
    56: `${BASE_UNIT * 56}px`,    // 448px
    60: `${BASE_UNIT * 60}px`,    // 480px
    64: `${BASE_UNIT * 64}px`,    // 512px
    72: `${BASE_UNIT * 72}px`,    // 576px
    80: `${BASE_UNIT * 80}px`,    // 640px
    96: `${BASE_UNIT * 96}px`,    // 768px
} as const;

// Semantic Spacing - Named spacing for common use cases
export const semanticSpacing = {
    // Component spacing
    component: {
        xs: spacing[1],      // 8px - Minimal internal spacing
        sm: spacing[2],      // 16px - Small component padding
        md: spacing[3],      // 24px - Medium component padding
        lg: spacing[4],      // 32px - Large component padding
        xl: spacing[6],      // 48px - Extra large component padding
    },

    // Layout spacing
    layout: {
        xs: spacing[4],      // 32px - Tight layout spacing
        sm: spacing[6],      // 48px - Small layout spacing
        md: spacing[8],      // 64px - Medium layout spacing
        lg: spacing[12],     // 96px - Large layout spacing
        xl: spacing[16],     // 128px - Extra large layout spacing
        '2xl': spacing[24],  // 192px - Section spacing
        '3xl': spacing[32],  // 256px - Major section spacing
    },

    // Content spacing
    content: {
        xs: spacing[1],      // 8px - Tight content spacing
        sm: spacing[2],      // 16px - Small content spacing
        md: spacing[4],      // 32px - Medium content spacing
        lg: spacing[6],      // 48px - Large content spacing
        xl: spacing[8],      // 64px - Extra large content spacing
    },

    // Interactive spacing
    interactive: {
        xs: spacing[1],      // 8px - Minimal touch target
        sm: spacing[2],      // 16px - Small interactive spacing
        md: spacing[3],      // 24px - Medium interactive spacing
        lg: spacing[4],      // 32px - Large interactive spacing
        xl: spacing[6],      // 48px - Touch-friendly spacing
    },
} as const;

// Breakpoints - Mobile-first responsive design
export const breakpoints = {
    values: {
        xs: 0,        // Extra small devices (phones)
        sm: 600,      // Small devices (tablets)
        md: 900,      // Medium devices (laptops)
        lg: 1200,     // Large devices (desktops)
        xl: 1536,     // Extra large devices (large desktops)
    },

    // Media queries for styled-components
    up: {
        xs: '@media (min-width: 0px)',
        sm: '@media (min-width: 600px)',
        md: '@media (min-width: 900px)',
        lg: '@media (min-width: 1200px)',
        xl: '@media (min-width: 1536px)',
    },

    down: {
        xs: '@media (max-width: 599.95px)',
        sm: '@media (max-width: 899.95px)',
        md: '@media (max-width: 1199.95px)',
        lg: '@media (max-width: 1535.95px)',
        xl: '@media (max-width: 1919.95px)',
    },

    between: {
        'xs-sm': '@media (min-width: 0px) and (max-width: 899.95px)',
        'sm-md': '@media (min-width: 600px) and (max-width: 1199.95px)',
        'md-lg': '@media (min-width: 900px) and (max-width: 1535.95px)',
        'lg-xl': '@media (min-width: 1200px) and (max-width: 1919.95px)',
    },
} as const;

// Container Widths - Maximum content widths for readability
export const containers = {
    xs: '444px',     // Extra small container
    sm: '600px',     // Small container
    md: '900px',     // Medium container
    lg: '1200px',    // Large container
    xl: '1536px',    // Extra large container

    // Content-specific containers
    content: {
        narrow: '640px',   // For text-heavy content
        medium: '768px',   // For balanced content
        wide: '1024px',    // For data-heavy content
        full: '100%',      // Full width
    },
} as const;

// Z-Index Scale - Layering hierarchy
export const zIndex = {
    // Background layers
    behind: -1,
    base: 0,

    // Content layers
    content: 1,
    raised: 10,
    overlay: 100,

    // UI layers
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200,
    modal: 1300,
    popover: 1400,
    tooltip: 1500,
    toast: 1600,

    // System layers
    loading: 9998,
    max: 9999,
} as const;

// Border Radius - Consistent rounding
export const borderRadius = {
    none: '0px',
    xs: '2px',       // Subtle rounding
    sm: '4px',       // Small rounding
    md: '6px',       // Medium rounding (default)
    lg: '8px',       // Large rounding
    xl: '12px',      // Extra large rounding
    '2xl': '16px',   // 2X large rounding
    '3xl': '24px',   // 3X large rounding
    full: '9999px',  // Fully rounded (pills)

    // Component-specific radius
    component: {
        button: '6px',
        card: '12px',
        input: '6px',
        modal: '16px',
        popover: '8px',
        tooltip: '4px',
    },
} as const;

// Grid System - CSS Grid utilities
export const grid = {
    // Grid template columns
    columns: {
        1: 'repeat(1, minmax(0, 1fr))',
        2: 'repeat(2, minmax(0, 1fr))',
        3: 'repeat(3, minmax(0, 1fr))',
        4: 'repeat(4, minmax(0, 1fr))',
        5: 'repeat(5, minmax(0, 1fr))',
        6: 'repeat(6, minmax(0, 1fr))',
        7: 'repeat(7, minmax(0, 1fr))',
        8: 'repeat(8, minmax(0, 1fr))',
        9: 'repeat(9, minmax(0, 1fr))',
        10: 'repeat(10, minmax(0, 1fr))',
        11: 'repeat(11, minmax(0, 1fr))',
        12: 'repeat(12, minmax(0, 1fr))',
    },

    // Grid gaps
    gap: {
        xs: spacing[1],
        sm: spacing[2],
        md: spacing[4],
        lg: spacing[6],
        xl: spacing[8],
    },
} as const;

// Flexbox utilities
export const flex = {
    // Flex direction
    direction: {
        row: 'row',
        rowReverse: 'row-reverse',
        column: 'column',
        columnReverse: 'column-reverse',
    },

    // Justify content
    justify: {
        start: 'flex-start',
        end: 'flex-end',
        center: 'center',
        between: 'space-between',
        around: 'space-around',
        evenly: 'space-evenly',
    },

    // Align items
    align: {
        start: 'flex-start',
        end: 'flex-end',
        center: 'center',
        baseline: 'baseline',
        stretch: 'stretch',
    },

    // Flex wrap
    wrap: {
        wrap: 'wrap',
        nowrap: 'nowrap',
        reverse: 'wrap-reverse',
    },
} as const;

// Export all layout tokens
export const layout = {
    spacing,
    semanticSpacing,
    breakpoints,
    containers,
    zIndex,
    borderRadius,
    grid,
    flex,
    BASE_UNIT,
} as const;

export default layout;