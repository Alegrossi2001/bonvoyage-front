import { Box, Grid, Typography, useTheme } from '@mui/material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from 'recharts';
import { DashboardCard } from './Primitives';
import { mockPerformanceData } from './PerformanceDashboard';

import { alpha } from '@mui/material';
const DashboardCharts = () => {

    const theme = useTheme();
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <Box sx={{
                    background: alpha('#000', 0.9),
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    p: 2,
                    borderRadius: 2,
                    boxShadow: `0 8px 25px ${alpha('#000', 0.3)}`
                }}>
                    <Typography variant="body2" fontWeight={600}>
                        {label}
                    </Typography>
                    {payload.map((entry: any, index: number) => (
                        <Typography key={index} variant="caption" sx={{ color: entry.color }}>
                            {entry.name}: {entry.value}
                        </Typography>
                    ))}
                </Box>
            );
        }
        return null;
    };

    return (
        <Grid container spacing={2} sx={{ mb: 6 }}>
            < Grid size={6} >
                <DashboardCard sx={{ minHeight: 500 }}>
                    <Box sx={{ mb: 5 }}>
                        <Typography variant="h5" fontWeight={600} gutterBottom>
                            Weekly Quote Activity
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Quotes sent vs conversions this week
                        </Typography>
                    </Box>

                    <Box sx={{ height: 400, mt: 3 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={mockPerformanceData.weeklyQuotes}
                                margin={{ top: 40, right: 40, left: 40, bottom: 40 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <XAxis
                                    dataKey="day"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 16, fill: theme.palette.text.secondary }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 16, fill: theme.palette.text.secondary }}
                                    dx={-10}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="quotes"
                                    stroke="#2196F3"
                                    strokeWidth={5}
                                    dot={{ fill: '#2196F3', strokeWidth: 3, r: 10 }}
                                    activeDot={{ r: 12, stroke: '#2196F3', strokeWidth: 3 }}
                                    name="Quotes Sent"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="conversions"
                                    stroke="#4CAF50"
                                    strokeWidth={5}
                                    dot={{ fill: '#4CAF50', strokeWidth: 3, r: 10 }}
                                    activeDot={{ r: 12, stroke: '#4CAF50', strokeWidth: 3 }}
                                    name="Conversions"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                </DashboardCard>
            </Grid >

            {/* Revenue Trend */}
            < Grid size={6} >
                <DashboardCard sx={{ minHeight: 500 }}>
                    <Box sx={{ mb: 5 }}>
                        <Typography variant="h5" fontWeight={700} gutterBottom>
                            Revenue Trend
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Monthly performance
                        </Typography>
                    </Box>

                    <Box sx={{ height: 400, mt: 3 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={mockPerformanceData.monthlyRevenue}
                                margin={{ top: 40, right: 40, left: 40, bottom: 40 }}
                            >
                                <defs>
                                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#9C27B0" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#9C27B0" stopOpacity={0.05} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 16, fill: theme.palette.text.secondary }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 16, fill: theme.palette.text.secondary }}
                                    tickFormatter={(value) => `€${value / 1000}K`}
                                    dx={-10}
                                />
                                <Tooltip
                                    content={<CustomTooltip />}
                                    formatter={(value: any) => [`€${value.toLocaleString()}`, 'Revenue']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#9C27B0"
                                    strokeWidth={5}
                                    fill="url(#revenueGradient)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Box>
                </DashboardCard>
            </Grid >
        </Grid >
    )
}

export default DashboardCharts;
