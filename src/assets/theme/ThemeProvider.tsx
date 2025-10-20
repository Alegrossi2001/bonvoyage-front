/**
 * Theme Provider and Context
 * ==========================
 * React context and provider for managing theme state across the application.
 * Includes theme switching, persistence, and system preference detection.
 */

import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { getTheme, type ThemeMode } from './index';

// Theme context interface
interface ThemeContextType {
    mode: ThemeMode;
    toggleTheme: () => void;
    setTheme: (mode: ThemeMode) => void;
    isDark: boolean;
    isLight: boolean;
}

// Create theme context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider props
interface ThemeProviderProps {
    children: ReactNode;
    defaultMode?: ThemeMode;
    enableSystemPreference?: boolean;
    persistTheme?: boolean;
}

// Local storage key for theme persistence
const THEME_STORAGE_KEY = 'bonvoyage-theme-mode';

// Detect system preference
const getSystemPreference = (): ThemeMode => {
    if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
};

// Get stored theme or system preference
const getInitialTheme = (
    defaultMode: ThemeMode = 'light',
    enableSystemPreference: boolean = true,
    persistTheme: boolean = true
): ThemeMode => {
    // Check for stored preference first
    if (persistTheme && typeof window !== 'undefined') {
        const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
        if (stored && (stored === 'light' || stored === 'dark')) {
            return stored;
        }
    }

    // Fall back to system preference or default
    return enableSystemPreference ? getSystemPreference() : defaultMode;
};

// Theme provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
    children,
    defaultMode = 'light',
    enableSystemPreference = true,
    persistTheme = true,
}) => {
    // Initialize theme state
    const [mode, setMode] = useState<ThemeMode>(() =>
        getInitialTheme(defaultMode, enableSystemPreference, persistTheme)
    );

    // Theme switching functions
    const toggleTheme = () => {
        setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
    };

    const setTheme = (newMode: ThemeMode) => {
        setMode(newMode);
    };

    // Persist theme to localStorage
    useEffect(() => {
        if (persistTheme && typeof window !== 'undefined') {
            localStorage.setItem(THEME_STORAGE_KEY, mode);
        }
    }, [mode, persistTheme]);

    // Listen for system preference changes
    useEffect(() => {
        if (!enableSystemPreference || typeof window === 'undefined') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e: MediaQueryListEvent) => {
            // Only update if no stored preference exists
            if (!persistTheme || !localStorage.getItem(THEME_STORAGE_KEY)) {
                setMode(e.matches ? 'dark' : 'light');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [enableSystemPreference, persistTheme]);

    // Context value
    const contextValue: ThemeContextType = {
        mode,
        toggleTheme,
        setTheme,
        isDark: mode === 'dark',
        isLight: mode === 'light',
    };

    // Get current theme
    const currentTheme = getTheme(mode);

    return (
        <ThemeContext.Provider value={contextValue}>
            <MUIThemeProvider theme={currentTheme}>
                {/* CssBaseline provides consistent CSS reset and baseline styles */}
                <CssBaseline />
                {children}
            </MUIThemeProvider>
        </ThemeContext.Provider>
    );
};

// Export theme context for advanced usage
export { ThemeContext };
export type { ThemeContextType, ThemeProviderProps };