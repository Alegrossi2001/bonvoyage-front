import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import { NavigationSidebar } from '../components/navigation/Sidebar';
import type { NavigationalRoutes } from '../routes/Routes';
import type { AuthUser } from '../interfaces/Auth/Auth';

interface DashboardLayoutProps {
    children: React.ReactNode;
    routes: NavigationalRoutes[];
    activeRoute?: string;
    onNavigate?: (route: string) => void;
    user: AuthUser;
    logout?: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
    children,
    routes,
    activeRoute,
    onNavigate,
    user,
    logout
}) => (
    <Box sx={{ display: 'flex' }}>
        <CssBaseline />

        <NavigationSidebar
            routes={routes}
            activeRoute={activeRoute}
            onNavigate={onNavigate}
            user={user}
            logout={logout}
        />

        <Box
            component="main"
            sx={{
                flexGrow: 1,
                minHeight: '100vh',
                backgroundColor: 'background.default',
                transition: 'margin 0.3s ease',
                padding: 3,
            }}
        >

            {children}
        </Box>
    </Box>
);

export default DashboardLayout;