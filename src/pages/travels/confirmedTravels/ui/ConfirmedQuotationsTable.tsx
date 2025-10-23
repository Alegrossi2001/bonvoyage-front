import React, { useState, useMemo } from 'react';
import {
    Box,
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Chip,
    IconButton,
    Avatar,
    Tooltip,
    Stack,
    TextField,
    InputAdornment,
    Menu,
    MenuItem,
    LinearProgress,
    alpha,
    useTheme,
} from '@mui/material';
import {
    SearchOutlined,
    MoreVertOutlined,
    BookmarkBorderOutlined,
    GroupOutlined,
    FlightTakeoffOutlined,
    FolderOpenOutlined,
    TaskOutlined,
    EditCalendarOutlined,
    HistoryOutlined,
    CheckCircleOutlined,
    PendingOutlined,
    LocationOnOutlined,
} from '@mui/icons-material';
import { format, parseISO, differenceInDays } from 'date-fns';
import type { ConfirmedQuotation } from '../interfaces/ConfirmedQuotations';

// Mock confirmed quotations data
const mockConfirmedQuotations: ConfirmedQuotation[] = [
    {
        id: 'QT-2024-001',
        version: 2,
        status: 'approved',
        customer: {
            id: 'C001',
            name: 'Sacred Heart College',
            email: 'admin@sacredheart.edu',
            phone: '+1-555-0123',
            company: 'Sacred Heart Educational Institute',
            type: "School"
        },
        createdAt: '2024-01-15T10:00:00Z',
        totalValue: 14647,
        currency: 'EUR',
        duration: 5,
        travelers: 30,
        destinations: ['Rome', 'Vatican City', 'Florence'],
        agent: 'Sarah Johnson',
        tags: ['School Group', 'Religious', 'Educational'],
        tripStartDate: '2024-03-15T08:00:00Z',
        operationalStatus: 'bookings_pending'
    },
    {
        id: 'QT-2024-003',
        version: 3,
        status: 'approved',
        customer: {
            id: 'C003',
            name: 'Corporate Events Plus',
            email: 'events@corpevents.com',
            phone: '+1-212-555-0199',
            company: 'Corporate Events Plus Inc.',
            type: 'Corporate'
        },
        createdAt: '2024-01-12T09:15:00Z',
        totalValue: 24750,
        currency: 'EUR',
        duration: 4,
        travelers: 45,
        destinations: ['Amsterdam', 'Brussels'],
        agent: 'Emma Thompson',
        tags: ['Corporate', 'Team Building', 'Luxury'],
        tripStartDate: '2024-02-28T09:00:00Z',
        operationalStatus: 'ready_to_travel'
    },
    {
        id: 'QT-2024-005',
        version: 2,
        status: 'approved',
        customer: {
            id: 'C005',
            name: 'University of Excellence',
            email: 'study.abroad@univexcel.edu',
            phone: '+1-617-555-0156',
            company: 'University of Excellence',
            type: 'School'
        },
        createdAt: '2024-01-20T11:20:00Z',
        totalValue: 18900,
        currency: 'EUR',
        duration: 10,
        travelers: 22,
        destinations: ['Berlin', 'Prague', 'Vienna'],
        agent: 'David Brown',
        tags: ['Educational', 'History', 'Multi-City'],
        tripStartDate: '2024-04-10T07:30:00Z',
        operationalStatus: 'trip_file_created'
    }
];

interface ConfirmedQuotationsTableProps {
    onManageBookings?: (quotationId: string) => void;
    onViewTripFile?: (quotationId: string) => void;
    onEditItinerary?: (quotationId: string) => void;
    onViewOperations?: (quotationId: string) => void;
}

const ConfirmedQuotationsTable: React.FC<ConfirmedQuotationsTableProps> = ({
    onManageBookings,
    onViewTripFile,
    onEditItinerary,
    onViewOperations
}) => {
    const theme = useTheme();

    // State management
    const [searchTerm, setSearchTerm] = useState('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedTrip, setSelectedTrip] = useState<string | null>(null);

    // Filtered data
    const filteredTrips = useMemo(() => {
        return mockConfirmedQuotations.filter(trip => {
            const searchLower = searchTerm.toLowerCase();
            return (
                trip.id.toLowerCase().includes(searchLower) ||
                trip.customer.name.toLowerCase().includes(searchLower) ||
                trip.destinations.some(dest => dest.toLowerCase().includes(searchLower)) ||
                trip.agent.toLowerCase().includes(searchLower)
            );
        });
    }, [searchTerm]);

    // Operational status configuration
    const getOperationalStatusConfig = (status: string) => {
        const configs = {
            bookings_pending: {
                color: 'warning' as const,
                icon: <PendingOutlined />,
                label: 'Bookings Pending',
                progress: 20
            },
            bookings_confirmed: {
                color: 'info' as const,
                icon: <CheckCircleOutlined />,
                label: 'Bookings Confirmed',
                progress: 40
            },
            trip_file_created: {
                color: 'info' as const,
                icon: <FolderOpenOutlined />,
                label: 'Trip File Ready',
                progress: 60
            },
            itinerary_locked: {
                color: 'primary' as const,
                icon: <EditCalendarOutlined />,
                label: 'Itinerary Locked',
                progress: 80
            },
            ready_to_travel: {
                color: 'success' as const,
                icon: <FlightTakeoffOutlined />,
                label: 'Ready to Travel',
                progress: 90
            },
            in_progress: {
                color: 'secondary' as const,
                icon: <GroupOutlined />,
                label: 'Trip in Progress',
                progress: 95
            },
            completed: {
                color: 'success' as const,
                icon: <CheckCircleOutlined />,
                label: 'Completed',
                progress: 100
            }
        };
        return configs[status as keyof typeof configs] || configs.bookings_pending;
    };

    // Priority based on trip start date
    const getTripUrgency = (tripStartDate: string) => {
        const daysUntilTrip = differenceInDays(parseISO(tripStartDate), new Date());
        if (daysUntilTrip <= 7) return 'urgent';
        if (daysUntilTrip <= 30) return 'high';
        if (daysUntilTrip <= 60) return 'medium';
        return 'low';
    };

    const getUrgencyColor = (urgency: string) => {
        const colors = {
            urgent: '#FF1744',
            high: '#FF5722',
            medium: '#FF9800',
            low: '#4CAF50'
        };
        return colors[urgency as keyof typeof colors];
    };

    // Action handlers
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, tripId: string) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedTrip(tripId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedTrip(null);
    };

    const formatCurrency = (value: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    Trip Operations Management
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage confirmed trips from booking to completion
                </Typography>
            </Box>

            {/* Search and Stats */}
            <Card sx={{ mb: 3 }}>
                <Box sx={{ p: 3 }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                        <TextField
                            placeholder="Search trips by ID, client, destination..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchOutlined />
                                    </InputAdornment>
                                )
                            }}
                            sx={{ flex: 1 }}
                        />

                        <Stack direction="row" spacing={2}>
                            <Chip
                                label={`${filteredTrips.length} Active Trips`}
                                color="primary"
                                variant="outlined"
                            />
                            <Chip
                                label={`${filteredTrips.filter(t => getTripUrgency(t.tripStartDate!) === 'urgent').length} Urgent`}
                                sx={{
                                    bgcolor: alpha('#FF1744', 0.1),
                                    color: '#FF1744'
                                }}
                            />
                        </Stack>
                    </Stack>
                </Box>
            </Card>

            {/* Main Table */}
            <Card>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{
                                bgcolor: alpha(theme.palette.primary.main, 0.05),
                                '& .MuiTableCell-head': {
                                    fontWeight: 700,
                                    fontSize: '0.875rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: 0.5
                                }
                            }}>
                                <TableCell>Priority</TableCell>
                                <TableCell>Trip Details</TableCell>
                                <TableCell>Client & Group</TableCell>
                                <TableCell>Travel Dates</TableCell>
                                <TableCell>Operational Status</TableCell>
                                <TableCell>Value</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredTrips.map((trip) => {
                                const urgency = getTripUrgency(trip.tripStartDate!);
                                const statusConfig = getOperationalStatusConfig(trip.operationalStatus!);
                                const daysUntilTrip = differenceInDays(parseISO(trip.tripStartDate!), new Date());

                                return (
                                    <TableRow
                                        key={trip.id}
                                        sx={{
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                bgcolor: alpha(theme.palette.primary.main, 0.04),
                                                transform: 'scale(1.001)',
                                            }
                                        }}
                                        onClick={() => onViewTripFile?.(trip.id)}
                                    >
                                        {/* Priority Indicator */}
                                        <TableCell>
                                            <Stack alignItems="center" spacing={1}>
                                                <Tooltip title={`${urgency.charAt(0).toUpperCase() + urgency.slice(1)} Priority`}>
                                                    <Box sx={{
                                                        width: 16,
                                                        height: 16,
                                                        borderRadius: '50%',
                                                        bgcolor: getUrgencyColor(urgency),
                                                        boxShadow: `0 0 0 3px ${alpha(getUrgencyColor(urgency), 0.2)}`
                                                    }} />
                                                </Tooltip>
                                                <Typography variant="caption" color="text.secondary">
                                                    {daysUntilTrip}d
                                                </Typography>
                                            </Stack>
                                        </TableCell>

                                        {/* Trip Details */}
                                        <TableCell>
                                            <Stack spacing={0.5}>
                                                <Typography variant="body1" fontWeight={600}>
                                                    {trip.id}
                                                </Typography>
                                                <Stack direction="row" alignItems="center" spacing={0.5}>
                                                    <LocationOnOutlined sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                    <Typography variant="caption" color="text.secondary">
                                                        {trip.destinations.join(' → ')}
                                                    </Typography>
                                                </Stack>
                                                <Typography variant="caption" color="text.secondary">
                                                    {trip.duration} days • {trip.travelers} travelers
                                                </Typography>
                                            </Stack>
                                        </TableCell>

                                        {/* Client & Group */}
                                        <TableCell>
                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                <Avatar sx={{ width: 40, height: 40, fontSize: '0.875rem' }}>
                                                    {trip.customer.name.charAt(0)}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {trip.customer.name}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {trip.customer.type} • {trip.agent}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </TableCell>

                                        {/* Travel Dates */}
                                        <TableCell>
                                            <Stack spacing={0.5}>
                                                <Typography variant="body2" fontWeight={600}>
                                                    {format(parseISO(trip.tripStartDate!), 'MMM dd, yyyy')}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Starts in {daysUntilTrip} days
                                                </Typography>
                                            </Stack>
                                        </TableCell>

                                        {/* Operational Status */}
                                        <TableCell>
                                            <Stack spacing={1}>
                                                <Chip
                                                    icon={statusConfig.icon}
                                                    label={statusConfig.label}
                                                    color={statusConfig.color}
                                                    size="small"
                                                    sx={{ fontWeight: 600 }}
                                                />
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={statusConfig.progress}
                                                    sx={{
                                                        height: 4,
                                                        borderRadius: 2,
                                                        bgcolor: alpha(theme.palette.grey[300], 0.3)
                                                    }}
                                                />
                                            </Stack>
                                        </TableCell>

                                        {/* Value */}
                                        <TableCell>
                                            <Typography variant="body1" fontWeight={700} color="primary">
                                                {formatCurrency(trip.totalValue, trip.currency)}
                                            </Typography>
                                        </TableCell>

                                        {/* Actions */}
                                        <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                                            <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                                {/* Quick Action Buttons based on status */}
                                                {trip.operationalStatus === 'bookings_pending' && (
                                                    <Tooltip title="Manage Supplier Bookings">
                                                        <IconButton
                                                            size="small"
                                                            color="warning"
                                                            onClick={() => onManageBookings?.(trip.id)}
                                                        >
                                                            <BookmarkBorderOutlined fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}

                                                <Tooltip title="View Trip File">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => onViewTripFile?.(trip.id)}
                                                    >
                                                        <FolderOpenOutlined fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="Edit Itinerary">
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => onEditItinerary?.(trip.id)}
                                                    >
                                                        <EditCalendarOutlined fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>

                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => handleMenuOpen(e, trip.id)}
                                                >
                                                    <MoreVertOutlined fontSize="small" />
                                                </IconButton>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>

                {filteredTrips.length === 0 && (
                    <Box sx={{ p: 6, textAlign: 'center' }}>
                        <FlightTakeoffOutlined sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            No confirmed trips found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {searchTerm ? 'Try adjusting your search terms' : 'No trips are currently in operations phase'}
                        </Typography>
                    </Box>
                )}
            </Card>

            {/* Actions Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
            >
                <MenuItem onClick={() => onManageBookings?.(selectedTrip!)}>
                    <BookmarkBorderOutlined sx={{ mr: 1 }} />
                    Manage Bookings
                </MenuItem>
                <MenuItem onClick={() => onViewTripFile?.(selectedTrip!)}>
                    <FolderOpenOutlined sx={{ mr: 1 }} />
                    View Trip File
                </MenuItem>
                <MenuItem onClick={() => onEditItinerary?.(selectedTrip!)}>
                    <EditCalendarOutlined sx={{ mr: 1 }} />
                    Edit Itinerary
                </MenuItem>
                <MenuItem onClick={() => onViewOperations?.(selectedTrip!)}>
                    <TaskOutlined sx={{ mr: 1 }} />
                    Operations Log
                </MenuItem>
                <MenuItem>
                    <HistoryOutlined sx={{ mr: 1 }} />
                    View History
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default ConfirmedQuotationsTable;