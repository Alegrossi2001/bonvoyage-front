import React, { useMemo } from 'react';
import {
    Box,
    Card,
    Typography,
    Stack,
    Chip,
    Avatar,
    IconButton,
    Tooltip,
    alpha,
    useTheme,
    LinearProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    CalendarTodayOutlined,
    LocationOnOutlined,
    FlightTakeoffOutlined,
    MoreVertOutlined,
    CheckCircleOutlined,
    PendingOutlined,
    WarningAmberOutlined,
    AttachMoneyOutlined,
    GroupOutlined,
} from '@mui/icons-material';
import { format, parseISO, differenceInDays, isToday, isTomorrow } from 'date-fns';
import type { ConfirmedQuotation } from '../../../travels/confirmedTravels/interfaces/ConfirmedQuotations';

// Styled Components
const CalendarCard = styled(Card)(({ theme }) => ({
    background: `linear-gradient(135deg, 
        ${alpha(theme.palette.primary.main, 0.02)} 0%, 
        ${alpha(theme.palette.secondary.main, 0.01)} 100%)`,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
    borderRadius: 16,
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
    }
}));

const HeaderSection = styled(Box)(({ theme }) => ({
    background: `linear-gradient(135deg, 
        ${theme.palette.primary.main} 0%, 
        ${theme.palette.primary.dark} 100%)`,
    padding: theme.spacing(2.5, 3),
    color: 'white',
    position: 'relative',
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: `linear-gradient(90deg, transparent 0%, ${alpha('#fff', 0.3)} 50%, transparent 100%)`,
    }
}));

const TripRow = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2, 3),
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    position: 'relative',
    '&:last-child': {
        borderBottom: 'none',
    },
    '&:hover': {
        background: alpha(theme.palette.primary.main, 0.03),
        '& .trip-actions': {
            opacity: 1,
        }
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '3px',
        background: 'transparent',
        transition: 'background 0.2s ease',
    },
    '&.urgent::before': {
        background: '#FF1744',
    },
    '&.today::before': {
        background: '#4CAF50',
    },
    '&.soon::before': {
        background: '#FF9800',
    }
}));

const DateChip = styled(Chip)(({ theme }) => ({
    minWidth: 85,
    height: 32,
    fontWeight: 600,
    fontSize: '0.875rem',
    '&.today': {
        background: `linear-gradient(45deg, #4CAF50 30%, #66BB6A 90%)`,
        color: 'white',
        boxShadow: `0 3px 12px ${alpha('#4CAF50', 0.3)}`,
    },
    '&.tomorrow': {
        background: `linear-gradient(45deg, #FF9800 30%, #FFB74D 90%)`,
        color: 'white',
        boxShadow: `0 3px 12px ${alpha('#FF9800', 0.3)}`,
    },
    '&.soon': {
        background: alpha(theme.palette.primary.main, 0.1),
        color: theme.palette.primary.main,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
    }
}));

// Mock data - Replace with actual data from your confirmed quotations
const mockUpcomingDepartures: ConfirmedQuotation[] = [
    {
        id: 'QT-2024-208',
        version: 1,
        status: 'approved',
        customer: {
            id: 'C001',
            name: 'Sacred Heart College',
            email: 'admin@sacredheart.edu',
            phone: '+1-555-0123',
            company: 'Sacred Heart Educational Institute',
            type: 'School'
        },
        createdAt: '2024-01-15T10:00:00Z',
        totalValue: 14647,
        currency: 'EUR',
        duration: 5,
        travelers: 30,
        destinations: ['Rome', 'Vatican City'],
        agent: 'Sarah Johnson',
        tags: ['School Group', 'Religious'],
        tripStartDate: '2024-10-23T08:00:00Z',
        operationalStatus: 'itinerary_locked'
    },
    {
        id: 'QT-2024-214',
        version: 2,
        status: 'approved',
        customer: {
            id: 'C002',
            name: 'Corporate Events Plus',
            email: 'events@corpevents.com',
            phone: '+1-212-555-0199',
            company: 'Corporate Events Plus Inc.',
            type: 'Corporate'
        },
        createdAt: '2024-01-18T14:30:00Z',
        totalValue: 24750,
        currency: 'EUR',
        duration: 4,
        travelers: 45,
        destinations: ['Paris', 'Versailles'],
        agent: 'Emma Thompson',
        tags: ['Corporate', 'Luxury'],
        tripStartDate: '2024-10-29T09:00:00Z',
        operationalStatus: 'ready_to_travel'
    },
    {
        id: 'QT-2024-219',
        version: 1,
        status: 'approved',
        customer: {
            id: 'C003',
            name: 'University of Excellence',
            email: 'study.abroad@univexcel.edu',
            phone: '+1-617-555-0156',
            company: 'University of Excellence',
            type: "Individual"
        },
        createdAt: '2024-01-20T11:20:00Z',
        totalValue: 18900,
        currency: 'EUR',
        duration: 7,
        travelers: 22,
        destinations: ['Tuscany', 'Florence'],
        agent: 'David Brown',
        tags: ['Educational', 'Cultural'],
        tripStartDate: '2024-11-02T07:30:00Z',
        operationalStatus: 'bookings_confirmed'
    }
];

interface UpcomingDeparturesProps {
    onViewTrip?: (tripId: string) => void;
    maxItems?: number;
}

const UpcomingDepartures: React.FC<UpcomingDeparturesProps> = ({
    onViewTrip,
    maxItems = 5
}) => {
    const theme = useTheme();

    // Sort by departure date and limit items
    const sortedDepartures = useMemo(() => {
        return mockUpcomingDepartures
            .sort((a, b) => new Date(a.tripStartDate).getTime() - new Date(b.tripStartDate).getTime())
            .slice(0, maxItems);
    }, [maxItems]);

    const getOperationalStatusConfig = (status: string) => {
        const configs = {
            bookings_pending: {
                label: 'Bookings Pending',
                color: 'warning' as const,
                icon: <PendingOutlined fontSize="small" />
            },
            bookings_confirmed: {
                label: 'Awaiting Deposit',
                color: 'info' as const,
                icon: <AttachMoneyOutlined fontSize="small" />
            },
            trip_file_created: {
                label: 'File Ready',
                color: 'info' as const,
                icon: <CheckCircleOutlined fontSize="small" />
            },
            itinerary_locked: {
                label: 'Final Docs Pending',
                color: 'warning' as const,
                icon: <WarningAmberOutlined fontSize="small" />
            },
            ready_to_travel: {
                label: 'Confirmed',
                color: 'success' as const,
                icon: <CheckCircleOutlined fontSize="small" />
            }
        };
        return configs[status as keyof typeof configs] || configs.bookings_pending;
    };

    const getDepartureUrgency = (departureDate: string) => {
        const date = parseISO(departureDate);
        if (isToday(date)) return 'today';
        if (isTomorrow(date)) return 'tomorrow';

        const daysUntil = differenceInDays(date, new Date());
        if (daysUntil <= 7) return 'soon';
        return 'normal';
    };

    const formatDepartureDate = (departureDate: string) => {
        const date = parseISO(departureDate);
        if (isToday(date)) return 'Today';
        if (isTomorrow(date)) return 'Tomorrow';

        const daysUntil = differenceInDays(date, new Date());
        if (daysUntil <= 7) {
            return format(date, 'MMM dd');
        }
        return format(date, 'MMM dd');
    };

    const getDateChipClass = (departureDate: string) => {
        const urgency = getDepartureUrgency(departureDate);
        return urgency === 'today' ? 'today' :
            urgency === 'tomorrow' ? 'tomorrow' :
                urgency === 'soon' ? 'soon' : '';
    };

    const formatCurrency = (value: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <CalendarCard>
            <HeaderSection>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{
                            bgcolor: alpha('#fff', 0.2),
                            color: 'white',
                            width: 40,
                            height: 40
                        }}>
                            <CalendarTodayOutlined />
                        </Avatar>
                        <Box>
                            <Typography variant="h6" fontWeight={700}>
                                Upcoming Departures
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Next {sortedDepartures.length} trips departing soon
                            </Typography>
                        </Box>
                    </Stack>
                    <Chip
                        label={`${sortedDepartures.length} trips`}
                        sx={{
                            bgcolor: alpha('#fff', 0.2),
                            color: 'white',
                            fontWeight: 600
                        }}
                    />
                </Stack>
            </HeaderSection>

            <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                {sortedDepartures.map((trip) => {
                    const statusConfig = getOperationalStatusConfig(trip.operationalStatus);
                    const urgency = getDepartureUrgency(trip.tripStartDate);
                    const daysUntil = differenceInDays(parseISO(trip.tripStartDate), new Date());

                    return (
                        <TripRow
                            key={trip.id}
                            className={urgency}
                            onClick={() => onViewTrip?.(trip.id)}
                        >
                            <Stack direction="row" alignItems="center" spacing={3}>
                                {/* Trip ID & Departure Date */}
                                <Box sx={{ minWidth: 140 }}>
                                    <Stack direction="row" alignItems="center" spacing={2}>
                                        <Box>
                                            <Typography variant="body1" fontWeight={700} color="primary">
                                                #{trip.id.split('-')[2]}
                                            </Typography>
                                            <DateChip
                                                label={formatDepartureDate(trip.tripStartDate)}
                                                size="small"
                                                className={getDateChipClass(trip.tripStartDate)}
                                            />
                                        </Box>
                                    </Stack>
                                </Box>

                                {/* Destination & Client */}
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                                        <LocationOnOutlined sx={{ fontSize: 16, color: 'text.secondary' }} />
                                        <Typography variant="body1" fontWeight={600} noWrap>
                                            {trip.destinations.join(' → ')}
                                        </Typography>
                                    </Stack>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <Typography variant="caption" color="text.secondary" noWrap>
                                            {trip.customer.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">•</Typography>
                                        <Stack direction="row" alignItems="center" spacing={0.5}>
                                            <GroupOutlined sx={{ fontSize: 12 }} />
                                            <Typography variant="caption" color="text.secondary">
                                                {trip.travelers}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Box>

                                {/* Status */}
                                <Box sx={{ minWidth: 140 }}>
                                    <Chip
                                        icon={statusConfig.icon}
                                        label={statusConfig.label}
                                        color={statusConfig.color}
                                        size="small"
                                        sx={{ fontWeight: 500 }}
                                    />
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                        {formatCurrency(trip.totalValue, trip.currency)}
                                    </Typography>
                                </Box>

                                {/* Actions */}
                                <Box className="trip-actions" sx={{ opacity: 0, transition: 'opacity 0.2s ease' }}>
                                    <Tooltip title="View Trip Details">
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onViewTrip?.(trip.id);
                                            }}
                                        >
                                            <MoreVertOutlined fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Stack>

                            {/* Progress Bar for urgency */}
                            {daysUntil <= 7 && (
                                <Box sx={{ mt: 1.5 }}>
                                    <LinearProgress
                                        variant="determinate"
                                        value={Math.max(0, 100 - (daysUntil * 14.3))} // 7 days = 0%, 0 days = 100%
                                        sx={{
                                            height: 3,
                                            borderRadius: 2,
                                            bgcolor: alpha(theme.palette.grey[300], 0.3),
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor: daysUntil <= 1 ? '#4CAF50' :
                                                    daysUntil <= 3 ? '#FF9800' :
                                                        theme.palette.primary.main,
                                            }
                                        }}
                                    />
                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                        {daysUntil === 0 ? 'Departing today!' :
                                            daysUntil === 1 ? 'Departing tomorrow' :
                                                `${daysUntil} days until departure`}
                                    </Typography>
                                </Box>
                            )}
                        </TripRow>
                    );
                })}
            </Box>

            {sortedDepartures.length === 0 && (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                    <FlightTakeoffOutlined sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                        No upcoming departures scheduled
                    </Typography>
                </Box>
            )}
        </CalendarCard>
    );
};

export default UpcomingDepartures;