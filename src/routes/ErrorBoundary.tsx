const RouteErrorBoundary: React.FC<{ children: React.ReactNode; routePath: string }> = ({
    children,
    routePath
}) => {
    try {
        return <>{children}</>;
    } catch (error) {
        console.error(`Error in route ${routePath}:`, error);
        return (
            <div style={{
                padding: '2rem',
                textAlign: 'center',
                color: '#ef4444'
            }}>
                <h2>Route Error</h2>
                <p>Failed to load component for path: {routePath}</p>
                <button onClick={() => window.location.href = '/dashboard'}>
                    Go to Dashboard
                </button>
            </div>
        );
    }
};

export default RouteErrorBoundary;