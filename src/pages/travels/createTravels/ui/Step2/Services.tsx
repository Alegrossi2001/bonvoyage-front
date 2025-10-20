import React, { useState, useCallback, useMemo } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import {
    Box,
    Grid,
    Typography,
    TextField,
    Autocomplete,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Card,
    CardContent,
    Stack,
    Chip,
    Button,
    IconButton,
    Alert,
    Divider,
    InputAdornment,
    Tooltip,
    alpha,
    useTheme,
    Paper,
    Badge,
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Switch,
    Collapse,
} from '@mui/material';
import {
    AddOutlined,
    DeleteOutlined,
    HotelOutlined,
    FlightOutlined,
    DirectionsBusOutlined,
    RestaurantOutlined,
    TourOutlined,
    PersonOutlined,
    MoreHorizOutlined,
    ContentCopyOutlined,
    ExpandMoreOutlined,
    ExpandLessOutlined,
    TrendingUpOutlined,
    CalculateOutlined,
    StarOutlined,
    AttachMoneyOutlined,
    WarningOutlined,
    CheckCircleOutlined,
    AutoAwesomeOutlined,
    SpeedOutlined,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Service item interface
interface ServiceItem {
    id: string;
    category: 'accommodation' | 'transport' | 'guide' | 'meal' | 'activity' | 'other';
    description: string;
    supplier?: string;
    quantity: number;
    unit: string;
    unitCost: number;
    totalCost: number;
    markup: number; // percentage
    markupAmount: number; // calculated amount
    finalPrice: number; // cost + markup
    notes?: string;
}

// Form interface
interface ServicesForm {
    services: ServiceItem[];
    totalNetCost: number;
    totalMarkup: number;
    totalGrossPrice: number;
    averageMargin: number;
}

// Mock data for suppliers
const supplierDatabase = {
    accommodation: [
        {
            id: 'acc_001',
            name: 'Hotel Roma Palace',
            category: 'accommodation',
            location: 'Rome, Italy',
            type: '4-star Hotel',
            netPrice: 85,
            unit: 'per room/night',
            rating: 4.2,
            commission: 12,
            notes: 'Central location, breakfast included'
        },
        {
            id: 'acc_002',
            name: 'Hostel San Lorenzo',
            category: 'accommodation',
            location: 'Rome, Italy',
            type: 'Hostel',
            netPrice: 25,
            unit: 'per bed/night',
            rating: 3.8,
            commission: 8,
            notes: 'Budget option, shared facilities'
        },
    ],
    transport: [
        {
            id: 'trans_001',
            name: 'Roma Coach Services',
            category: 'transport',
            type: '49-seater Coach',
            netPrice: 450,
            unit: 'per day',
            rating: 4.5,
            commission: 15,
            notes: 'Air conditioning, WiFi, professional driver'
        },
        {
            id: 'trans_002',
            name: 'Airport Transfer Pro',
            category: 'transport',
            type: 'Airport Transfer',
            netPrice: 65,
            unit: 'per transfer',
            rating: 4.3,
            commission: 10,
            notes: 'Meet & greet service included'
        },
    ],
    guide: [
        {
            id: 'guide_001',
            name: 'Marco Rossi - Licensed Guide',
            category: 'guide',
            type: 'Vatican & Colosseum Specialist',
            netPrice: 180,
            unit: 'per half-day',
            rating: 4.8,
            commission: 0,
            notes: 'Fluent English, educational groups specialist'
        },
    ],
    meal: [
        {
            id: 'meal_001',
            name: 'Pizzeria Tradizionale',
            category: 'meal',
            type: 'Traditional Italian Lunch',
            netPrice: 18,
            unit: 'per person',
            rating: 4.1,
            commission: 5,
            notes: 'Pizza + drink + gelato, group menus available'
        },
    ],
    activity: [
        {
            id: 'act_001',
            name: 'Vatican Museums Skip-the-Line',
            category: 'activity',
            type: 'Museum Entry',
            netPrice: 22,
            unit: 'per person',
            rating: 4.6,
            commission: 0,
            notes: 'Audio guide included, group rates available'
        },
    ],
};

// Service templates
const serviceTemplates = [
    {
        id: 'rome_3day_school',
        name: '3-Day Rome School Package',
        description: 'Complete package for educational groups',
        icon: '🎓',
        services: [
            {
                category: 'accommodation',
                description: 'Hotel accommodation - twin rooms',
                quantity: 6,
                unit: 'room-nights',
                unitCost: 85,
                markup: 20,
            },
            {
                category: 'transport',
                description: 'Airport transfers + city transport',
                quantity: 3,
                unit: 'days',
                unitCost: 450,
                markup: 15,
            },
            {
                category: 'guide',
                description: 'Licensed guide for historical sites',
                quantity: 2,
                unit: 'half-days',
                unitCost: 180,
                markup: 25,
            },
            {
                category: 'meal',
                description: 'Traditional Italian lunches',
                quantity: 30,
                unit: 'persons',
                unitCost: 18,
                markup: 15,
            },
            {
                category: 'activity',
                description: 'Vatican Museums + Colosseum entry',
                quantity: 30,
                unit: 'persons',
                unitCost: 22,
                markup: 10,
            },
        ]
    },
    {
        id: 'pilgrimage_basic',
        name: 'Pilgrimage Basic Package',
        description: 'Essential services for religious groups',
        icon: '⛪',
        services: [
            {
                category: 'accommodation',
                description: 'Simple hotel/guesthouse accommodation',
                quantity: 4,
                unit: 'room-nights',
                unitCost: 65,
                markup: 18,
            },
            {
                category: 'transport',
                description: 'Coach transport to religious sites',
                quantity: 2,
                unit: 'days',
                unitCost: 380,
                markup: 12,
            },
            {
                category: 'guide',
                description: 'Religious sites specialist guide',
                quantity: 3,
                unit: 'half-days',
                unitCost: 160,
                markup: 20,
            },
        ]
    },
];

// Category configurations
const categoryConfig = {
    accommodation: {
        icon: HotelOutlined,
        color: '#1976d2',
        units: ['room-nights', 'bed-nights', 'apartments', 'nights'],
        description: 'Hotels, hostels, apartments, and lodging'
    },
    transport: {
        icon: DirectionsBusOutlined,
        color: '#388e3c',
        units: ['days', 'transfers', 'km', 'hours'],
        description: 'Coaches, transfers, flights, and transportation'
    },
    guide: {
        icon: PersonOutlined,
        color: '#f57c00',
        units: ['days', 'half-days', 'hours', 'tours'],
        description: 'Tour guides and local specialists'
    },
    meal: {
        icon: RestaurantOutlined,
        color: '#d32f2f',
        units: ['persons', 'meals', 'days', 'groups'],
        description: 'Restaurants, catering, and dining experiences'
    },
    activity: {
        icon: TourOutlined,
        color: '#7b1fa2',
        units: ['persons', 'entries', 'activities', 'groups'],
        description: 'Museums, tours, experiences, and activities'
    },
    other: {
        icon: MoreHorizOutlined,
        color: '#455a64',
        units: ['items', 'services', 'days', 'persons'],
        description: 'Insurance, visas, and miscellaneous services'
    },
};

const ServiceCard = styled(Card)(({ theme }) => ({
    border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
    borderRadius: theme.spacing(2),
    transition: 'all 0.2s ease-in-out',

    '&:hover': {
        boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.12)}`,
        borderColor: alpha(theme.palette.primary.main, 0.3),
    },
}));

const CategoryChip = styled(Chip)<{ category: string }>(({ theme, category }) => {
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

const MarginIndicator = styled(Box)<{ margin: number }>(({ theme, margin }) => {
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

const ServicesComponents: React.FC = () => {
    const theme = useTheme();
    const [templatesOpen, setTemplatesOpen] = useState(false);
    const [suppliersOpen, setSuppliersOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
    const [expandedServices, setExpandedServices] = useState<string[]>([]);

    const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<ServicesForm>({
        defaultValues: {
            services: [
                {
                    id: '1',
                    category: 'accommodation',
                    description: '',
                    quantity: 1,
                    unit: 'room-nights',
                    unitCost: 0,
                    totalCost: 0,
                    markup: 20,
                    markupAmount: 0,
                    finalPrice: 0,
                }
            ],
            totalNetCost: 0,
            totalMarkup: 0,
            totalGrossPrice: 0,
            averageMargin: 0,
        },
        mode: 'onChange'
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'services'
    });

    const watchedServices = watch('services');

    // Calculate totals
    const totals = useMemo(() => {
        const totalNetCost = watchedServices.reduce((sum, service) => sum + (service.totalCost || 0), 0);
        const totalMarkupAmount = watchedServices.reduce((sum, service) => sum + (service.markupAmount || 0), 0);
        const totalGrossPrice = totalNetCost + totalMarkupAmount;
        const averageMargin = totalNetCost > 0 ? (totalMarkupAmount / totalNetCost) * 100 : 0;

        return {
            totalNetCost,
            totalMarkupAmount,
            totalGrossPrice,
            averageMargin,
        };
    }, [watchedServices]);

    // Calculate service totals when values change
    const calculateServiceTotals = useCallback((index: number) => {
        const service = watchedServices[index];
        if (service) {
            const totalCost = (service.quantity || 0) * (service.unitCost || 0);
            const markupAmount = totalCost * ((service.markup || 0) / 100);
            const finalPrice = totalCost + markupAmount;

            setValue(`services.${index}.totalCost`, totalCost);
            setValue(`services.${index}.markupAmount`, markupAmount);
            setValue(`services.${index}.finalPrice`, finalPrice);
        }
    }, [watchedServices, setValue]);

    const addService = useCallback(() => {
        const newService: ServiceItem = {
            id: Date.now().toString(),
            category: 'accommodation',
            description: '',
            quantity: 1,
            unit: 'room-nights',
            unitCost: 0,
            totalCost: 0,
            markup: 20,
            markupAmount: 0,
            finalPrice: 0,
        };
        append(newService);
    }, [append]);

    const addFromTemplate = useCallback((template: any) => {
        template.services.forEach((templateService: any) => {
            const service: ServiceItem = {
                id: Date.now().toString() + Math.random(),
                category: templateService.category,
                description: templateService.description,
                quantity: templateService.quantity,
                unit: templateService.unit,
                unitCost: templateService.unitCost,
                totalCost: templateService.quantity * templateService.unitCost,
                markup: templateService.markup,
                markupAmount: (templateService.quantity * templateService.unitCost) * (templateService.markup / 100),
                finalPrice: (templateService.quantity * templateService.unitCost) * (1 + templateService.markup / 100),
            };
            append(service);
        });
        setTemplatesOpen(false);
    }, [append]);

    const addFromSupplier = useCallback((supplier: any) => {
        const service: ServiceItem = {
            id: Date.now().toString(),
            category: supplier.category,
            description: `${supplier.name} - ${supplier.type}`,
            supplier: supplier.name,
            quantity: 1,
            unit: supplier.unit.split(' ')[1] || 'items',
            unitCost: supplier.netPrice,
            totalCost: supplier.netPrice,
            markup: 20,
            markupAmount: supplier.netPrice * 0.2,
            finalPrice: supplier.netPrice * 1.2,
            notes: supplier.notes,
        };
        append(service);
        setSuppliersOpen(false);
    }, [append]);

    const toggleServiceExpansion = useCallback((serviceId: string) => {
        setExpandedServices(prev =>
            prev.includes(serviceId)
                ? prev.filter(id => id !== serviceId)
                : [...prev, serviceId]
        );
    }, []);

    const onSubmit = (data: ServicesForm) => {
        console.log('Services submitted:', { ...data, totals });
    };

    const renderSupplierCard = (supplier: any) => (
        <Card
            key={supplier.id}
            sx={{
                cursor: 'pointer',
                border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                '&:hover': {
                    borderColor: theme.palette.primary.main,
                    boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.12)}`,
                }
            }}
            onClick={() => addFromSupplier(supplier)}
        >
            <CardContent sx={{ pb: 2 }}>
                <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Typography variant="subtitle2" fontWeight={600}>
                            {supplier.name}
                        </Typography>
                        <Typography variant="h6" color="primary.main" fontWeight={700}>
                            €{supplier.netPrice}
                        </Typography>
                    </Stack>

                    <Typography variant="caption" color="text.secondary">
                        {supplier.type} • {supplier.unit}
                    </Typography>

                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="caption">
                            ⭐ {supplier.rating}
                        </Typography>
                        <Typography variant="caption" color="success.main">
                            {supplier.commission}% commission
                        </Typography>
                    </Stack>

                    {supplier.notes && (
                        <Typography variant="caption" color="text.secondary" sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}>
                            {supplier.notes}
                        </Typography>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    Services & Components
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Build your quotation by adding services and components with smart pricing
                </Typography>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={4}>
                    {/* Services List */}
                    <Grid xs={12} lg={8}>
                        <Stack spacing={3}>
                            {/* Quick Actions */}
                            <Paper sx={{ p: 3, backgroundColor: alpha(theme.palette.primary.main, 0.02) }}>
                                <Stack direction="row" spacing={2} flexWrap="wrap">
                                    <Button
                                        variant="outlined"
                                        startIcon={<AutoAwesomeOutlined />}
                                        onClick={() => setTemplatesOpen(true)}
                                    >
                                        Use Template
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        startIcon={<StarOutlined />}
                                        onClick={() => setSuppliersOpen(true)}
                                    >
                                        Add from Suppliers
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        startIcon={<SpeedOutlined />}
                                        onClick={() => {
                                            // Add bulk services logic
                                            console.log('Bulk add services');
                                        }}
                                    >
                                        Bulk Add
                                    </Button>
                                </Stack>
                            </Paper>

                            {/* Services */}
                            {fields.map((field, index) => {
                                const service = watchedServices[index];
                                const isExpanded = expandedServices.includes(field.id);
                                const CategoryIcon = categoryConfig[service?.category || 'other'].icon;
                                const margin = service?.totalCost > 0 ? ((service?.markupAmount || 0) / service.totalCost) * 100 : 0;

                                return (
                                    <ServiceCard key={field.id}>
                                        <CardContent>
                                            <Stack spacing={3}>
                                                {/* Service Header */}
                                                <Stack direction="row" alignItems="center" spacing={2}>
                                                    <CategoryChip
                                                        category={service?.category || 'other'}
                                                        icon={<CategoryIcon />}
                                                        label={service?.category || 'other'}
                                                        size="small"
                                                    />

                                                    <Box flex={1}>
                                                        <Controller
                                                            name={`services.${index}.description`}
                                                            control={control}
                                                            rules={{ required: 'Description is required' }}
                                                            render={({ field }) => (
                                                                <TextField
                                                                    {...field}
                                                                    fullWidth
                                                                    placeholder="Service description..."
                                                                    variant="standard"
                                                                    error={!!errors.services?.[index]?.description}
                                                                    helperText={errors.services?.[index]?.description?.message}
                                                                />
                                                            )}
                                                        />
                                                    </Box>

                                                    <MarginIndicator margin={margin}>
                                                        <TrendingUpOutlined sx={{ fontSize: 16, mr: 0.5 }} />
                                                        {margin.toFixed(1)}%
                                                    </MarginIndicator>

                                                    <Typography variant="h6" color="primary.main" fontWeight={700}>
                                                        €{(service?.finalPrice || 0).toLocaleString()}
                                                    </Typography>

                                                    <IconButton
                                                        size="small"
                                                        onClick={() => toggleServiceExpansion(field.id)}
                                                    >
                                                        {isExpanded ? <ExpandLessOutlined /> : <ExpandMoreOutlined />}
                                                    </IconButton>

                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => remove(index)}
                                                    >
                                                        <DeleteOutlined />
                                                    </IconButton>
                                                </Stack>

                                                <Collapse in={isExpanded}>
                                                    <Stack spacing={3}>
                                                        <Grid container spacing={2}>
                                                            {/* Category */}
                                                            <Grid xs={12} md={3}>
                                                                <Controller
                                                                    name={`services.${index}.category`}
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <FormControl fullWidth size="small">
                                                                            <InputLabel>Category</InputLabel>
                                                                            <Select
                                                                                {...field}
                                                                                label="Category"
                                                                                onChange={(e) => {
                                                                                    field.onChange(e.target.value);
                                                                                    const newUnits = categoryConfig[e.target.value as keyof typeof categoryConfig].units;
                                                                                    setValue(`services.${index}.unit`, newUnits[0]);
                                                                                }}
                                                                            >
                                                                                {Object.entries(categoryConfig).map(([key, config]) => (
                                                                                    <MenuItem key={key} value={key}>
                                                                                        <Stack direction="row" alignItems="center" spacing={1}>
                                                                                            <config.icon sx={{ fontSize: 18, color: config.color }} />
                                                                                            <span>{key}</span>
                                                                                        </Stack>
                                                                                    </MenuItem>
                                                                                ))}
                                                                            </Select>
                                                                        </FormControl>
                                                                    )}
                                                                />
                                                            </Grid>

                                                            {/* Quantity */}
                                                            <Grid xs={6} md={2}>
                                                                <Controller
                                                                    name={`services.${index}.quantity`}
                                                                    control={control}
                                                                    rules={{ required: true, min: 0.1 }}
                                                                    render={({ field }) => (
                                                                        <TextField
                                                                            {...field}
                                                                            fullWidth
                                                                            type="number"
                                                                            label="Quantity"
                                                                            size="small"
                                                                            inputProps={{ min: 0.1, step: 0.1 }}
                                                                            onChange={(e) => {
                                                                                field.onChange(parseFloat(e.target.value) || 0);
                                                                                setTimeout(() => calculateServiceTotals(index), 100);
                                                                            }}
                                                                        />
                                                                    )}
                                                                />
                                                            </Grid>

                                                            {/* Unit */}
                                                            <Grid xs={6} md={2}>
                                                                <Controller
                                                                    name={`services.${index}.unit`}
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <FormControl fullWidth size="small">
                                                                            <InputLabel>Unit</InputLabel>
                                                                            <Select {...field} label="Unit">
                                                                                {categoryConfig[service?.category || 'other'].units.map((unit) => (
                                                                                    <MenuItem key={unit} value={unit}>
                                                                                        {unit}
                                                                                    </MenuItem>
                                                                                ))}
                                                                            </Select>
                                                                        </FormControl>
                                                                    )}
                                                                />
                                                            </Grid>

                                                            {/* Unit Cost */}
                                                            <Grid xs={6} md={2}>
                                                                <Controller
                                                                    name={`services.${index}.unitCost`}
                                                                    control={control}
                                                                    rules={{ required: true, min: 0 }}
                                                                    render={({ field }) => (
                                                                        <TextField
                                                                            {...field}
                                                                            fullWidth
                                                                            type="number"
                                                                            label="Unit Cost"
                                                                            size="small"
                                                                            InputProps={{
                                                                                startAdornment: <InputAdornment position="start">€</InputAdornment>,
                                                                                inputProps: { min: 0, step: 0.01 }
                                                                            }}
                                                                            onChange={(e) => {
                                                                                field.onChange(parseFloat(e.target.value) || 0);
                                                                                setTimeout(() => calculateServiceTotals(index), 100);
                                                                            }}
                                                                        />
                                                                    )}
                                                                />
                                                            </Grid>

                                                            {/* Markup */}
                                                            <Grid xs={6} md={3}>
                                                                <Controller
                                                                    name={`services.${index}.markup`}
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <TextField
                                                                            {...field}
                                                                            fullWidth
                                                                            type="number"
                                                                            label="Markup"
                                                                            size="small"
                                                                            InputProps={{
                                                                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                                                                inputProps: { min: 0, step: 0.1 }
                                                                            }}
                                                                            onChange={(e) => {
                                                                                field.onChange(parseFloat(e.target.value) || 0);
                                                                                setTimeout(() => calculateServiceTotals(index), 100);
                                                                            }}
                                                                        />
                                                                    )}
                                                                />
                                                            </Grid>
                                                        </Grid>

                                                        {/* Cost Breakdown */}
                                                        <Box sx={{
                                                            p: 2,
                                                            backgroundColor: alpha(theme.palette.background.default, 0.8),
                                                            borderRadius: 1,
                                                        }}>
                                                            <Grid container spacing={2}>
                                                                <Grid xs={3}>
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        Net Cost
                                                                    </Typography>
                                                                    <Typography variant="subtitle2" fontWeight={600}>
                                                                        €{(service?.totalCost || 0).toLocaleString()}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid xs={3}>
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        Markup
                                                                    </Typography>
                                                                    <Typography variant="subtitle2" fontWeight={600} color="success.main">
                                                                        €{(service?.markupAmount || 0).toLocaleString()}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid xs={3}>
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        Margin
                                                                    </Typography>
                                                                    <Typography variant="subtitle2" fontWeight={600}>
                                                                        {margin.toFixed(1)}%
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid xs={3}>
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        Final Price
                                                                    </Typography>
                                                                    <Typography variant="subtitle2" fontWeight={700} color="primary.main">
                                                                        €{(service?.finalPrice || 0).toLocaleString()}
                                                                    </Typography>
                                                                </Grid>
                                                            </Grid>
                                                        </Box>

                                                        {/* Supplier & Notes */}
                                                        <Grid container spacing={2}>
                                                            <Grid xs={12} md={6}>
                                                                <Controller
                                                                    name={`services.${index}.supplier`}
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <TextField
                                                                            {...field}
                                                                            fullWidth
                                                                            label="Supplier (Optional)"
                                                                            size="small"
                                                                            placeholder="e.g., Hotel Roma Palace"
                                                                        />
                                                                    )}
                                                                />
                                                            </Grid>
                                                            <Grid xs={12} md={6}>
                                                                <Controller
                                                                    name={`services.${index}.notes`}
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <TextField
                                                                            {...field}
                                                                            fullWidth
                                                                            label="Notes (Optional)"
                                                                            size="small"
                                                                            placeholder="Special requirements, conditions..."
                                                                        />
                                                                    )}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    </Stack>
                                                </Collapse>
                                            </Stack>
                                        </CardContent>
                                    </ServiceCard>
                                );
                            })}

                            {/* Add Service Button */}
                            <Button
                                variant="dashed"
                                startIcon={<AddOutlined />}
                                onClick={addService}
                                sx={{
                                    py: 2,
                                    border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                                    '&:hover': {
                                        borderColor: theme.palette.primary.main,
                                        backgroundColor: alpha(theme.palette.primary.main, 0.04),
                                    }
                                }}
                            >
                                Add New Service
                            </Button>
                        </Stack>
                    </Grid>

                    {/* Summary Panel */}
                    <Grid xs={12} lg={4}>
                        <Card sx={{ position: 'sticky', top: 24 }}>
                            <CardContent>
                                <Typography variant="h6" fontWeight={700} gutterBottom>
                                    <CalculateOutlined sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    Pricing Summary
                                </Typography>

                                <Divider sx={{ my: 2 }} />

                                <Stack spacing={2}>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="body2" color="text.secondary">
                                            Total Net Cost
                                        </Typography>
                                        <Typography variant="body2" fontWeight={600}>
                                            €{totals.totalNetCost.toLocaleString()}
                                        </Typography>
                                    </Stack>

                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="body2" color="text.secondary">
                                            Total Markup
                                        </Typography>
                                        <Typography variant="body2" fontWeight={600} color="success.main">
                                            €{totals.totalMarkupAmount.toLocaleString()}
                                        </Typography>
                                    </Stack>

                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="body2" color="text.secondary">
                                            Average Margin
                                        </Typography>
                                        <MarginIndicator margin={totals.averageMargin}>
                                            {totals.averageMargin.toFixed(1)}%
                                        </MarginIndicator>
                                    </Stack>

                                    <Divider />

                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="h6" fontWeight={700}>
                                            Total Quote Value
                                        </Typography>
                                        <Typography variant="h6" fontWeight={700} color="primary.main">
                                            €{totals.totalGrossPrice.toLocaleString()}
                                        </Typography>
                                    </Stack>

                                    {/* Margin Analysis */}
                                    <Box sx={{ mt: 3, p: 2, backgroundColor: alpha(theme.palette.background.default, 0.8), borderRadius: 1 }}>
                                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                            Margin Analysis
                                        </Typography>

                                        {totals.averageMargin < 10 && (
                                            <Alert severity="warning" sx={{ mb: 1 }}>
                                                Low margin detected
                                            </Alert>
                                        )}

                                        {totals.averageMargin >= 20 && (
                                            <Alert severity="success" sx={{ mb: 1 }}>
                                                Healthy margin achieved
                                            </Alert>
                                        )}

                                        <Typography variant="caption" color="text.secondary">
                                            Recommended margin: 15-25%
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Submit Button */}
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={fields.length === 0}
                        sx={{ minWidth: 200 }}
                    >
                        Continue to Pricing →
                    </Button>
                </Box>
            </form>

            {/* Templates Dialog */}
            <Dialog
                open={templatesOpen}
                onClose={() => setTemplatesOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <AutoAwesomeOutlined sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Service Templates
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        {serviceTemplates.map((template) => (
                            <Grid xs={12} md={6} key={template.id}>
                                <Card
                                    sx={{
                                        cursor: 'pointer',
                                        border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                                        '&:hover': {
                                            borderColor: theme.palette.primary.main,
                                            boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.12)}`,
                                        }
                                    }}
                                    onClick={() => addFromTemplate(template)}
                                >
                                    <CardContent>
                                        <Stack spacing={2}>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <Typography variant="h5">{template.icon}</Typography>
                                                <Typography variant="subtitle1" fontWeight={600}>
                                                    {template.name}
                                                </Typography>
                                            </Stack>

                                            <Typography variant="body2" color="text.secondary">
                                                {template.description}
                                            </Typography>

                                            <Typography variant="caption" color="primary.main">
                                                {template.services.length} services included
                                            </Typography>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setTemplatesOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Suppliers Dialog */}
            <Dialog
                open={suppliersOpen}
                onClose={() => setSuppliersOpen(false)}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle>
                    <StarOutlined sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Supplier Database
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={3}>
                        {Object.entries(supplierDatabase).map(([category, suppliers]) => (
                            <Grid xs={12} key={category}>
                                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ textTransform: 'capitalize' }}>
                                    {category}
                                </Typography>
                                <Grid container spacing={2}>
                                    {suppliers.map((supplier) => (
                                        <Grid xs={12} md={6} lg={4} key={supplier.id}>
                                            {renderSupplierCard(supplier)}
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSuppliersOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ServicesComponents;