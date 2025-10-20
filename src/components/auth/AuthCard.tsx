import React from 'react';
import { styled } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import { Card } from '../../assets/atoms';
import type { CardProps } from '@mui/material/Card';

const StyledAuthCard = styled(Card)(({ theme }) => ({
    maxWidth: 480,
    width: '100%',
    padding: theme.spacing(6, 5),
    background: theme.palette.mode === 'dark'
        ? `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`
        : `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
    backdropFilter: 'blur(20px)',
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    borderRadius: theme.spacing(3),
    boxShadow: theme.shadows[8],
    position: 'relative',
    overflow: 'hidden',

    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        background: theme.gradients.brandPrimary,
    },

    '&::after': {
        content: '""',
        position: 'absolute',
        top: -50,
        right: -50,
        width: 100,
        height: 100,
        background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
        borderRadius: '50%',
    },

    [theme.breakpoints.down('sm')]: {
        margin: theme.spacing(2),
        padding: theme.spacing(4, 3),
    },
}));

const AuthCardHeader = styled('div')(({ theme }) => ({
    textAlign: 'center',
    marginBottom: theme.spacing(4),

    '& .auth-logo': {
        width: 60,
        height: 60,
        margin: '0 auto',
        marginBottom: theme.spacing(2),
        background: theme.gradients.brandPrimary,
        borderRadius: theme.spacing(2),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.8rem',
        color: theme.palette.common.white,
        fontWeight: 700,
    },

    '& .auth-title': {
        fontSize: '1.75rem',
        fontWeight: 700,
        color: theme.palette.text.primary,
        marginBottom: theme.spacing(1),
        background: theme.gradients.brandPrimary,
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },

    '& .auth-subtitle': {
        fontSize: '1rem',
        color: theme.palette.text.secondary,
        fontWeight: 400,
    },
}));

const AuthCardContent = styled('div')(({ theme }) => ({
    '& .auth-form': {
        marginBottom: theme.spacing(3),
    },

    '& .auth-actions': {
        marginTop: theme.spacing(4),
    },

    '& .auth-footer': {
        marginTop: theme.spacing(4),
        textAlign: 'center',
        padding: theme.spacing(3, 0, 0, 0),
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    },
}));

export interface AuthCardProps extends Omit<CardProps, 'children' | 'variant'> {
    logo?: React.ReactNode;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

export const AuthCard: React.FC<AuthCardProps> = ({
    logo,
    title,
    subtitle,
    children,
    footer,
    ...props
}) => {
    return (
        <StyledAuthCard {...props}>
            <AuthCardHeader>
                {logo && <div className="auth-logo">{logo}</div>}
                <h1 className="auth-title">{title}</h1>
                {subtitle && <p className="auth-subtitle">{subtitle}</p>}
            </AuthCardHeader>

            <AuthCardContent>
                <div className="auth-form">
                    {children}
                </div>

                {footer && (
                    <div className="auth-footer">
                        {footer}
                    </div>
                )}
            </AuthCardContent>
        </StyledAuthCard>
    );
};
