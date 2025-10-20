/**
 * Theme Hooks
 * ===========
 * Custom hooks for accessing theme state and functionality.
 */

import { useContext } from 'react';
import { ThemeContext, type ThemeContextType } from './ThemeProvider';
import { getTheme } from './index';

// Hook to use theme context
export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

// Hook to get MUI theme
export const useMUITheme = () => {
    const { mode } = useTheme();
    return getTheme(mode);
};