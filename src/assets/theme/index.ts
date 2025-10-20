/**
 * Main Theme Configuration
 * ========================
 * Central theme configuration that manages light/dark modes and provides
 * the complete theme system for the application.
 */

import { lightTheme } from './modes/lightTheme';
import { darkTheme } from './modes/darkTheme';

// Theme mode type
export type ThemeMode = 'light' | 'dark';

// Theme configuration
export const themes = {
    light: lightTheme,
    dark: darkTheme,
} as const;

// Get theme by mode
export const getTheme = (mode: ThemeMode) => {
    return themes[mode];
};

// Default theme
export const defaultTheme = lightTheme;

// Export design tokens
export { colors } from './tokens/colors';
export { typography } from './tokens/typography';
export { layout } from './tokens/layout';
export { elevationSystem } from './tokens/elevation';

// Export themes
export { lightTheme, darkTheme };

// Export theme provider and hooks
export { ThemeProvider, type ThemeContextType, type ThemeProviderProps } from './ThemeProvider';
export { useTheme, useMUITheme } from './hooks';

export default themes;