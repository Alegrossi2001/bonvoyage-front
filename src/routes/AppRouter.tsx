/* eslint-disable @typescript-eslint/no-explicit-any */
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import RouteWrapper from './RouteWrapper';
import { NavigationalRoutes } from './Routes';
import type { NavigationalRoutes as NavigationalRoutesType } from './Routes';
import Signin from '../pages/auth/signin/Signin';
import RouteErrorBoundary from './ErrorBoundary';

const normalizePath = (path: string): string => {
    if (!path || typeof path !== 'string') {
        console.warn(`Invalid path detected: ${path}. Using fallback.`);
        return '/dashboard';
    }

    // Ensure path starts with /
    let normalizedPath = path.startsWith('/') ? path : `/${path}`;

    // Remove trailing slash (except for root)
    if (normalizedPath.length > 1 && normalizedPath.endsWith('/')) {
        normalizedPath = normalizedPath.slice(0, -1);
    }

    // Validate path format (basic security check)
    const validPathRegex = /^\/[a-zA-Z0-9\-_/:]*$/;
    if (!validPathRegex.test(normalizedPath)) {
        console.warn(`Invalid path format: ${path}. Using fallback.`);
        return '/dashboard';
    }

    return normalizedPath;
};

const collectRoutes = (routes: NavigationalRoutesType[], parentPath = ''): any[] => {
    const routeElements: any[] = [];
    const usedPaths = new Set<string>();

    routes.forEach((route) => {
        if (route.type === 'collapse' && route.route && route.component) {
            const normalizedPath = normalizePath(route.route);

            // Check for duplicate paths
            if (usedPaths.has(normalizedPath)) {
                console.error(`Duplicate path detected: ${normalizedPath} in route ${route.key}`);
                return; // Skip duplicate
            }
            usedPaths.add(normalizedPath);

            // Validate path structure
            if (parentPath && !normalizedPath.startsWith(parentPath)) {
                console.warn(`Path mismatch: ${normalizedPath} should start with ${parentPath}`);
            }

            // Create route with validation
            routeElements.push({
                path: normalizedPath === '/' ? '' : normalizedPath.slice(1), // Remove leading slash for React Router
                element: validateComponent(route.component, normalizedPath),
                errorElement: (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
                        <h2>Route Error</h2>
                        <p>Failed to load: {normalizedPath}</p>
                        <Navigate to="/dashboard" replace />
                    </div>
                ),
            });
        }

        if (route.type === 'hidden' && route.route && route.component) {
            const normalizedPath = normalizePath(route.route);

            console.log(`Processing hidden route: ${route.key} -> ${normalizedPath}`);

            if (!usedPaths.has(normalizedPath)) {
                usedPaths.add(normalizedPath);

                const routePath = normalizedPath.startsWith('/') ? normalizedPath.slice(1) : normalizedPath;

                routeElements.push({
                    path: routePath,
                    element: validateComponent(route.component, normalizedPath),
                });
            }
        }

        // Handle sub-routes recursively
        if (route.subRoutes && route.subRoutes.length > 0) {
            const subRoutes = collectRoutes(route.subRoutes, route.route || parentPath);
            routeElements.push(...subRoutes);
        }
    });

    return routeElements;
};

const validateComponent = (component: any, routePath: string): React.ReactNode => {
    if (!component) {
        console.warn(`No component found for route: ${routePath}`);
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h3>Page Not Ready</h3>
                <p>This page is under development.</p>
                <p>Route: {routePath}</p>
            </div>
        );
    }

    // Wrap component in error boundary
    return (
        <RouteErrorBoundary routePath={routePath}>
            {component}
        </RouteErrorBoundary>
    );
};

const allRoutes = (() => {
    try {
        const routes = collectRoutes(NavigationalRoutes);

        // Ensure we have at least a dashboard route
        const hasDashboard = routes.some(route =>
            route.path === 'dashboard' || route.path === ''
        );

        if (!hasDashboard) {
            console.warn('No dashboard route found. Adding fallback.');
            routes.unshift({
                path: 'dashboard',
                element: (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>
                        <h2>Dashboard</h2>
                        <p>Welcome to BonVoyage Dashboard</p>
                    </div>
                ),
            });
        }

        return routes;
    } catch (error) {
        console.error('Error collecting routes:', error);
        return [
            {
                path: 'dashboard',
                element: (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>
                        <h2>System Error</h2>
                        <p>Failed to load navigation. Please refresh the page.</p>
                    </div>
                ),
            }
        ];
    }
})();


const router = createBrowserRouter([
    {
        path: '/auth/signin',
        element: <Signin />,
        errorElement: (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h2>Authentication Error</h2>
                <p>Failed to load sign-in page.</p>
                <button onClick={() => window.location.reload()}>
                    Reload Page
                </button>
            </div>
        ),
    },
    {
        path: '/onboarding',
        element: <p>Onboarding Page</p>,
        errorElement: (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h2>Onboarding Error</h2>
                <p>Failed to load onboarding page.</p>
                <button onClick={() => window.location.reload()}>

                    Reload Page
                </button>
            </div>
        ),
    },
    {
        path: '/',
        element: <RouteWrapper userRole="admin" />,
        errorElement: (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h2>Application Error</h2>
                <p>Something went wrong. Please try again.</p>
                <button onClick={() => window.location.href = '/auth/signin'}>
                    Back to Sign In
                </button>
            </div>
        ),
        children: [
            {
                index: true,
                element: <Navigate to="/dashboard" replace />,
            },
            ...allRoutes,
            {
                path: '*',
                element: (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>
                        <h2>Page Not Found</h2>
                        <p>The page you're looking for doesn't exist.</p>
                        <button onClick={() => window.location.href = '/dashboard'}>
                            Go to Dashboard
                        </button>
                    </div>
                ),
            },
        ],
    },
]);

export const AppRouter = () => {
    try {
        return <RouterProvider router={router} />;
    } catch (error) {
        console.error('Router provider error:', error);
        return (
            <div style={{
                padding: '2rem',
                textAlign: 'center',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <h1>Application Failed to Start</h1>
                <p>Please refresh the page or contact support.</p>
                <button
                    onClick={() => window.location.reload()}
                    style={{
                        padding: '0.5rem 1rem',
                        marginTop: '1rem',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.25rem',
                        cursor: 'pointer'
                    }}
                >
                    Reload Application
                </button>
            </div>
        );
    }
};