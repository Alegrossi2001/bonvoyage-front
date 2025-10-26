import { useCallback } from "react";
import { useLocation, useNavigate, type NavigateOptions } from "react-router"
import type { Permission, Role } from "../interfaces/Auth/Auth";
import { useAuthStore } from "../stores/AuthStore";
import AuthRoutes from "./AuthRoutes";

interface NavigationOptions extends NavigateOptions {
    // Custom options for smart navigation
    requireAuth?: boolean;
    requirePermissions?: Permission[];
    requireRoles?: Role[];
    fallbackRoute?: string;
    preserveQuery?: boolean;
    skipAuthCheck?: boolean;
}

const TEST_ONBOARDING_MODE = false;

const useBonVoyageNavigate = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { isAuthenticated, hasPermission, hasRole, isOnboarded } = useAuthStore();
    const routeNavigate = useCallback((to: string, options: NavigationOptions = {}) => {
        const {
            requireAuth = false,
            requirePermissions = [],
            requireRoles = [],
            fallbackRoute = '/dashboard',
            preserveQuery = false,
            skipAuthCheck = false,
            ...navigateOptions
        } = options;

        if (!skipAuthCheck && requireAuth && !isAuthenticated) {
            navigate(AuthRoutes.SIGN_IN, { replace: true });
            return false;
        }

        if (requirePermissions.length > 0 && !requirePermissions.every(p => hasPermission(p))) {
            navigate(fallbackRoute, { replace: true });
            return false;
        }

        if (requireRoles.length > 0 && !requireRoles.some(r => hasRole(r))) {
            navigate(fallbackRoute, { replace: true });
            return false;
        }
        /*
                if (!isOnboarded() || (TEST_ONBOARDING_MODE && to !== '/onboarding')) {
                    navigate('/onboarding', { replace: true });
                    return false;
                }
        */
        const finalPath = preserveQuery && location.search ? `${to}${location.search}` : to;
        navigate(finalPath, navigateOptions);
        return true;
    }, [navigate, location, isAuthenticated, hasPermission, hasRole]);

    const isOperator = hasRole('operator');

    const quickNav = {
        dashboard: () => routeNavigate(`dashboard-${isOperator ? 'operator' : 'user'}`),
        login: () => navigate('/auth/signin'),
        confirmedTravels: () => routeNavigate('/bookings/confirmed'),
        back: () => navigate(-1),
        forward: () => navigate(1),
    };

    return {
        routeNavigate,
        quickNav,
    }
}

export default useBonVoyageNavigate;