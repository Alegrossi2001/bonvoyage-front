import React from 'react';
import { Box, Container, useTheme, alpha } from '@mui/material';
import { Typography } from '@mui/material';

interface AuthLayoutProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    imageUrl?: string;
    imageAlt?: string;
    brandLogo?: React.ReactNode;
    showOverlay?: boolean;
    contentWidth?: 'sm' | 'md' | 'lg';
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
    children,
    title,
    subtitle,
    imageUrl = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    imageAlt = 'Beautiful travel destination',
    brandLogo,
    showOverlay = true,
    contentWidth = 'sm'
}) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '100vh',
                width: '100%',
                overflow: 'hidden',
                background: theme.gradients.brandPrimary,
            }}
        >
            {/* Left Content Panel */}
            <Box
                sx={{
                    flex: { xs: 1, lg: '0 0 50%' },
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    zIndex: 2,

                    // Glass morphism background
                    background: theme.palette.mode === 'dark'
                        ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`
                        : `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.98)} 100%)`,

                    backdropFilter: 'blur(20px)',
                    borderRight: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,

                    [theme.breakpoints.down('lg')]: {
                        borderRight: 'none',
                        background: theme.palette.background.paper,
                    },
                }}
            >
                {/* Brand Header */}
                <Box
                    sx={{
                        p: { xs: 3, sm: 4, md: 6 },
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    }}
                >
                    {brandLogo ? (
                        brandLogo
                    ) : (
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 2,
                                background: theme.gradients.brandPrimary,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '1.2rem',
                            }}
                        >
                            BV
                        </Box>
                    )}
                    <Typography
                        sx={{ fontWeight: 700 }}
                    >
                        BonVoyage
                    </Typography>
                </Box>

                {/* Main Content Area */}
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        p: { xs: 3, sm: 4, md: 6 },
                    }}
                >
                    <Container
                        maxWidth={contentWidth}
                        sx={{
                            px: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 4,
                        }}
                    >
                        {/* Title Section */}
                        {(title || subtitle) && (
                            <Box sx={{ textAlign: 'center', mb: 2 }}>
                                {title && (
                                    <Typography
                                        variant="h6"
                                        sx={{ mb: 1 }}
                                    >
                                        {title}
                                    </Typography>
                                )}
                                {subtitle && (
                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                        sx={{ fontSize: '1.1rem' }}
                                    >
                                        {subtitle}
                                    </Typography>
                                )}
                            </Box>
                        )}

                        {/* Form Content */}
                        <Box>{children}</Box>
                    </Container>
                </Box>

                {/* Footer */}
                <Box
                    sx={{
                        p: { xs: 3, sm: 4, md: 6 },
                        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        textAlign: 'center',
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        © 2025 BonVoyage. All rights reserved.
                    </Typography>
                </Box>
            </Box>

            {/* Right Image Panel */}
            <Box
                sx={{
                    flex: '0 0 50%',
                    position: 'relative',
                    display: { xs: 'none', lg: 'block' },
                    overflow: 'hidden',
                }}
            >
                {/* Background Image */}
                <Box
                    component="img"
                    src={imageUrl}
                    alt={imageAlt}
                    sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                            transform: 'scale(1.05)',
                        },
                    }}
                />

                {/* Overlay */}
                {showOverlay && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(theme.palette.secondary.main, 0.3)} 100%)`,
                            backdropFilter: 'blur(1px)',
                        }}
                    />
                )}

                {/* Decorative Elements */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: '20%',
                        left: '10%',
                        width: 200,
                        height: 200,
                        background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.2)} 0%, transparent 70%)`,
                        borderRadius: '50%',
                        filter: 'blur(40px)',
                        animation: 'float 6s ease-in-out infinite',
                        '@keyframes float': {
                            '0%, 100%': { transform: 'translateY(0px)' },
                            '50%': { transform: 'translateY(-20px)' },
                        },
                    }}
                />

                <Box
                    sx={{
                        position: 'absolute',
                        bottom: '30%',
                        right: '15%',
                        width: 150,
                        height: 150,
                        background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.3)} 0%, transparent 70%)`,
                        borderRadius: '50%',
                        filter: 'blur(30px)',
                        animation: 'float 8s ease-in-out infinite reverse',
                    }}
                />

                {/* Bottom Gradient */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '30%',
                        background: `linear-gradient(to top, ${alpha('#000', 0.4)} 0%, transparent 100%)`,
                        display: 'flex',
                        alignItems: 'end',
                        p: 6,
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            color: 'white',
                            fontWeight: 700,
                            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                        }}
                    >
                        Welcome to the Future of Travel
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default AuthLayout;