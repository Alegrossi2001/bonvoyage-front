import React, { useState, useCallback, useMemo } from 'react';
import {
    Box,
    Grid,
    Typography,
    Card,
    CardContent,
    Stack,
    Chip,
    Button,
    IconButton,
    Alert,
    Divider,
    Paper,
    TextField,
    InputAdornment,
    Slider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Tooltip,
    alpha,
    useTheme,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Badge,
} from '@mui/material';
import {
    CalculateOutlined,
    TrendingUpOutlined,
    TrendingDownOutlined,
    PersonOutlined,
    GroupOutlined,
    EditOutlined,
    SaveOutlined,
    SendOutlined,
    VisibilityOutlined,
    WarningOutlined,
    CheckCircleOutlined,
    InfoOutlined,
    AttachMoneyOutlined,
    CalendarTodayOutlined,
    SwapHorizOutlined,
    PlayArrowOutlined,
    AutoGraphOutlined,
    ThumbUpOutlined,
    ThumbDownOutlined,
    ExpandMoreOutlined,
    ExpandLessOutlined,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';

// Mock data - this would come from previous steps
const mockQuoteData = {
    quoteId: 'QT-2024-001',
    client: {
        name: 'Sacred Heart College',
        contactPerson: 'Sister Mary Catherine',
        email: 'admissions@sacredheart.edu',
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
            totalCost: 6375, // 15 rooms × 5 nights × 85
            markup: 20,
            markupAmount: 1275,
            finalPrice: 7650,
        },
        {
            id: '2',
            category: 'transport',
            description: 'Coach transport + airport transfers',
            quantity: 5,
            unit: 'days',
            unitCost: 450,
            totalCost: 2250,
            markup: 15,
            markupAmount: 337.5,
            finalPrice: 2587.5,
        },
        {
            id: '3',
            category: 'guide',
            description: 'Licensed guide for historical sites',
            quantity: 3,
            unit: 'full-days',
            unitCost: 320,
            totalCost: 960,
            markup: 25,
            markupAmount: 240,
            finalPrice: 1200,
        },
        {
            id: '4',
            category: 'meal',
            description: 'Traditional Italian lunches',
            quantity: 30,
            unit: 'persons',
            unitCost: 18,
            totalCost: 2160, // 30 people × 4 lunches × 18
            markup: 15,
            markupAmount: 324,
            finalPrice: 2484,
        },
        {
            id: '5',
            category: 'activity',
            description: 'Vatican Museums + Colosseum entry',
            quantity: 30,
            unit: 'persons',
            unitCost: 22,
            totalCost: 660,
            markup: 10,
            markupAmount: 66,
            finalPrice: 726,
        },
    ],
    status: 'draft',
    createdAt: new Date(),
    validUntil: '2024-05-15',
};

interface WhatIfScenario {
    travelers: number;
    duration: number;
    adjustedTotal: number;
    pricePerPerson: number;
    marginImpact: number;
}

const StatusChip = styled(Chip)<{ status: string }>(({ theme, status }) => {
    const getStatusConfig = () => {
        switch (status) {
            case 'draft':
                return { color: theme.palette.warning.main, bg: alpha(theme.palette.warning.main, 0.1) };
            case 'sent':
                return { color: theme.palette.info.main, bg: alpha(theme.palette.info.main, 0.1) };
            case 'approved':
                return { color: theme.palette.success.main, bg: alpha(theme.palette.success.main, 0.1) };
            case 'rejected':
                return { color: theme.palette.error.main, bg: alpha(theme.palette.error.main, 0.1) };
            default:
                return { color: theme.palette.grey[600], bg: alpha(theme.palette.grey[600], 0.1) };
        }
    };

    const config = getStatusConfig();
    return {
        backgroundColor: config.bg,
        color: config.color,
        fontWeight: 600,
        textTransform: 'uppercase',
        fontSize: '0.75rem',
    };
});

const MarginBadge = styled(Box)<{ margin: number; target?: number }>(({ theme, margin, target = 20 }) => {
    const getMarginStatus = () => {
        if (margin >= target) return { color: theme.palette.success.main, icon: '🎯', label: 'Excellent' };
        if (margin >= target * 0.75) return { color: theme.palette.warning.main, icon: '⚠️', label: 'Acceptable' };
        return { color: theme.palette.error.main, icon: '🔻', label: 'Low' };
    };

    const status = getMarginStatus();

    return {
        display: 'inline-flex',
        alignItems: 'center',
        padding: theme.spacing(0.5, 1.5),
        borderRadius: theme.spacing(3),
        backgroundColor: alpha(status.color, 0.1),
        border: `2px solid ${alpha(status.color, 0.3)}`,
        color: status.color,
        fontWeight: 700,
        fontSize: '0.875rem',
        gap: theme.spacing(0.5),

        '&::before': {
            content: `"${status.icon}"`,
            fontSize: '1rem',
        },

        '&::after': {
            content: `"${status.label}"`,
            marginLeft: theme.spacing(0.5),
            fontSize: '0.75rem',
            opacity: 0.8,
        },
    };
});

const PriceCard = styled(Card)(({ theme }) => ({
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    color: 'white',
    '& .MuiTypography-root': {
        color: 'inherit',
    },
}));

const SummaryPriceBreakdown: React.FC = () => {
    const theme = useTheme();
    const [whatIfOpen, setWhatIfOpen] = useState(false);
    const [whatIfTravelers, setWhatIfTravelers] = useState(mockQuoteData.trip.travelers);
    const [whatIfDuration, setWhatIfDuration] = useState(mockQuoteData.trip.duration);
    const [quoteStatus, setQuoteStatus] = useState(mockQuoteData.status);
    const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(false);

    // Calculate totals
    const totals = useMemo(() => {
        const subtotalCost = mockQuoteData.services.reduce((sum, service) => sum + service.totalCost, 0);
        const totalMarkup = mockQuoteData.services.reduce((sum, service) => sum + service.markupAmount, 0);
        const totalPrice = subtotalCost + totalMarkup;
        const pricePerPerson = totalPrice / mockQuoteData.trip.travelers;
        const marginPercentage = subtotalCost > 0 ? (totalMarkup / subtotalCost) * 100 : 0;

        return {
            subtotalCost,
            totalMarkup,
            totalPrice,
            pricePerPerson,
            marginPercentage,
        };
    }, []);

    // Calculate what-if scenario
    const whatIfScenario = useMemo((): WhatIfScenario => {
        const travelerRatio = whatIfTravelers / mockQuoteData.trip.travelers;
        const durationRatio = whatIfDuration / mockQuoteData.trip.duration;

        // Adjust costs based on traveler and duration changes
        let adjustedTotal = 0;

        mockQuoteData.services.forEach(service => {
            let adjustedServiceCost = service.finalPrice;

            // Apply different scaling based on service type
            switch (service.category) {
                case 'accommodation':
                    // Rooms scale with travelers (assuming 2 per room)
                    adjustedServiceCost = (service.finalPrice / mockQuoteData.trip.duration) * whatIfDuration * Math.ceil(whatIfTravelers / 2) / Math.ceil(mockQuoteData.trip.travelers / 2);
                    break;
                case 'transport':
                    // Transport scales with duration, slight scale with travelers
                    adjustedServiceCost = (service.finalPrice / mockQuoteData.trip.duration) * whatIfDuration * Math.min(travelerRatio, 1.5);
                    break;
                case 'guide':
                    // Guide scales with duration only
                    adjustedServiceCost = (service.finalPrice / mockQuoteData.trip.duration) * whatIfDuration;
                    break;
                case 'meal':
                case 'activity':
                    // Meals and activities scale with both travelers and duration
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

    const handleStatusChange = useCallback((newStatus: string) => {
        setQuoteStatus(newStatus);
        // Here you would typically save to API
        console.log('Status changed to:', newStatus);
    }, []);

    const handleSaveQuote = useCallback(() => {
        console.log('Saving quote...');
        // API call to save quote
    }, []);

    const handleSendQuote = useCallback(() => {
        console.log('Sending quote...');
        // API call to send quote
        handleStatusChange('sent');
    }, [handleStatusChange]);

    const getCategoryIcon = (category: string) => {
        const icons = {
            accommodation: '🏨',
            transport: '🚌',
            guide: '👨‍🏫',
            meal: '🍽️',
            activity: '🎭',
            other: '📋',
        };
        return icons[category as keyof typeof icons] || '📋';
    };

    const getMarginRecommendation = () => {
        if (totals.marginPercentage >= 25) {
            return {
                icon: <ThumbUpOutlined color="success" />,
                message: 'Excellent margin! This quote provides healthy profitability.',
                color: 'success.main'
            };
        } else if (totals.marginPercentage >= 15) {
            return {
                icon: <InfoOutlined color="warning" />,
                message: 'Good margin. Consider if there\'s room for optimization.',
                color: 'warning.main'
            };
        } else {
            return {
                icon: <ThumbDownOutlined color="error" />,
                message: 'Low margin detected. Review pricing or reduce costs.',
                color: 'error.main'
            };
        }
    };

    const recommendation = getMarginRecommendation();

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
                    <Box>
                        <Typography variant="h4" fontWeight={700} gutterBottom>
                            Summary & Price Breakdown
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Review your quote details and pricing before sending to client
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={2}>
                        <StatusChip
                            status={quoteStatus}
                            label={quoteStatus}
                            onDelete={quoteStatus === 'draft' ? () => { } : undefined}
                            deleteIcon={<EditOutlined />}
                        />

                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={quoteStatus}
                                label="Status"
                                onChange={(e) => handleStatusChange(e.target.value)}
                            >
                                <MenuItem value="draft">Draft</MenuItem>
                                <MenuItem value="sent">Sent</MenuItem>
                                <MenuItem value="approved">Approved</MenuItem>
                                <MenuItem value="rejected">Rejected</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                </Stack>
            </Box>

            <Grid container spacing={4}>
                {/* Quote Overview */}
                <Grid xs={12} lg={8}>
                    <Stack spacing={4}>
                        {/* Quote Header */}
                        <Card>
                            <CardContent>
                                <Grid container spacing={3}>
                                    <Grid xs={12} md={6}>
                                        <Typography variant="h6" fontWeight={600} gutterBottom>
                                            Quote Details
                                        </Typography>
                                        <Stack spacing={1}>
                                            <Typography variant="body2">
                                                <strong>Quote ID:</strong> {mockQuoteData.quoteId}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Client:</strong> {mockQuoteData.client.name}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Contact:</strong> {mockQuoteData.client.contactPerson}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Trip:</strong> {mockQuoteData.trip.title}
                                            </Typography>
                                        </Stack>
                                    </Grid>

                                    <Grid xs={12} md={6}>
                                        <Typography variant="h6" fontWeight={600} gutterBottom>
                                            Trip Information
                                        </Typography>
                                        <Stack spacing={1}>
                                            <Typography variant="body2">
                                                <CalendarTodayOutlined sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                                                {dayjs(mockQuoteData.trip.dateFrom).format('MMM DD')} - {dayjs(mockQuoteData.trip.dateTo).format('MMM DD, YYYY')}
                                            </Typography>
                                            <Typography variant="body2">
                                                <GroupOutlined sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                                                {mockQuoteData.trip.travelers} travelers • {mockQuoteData.trip.duration} days
                                            </Typography>
                                            <Typography variant="body2">
                                                📍 {mockQuoteData.trip.destinations.join(' → ')}
                                            </Typography>
                                            <Typography variant="body2">
                                                🏷️ {mockQuoteData.trip.tripType.replace('_', ' ')}
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        {/* Services Breakdown */}
                        <Card>
                            <CardContent>
                                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                                    <Typography variant="h6" fontWeight={600}>
                                        Services Breakdown
                                    </Typography>
                                    <Button
                                        size="small"
                                        onClick={() => setShowDetailedBreakdown(!showDetailedBreakdown)}
                                        endIcon={showDetailedBreakdown ? <ExpandLessOutlined /> : <ExpandMoreOutlined />}
                                    >
                                        {showDetailedBreakdown ? 'Hide' : 'Show'} Details
                                    </Button>
                                </Stack>

                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Service</TableCell>
                                                <TableCell align="center">Qty</TableCell>
                                                {showDetailedBreakdown && (
                                                    <>
                                                        <TableCell align="right">Unit Cost</TableCell>
                                                        <TableCell align="right">Net Cost</TableCell>
                                                        <TableCell align="center">Markup</TableCell>
                                                    </>
                                                )}
                                                <TableCell align="right">Total</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {mockQuoteData.services.map((service) => (
                                                <TableRow key={service.id}>
                                                    <TableCell>
                                                        <Stack direction="row" alignItems="center" spacing={1}>
                                                            <Typography component="span">
                                                                {getCategoryIcon(service.category)}
                                                            </Typography>
                                                            <Box>
                                                                <Typography variant="body2" fontWeight={600}>
                                                                    {service.description}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {service.category}
                                                                </Typography>
                                                            </Box>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {service.quantity} {service.unit}
                                                    </TableCell>
                                                    {showDetailedBreakdown && (
                                                        <>
                                                            <TableCell align="right">
                                                                €{service.unitCost}
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                €{service.totalCost.toLocaleString()}
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Chip
                                                                    label={`${service.markup}%`}
                                                                    size="small"
                                                                    variant="outlined"
                                                                    color={service.markup >= 20 ? 'success' : service.markup >= 10 ? 'warning' : 'error'}
                                                                />
                                                            </TableCell>
                                                        </>
                                                    )}
                                                    <TableCell align="right">
                                                        <Typography variant="body2" fontWeight={600}>
                                                            €{service.finalPrice.toLocaleString()}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>

                        {/* What-If Analysis */}
                        <Card>
                            <CardContent>
                                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                                    <Typography variant="h6" fontWeight={600}>
                                        What-If Analysis
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        startIcon={<AutoGraphOutlined />}
                                        onClick={() => setWhatIfOpen(true)}
                                    >
                                        Open Calculator
                                    </Button>
                                </Stack>

                                <Alert severity="info" sx={{ mb: 2 }}>
                                    Quickly see how changes in group size or duration affect pricing
                                </Alert>

                                <Grid container spacing={3}>
                                    <Grid xs={12} md={4}>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            label="Travelers"
                                            value={whatIfTravelers}
                                            onChange={(e) => setWhatIfTravelers(parseInt(e.target.value) || 0)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PersonOutlined />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>

                                    <Grid xs={12} md={4}>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            label="Duration (days)"
                                            value={whatIfDuration}
                                            onChange={(e) => setWhatIfDuration(parseInt(e.target.value) || 0)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <CalendarTodayOutlined />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>

                                    <Grid xs={12} md={4}>
                                        <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                                            <Typography variant="caption" color="text.secondary">
                                                New Price per Person
                                            </Typography>
                                            <Typography variant="h6" fontWeight={700} color="primary.main">
                                                €{whatIfScenario.pricePerPerson.toLocaleString()}
                                            </Typography>
                                            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                                                {whatIfScenario.marginImpact > 0 ? (
                                                    <TrendingUpOutlined color="success" fontSize="small" />
                                                ) : (
                                                    <TrendingDownOutlined color="error" fontSize="small" />
                                                )}
                                                <Typography variant="caption" color={whatIfScenario.marginImpact > 0 ? 'success.main' : 'error.main'}>
                                                    {whatIfScenario.marginImpact > 0 ? '+' : ''}{whatIfScenario.marginImpact.toFixed(1)}%
                                                </Typography>
                                            </Stack>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Stack>
                </Grid>

                {/* Pricing Summary */}
                <Grid xs={12} lg={4}>
                    <Stack spacing={3}>
                        {/* Main Pricing Card */}
                        <PriceCard>
                            <CardContent>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    <CalculateOutlined sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    Pricing Summary
                                </Typography>

                                <Stack spacing={2}>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="body2">
                                            Subtotal Cost
                                        </Typography>
                                        <Typography variant="body2" fontWeight={600}>
                                            €{totals.subtotalCost.toLocaleString()}
                                        </Typography>
                                    </Stack>

                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="body2">
                                            Total Markup
                                        </Typography>
                                        <Typography variant="body2" fontWeight={600}>
                                            €{totals.totalMarkup.toLocaleString()}
                                        </Typography>
                                    </Stack>

                                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />

                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="h6" fontWeight={700}>
                                            Total Price
                                        </Typography>
                                        <Typography variant="h6" fontWeight={700}>
                                            €{totals.totalPrice.toLocaleString()}
                                        </Typography>
                                    </Stack>

                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="body1">
                                            Price per Person
                                        </Typography>
                                        <Typography variant="h5" fontWeight={700}>
                                            €{totals.pricePerPerson.toLocaleString()}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </PriceCard>

                        {/* Margin Analysis */}
                        <Card>
                            <CardContent>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    Margin Analysis
                                </Typography>

                                <Box sx={{ textAlign: 'center', mb: 3 }}>
                                    <MarginBadge margin={totals.marginPercentage} />
                                    <Typography variant="h4" fontWeight={700} sx={{ mt: 1, mb: 0.5 }}>
                                        {totals.marginPercentage.toFixed(1)}%
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Overall Margin
                                    </Typography>
                                </Box>

                                <Alert
                                    severity={totals.marginPercentage >= 20 ? 'success' : totals.marginPercentage >= 15 ? 'warning' : 'error'}
                                    icon={recommendation.icon}
                                    sx={{ mb: 2 }}
                                >
                                    {recommendation.message}
                                </Alert>

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
                                            Industry Average:
                                        </Typography>
                                        <Typography variant="caption" fontWeight={600}>
                                            18%
                                        </Typography>
                                    </Stack>

                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="caption" color="text.secondary">
                                            Profit Amount:
                                        </Typography>
                                        <Typography variant="caption" fontWeight={600} color="success.main">
                                            €{totals.totalMarkup.toLocaleString()}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Card>

                        {/* Quote Validity */}
                        <Card>
                            <CardContent>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    Quote Validity
                                </Typography>

                                <Stack spacing={2}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="body2" color="text.secondary">
                                            Valid Until:
                                        </Typography>
                                        <Typography variant="body2" fontWeight={600}>
                                            {dayjs(mockQuoteData.validUntil).format('MMM DD, YYYY')}
                                        </Typography>
                                    </Stack>

                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="body2" color="text.secondary">
                                            Days Remaining:
                                        </Typography>
                                        <Chip
                                            label={`${dayjs(mockQuoteData.validUntil).diff(dayjs(), 'day')} days`}
                                            size="small"
                                            color={dayjs(mockQuoteData.validUntil).diff(dayjs(), 'day') > 15 ? 'success' : 'warning'}
                                        />
                                    </Stack>

                                    <Alert severity="warning" sx={{ mt: 2 }}>
                                        Prices subject to availability and may change after validity period
                                    </Alert>
                                </Stack>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <Card>
                            <CardContent>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    Actions
                                </Typography>

                                <Stack spacing={2}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        startIcon={<SendOutlined />}
                                        onClick={handleSendQuote}
                                        disabled={quoteStatus !== 'draft'}
                                    >
                                        Send Quote to Client
                                    </Button>

                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        startIcon={<SaveOutlined />}
                                        onClick={handleSaveQuote}
                                    >
                                        Save as Draft
                                    </Button>

                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        startIcon={<VisibilityOutlined />}
                                        onClick={() => console.log('Preview quote')}
                                    >
                                        Preview Quote
                                    </Button>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Stack>
                </Grid>
            </Grid>

            {/* What-If Dialog */}
            <Dialog open={whatIfOpen} onClose={() => setWhatIfOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    <AutoGraphOutlined sx={{ mr: 1, verticalAlign: 'middle' }} />
                    What-If Price Calculator
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={3}>
                        <Grid xs={12} md={6}>
                            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                Adjust Parameters
                            </Typography>

                            <Stack spacing={3}>
                                <Box>
                                    <Typography variant="body2" gutterBottom>
                                        Number of Travelers: {whatIfTravelers}
                                    </Typography>
                                    <Slider
                                        value={whatIfTravelers}
                                        onChange={(_, value) => setWhatIfTravelers(value as number)}
                                        min={5}
                                        max={100}
                                        step={5}
                                        marks
                                        valueLabelDisplay="auto"
                                    />
                                </Box>

                                <Box>
                                    <Typography variant="body2" gutterBottom>
                                        Trip Duration: {whatIfDuration} days
                                    </Typography>
                                    <Slider
                                        value={whatIfDuration}
                                        onChange={(_, value) => setWhatIfDuration(value as number)}
                                        min={2}
                                        max={14}
                                        step={1}
                                        marks
                                        valueLabelDisplay="auto"
                                    />
                                </Box>
                            </Stack>
                        </Grid>

                        <Grid xs={12} md={6}>
                            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                Price Impact
                            </Typography>

                            <Stack spacing={2}>
                                <Paper sx={{ p: 2 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Original Price per Person
                                    </Typography>
                                    <Typography variant="h6" fontWeight={600}>
                                        €{totals.pricePerPerson.toLocaleString()}
                                    </Typography>
                                </Paper>

                                <Paper sx={{ p: 2, backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                                    <Typography variant="caption" color="text.secondary">
                                        New Price per Person
                                    </Typography>
                                    <Typography variant="h5" fontWeight={700} color="primary.main">
                                        €{whatIfScenario.pricePerPerson.toLocaleString()}
                                    </Typography>
                                </Paper>

                                <Paper sx={{ p: 2 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Total Quote Value
                                    </Typography>
                                    <Typography variant="h6" fontWeight={600}>
                                        €{whatIfScenario.adjustedTotal.toLocaleString()}
                                    </Typography>
                                    <Typography variant="caption" color={whatIfScenario.marginImpact > 0 ? 'success.main' : 'error.main'}>
                                        {whatIfScenario.marginImpact > 0 ? '+' : ''}{whatIfScenario.marginImpact.toFixed(1)}% vs original
                                    </Typography>
                                </Paper>
                            </Stack>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setWhatIfOpen(false)}>Close</Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            // Apply what-if scenario
                            console.log('Apply scenario:', whatIfScenario);
                            setWhatIfOpen(false);
                        }}
                    >
                        Apply Changes
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SummaryPriceBreakdown;