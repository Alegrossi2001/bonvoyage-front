import React, { useMemo } from 'react';
import {
    Box,
    Card,
    Typography,
    Stack,
    Chip,
    Avatar,
    Grid,
    LinearProgress,
    alpha,
    useTheme,
} from '@mui/material';
import { MetricCard, TrendChip } from './Primitives';
import {
    TrendingUpOutlined,
    TrendingDownOutlined,
    RequestQuoteOutlined,
    ChargingStation,
    TimerOutlined,
    AttachMoneyOutlined,
} from '@mui/icons-material';



// Mock performance data
export const mockPerformanceData = {
    metrics: [
        {
            id: 'quotes_sent',
            title: 'Quotes Sent',
            value: 12,
            unit: 'this week',
            comparison: { value: 3, period: 'vs last week', trend: 'positive' },
            icon: <RequestQuoteOutlined />,
            color: '#2196F3',
            progress: 75
        },
        {
            id: 'conversion_rate',
            title: 'Conversion Rate',
            value: 42,
            unit: '%',
            comparison: { value: 6, period: 'vs last month', trend: 'positive' },
            icon: <ChargingStation />,
            color: '#4CAF50',
            progress: 84
        },
        {
            id: 'response_time',
            title: 'Avg Response Time',
            value: 1.8,
            unit: 'hours',
            comparison: { value: 0.4, period: 'improvement', trend: 'positive' },
            icon: <TimerOutlined />,
            color: '#FF9800',
            progress: 90
        },
        {
            id: 'revenue',
            title: 'Revenue Generated',
            value: 24800,
            unit: 'this month',
            comparison: { value: 15, period: 'vs target', trend: 'positive' },
            icon: <AttachMoneyOutlined />,
            color: '#9C27B0',
            progress: 68
        },
        {
            id: 'customer_satisfaction',
            title: 'Customer Satisfaction',
            value: 4.7,
            unit: 'out of 5',
            comparison: { value: 0.2, period: 'vs last quarter', trend: 'positive' },
            icon: <Avatar src="/assets/icons/satisfaction.png" sx={{ width: 24, height: 24 }} />,
            color: '#E91E63',
            progress: 95
        },
        {
            id: 'follow_up_rate',
            title: 'Follow-up Rate',
            value: 68,
            unit: '%',
            comparison: { value: 5, period: 'vs last month', trend: 'negative' },
            icon: <Avatar src="/assets/icons/followup.png" sx={{ width: 24, height: 24 }} />,
            color: '#3F51B5',
            progress: 72
        }

    ],
    weeklyQuotes: [
        { day: 'Mon', quotes: 2, conversions: 1 },
        { day: 'Tue', quotes: 3, conversions: 1 },
        { day: 'Wed', quotes: 1, conversions: 0 },
        { day: 'Thu', quotes: 4, conversions: 2 },
        { day: 'Fri', quotes: 2, conversions: 1 },
        { day: 'Sat', quotes: 0, conversions: 0 },
        { day: 'Sun', quotes: 0, conversions: 0 }
    ],
    monthlyRevenue: [
        { month: 'Jul', revenue: 18500 },
        { month: 'Aug', revenue: 22300 },
        { month: 'Sep', revenue: 20800 },
        { month: 'Oct', revenue: 24800 }
    ],
    achievements: [
        { id: 1, title: 'Speed Demon', description: 'Responded within 1 hour', earned: true },
        { id: 2, title: 'Conversion King', description: '40%+ conversion rate', earned: true },
        { id: 3, title: 'Revenue Rocket', description: '€25K monthly target', earned: false }
    ]
};

interface PerformanceDashboardProps {
    timeRange?: 'week' | 'month' | 'quarter';
}

const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
    timeRange = 'week'
}) => {
    const getTrendIcon = (trend: string) => {
        return trend === 'positive'
            ? <TrendingUpOutlined fontSize="small" />
            : trend === 'negative'
                ? <TrendingDownOutlined fontSize="small" />
                : undefined; // <-- use undefined, not null
    };

    const getTrendClass = (trend: string) => {
        return trend === 'positive' ? 'positive' :
            trend === 'negative' ? 'negative' : 'neutral';
    };

    const formatValue = (value: number, id: string) => {
        if (id === 'revenue') {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 0,
            }).format(value);
        }
        return value.toString();
    };

    const formatComparison = (comparison: any) => {
        const prefix = comparison.trend === 'positive' ? '+' :
            comparison.trend === 'negative' ? '-' : '';
        return `${prefix}${comparison.value} ${comparison.period}`;
    };

    return (
        <Grid
            container
            spacing={4}
            alignItems="stretch" // Ensures all items/cards are same height
            sx={{
                mb: 5,
                flex: 1,
                minHeight: 0,
                height: '100%',
            }}
        >
            {mockPerformanceData.metrics.map((metric) => (
                <Grid
                    size={2}
                    key={metric.id}
                    sx={{ height: '100%', display: 'flex' }}
                >
                    <MetricCard
                        className={getTrendClass(metric.comparison.trend)}
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        {/* Header Section */}
                        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 3 }}>
                            <Avatar sx={{
                                bgcolor: alpha(metric.color, 0.1),
                                color: metric.color,
                                width: 56,
                                height: 56
                            }}>
                                {metric.icon}
                            </Avatar>

                            <TrendChip
                                icon={getTrendIcon(metric.comparison.trend)}
                                label={formatComparison(metric.comparison)}
                                size="medium"
                                className={getTrendClass(metric.comparison.trend)}
                            />
                        </Stack>

                        {/* Main Value */}
                        <Box sx={{ mb: 2, flexGrow: 1 }}>
                            <Typography
                                variant="h2"
                                fontWeight={800}
                                color={metric.color}
                                sx={{
                                    fontSize: { xs: '2.5rem', sm: '3rem' },
                                    lineHeight: 1.1,
                                    mb: 1
                                }}
                            >
                                {formatValue(metric.value, metric.id)}
                            </Typography>

                            <Typography variant="h6" color="text.primary" fontWeight={600} gutterBottom>
                                {metric.title}
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                                {metric.unit}
                            </Typography>
                        </Box>

                        {/* Progress Bar */}
                        <Box sx={{ mt: 'auto' }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                    Progress to Goal
                                </Typography>
                                <Typography variant="body2" fontWeight={700} color={metric.color}>
                                    {metric.progress}%
                                </Typography>
                            </Stack>
                            <LinearProgress
                                variant="determinate"
                                value={metric.progress}
                                sx={{
                                    height: 8,
                                    borderRadius: 4,
                                    bgcolor: alpha(metric.color, 0.1),
                                    '& .MuiLinearProgress-bar': {
                                        background: `linear-gradient(45deg, ${metric.color} 30%, ${alpha(metric.color, 0.8)} 90%)`,
                                        borderRadius: 4,
                                    }
                                }}
                            />
                        </Box>
                    </MetricCard>
                </Grid>
            ))}
        </Grid>
    );
};

export default PerformanceDashboard;