/**
 * Elevation and Shadow System
 * ===========================
 * A sophisticated shadow system designed to create beautiful depth and hierarchy.
 * Crafted to look polished, modern, and futuristic for travel operators transitioning
 * from outdated systems to cutting-edge technology.
 */

// Shadow Colors - Sophisticated and subtle
const shadowColors = {
    // Primary shadow color - soft and neutral
    primary: 'rgba(16, 24, 40, 0.08)',      // Very subtle dark
    secondary: 'rgba(16, 24, 40, 0.04)',    // Ultra subtle

    // Colored shadows for brand elements
    brand: 'rgba(0, 102, 204, 0.12)',       // Brand blue shadow
    accent: 'rgba(99, 61, 255, 0.1)',       // Purple accent shadow

    // Interactive shadows
    interactive: 'rgba(16, 24, 40, 0.1)',   // Slightly stronger for hover
    focus: 'rgba(0, 102, 204, 0.2)',        // Focus ring shadow

    // Dark mode shadows
    dark: {
        primary: 'rgba(0, 0, 0, 0.25)',
        secondary: 'rgba(0, 0, 0, 0.15)',
        interactive: 'rgba(0, 0, 0, 0.35)',
    },
} as const;

// Elevation Levels - Material Design inspired but more sophisticated
export const elevation = {
    // Level 0 - Flat, no shadow
    0: 'none',

    // Level 1 - Barely perceptible, for subtle separation
    1: `
    0px 1px 2px ${shadowColors.secondary},
    0px 1px 3px ${shadowColors.primary}
  `,

    // Level 2 - Cards and tiles
    2: `
    0px 1px 3px ${shadowColors.secondary},
    0px 4px 6px ${shadowColors.primary}
  `,

    // Level 3 - Raised cards, buttons
    3: `
    0px 2px 4px ${shadowColors.secondary},
    0px 4px 12px ${shadowColors.primary}
  `,

    // Level 4 - Floating elements
    4: `
    0px 4px 6px ${shadowColors.secondary},
    0px 8px 16px ${shadowColors.primary}
  `,

    // Level 5 - Modals and overlays
    5: `
    0px 8px 10px ${shadowColors.secondary},
    0px 16px 24px ${shadowColors.primary}
  `,

    // Level 6 - Navigation and app bars
    6: `
    0px 8px 12px ${shadowColors.secondary},
    0px 20px 32px ${shadowColors.primary}
  `,

    // Level 7 - High-priority elements
    7: `
    0px 12px 16px ${shadowColors.secondary},
    0px 24px 40px ${shadowColors.primary}
  `,

    // Level 8 - Hero elements and major sections
    8: `
    0px 16px 20px ${shadowColors.secondary},
    0px 32px 48px ${shadowColors.primary}
  `,
} as const;

// Specialized Shadows - For specific use cases
export const shadows = {
    // Interactive shadows
    interactive: {
        // Button shadows
        button: {
            default: elevation[2],
            hover: `
        0px 3px 6px ${shadowColors.secondary},
        0px 6px 16px ${shadowColors.interactive}
      `,
            active: `
        0px 1px 2px ${shadowColors.secondary},
        0px 2px 4px ${shadowColors.primary}
      `,
            focus: `
        0px 0px 0px 3px ${shadowColors.focus},
        ${elevation[2]}
      `,
        },

        // Card shadows
        card: {
            default: elevation[2],
            hover: `
        0px 4px 8px ${shadowColors.secondary},
        0px 12px 24px ${shadowColors.interactive}
      `,
        },
    },

    // Brand shadows - For premium feel
    brand: {
        primary: `
      0px 4px 8px ${shadowColors.brand},
      0px 8px 24px rgba(0, 102, 204, 0.08)
    `,
        secondary: `
      0px 4px 8px ${shadowColors.accent},
      0px 8px 24px rgba(99, 61, 255, 0.06)
    `,
    },

    // Glow effects - For futuristic feel
    glow: {
        subtle: `
      0px 0px 20px rgba(0, 102, 204, 0.1),
      0px 0px 40px rgba(0, 102, 204, 0.05)
    `,
        medium: `
      0px 0px 30px rgba(0, 102, 204, 0.15),
      0px 0px 60px rgba(0, 102, 204, 0.08)
    `,
        strong: `
      0px 0px 40px rgba(0, 102, 204, 0.2),
      0px 0px 80px rgba(0, 102, 204, 0.1)
    `,
        accent: `
      0px 0px 30px rgba(99, 61, 255, 0.15),
      0px 0px 60px rgba(99, 61, 255, 0.08)
    `,
    },

    // Inner shadows - For inset elements
    inner: {
        subtle: `inset 0px 1px 2px ${shadowColors.secondary}`,
        medium: `inset 0px 2px 4px ${shadowColors.primary}`,
        strong: `inset 0px 4px 8px ${shadowColors.primary}`,
    },

    // Special effects
    special: {
        // Floating effect for hero elements
        floating: `
      0px 8px 16px ${shadowColors.secondary},
      0px 24px 48px ${shadowColors.primary},
      0px 0px 1px rgba(255, 255, 255, 0.05) inset
    `,

        // Glass morphism effect
        glass: `
      0px 8px 32px rgba(16, 24, 40, 0.12),
      inset 0px 1px 0px rgba(255, 255, 255, 0.05)
    `,

        // Neumorphism effect (subtle)
        neu: `
      6px 6px 12px ${shadowColors.primary},
      -6px -6px 12px rgba(255, 255, 255, 0.7)
    `,
    },

    // Dark mode shadows
    dark: {
        elevation: {
            1: `
        0px 1px 2px ${shadowColors.dark.secondary},
        0px 1px 3px ${shadowColors.dark.primary}
      `,
            2: `
        0px 1px 3px ${shadowColors.dark.secondary},
        0px 4px 6px ${shadowColors.dark.primary}
      `,
            3: `
        0px 2px 4px ${shadowColors.dark.secondary},
        0px 4px 12px ${shadowColors.dark.primary}
      `,
            4: `
        0px 4px 6px ${shadowColors.dark.secondary},
        0px 8px 16px ${shadowColors.dark.primary}
      `,
            5: `
        0px 8px 10px ${shadowColors.dark.secondary},
        0px 16px 24px ${shadowColors.dark.primary}
      `,
        },

        glow: {
            primary: `
        0px 0px 20px rgba(0, 102, 204, 0.3),
        0px 0px 40px rgba(0, 102, 204, 0.15)
      `,
            accent: `
        0px 0px 20px rgba(99, 61, 255, 0.25),
        0px 0px 40px rgba(99, 61, 255, 0.12)
      `,
        },
    },
} as const;

// Border styles - Complementing the shadow system
export const borders = {
    // Subtle borders for layering
    subtle: `1px solid rgba(234, 236, 240, 0.6)`,
    medium: `1px solid rgba(208, 213, 221, 0.8)`,
    strong: `1px solid rgba(152, 162, 179, 1)`,

    // Glass borders for modern effects
    glass: `1px solid rgba(255, 255, 255, 0.1)`,
    glassStrong: `1px solid rgba(255, 255, 255, 0.2)`,

    // Brand borders
    brand: `1px solid rgba(0, 102, 204, 0.2)`,
    accent: `1px solid rgba(99, 61, 255, 0.2)`,

    // Focus borders
    focus: `2px solid rgba(0, 102, 204, 0.4)`,

    // Dark mode borders
    dark: {
        subtle: `1px solid rgba(255, 255, 255, 0.08)`,
        medium: `1px solid rgba(255, 255, 255, 0.12)`,
        strong: `1px solid rgba(255, 255, 255, 0.16)`,
    },
} as const;

// Backdrop filters - For glass morphism effects
export const backdrops = {
    // Blur effects
    blur: {
        none: 'none',
        sm: 'blur(4px)',
        md: 'blur(8px)',
        lg: 'blur(12px)',
        xl: 'blur(16px)',
    },

    // Saturation effects
    saturate: {
        50: 'saturate(0.5)',
        100: 'saturate(1)',
        150: 'saturate(1.5)',
        200: 'saturate(2)',
    },

    // Combined effects for glass morphism
    glass: {
        subtle: 'blur(8px) saturate(1.2)',
        medium: 'blur(12px) saturate(1.4)',
        strong: 'blur(16px) saturate(1.6)',
    },
} as const;

// Component-specific elevation mapping
export const componentElevation = {
    // Interface elements
    surface: elevation[0],           // Base surface
    paper: elevation[1],             // Cards, tiles
    card: elevation[2],              // Standard cards
    button: elevation[2],            // Buttons
    buttonHover: shadows.interactive.button.hover,

    // Navigation
    appBar: elevation[4],            // Top navigation
    drawer: elevation[6],            // Side navigation

    // Overlays
    modal: elevation[8],             // Modals
    popover: elevation[5],           // Popovers, dropdowns
    tooltip: elevation[3],           // Tooltips

    // Interactive
    fab: elevation[6],               // Floating action button
    fabHover: elevation[8],          // FAB on hover

    // Special
    hero: shadows.special.floating,  // Hero sections
    glass: shadows.special.glass,    // Glass morphism
} as const;

// Export all elevation and shadow tokens
export const elevationSystem = {
    elevation,
    shadows,
    borders,
    backdrops,
    componentElevation,
    shadowColors,
} as const;

export default elevationSystem;