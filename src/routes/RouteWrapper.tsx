import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { NavigationalRoutes } from './Routes';
import type { NavigationalRoutes as NavigationalRoutesType } from './Routes';
import type { Role } from '../interfaces/Auth/Auth';
import { useAuthStore } from '../stores/AuthStore';
import AuthRoutes from './AuthRoutes';
import useBonVoyageNavigate from './navigate';


interface RouteWrapperProps {
    userRole: Role;
}

const hasAccess = (route: NavigationalRoutesType, userRole: Role): boolean => {
    if (!route.permissions) return true;
    return route.permissions.includes(userRole);
};

const filterRoutes = (routes: NavigationalRoutesType[], userRole: Role): NavigationalRoutesType[] => {
    return routes
        .filter(route => hasAccess(route, userRole))
        .map(route => ({
            ...route,
            subRoutes: route.subRoutes ? filterRoutes(route.subRoutes, userRole) : undefined
        }));
};

const RouteWrapper: React.FC<RouteWrapperProps> = ({ userRole = 'admin' }) => {
    const location = useLocation();
    const { routeNavigate } = useBonVoyageNavigate();

    const availableRoutes = filterRoutes(NavigationalRoutes, userRole);

    //Permissions and auth
    const {
        user,
        isAuthenticated,
        initialize,
        isInitialised,
        logout,
    } = useAuthStore();

    useEffect(() => {
        if (!isInitialised) {
            initialize();
        }
    }, [isInitialised, initialize]);

    useEffect(() => {
        if (isInitialised && !isAuthenticated) {
            routeNavigate(AuthRoutes.SIGN_IN);
        }
    }, [isAuthenticated, isInitialised, routeNavigate]);

    const handleLogout = async () => {
        await logout();
        routeNavigate(AuthRoutes.SIGN_IN);
    }

    if (!isAuthenticated || !user) {
        return null;
    }

    return (
        <DashboardLayout
            routes={availableRoutes}
            activeRoute={location.pathname}
            onNavigate={routeNavigate}
            user={user}
            logout={handleLogout}
        >
            <Outlet />
        </DashboardLayout>
    );
};

export default RouteWrapper;