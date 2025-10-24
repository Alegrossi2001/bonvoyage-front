import { Card, Chip, alpha, styled } from '@mui/material';

export const DashboardCard = styled(Card)(({ theme }) => ({
    background: `linear-gradient(135deg, 
        ${alpha(theme.palette.background.paper, 0.9)} 0%, 
        ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    borderRadius: 20,
    padding: theme.spacing(4), // Increased padding
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    minHeight: 200, // Ensure minimum height
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: `linear-gradient(90deg, 
            ${theme.palette.primary.main} 0%, 
            ${theme.palette.secondary.main} 100%)`,
    }
}));

export const MetricCard = styled(Card)(({ theme }) => ({
    background: `linear-gradient(135deg, 
        ${alpha('#fff', 0.95)} 0%, 
        ${alpha('#fff', 0.85)} 100%)`,
    backdropFilter: 'blur(20px)',
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    borderRadius: 20, // Increased border radius
    padding: theme.spacing(3, 3, 4, 3), // More generous padding
    height: 'auto', // Let it grow naturally
    minHeight: 240, // Ensure readable height
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: `0 16px 40px ${alpha(theme.palette.primary.main, 0.2)}`,
    },
    '&.positive': {
        '&::before': {
            background: `linear-gradient(45deg, #4CAF50 30%, #66BB6A 90%)`,
        }
    },
    '&.negative': {
        '&::before': {
            background: `linear-gradient(45deg, #FF5722 30%, #FF7043 90%)`,
        }
    },
    '&.neutral': {
        '&::before': {
            background: `linear-gradient(45deg, #2196F3 30%, #42A5F5 90%)`,
        }
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px', // Thicker accent line
        background: `linear-gradient(45deg, #9E9E9E 30%, #BDBDBD 90%)`,
    }
}));

export const TrendChip = styled(Chip)(({ theme }) => ({
    fontWeight: 700,
    fontSize: '0.8rem', // Slightly larger text
    height: 28, // Taller chip
    minWidth: 80, // Ensure minimum width
    '&.positive': {
        background: `linear-gradient(45deg, #4CAF50 30%, #66BB6A 90%)`,
        color: 'white',
        boxShadow: `0 2px 8px ${alpha('#4CAF50', 0.3)}`,
    },
    '&.negative': {
        background: `linear-gradient(45deg, #FF5722 30%, #FF7043 90%)`,
        color: 'white',
        boxShadow: `0 2px 8px ${alpha('#FF5722', 0.3)}`,
    },
    '&.neutral': {
        background: alpha(theme.palette.grey[400], 0.2),
        color: theme.palette.grey[700],
    }
}));