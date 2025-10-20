import React, { useState, useCallback, useMemo } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import {
    Box,
    Typography,
    TextField,
    Card,
    CardContent,
    Stack,
    Chip,
    Button,
    IconButton,
    Divider,
    InputAdornment,
    alpha,
    useTheme,
    Paper,
    Grid,
    Fab,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Badge,
    Tooltip,
    FormControl,
    InputLabel,
    Select,
    Collapse,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Autocomplete,
    Switch,
    FormControlLabel,
} from '@mui/material';
import {
    AddOutlined,
    DeleteOutlined,
    HotelOutlined,
    DirectionsBusOutlined,
    RestaurantOutlined,
    TourOutlined,
    PersonOutlined,
    MoreHorizOutlined,
    DragIndicatorOutlined,
    AccessTimeOutlined,
    LocationOnOutlined,
    CalendarTodayOutlined,
    CheckCircleOutlined,
    AttachMoneyOutlined,
    Edit,
    FileCopy,
    Today,
    ExpandMoreOutlined,
    ExpandLessOutlined,
    BusinessOutlined,
    PhoneOutlined,
    EmailOutlined,
    StarOutlined,
    AccountBalanceWalletOutlined,
    ReceiptLongOutlined,
    GroupOutlined,
    NotesOutlined,
    LinkOutlined,
    WarningOutlined,
    InfoOutlined,
    SaveOutlined,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

// Activity type definition
type ActivityType = 'accommodation' | 'transport' | 'meal' | 'activity' | 'guide' | 'free_time' | 'other';

// Interfaces
interface Supplier {
    id: string;
    name: string;
    category: ActivityType;
    contact: {
        phone?: string;
        email?: string;
        website?: string;
    };
    location: string;
    rating: number;
    commission: number;
    paymentTerms: string;
    notes: string;
    isPreferred: boolean;
}

interface ActivityItem {
    id: string;
    time: Dayjs | null;
    duration: number; // minutes
    type: ActivityType;
    title: string;
    location: string;
    description: string;
    supplier?: Supplier;
    supplierId?: string;
    cost: number;
    netCost: number;
    markup: number; // percentage
    finalPrice: number;
    notes?: string;
    participants: number;
    status: 'confirmed' | 'pending' | 'optional' | 'cancelled';
    bookingRef?: string;
    confirmationDeadline?: string;
    specialRequirements?: string;
    isIncluded: boolean; // whether it's included in the package or optional extra
}

interface DayPlan {
    id: string;
    date: string;
    dayNumber: number;
    title: string;
    city: string;
    accommodation?: Supplier;
    accommodationBookingRef?: string;
    activities: ActivityItem[];
    totalCost: number;
    estimatedDistance: number; // km
    notes?: string;
    status: 'draft' | 'confirmed' | 'locked';
    weather?: string;
    emergencyContacts?: string;
}

interface ItineraryForm {
    days: DayPlan[];
    totalDays: number;
    totalCost: number;
    startDate: string;
    endDate: string;
    defaultParticipants: number;
}

// Activity type configurations
const activityTypes: Record<ActivityType, { icon: React.ComponentType; color: string; label: string }> = {
    accommodation: { icon: HotelOutlined, color: '#1976d2', label: 'Hotel Check-in/out' },
    transport: { icon: DirectionsBusOutlined, color: '#388e3c', label: 'Transportation' },
    meal: { icon: RestaurantOutlined, color: '#d32f2f', label: 'Meal' },
    activity: { icon: TourOutlined, color: '#7b1fa2', label: 'Activity/Tour' },
    guide: { icon: PersonOutlined, color: '#f57c00', label: 'Guided Tour' },
    free_time: { icon: AccessTimeOutlined, color: '#455a64', label: 'Free Time' },
    other: { icon: MoreHorizOutlined, color: '#795548', label: 'Other' },
};

// Mock suppliers database
const suppliersDatabase: Supplier[] = [
    {
        id: 'hotel_001',
        name: 'Hotel Roma Palace',
        category: 'accommodation',
        contact: { phone: '+39 06 123 4567', email: 'info@romapalace.it', website: 'www.romapalace.it' },
        location: 'Rome City Center',
        rating: 4.2,
        commission: 12,
        paymentTerms: 'Net 30',
        notes: 'Central location, breakfast included, group rates available',
        isPreferred: true,
    },
    {
        id: 'transport_001',
        name: 'Roma Coach Services',
        category: 'transport',
        contact: { phone: '+39 06 987 6543', email: 'booking@romacoach.it' },
        location: 'Rome',
        rating: 4.5,
        commission: 15,
        paymentTerms: 'Net 15',
        notes: 'Professional drivers, air conditioning, WiFi available',
        isPreferred: true,
    },
    {
        id: 'guide_001',
        name: 'Marco Rossi - Licensed Guide',
        category: 'guide',
        contact: { phone: '+39 333 111 2222', email: 'marco@romeguide.it' },
        location: 'Rome',
        rating: 4.8,
        commission: 0,
        paymentTerms: 'Cash on delivery',
        notes: 'Vatican & Colosseum specialist, fluent English, educational groups expert',
        isPreferred: true,
    },
    {
        id: 'restaurant_001',
        name: 'Pizzeria Tradizionale',
        category: 'meal',
        contact: { phone: '+39 06 555 7788', email: 'group@pizzeriatrad.it' },
        location: 'Trastevere, Rome',
        rating: 4.1,
        commission: 5,
        paymentTerms: 'Net 7',
        notes: 'Traditional Italian cuisine, group menus available, vegetarian options',
        isPreferred: false,
    },
    {
        id: 'activity_001',
        name: 'Vatican Museums',
        category: 'activity',
        contact: { phone: '+39 06 6988 4676', website: 'www.museivaticani.va' },
        location: 'Vatican City',
        rating: 4.6,
        commission: 0,
        paymentTerms: 'Prepaid',
        notes: 'Skip-the-line tickets, audio guides included, group rates for 15+',
        isPreferred: true,
    },
];

// Quick activity templates with supplier suggestions
const quickActivities: Array<{
    type: ActivityType;
    title: string;
    duration: number;
    cost: number;
    suggestedSuppliers?: string[];
}> = [
        { type: 'accommodation', title: 'Hotel Check-in', duration: 30, cost: 0, suggestedSuppliers: ['hotel_001'] },
        { type: 'accommodation', title: 'Hotel Check-out', duration: 30, cost: 0 },
        { type: 'transport', title: 'Airport Transfer', duration: 60, cost: 65, suggestedSuppliers: ['transport_001'] },
        { type: 'transport', title: 'City Transport', duration: 30, cost: 25, suggestedSuppliers: ['transport_001'] },
        { type: 'meal', title: 'Traditional Lunch', duration: 90, cost: 25, suggestedSuppliers: ['restaurant_001'] },
        { type: 'meal', title: 'Group Dinner', duration: 120, cost: 35, suggestedSuppliers: ['restaurant_001'] },
        { type: 'activity', title: 'Vatican Museums Tour', duration: 180, cost: 30, suggestedSuppliers: ['activity_001'] },
        { type: 'guide', title: 'City Walking Tour', duration: 240, cost: 180, suggestedSuppliers: ['guide_001'] },
        { type: 'free_time', title: 'Free Time & Shopping', duration: 120, cost: 0 },
    ];

// Styled components
const DayCard = styled(Card)(({ theme }) => ({
    border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
    borderRadius: theme.spacing(2),
    marginBottom: theme.spacing(2),
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',

    '&:hover': {
        boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.08)}`,
        borderColor: alpha(theme.palette.primary.main, 0.3),
    },

    '&.confirmed': {
        borderColor: theme.palette.success.main,
        backgroundColor: alpha(theme.palette.success.main, 0.02),
    },

    '&.locked': {
        borderColor: theme.palette.warning.main,
        backgroundColor: alpha(theme.palette.warning.main, 0.02),
    },
}));

const ActivityCard = styled(Card)(({ theme }) => ({
    border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
    borderRadius: theme.spacing(1.5),
    marginBottom: theme.spacing(1),
    cursor: 'grab',
    transition: 'all 0.2s ease',

    '&:hover': {
        borderColor: theme.palette.primary.main,
        boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.12)}`,
    },

    '&.confirmed': {
        borderLeftColor: theme.palette.success.main,
        borderLeftWidth: 4,
    },

    '&.pending': {
        borderLeftColor: theme.palette.warning.main,
        borderLeftWidth: 4,
    },

    '&.optional': {
        borderLeftColor: theme.palette.info.main,
        borderLeftWidth: 4,
        backgroundColor: alpha(theme.palette.info.main, 0.02),
    },
}));

const SupplierChip = styled(Chip)(({ theme }) => ({
    backgroundColor: alpha(theme.palette.success.main, 0.1),
    color: theme.palette.success.main,
    border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
    fontSize: '0.75rem',
    fontWeight: 600,

    '& .MuiChip-icon': {
        color: theme.palette.success.main,
    },
}));

const DayByDayPlanning: React.FC = () => {
    const theme = useTheme();
    const selectedDay = 0;
    const [quickAddAnchor, setQuickAddAnchor] = useState<null | HTMLElement>(null);
    const [supplierDialogOpen, setSupplierDialogOpen] = useState(false);
    const [selectedActivityForSupplier, setSelectedActivityForSupplier] = useState<{ dayIndex: number, activityIndex: number } | null>(null);
    const [expandedActivities, setExpandedActivities] = useState<Set<string>>(new Set());

    const { control, handleSubmit, watch, setValue } = useForm<ItineraryForm>({
        defaultValues: {
            days: [
                {
                    id: '1',
                    date: dayjs().format('YYYY-MM-DD'),
                    dayNumber: 1,
                    title: 'Arrival Day',
                    city: 'Rome',
                    activities: [],
                    totalCost: 0,
                    estimatedDistance: 0,
                    status: 'draft',
                }
            ],
            totalDays: 1,
            totalCost: 0,
            startDate: dayjs().format('YYYY-MM-DD'),
            endDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
            defaultParticipants: 30,
        },
        mode: 'onChange'
    });

    const { fields: dayFields, append: appendDay, remove: removeDay } = useFieldArray({
        control,
        name: 'days'
    });

    const watchedDays = watch('days');
    const defaultParticipants = watch('defaultParticipants');

    // Calculate totals
    const totals = useMemo(() => {
        const totalCost = watchedDays.reduce((sum, day) =>
            sum + day.activities.reduce((daySum, activity) => daySum + (activity.finalPrice || activity.cost), 0), 0
        );
        const totalActivities = watchedDays.reduce((sum, day) => sum + day.activities.length, 0);
        const confirmedDays = watchedDays.filter(day => day.status === 'confirmed').length;
        const pendingBookings = watchedDays.reduce((sum, day) =>
            sum + day.activities.filter(a => a.status === 'pending').length, 0
        );

        return { totalCost, totalActivities, confirmedDays, pendingBookings };
    }, [watchedDays]);

    const addDay = useCallback(() => {
        const newDay: DayPlan = {
            id: Date.now().toString(),
            date: dayjs().add(dayFields.length, 'day').format('YYYY-MM-DD'),
            dayNumber: dayFields.length + 1,
            title: `Day ${dayFields.length + 1}`,
            city: '',
            activities: [],
            totalCost: 0,
            estimatedDistance: 0,
            status: 'draft',
        };
        appendDay(newDay);
    }, [appendDay, dayFields.length]);

    const addActivity = useCallback((dayIndex: number, template?: typeof quickActivities[0]) => {
        const currentDay = watchedDays[dayIndex];
        const lastActivity = currentDay.activities[currentDay.activities.length - 1];
        const defaultTime = lastActivity
            ? dayjs(lastActivity.time).add(lastActivity.duration + 30, 'minute')
            : dayjs().hour(9).minute(0);

        // Find suggested supplier if available
        const suggestedSupplier = template?.suggestedSuppliers?.length
            ? suppliersDatabase.find(s => s.id === template.suggestedSuppliers![0])
            : undefined;

        const baseCost = template?.cost || 0;
        const markup = suggestedSupplier?.commission || 20;
        const finalPrice = baseCost * (1 + markup / 100);

        const newActivity: ActivityItem = {
            id: Date.now().toString() + Math.random(),
            time: defaultTime,
            duration: template?.duration || 60,
            type: template?.type || 'other',
            title: template?.title || '',
            location: '',
            description: '',
            supplier: suggestedSupplier,
            supplierId: suggestedSupplier?.id,
            cost: baseCost,
            netCost: baseCost,
            markup: markup,
            finalPrice: finalPrice,
            participants: defaultParticipants,
            status: 'pending',
            isIncluded: true,
        };

        const updatedActivities = [...currentDay.activities, newActivity];
        setValue(`days.${dayIndex}.activities`, updatedActivities);
        setQuickAddAnchor(null);
    }, [watchedDays, setValue, defaultParticipants]);

    const toggleActivityExpansion = useCallback((activityId: string) => {
        setExpandedActivities(prev => {
            const newSet = new Set(prev);
            if (newSet.has(activityId)) {
                newSet.delete(activityId);
            } else {
                newSet.add(activityId);
            }
            return newSet;
        });
    }, []);

    const openSupplierDialog = useCallback((dayIndex: number, activityIndex: number) => {
        setSelectedActivityForSupplier({ dayIndex, activityIndex });
        setSupplierDialogOpen(true);
    }, []);

    const assignSupplier = useCallback((supplier: Supplier) => {
        if (!selectedActivityForSupplier) return;

        const { dayIndex, activityIndex } = selectedActivityForSupplier;
        const activity = watchedDays[dayIndex].activities[activityIndex];

        const newNetCost = activity.cost;
        const newMarkup = supplier.commission;
        const newFinalPrice = newNetCost * (1 + newMarkup / 100);

        setValue(`days.${dayIndex}.activities.${activityIndex}.supplier`, supplier);
        setValue(`days.${dayIndex}.activities.${activityIndex}.supplierId`, supplier.id);
        setValue(`days.${dayIndex}.activities.${activityIndex}.netCost`, newNetCost);
        setValue(`days.${dayIndex}.activities.${activityIndex}.markup`, newMarkup);
        setValue(`days.${dayIndex}.activities.${activityIndex}.finalPrice`, newFinalPrice);

        setSupplierDialogOpen(false);
        setSelectedActivityForSupplier(null);
    }, [selectedActivityForSupplier, watchedDays, setValue]);

    const onSubmit = (data: ItineraryForm) => {
        console.log('Itinerary submitted:', data);
    };

    const renderActivityItem = (activity: ActivityItem, dayIndex: number, activityIndex: number) => {
        const ActivityIcon = activityTypes[activity.type].icon;
        const typeColor = activityTypes[activity.type].color;
        const isExpanded = expandedActivities.has(activity.id);

        return (
            <ActivityCard key={activity.id} className={activity.status}>
                <CardContent sx={{ py: 2 }}>
                    <Stack spacing={2}>
                        {/* Main Activity Row */}
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <DragIndicatorOutlined sx={{ color: 'text.disabled', cursor: 'grab' }} />

                            <Box sx={{
                                p: 1,
                                borderRadius: 1,
                                backgroundColor: alpha(typeColor, 0.1),
                                color: typeColor,
                            }}>
                                <ActivityIcon />
                            </Box>

                            <Box flex={1}>
                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                                    <Controller
                                        name={`days.${dayIndex}.activities.${activityIndex}.time`}
                                        control={control}
                                        render={({ field }) => (
                                            <TimePicker
                                                {...field}
                                                slotProps={{
                                                    textField: {
                                                        size: 'small',
                                                        sx: { width: 120 }
                                                    }
                                                }}
                                            />
                                        )}
                                    />

                                    <Chip
                                        label={`${activity.duration}min`}
                                        size="small"
                                        variant="outlined"
                                        sx={{ minWidth: 60 }}
                                    />

                                    <Chip
                                        label={activity.status}
                                        size="small"
                                        color={activity.status === 'confirmed' ? 'success' :
                                            activity.status === 'pending' ? 'warning' :
                                                activity.status === 'optional' ? 'info' : 'default'}
                                    />

                                    {!activity.isIncluded && (
                                        <Chip
                                            label="Optional Extra"
                                            size="small"
                                            color="secondary"
                                            variant="outlined"
                                        />
                                    )}
                                </Stack>

                                <Controller
                                    name={`days.${dayIndex}.activities.${activityIndex}.title`}
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            placeholder="Activity title..."
                                            variant="standard"
                                            size="small"
                                            sx={{ mb: 1 }}
                                        />
                                    )}
                                />

                                <Stack direction="row" spacing={1} alignItems="center">
                                    {activity.supplier && (
                                        <SupplierChip
                                            icon={<BusinessOutlined />}
                                            label={activity.supplier.name}
                                            size="small"
                                            onClick={() => openSupplierDialog(dayIndex, activityIndex)}
                                        />
                                    )}

                                    {activity.bookingRef && (
                                        <Chip
                                            icon={<ReceiptLongOutlined />}
                                            label={activity.bookingRef}
                                            size="small"
                                            variant="outlined"
                                        />
                                    )}
                                </Stack>
                            </Box>

                            <Stack alignItems="flex-end" spacing={0.5}>
                                <Typography variant="h6" color="primary.main" fontWeight={700}>
                                    €{(activity.finalPrice || activity.cost).toLocaleString()}
                                </Typography>
                                {activity.finalPrice !== activity.cost && (
                                    <Typography variant="caption" color="text.secondary">
                                        Net: €{activity.cost} (+{activity.markup}%)
                                    </Typography>
                                )}
                            </Stack>

                            <Stack direction="row" spacing={1}>
                                <IconButton
                                    size="small"
                                    onClick={() => toggleActivityExpansion(activity.id)}
                                >
                                    {isExpanded ? <ExpandLessOutlined /> : <ExpandMoreOutlined />}
                                </IconButton>
                                <IconButton size="small" color="error">
                                    <DeleteOutlined />
                                </IconButton>
                            </Stack>
                        </Stack>

                        {/* Expanded Details */}
                        <Collapse in={isExpanded}>
                            <Stack spacing={2}>
                                <Grid container spacing={2}>
                                    <Grid>
                                        <Controller
                                            name={`days.${dayIndex}.activities.${activityIndex}.location`}
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    label="Location"
                                                    size="small"
                                                    InputProps={{
                                                        startAdornment: <LocationOnOutlined sx={{ fontSize: 16, mr: 1 }} />
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid>
                                        <Controller
                                            name={`days.${dayIndex}.activities.${activityIndex}.participants`}
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    type="number"
                                                    label="Participants"
                                                    size="small"
                                                    InputProps={{
                                                        startAdornment: <GroupOutlined sx={{ fontSize: 16, mr: 1 }} />
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={4}>
                                        <Controller
                                            name={`days.${dayIndex}.activities.${activityIndex}.cost`}
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    type="number"
                                                    label="Net Cost"
                                                    size="small"
                                                    InputProps={{
                                                        startAdornment: <InputAdornment position="start">€</InputAdornment>
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Controller
                                            name={`days.${dayIndex}.activities.${activityIndex}.markup`}
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    type="number"
                                                    label="Markup"
                                                    size="small"
                                                    InputProps={{
                                                        endAdornment: <InputAdornment position="end">%</InputAdornment>
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            fullWidth
                                            label="Final Price"
                                            size="small"
                                            value={`€${(activity.finalPrice || activity.cost).toLocaleString()}`}
                                            InputProps={{ readOnly: true }}
                                            sx={{
                                                '& .MuiInputBase-input': {
                                                    fontWeight: 600,
                                                    color: theme.palette.primary.main
                                                }
                                            }}
                                        />
                                    </Grid>
                                </Grid>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Controller
                                            name={`days.${dayIndex}.activities.${activityIndex}.bookingRef`}
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    label="Booking Reference"
                                                    size="small"
                                                    InputProps={{
                                                        startAdornment: <ReceiptLongOutlined sx={{ fontSize: 16, mr: 1 }} />
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Controller
                                            name={`days.${dayIndex}.activities.${activityIndex}.status`}
                                            control={control}
                                            render={({ field }) => (
                                                <FormControl fullWidth size="small">
                                                    <InputLabel>Status</InputLabel>
                                                    <Select {...field} label="Status">
                                                        <MenuItem value="pending">Pending</MenuItem>
                                                        <MenuItem value="confirmed">Confirmed</MenuItem>
                                                        <MenuItem value="optional">Optional</MenuItem>
                                                        <MenuItem value="cancelled">Cancelled</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            )}
                                        />
                                    </Grid>
                                </Grid>

                                <Controller
                                    name={`days.${dayIndex}.activities.${activityIndex}.notes`}
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            multiline
                                            rows={2}
                                            label="Notes & Special Requirements"
                                            size="small"
                                            InputProps={{
                                                startAdornment: <NotesOutlined sx={{ fontSize: 16, mr: 1, mt: 1 }} />
                                            }}
                                        />
                                    )}
                                />

                                <Stack direction="row" spacing={2}>
                                    <Button
                                        size="small"
                                        startIcon={<BusinessOutlined />}
                                        onClick={() => openSupplierDialog(dayIndex, activityIndex)}
                                    >
                                        {activity.supplier ? 'Change Supplier' : 'Assign Supplier'}
                                    </Button>

                                    <Controller
                                        name={`days.${dayIndex}.activities.${activityIndex}.isIncluded`}
                                        control={control}
                                        render={({ field }) => (
                                            <FormControlLabel
                                                control={<Switch {...field} checked={field.value} size="small" />}
                                                label="Included in package"
                                            />
                                        )}
                                    />
                                </Stack>
                            </Stack>
                        </Collapse>
                    </Stack>
                </CardContent>
            </ActivityCard>
        );
    };

    const renderDayCard = (day: DayPlan, dayIndex: number) => {
        const dayTotal = day.activities.reduce((sum, activity) => sum + (activity.finalPrice || activity.cost), 0);
        const confirmedActivities = day.activities.filter(a => a.status === 'confirmed').length;
        const pendingBookings = day.activities.filter(a => a.status === 'pending').length;

        return (
            <DayCard key={day.id} className={day.status}>
                <CardContent>
                    <Stack spacing={3}>
                        {/* Day Header */}
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Box sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    backgroundColor: theme.palette.primary.main,
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 700,
                                }}>
                                    {day.dayNumber}
                                </Box>

                                <Box>
                                    <Controller
                                        name={`days.${dayIndex}.title`}
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                variant="standard"
                                                placeholder="Day title..."
                                                sx={{
                                                    '& .MuiInput-input': {
                                                        fontSize: '1.25rem',
                                                        fontWeight: 600
                                                    }
                                                }}
                                            />
                                        )}
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                        {dayjs(day.date).format('dddd, MMMM DD')}
                                    </Typography>
                                </Box>
                            </Stack>

                            <Stack direction="row" spacing={1} alignItems="center">
                                <Badge badgeContent={confirmedActivities} color="success">
                                    <Chip
                                        label={`${day.activities.length} activities`}
                                        size="small"
                                        variant="outlined"
                                    />
                                </Badge>

                                {pendingBookings > 0 && (
                                    <Badge badgeContent={pendingBookings} color="warning">
                                        <Chip
                                            label="Pending"
                                            size="small"
                                            color="warning"
                                            variant="outlined"
                                        />
                                    </Badge>
                                )}

                                <Typography variant="h6" color="primary.main" fontWeight={700}>
                                    €{dayTotal.toLocaleString()}
                                </Typography>

                                <IconButton
                                    size="small"
                                    onClick={(e) => setQuickAddAnchor(e.currentTarget)}
                                >
                                    <MoreHorizOutlined />
                                </IconButton>
                            </Stack>
                        </Stack>

                        {/* City & Accommodation */}
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Controller
                                    name={`days.${dayIndex}.city`}
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="City/Location"
                                            size="small"
                                            InputProps={{
                                                startAdornment: <LocationOnOutlined sx={{ fontSize: 16, mr: 1 }} />
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Autocomplete
                                    options={suppliersDatabase.filter(s => s.category === 'accommodation')}
                                    getOptionLabel={(option) => option.name}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Accommodation"
                                            size="small"
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: <HotelOutlined sx={{ fontSize: 16, mr: 1 }} />
                                            }}
                                        />
                                    )}
                                    renderOption={(props, option) => (
                                        <Box component="li" {...props}>
                                            <Stack>
                                                <Typography variant="body2">{option.name}</Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    ⭐ {option.rating} • {option.location}
                                                </Typography>
                                            </Stack>
                                        </Box>
                                    )}
                                />
                            </Grid>
                        </Grid>

                        {/* Activities Timeline */}
                        <Box>
                            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Daily Schedule
                                </Typography>
                                <Button
                                    size="small"
                                    startIcon={<AddOutlined />}
                                    onClick={() => addActivity(dayIndex)}
                                >
                                    Add Activity
                                </Button>
                            </Stack>

                            <Stack spacing={1}>
                                {day.activities.map((activity, activityIndex) =>
                                    renderActivityItem(activity, dayIndex, activityIndex)
                                )}

                                {day.activities.length === 0 && (
                                    <Paper sx={{
                                        p: 3,
                                        textAlign: 'center',
                                        backgroundColor: alpha(theme.palette.primary.main, 0.02),
                                        border: `2px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
                                    }}>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            No activities scheduled for this day
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<AddOutlined />}
                                            onClick={() => addActivity(dayIndex)}
                                        >
                                            Add First Activity
                                        </Button>
                                    </Paper>
                                )}
                            </Stack>
                        </Box>
                    </Stack>
                </CardContent>
            </DayCard>
        );
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ maxWidth: 1400, mx: 'auto', p: 4 }}>
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                            <Typography variant="h4" fontWeight={700} gutterBottom>
                                Day-by-Day Itinerary
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Plan detailed daily schedules with suppliers, costs, and booking management
                            </Typography>
                        </Box>

                        <Stack direction="row" spacing={2}>
                            <Chip
                                icon={<CalendarTodayOutlined />}
                                label={`${dayFields.length} days`}
                                variant="outlined"
                            />
                            <Chip
                                icon={<AttachMoneyOutlined />}
                                label={`€${totals.totalCost.toLocaleString()}`}
                                color="primary"
                            />
                            <Chip
                                icon={<CheckCircleOutlined />}
                                label={`${totals.confirmedDays} confirmed`}
                                color="success"
                            />
                            {totals.pendingBookings > 0 && (
                                <Chip
                                    icon={<WarningOutlined />}
                                    label={`${totals.pendingBookings} pending`}
                                    color="warning"
                                />
                            )}
                        </Stack>
                    </Stack>
                </Box>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={4}>
                        {/* Main Content */}
                        <Grid item xs={12} lg={8}>
                            <Stack spacing={3}>
                                {/* Quick Actions */}
                                <Paper sx={{ p: 3, backgroundColor: alpha(theme.palette.primary.main, 0.02) }}>
                                    <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center">
                                        <Button
                                            variant="outlined"
                                            startIcon={<AddOutlined />}
                                            onClick={addDay}
                                        >
                                            Add Day
                                        </Button>

                                        <Divider orientation="vertical" flexItem />

                                        <Controller
                                            name="defaultParticipants"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="Default Group Size"
                                                    type="number"
                                                    size="small"
                                                    sx={{ width: 160 }}
                                                    InputProps={{
                                                        startAdornment: <GroupOutlined sx={{ fontSize: 16, mr: 1 }} />
                                                    }}
                                                />
                                            )}
                                        />
                                    </Stack>
                                </Paper>

                                {/* Day Cards */}
                                {dayFields.map((field, index) => renderDayCard(watchedDays[index], index))}
                            </Stack>
                        </Grid>

                        {/* Sidebar */}
                        <Grid item xs={12} lg={4}>
                            <Stack spacing={3}>
                                {/* Overview */}
                                <Card sx={{ position: 'sticky', top: theme.spacing(2) }}>
                                    <CardContent>
                                        <Typography variant="h6" fontWeight={600} gutterBottom>
                                            <Today sx={{ mr: 1, verticalAlign: 'middle' }} />
                                            Trip Overview
                                        </Typography>

                                        <Stack spacing={2}>
                                            <Stack direction="row" justifyContent="space-between">
                                                <Typography variant="body2" color="text.secondary">
                                                    Total Duration
                                                </Typography>
                                                <Typography variant="body2" fontWeight={600}>
                                                    {dayFields.length} days
                                                </Typography>
                                            </Stack>

                                            <Stack direction="row" justifyContent="space-between">
                                                <Typography variant="body2" color="text.secondary">
                                                    Total Activities
                                                </Typography>
                                                <Typography variant="body2" fontWeight={600}>
                                                    {totals.totalActivities}
                                                </Typography>
                                            </Stack>

                                            <Stack direction="row" justifyContent="space-between">
                                                <Typography variant="body2" color="text.secondary">
                                                    Confirmed/Pending
                                                </Typography>
                                                <Typography variant="body2" fontWeight={600}>
                                                    <span style={{ color: theme.palette.success.main }}>
                                                        {totals.totalActivities - totals.pendingBookings}
                                                    </span>
                                                    {totals.pendingBookings > 0 && (
                                                        <span style={{ color: theme.palette.warning.main }}>
                                                            /{totals.pendingBookings}
                                                        </span>
                                                    )}
                                                </Typography>
                                            </Stack>

                                            <Divider />

                                            <Stack direction="row" justifyContent="space-between">
                                                <Typography variant="subtitle1" fontWeight={600}>
                                                    Total Cost
                                                </Typography>
                                                <Typography variant="h6" fontWeight={700} color="primary.main">
                                                    €{totals.totalCost.toLocaleString()}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </CardContent>
                                </Card>

                                {/* Quick Add Activities */}
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" fontWeight={600} gutterBottom>
                                            Quick Add Templates
                                        </Typography>

                                        <Stack spacing={1}>
                                            {quickActivities.slice(0, 6).map((template, index) => {
                                                const Icon = activityTypes[template.type].icon;
                                                return (
                                                    <Button
                                                        key={index}
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        startIcon={<Icon />}
                                                        onClick={() => addActivity(selectedDay, template)}
                                                        sx={{ justifyContent: 'flex-start' }}
                                                    >
                                                        <Stack sx={{ textAlign: 'left', width: '100%' }}>
                                                            <Typography variant="body2">{template.title}</Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {template.duration}min • €{template.cost}
                                                                {template.suggestedSuppliers?.length && ' • Auto-supplier'}
                                                            </Typography>
                                                        </Stack>
                                                    </Button>
                                                );
                                            })}
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Stack>
                        </Grid>
                    </Grid>

                    {/* Submit Button */}
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={dayFields.length === 0}
                            sx={{ minWidth: 200 }}
                            startIcon={<SaveOutlined />}
                        >
                            Save & Continue →
                        </Button>
                    </Box>
                </form>

                {/* Supplier Selection Dialog */}
                <Dialog
                    open={supplierDialogOpen}
                    onClose={() => setSupplierDialogOpen(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        <BusinessOutlined sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Select Supplier
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            {suppliersDatabase
                                .filter(supplier =>
                                    !selectedActivityForSupplier ||
                                    supplier.category === watchedDays[selectedActivityForSupplier.dayIndex]
                                        ?.activities[selectedActivityForSupplier.activityIndex]?.type
                                )
                                .map((supplier) => (
                                    <Grid item xs={12} md={6} key={supplier.id}>
                                        <Card
                                            sx={{
                                                cursor: 'pointer',
                                                border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                                                '&:hover': {
                                                    borderColor: theme.palette.primary.main,
                                                    boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.12)}`,
                                                }
                                            }}
                                            onClick={() => assignSupplier(supplier)}
                                        >
                                            <CardContent>
                                                <Stack spacing={2}>
                                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                                        <Box>
                                                            <Typography variant="subtitle1" fontWeight={600}>
                                                                {supplier.name}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {supplier.location}
                                                            </Typography>
                                                        </Box>
                                                        {supplier.isPreferred && (
                                                            <Chip
                                                                label="Preferred"
                                                                size="small"
                                                                color="primary"
                                                                icon={<StarOutlined />}
                                                            />
                                                        )}
                                                    </Stack>

                                                    <Stack direction="row" spacing={2}>
                                                        <Typography variant="body2">
                                                            ⭐ {supplier.rating}
                                                        </Typography>
                                                        <Typography variant="body2" color="success.main">
                                                            {supplier.commission}% commission
                                                        </Typography>
                                                    </Stack>

                                                    <Typography variant="body2" color="text.secondary">
                                                        {supplier.notes}
                                                    </Typography>

                                                    <Stack direction="row" spacing={1}>
                                                        {supplier.contact.phone && (
                                                            <Chip
                                                                icon={<PhoneOutlined />}
                                                                label={supplier.contact.phone}
                                                                size="small"
                                                                variant="outlined"
                                                            />
                                                        )}
                                                        {supplier.contact.email && (
                                                            <Chip
                                                                icon={<EmailOutlined />}
                                                                label="Email"
                                                                size="small"
                                                                variant="outlined"
                                                            />
                                                        )}
                                                    </Stack>
                                                </Stack>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setSupplierDialogOpen(false)}>Cancel</Button>
                    </DialogActions>
                </Dialog>

                {/* Quick Add Menu */}
                <Menu
                    anchorEl={quickAddAnchor}
                    open={Boolean(quickAddAnchor)}
                    onClose={() => setQuickAddAnchor(null)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    {quickActivities.map((template, index) => {
                        const Icon = activityTypes[template.type].icon;
                        return (
                            <MenuItem
                                key={index}
                                onClick={() => addActivity(selectedDay, template)}
                            >
                                <ListItemIcon>
                                    <Icon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>
                                    {template.title}
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        {template.duration}min • €{template.cost}
                                        {template.suggestedSuppliers?.length && ' • Auto-supplier'}
                                    </Typography>
                                </ListItemText>
                            </MenuItem>
                        );
                    })}
                </Menu>
            </Box>
        </LocalizationProvider>
    );
};

export default DayByDayPlanning;