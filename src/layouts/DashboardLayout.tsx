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
    <Box
        sx={{
            display: 'flex',
            height: '100vh',
            width: '100%',
            maxWidth: '100vw',
            overflowX: 'hidden',
            overflowY: 'hidden',
        }}
    >
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
                flex: '1 1 0',
                height: '100vh',
                minHeight: 0,
                overflowY: 'auto',
                overflowX: 'hidden',
                backgroundColor: 'background.default',
                transition: 'margin 0.3s ease',
                padding: 3,
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                maxWidth: '100vw',
            }}
        >
            {children}
        </Box>
    </Box>
);

export default DashboardLayout;