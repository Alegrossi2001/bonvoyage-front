import React, { useState, useMemo } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Stack,
    Chip,
    Divider,
    Paper,
    TextField,
    InputAdornment,
    alpha,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    LinearProgress,
    Avatar,
    Fade,
    Slide,
    Zoom,
} from '@mui/material';
import {
    TrendingUpOutlined,
    TrendingDownOutlined,
    PersonOutlined,
    CalendarTodayOutlined,
    AttachMoneyOutlined,
    ShowChartOutlined,
    TimelineOutlined,
    CheckCircleOutlined,
    WarningAmberOutlined,
    ErrorOutlineOutlined,
    StarOutlined,
    DiamondOutlined,
    BusinessCenterOutlined,
    AutoGraphOutlined,
    InsightsOutlined,
    InfoOutline,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import type { Theme } from '@mui/system';

// Mock data - this would come from previous steps
const mockQuoteData = {
    quoteId: 'QT-2024-001',
    version: '2.1',
    client: {
        name: 'Sacred Heart College',
        contactPerson: 'Sister Mary Catherine',
        email: 'admissions@sacredheart.edu',
        tier: 'Premium',
        logo: '/api/placeholder/40/40',
    },
    trip: {
        title: 'Spring 2024 Educational Trip to Rome',
        destinations: ['Rome', 'Vatican City', 'Florence'],
        dateFrom: '2024-06-15',
        dateTo: '2024-06-20',
        duration: 5,
        travelers: 30,
        tripType: 'school_group',
    },
    services: [
        {
            id: '1',
            category: 'accommodation',
            description: 'Hotel Roma Palace - Twin rooms with breakfast',
            quantity: 15,
            unit: 'room-nights',
            unitCost: 85,
            totalCost: 6375,
            markup: 20,
            markupAmount: 1275,
            finalPrice: 7650,
            confidence: 95,
            supplier: 'Roma Palace Hotels',
        },
        {
            id: '2',
            category: 'transport',
            description: 'Premium coach transport + VIP transfers',
            quantity: 5,
            unit: 'days',
            unitCost: 450,
            totalCost: 2250,
            markup: 15,
            markupAmount: 337.5,
            finalPrice: 2587.5,
            confidence: 88,
            supplier: 'Elite Transport Services',
        },
        {
            id: '3',
            category: 'guide',
            description: 'Licensed expert guide for historical sites',
            quantity: 3,
            unit: 'full-days',
            unitCost: 320,
            totalCost: 960,
            markup: 25,
            markupAmount: 240,
            finalPrice: 1200,
            confidence: 92,
            supplier: 'Roman Heritage Guides',
        },
        {
            id: '4',
            category: 'meal',
            description: 'Authentic Italian dining experiences',
            quantity: 30,
            unit: 'persons',
            unitCost: 18,
            totalCost: 2160,
            markup: 15,
            markupAmount: 324,
            finalPrice: 2484,
            confidence: 87,
            supplier: 'Bella Vista Restaurants',
        },
        {
            id: '5',
            category: 'activity',
            description: 'Skip-the-line Vatican & Colosseum access',
            quantity: 30,
            unit: 'persons',
            unitCost: 22,
            totalCost: 660,
            markup: 10,
            markupAmount: 66,
            finalPrice: 726,
            confidence: 96,
            supplier: 'Premium Rome Tours',
        },
    ],
    status: 'draft',
    createdAt: new Date(),
    validUntil: '2024-05-15',
    competitorAnalysis: {
        averagePrice: 15800,
        ourPosition: 'competitive',
        savings: 1150,
    }
};

interface WhatIfScenario {
    travelers: number;
    duration: number;
    adjustedTotal: number;
    pricePerPerson: number;
    marginImpact: number;
}

interface SummaryPriceBreakdownProps {
    theme: Theme;
}

const SummaryPriceBreakdown: React.FC<SummaryPriceBreakdownProps> = ({ theme }) => {
    const [whatIfTravelers, setWhatIfTravelers] = useState(mockQuoteData.trip.travelers);
    const [whatIfDuration, setWhatIfDuration] = useState(mockQuoteData.trip.duration);
    const [hoveredService, setHoveredService] = useState<string | null>(null);

    // Calculate totals with enhanced metrics
    const totals = useMemo(() => {
        const subtotalCost = mockQuoteData.services.reduce((sum, service) => sum + service.totalCost, 0);
        const totalMarkup = mockQuoteData.services.reduce((sum, service) => sum + service.markupAmount, 0);
        const totalPrice = subtotalCost + totalMarkup;
        const pricePerPerson = totalPrice / mockQuoteData.trip.travelers;
        const marginPercentage = subtotalCost > 0 ? (totalMarkup / subtotalCost) * 100 : 0;
        const averageConfidence = mockQuoteData.services.reduce((sum, service) => sum + service.confidence, 0) / mockQuoteData.services.length;

        return {
            subtotalCost,
            totalMarkup,
            totalPrice,
            pricePerPerson,
            marginPercentage,
            averageConfidence,
        };
    }, []);

    // Enhanced what-if scenario calculation
    const whatIfScenario = useMemo((): WhatIfScenario => {
        const travelerRatio = whatIfTravelers / mockQuoteData.trip.travelers;
        const durationRatio = whatIfDuration / mockQuoteData.trip.duration;
        let adjustedTotal = 0;

        mockQuoteData.services.forEach(service => {
            let adjustedServiceCost = service.finalPrice;

            switch (service.category) {
                case 'accommodation':
                    adjustedServiceCost = (service.finalPrice / mockQuoteData.trip.duration) * whatIfDuration * Math.ceil(whatIfTravelers / 2) / Math.ceil(mockQuoteData.trip.travelers / 2);
                    break;
                case 'transport':
                    adjustedServiceCost = (service.finalPrice / mockQuoteData.trip.duration) * whatIfDuration * Math.min(travelerRatio, 1.5);
                    break;
                case 'guide':
                    adjustedServiceCost = (service.finalPrice / mockQuoteData.trip.duration) * whatIfDuration;
                    break;
                case 'meal':
                case 'activity':
                    adjustedServiceCost = service.finalPrice * travelerRatio * durationRatio;
                    break;
                default:
                    adjustedServiceCost = service.finalPrice * Math.max(travelerRatio, durationRatio);
            }
            adjustedTotal += adjustedServiceCost;
        });

        const pricePerPerson = adjustedTotal / whatIfTravelers;
        const marginImpact = ((adjustedTotal - totals.totalPrice) / totals.totalPrice) * 100;

        return {
            travelers: whatIfTravelers,
            duration: whatIfDuration,
            adjustedTotal,
            pricePerPerson,
            marginImpact,
        };
    }, [whatIfTravelers, whatIfDuration, totals.totalPrice]);

    const getCategoryIcon = (category: string) => {
        const iconMap = {
            accommodation: <BusinessCenterOutlined sx={{ color: '#FF6B35' }} />,
            transport: <AutoGraphOutlined sx={{ color: '#4ECDC4' }} />,
            guide: <StarOutlined sx={{ color: '#45B7D1' }} />,
            meal: <DiamondOutlined sx={{ color: '#96CEB4' }} />,
            activity: <InsightsOutlined sx={{ color: '#FFEAA7' }} />,
            other: <InfoOutline sx={{ color: '#DDA0DD' }} />,
        };
        return iconMap[category as keyof typeof iconMap] || iconMap.other;
    };

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 90) return 'success';
        if (confidence >= 80) return 'warning';
        return 'error';
    };

    const getMarginHealthStatus = () => {
        if (totals.marginPercentage >= 25) return { status: 'excellent', color: '#4CAF50', icon: <CheckCircleOutlined /> };
        if (totals.marginPercentage >= 15) return { status: 'good', color: '#FF9800', icon: <WarningAmberOutlined /> };
        return { status: 'low', color: '#F44336', icon: <ErrorOutlineOutlined /> };
    };

    const marginHealth = getMarginHealthStatus();

    return (
        <Box sx={{
            mx: 'auto',
            p: 4,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
            minHeight: '100vh'
        }}>
            {/* Main Layout Container */}
            <Box sx={{
                display: 'flex',
                gap: 4,
                flexDirection: { xs: 'column', lg: 'row' },
            }}>
                {/* Left Column - Details */}
                <Box sx={{
                    flex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                }}>
                    {/* Client & Trip Overview */}
                    <Slide direction="up" in timeout={600}>
                        <Card sx={{
                            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                        }}>
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{
                                    display: 'flex',
                                    gap: 4,
                                    flexDirection: { xs: 'column', md: 'row' },
                                }}>
                                    <Box sx={{ flex: 1 }}>
                                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                                            <Avatar src={mockQuoteData.client.logo} sx={{ width: 48, height: 48 }}>
                                                <BusinessCenterOutlined />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="h6" fontWeight={700}>
                                                    {mockQuoteData.client.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {mockQuoteData.client.contactPerson}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                        <Stack spacing={2}>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                                                    Quote ID
                                                </Typography>
                                                <Typography variant="body1" fontWeight={600}>
                                                    {mockQuoteData.quoteId}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                                                    Client Email
                                                </Typography>
                                                <Typography variant="body1" fontWeight={600}>
                                                    {mockQuoteData.client.email}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Stack spacing={2}>
                                            <Box sx={{
                                                p: 2,
                                                borderRadius: 2,
                                                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
                                            }}>
                                                <Typography variant="caption" color="primary" sx={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
                                                    Travel Period
                                                </Typography>
                                                <Typography variant="h6" fontWeight={700}>
                                                    {dayjs(mockQuoteData.trip.dateFrom).format('MMM DD')} - {dayjs(mockQuoteData.trip.dateTo).format('MMM DD, YYYY')}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {mockQuoteData.trip.duration} days • {mockQuoteData.trip.travelers} travelers
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                                                    Destinations
                                                </Typography>
                                                <Typography variant="body1" fontWeight={600}>
                                                    {mockQuoteData.trip.destinations.join(' → ')}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Slide>

                    {/* Premium Services Table */}
                    <Zoom in timeout={800}>
                        <Card sx={{
                            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                            borderRadius: 3,
                            overflow: 'hidden'
                        }}>
                            <Box sx={{
                                p: 3,
                                background: `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`,
                                borderBottom: `1px solid ${theme.palette.divider}`
                            }}>
                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <Box>
                                        <Typography variant="h5" fontWeight={700}>
                                            Service Breakdown
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Detailed cost analysis with supplier confidence ratings
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={`${totals.averageConfidence.toFixed(0)}% Avg Confidence`}
                                        color="success"
                                        variant="outlined"
                                        icon={<ShowChartOutlined />}
                                    />
                                </Stack>
                            </Box>

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.02) }}>
                                            <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1 }}>
                                                Service & Supplier
                                            </TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                                Quantity
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                                Unit Cost
                                            </TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                                Margin
                                            </TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                                Confidence
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                                Total Price
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {mockQuoteData.services.map((service, index) => (
                                            <TableRow
                                                key={service.id}
                                                onMouseEnter={() => setHoveredService(service.id)}
                                                onMouseLeave={() => setHoveredService(null)}
                                                sx={{
                                                    '&:hover': {
                                                        backgroundColor: alpha(theme.palette.primary.main, 0.03),
                                                        transform: 'scale(1.01)',
                                                        transition: 'all 0.2s ease',
                                                    },
                                                    transition: 'all 0.2s ease',
                                                    animationDelay: `${index * 100}ms`,
                                                }}
                                            >
                                                <TableCell>
                                                    <Stack direction="row" alignItems="center" spacing={2}>
                                                        <Avatar sx={{
                                                            width: 40,
                                                            height: 40,
                                                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
                                                        }}>
                                                            {getCategoryIcon(service.category)}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="body1" fontWeight={600}>
                                                                {service.description}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {service.supplier}
                                                            </Typography>
                                                        </Box>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Box>
                                                        <Typography variant="body1" fontWeight={600}>
                                                            {service.quantity}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {service.unit}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography variant="body1" fontWeight={600}>
                                                        €{service.unitCost}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Chip
                                                        label={`${service.markup}%`}
                                                        size="small"
                                                        sx={{
                                                            background: service.markup >= 20 ?
                                                                'linear-gradient(45deg, #4CAF50, #45a049)' :
                                                                service.markup >= 10 ?
                                                                    'linear-gradient(45deg, #FF9800, #f57c00)' :
                                                                    'linear-gradient(45deg, #F44336, #d32f2f)',
                                                            color: 'white',
                                                            fontWeight: 600,
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Stack alignItems="center" spacing={0.5}>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={service.confidence}
                                                            color={getConfidenceColor(service.confidence)}
                                                            sx={{ width: 60, height: 6, borderRadius: 3 }}
                                                        />
                                                        <Typography variant="caption" fontWeight={600}>
                                                            {service.confidence}%
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography variant="h6" fontWeight={700} color="primary.main">
                                                        €{service.finalPrice.toLocaleString()}
                                                    </Typography>
                                                    {hoveredService === service.id && (
                                                        <Typography variant="caption" color="text.secondary">
                                                            +€{service.markupAmount.toLocaleString()} margin
                                                        </Typography>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Card>
                    </Zoom>

                    {/* What-If Analysis */}
                    <Slide direction="left" in timeout={1000}>
                        <Card sx={{
                            background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.05)} 0%, ${alpha(theme.palette.info.main, 0.1)} 100%)`,
                            border: `2px solid ${alpha(theme.palette.info.main, 0.2)}`,
                            borderRadius: 3,
                        }}>
                            <CardContent sx={{ p: 4 }}>
                                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                                    <Avatar sx={{
                                        backgroundColor: theme.palette.info.main,
                                        width: 48,
                                        height: 48
                                    }}>
                                        <TimelineOutlined />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h5" fontWeight={700}>
                                            Smart What-If Analysis
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Instantly see pricing impact of group size or duration changes
                                        </Typography>
                                    </Box>
                                </Stack>

                                <Box sx={{
                                    display: 'flex',
                                    gap: 3,
                                    flexDirection: { xs: 'column', md: 'row' },
                                }}>
                                    <Box sx={{ flex: 1 }}>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            label="Travelers"
                                            value={whatIfTravelers}
                                            onChange={(e) => setWhatIfTravelers(parseInt(e.target.value) || 0)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PersonOutlined color="info" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: 'white',
                                                    '&:hover': {
                                                        backgroundColor: alpha(theme.palette.info.main, 0.02),
                                                    }
                                                }
                                            }}
                                        />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            label="Duration (days)"
                                            value={whatIfDuration}
                                            onChange={(e) => setWhatIfDuration(parseInt(e.target.value) || 0)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <CalendarTodayOutlined color="info" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: 'white',
                                                    '&:hover': {
                                                        backgroundColor: alpha(theme.palette.info.main, 0.02),
                                                    }
                                                }
                                            }}
                                        />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Paper sx={{
                                            p: 3,
                                            textAlign: 'center',
                                            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                                            border: `2px solid ${alpha(theme.palette.success.main, 0.2)}`,
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center'
                                        }}>
                                            <Typography variant="caption" color="success.main" sx={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>
                                                New Price per Person
                                            </Typography>
                                            <Typography variant="h4" fontWeight={800} color="success.main" sx={{ my: 1 }}>
                                                €{whatIfScenario.pricePerPerson.toLocaleString()}
                                            </Typography>
                                            <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                                                {whatIfScenario.marginImpact > 0 ? (
                                                    <TrendingUpOutlined color="success" />
                                                ) : (
                                                    <TrendingDownOutlined color="error" />
                                                )}
                                                <Typography variant="body1" fontWeight={600} color={whatIfScenario.marginImpact > 0 ? 'success.main' : 'error.main'}>
                                                    {whatIfScenario.marginImpact > 0 ? '+' : ''}{whatIfScenario.marginImpact.toFixed(1)}%
                                                </Typography>
                                            </Stack>
                                        </Paper>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Slide>
                </Box>

                {/* Right Column - Pricing & Actions */}
                <Box sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                }}>
                    {/* Main Pricing Card */}
                    <Zoom in timeout={1200}>
                        <Card sx={{
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                            color: 'white',
                            position: 'relative',
                            overflow: 'hidden',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: '-50%',
                                right: '-50%',
                                width: '200%',
                                height: '200%',
                                background: `conic-gradient(from 0deg, transparent, ${alpha('#fff', 0.1)}, transparent)`,
                                animation: 'rotate 20s linear infinite',
                            },
                            '@keyframes rotate': {
                                '0%': { transform: 'rotate(0deg)' },
                                '100%': { transform: 'rotate(360deg)' },
                            },
                        }}>
                            <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                                    <Avatar sx={{
                                        backgroundColor: alpha('#fff', 0.2),
                                        width: 56,
                                        height: 56
                                    }}>
                                        <AttachMoneyOutlined sx={{ fontSize: 32 }} />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h5" fontWeight={700}>
                                            Total Investment
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                            Premium package pricing
                                        </Typography>
                                    </Box>
                                </Stack>

                                <Stack spacing={3}>
                                    <Box>
                                        <Typography variant="h2" fontWeight={800} sx={{
                                            background: 'linear-gradient(45deg, #fff 30%, rgba(255,255,255,0.7) 90%)',
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}>
                                            €{totals.totalPrice.toLocaleString()}
                                        </Typography>
                                        <Typography variant="h6" sx={{ opacity: 0.9 }}>
                                            €{totals.pricePerPerson.toLocaleString()} per person
                                        </Typography>
                                    </Box>

                                    <Divider sx={{ borderColor: alpha('#fff', 0.3) }} />

                                    <Stack spacing={2}>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                                Base Cost
                                            </Typography>
                                            <Typography variant="body1" fontWeight={600}>
                                                €{totals.subtotalCost.toLocaleString()}
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                                Service Margin
                                            </Typography>
                                            <Typography variant="body1" fontWeight={600}>
                                                €{totals.totalMarkup.toLocaleString()}
                                            </Typography>
                                        </Stack>
                                    </Stack>

                                    {/* Competitive Analysis */}
                                    <Box sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        backgroundColor: alpha('#fff', 0.1),
                                    }}>
                                        <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                                            Market Position
                                        </Typography>
                                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                                            <Typography variant="caption">
                                                Competitor Average: €{mockQuoteData.competitorAnalysis.averagePrice.toLocaleString()}
                                            </Typography>
                                            <Chip
                                                label={`€${mockQuoteData.competitorAnalysis.savings} saved`}
                                                size="small"
                                                sx={{
                                                    backgroundColor: alpha('#4CAF50', 0.2),
                                                    color: '#4CAF50',
                                                    fontWeight: 600
                                                }}
                                            />
                                        </Stack>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Zoom>

                    {/* Margin Health Dashboard */}
                    <Fade in timeout={1400}>
                        <Card sx={{
                            border: `2px solid ${marginHealth.color}`,
                            background: `linear-gradient(135deg, ${alpha(marginHealth.color, 0.05)} 0%, ${alpha(marginHealth.color, 0.1)} 100%)`
                        }}>
                            <CardContent sx={{ p: 3 }}>
                                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                                    <Avatar sx={{
                                        backgroundColor: marginHealth.color,
                                        width: 48,
                                        height: 48
                                    }}>
                                        {marginHealth.icon}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" fontWeight={700}>
                                            Margin Health
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Profitability analysis
                                        </Typography>
                                    </Box>
                                </Stack>

                                <Box sx={{ textAlign: 'center', mb: 3 }}>
                                    <Typography variant="h3" fontWeight={800} color={marginHealth.color}>
                                        {totals.marginPercentage.toFixed(1)}%
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={Math.min(totals.marginPercentage, 100)}
                                        sx={{
                                            height: 8,
                                            borderRadius: 4,
                                            mt: 1,
                                            backgroundColor: alpha(marginHealth.color, 0.2),
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor: marginHealth.color,
                                                borderRadius: 4,
                                            }
                                        }}
                                    />
                                </Box>

                                <Stack spacing={1}>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="caption" color="text.secondary">
                                            Target Margin:
                                        </Typography>
                                        <Typography variant="caption" fontWeight={600}>
                                            20%
                                        </Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="caption" color="text.secondary">
                                            Profit Generated:
                                        </Typography>
                                        <Typography variant="caption" fontWeight={600} color="success.main">
                                            €{totals.totalMarkup.toLocaleString()}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Fade>

                    {/* Quote Validity */}
                    <Slide direction="up" in timeout={1600}>
                        <Card>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={700} gutterBottom>
                                    Quote Validity
                                </Typography>
                                <Stack spacing={2}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="body2" color="text.secondary">
                                            Valid Until:
                                        </Typography>
                                        <Typography variant="body1" fontWeight={600}>
                                            {dayjs(mockQuoteData.validUntil).format('MMM DD, YYYY')}
                                        </Typography>
                                    </Stack>
                                    <Box sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.main, 0.2)} 100%)`,
                                        textAlign: 'center'
                                    }}>
                                        <Typography variant="h4" fontWeight={700} color="warning.main">
                                            {dayjs(mockQuoteData.validUntil).diff(dayjs(), 'day')}
                                        </Typography>
                                        <Typography variant="caption" color="warning.main" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                                            Days Remaining
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Slide>
                </Box>
            </Box>
        </Box>
    );
};

export default SummaryPriceBreakdown;