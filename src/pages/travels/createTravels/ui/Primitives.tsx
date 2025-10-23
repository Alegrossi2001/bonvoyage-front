import { styled } from "@mui/system";
import { Paper, Box, Card } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Chip } from "../../../../assets/atoms/Status";
import { categoryConfig } from "../interfaces/constants";

export const QuotationContainer = styled(Paper)(({ theme }) => ({
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.default,
    borderRadius: 0,
    overflow: 'hidden',
}));

export const StepContent = styled(Box)(({ theme }) => ({
    flex: 1,
    padding: theme.spacing(3),
    overflow: 'auto',
    backgroundColor: theme.palette.background.paper,
}));

export const QuotationHeader = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2, 3),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
}));

export const ActionBar = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2, 3),
    borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
    backdropFilter: 'blur(8px)',
}));

export const RequirementCard = styled(Card)(({ theme }) => ({
    height: '100%',
    border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
    borderRadius: theme.spacing(2),
    transition: 'all 0.2s ease-in-out',

    '&:hover': {
        borderColor: theme.palette.primary.main,
        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
        transform: 'translateY(-2px)',
    },
}));

export const SectionHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
}));

export const TemplateCard = styled(Card)<{ selected?: boolean }>(({ theme, selected }) => ({
    height: '300px',
    border: selected
        ? `3px solid ${theme.palette.primary.main}`
        : `2px solid ${alpha(theme.palette.divider, 0.12)}`,
    borderRadius: theme.spacing(3),
    transition: 'all 0.3s ease-in-out',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',

    '&:hover': {
        borderColor: theme.palette.primary.main,
        boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.2)}`,
        transform: 'translateY(-4px)',
    },

    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        background: selected
            ? `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
            : 'transparent',
    },
}));

export const QuoteCard = styled(Card)(({ theme }) => ({
    border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
    borderRadius: theme.spacing(2),
    transition: 'all 0.2s ease-in-out',
    cursor: 'pointer',

    '&:hover': {
        borderColor: theme.palette.primary.main,
        boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.12)}`,
        transform: 'translateY(-1px)',
    },
}));

export const StatusChip = styled(Chip)<{ status: string }>(({ theme, status }) => {
    const getStatusColor = () => {
        switch (status) {
            case 'accepted': return theme.palette.success.main;
            case 'booked': return theme.palette.info.main;
            case 'sent': return theme.palette.warning.main;
            case 'expired': return theme.palette.error.main;
            default: return theme.palette.grey[500];
        }
    };

    return {
        backgroundColor: alpha(getStatusColor(), 0.1),
        color: getStatusColor(),
        fontWeight: 600,
        fontSize: '0.75rem',
    };
});

export const FormCard = styled(Card)(({ theme }) => ({
    border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
    borderRadius: theme.spacing(2),
    boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.04)}`,

    '&:hover': {
        boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.08)}`,
    },
}));

export const ServiceCard = styled(Card)(({ theme }) => ({
    border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
    borderRadius: theme.spacing(2),
    transition: 'all 0.2s ease-in-out',

    '&:hover': {
        boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.12)}`,
        borderColor: alpha(theme.palette.primary.main, 0.3),
    },
}));

export const CategoryChip = styled(Chip)<{ category: string }>(({ category }) => {
    const config = categoryConfig[category as keyof typeof categoryConfig];
    return {
        backgroundColor: alpha(config.color, 0.1),
        color: config.color,
        fontWeight: 600,
        '& .MuiChip-icon': {
            color: config.color,
        },
    };
});

export const MarginIndicator = styled(Box)<{ margin: number }>(({ theme, margin }) => {
    const getColor = () => {
        if (margin < 10) return theme.palette.error.main;
        if (margin < 20) return theme.palette.warning.main;
        return theme.palette.success.main;
    };

    return {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0.5, 1),
        borderRadius: theme.spacing(1),
        backgroundColor: alpha(getColor(), 0.1),
        color: getColor(),
        fontWeight: 600,
        fontSize: '0.875rem',
    };
});