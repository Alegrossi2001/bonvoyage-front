import React, { useState, useCallback, useMemo } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import {
    Box,
    Typography,
    TextField,
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
    alpha,
    useTheme,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Collapse,
    Grid,
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
    ExpandMoreOutlined,
    ExpandLessOutlined,
    TrendingUpOutlined,
    CalculateOutlined,
    StarOutlined,
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
            rating: 4.2,
            verified: true,
            services: [{
                id: '1',
                category: 'accommodation' as const,
                description: '4-star Hotel - Central location, breakfast included',
                quantity: 1,
                unit: 'room-nights',
                unitCost: 85,
                totalCost: 85,
                markup: 12,
                markupAmount: 10.2,
                finalPrice: 95.2,
                notes: 'Central location, breakfast included'
            }]
        },
        {
            id: 'acc_002',
            name: 'Hostel San Lorenzo',
            category: 'accommodation',
            rating: 3.8,
            verified: true,
            services: [{
                id: '1',
                category: 'accommodation' as const,
                description: 'Hostel - Budget option, shared facilities',
                quantity: 1,
                unit: 'bed-nights',
                unitCost: 25,
                totalCost: 25,
                markup: 8,
                markupAmount: 2,
                finalPrice: 27,
                notes: 'Budget option, shared facilities'
            }]
        },
    ],
    transport: [
        {
            id: 'trans_001',
            name: 'Roma Coach Services',
            category: 'transport',
            rating: 4.5,
            verified: true,
            services: [{
                id: '1',
                category: 'transport' as const,
                description: '49-seater Coach with AC and WiFi',
                quantity: 1,
                unit: 'days',
                unitCost: 450,
                totalCost: 450,
                markup: 15,
                markupAmount: 67.5,
                finalPrice: 517.5,
                notes: 'Air conditioning, WiFi, professional driver'
            }]
        },
        {
            id: 'trans_002',
            name: 'Airport Transfer Pro',
            category: 'transport',
            rating: 4.3,
            verified: true,
            services: [{
                id: '1',
                category: 'transport' as const,
                description: 'Airport Transfer with meet & greet',
                quantity: 1,
                unit: 'transfers',
                unitCost: 65,
                totalCost: 65,
                markup: 10,
                markupAmount: 6.5,
                finalPrice: 71.5,
                notes: 'Meet & greet service included'
            }]
        },
    ],
    guide: [
        {
            id: 'guide_001',
            name: 'Marco Rossi - Licensed Guide',
            category: 'guide',
            rating: 4.8,
            verified: true,
            services: [{
                id: '1',
                category: 'guide' as const,
                description: 'Vatican & Colosseum Specialist Guide',
                quantity: 1,
                unit: 'half-days',
                unitCost: 180,
                totalCost: 180,
                markup: 20,
                markupAmount: 36,
                finalPrice: 216,
                notes: 'Fluent English, educational groups specialist'
            }]
        },
    ],
    meal: [
        {
            id: 'meal_001',
            name: 'Pizzeria Tradizionale',
            category: 'meal',
            rating: 4.1,
            verified: true,
            services: [{
                id: '1',
                category: 'meal' as const,
                description: 'Traditional Italian Lunch',
                quantity: 1,
                unit: 'persons',
                unitCost: 18,
                totalCost: 18,
                markup: 5,
                markupAmount: 0.9,
                finalPrice: 18.9,
                notes: 'Pizza + drink + gelato, group menus available'
            }]
        },
    ],
    activity: [
        {
            id: 'act_001',
            name: 'Vatican Museums Skip-the-Line',
            category: 'activity',
            rating: 4.6,
            verified: true,
            services: [{
                id: '1',
                category: 'activity' as const,
                description: 'Vatican Museums Entry with Skip-the-Line',
                quantity: 1,
                unit: 'persons',
                unitCost: 22,
                totalCost: 22,
                markup: 10,
                markupAmount: 2.2,
                finalPrice: 24.2,
                notes: 'Audio guide included, group rates available'
            }]
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
                id: '1',
                category: 'accommodation' as const,
                description: 'Hotel accommodation - twin rooms',
                quantity: 6,
                unit: 'room-nights',
                unitCost: 85,
                totalCost: 510,
                markup: 20,
                markupAmount: 102,
                finalPrice: 612,
            },
            {
                id: '2',
                category: 'transport' as const,
                description: 'Airport transfers + city transport',
                quantity: 3,
                unit: 'days',
                unitCost: 450,
                totalCost: 1350,
                markup: 15,
                markupAmount: 202.5,
                finalPrice: 1552.5,
            },
            {
                id: '3',
                category: 'guide' as const,
                description: 'Licensed guide for historical sites',
                quantity: 2,
                unit: 'half-days',
                unitCost: 180,
                totalCost: 360,
                markup: 25,
                markupAmount: 90,
                finalPrice: 450,
            },
            {
                id: '4',
                category: 'meal' as const,
                description: 'Traditional Italian lunches',
                quantity: 30,
                unit: 'persons',
                unitCost: 18,
                totalCost: 540,
                markup: 15,
                markupAmount: 81,
                finalPrice: 621,
            },
            {
                id: '5',
                category: 'activity' as const,
                description: 'Vatican Museums + Colosseum entry',
                quantity: 30,
                unit: 'persons',
                unitCost: 22,
                totalCost: 660,
                markup: 10,
                markupAmount: 66,
                finalPrice: 726,
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
                id: '1',
                category: 'accommodation' as const,
                description: 'Simple hotel/guesthouse accommodation',
                quantity: 4,
                unit: 'room-nights',
                unitCost: 65,
                totalCost: 260,
                markup: 18,
                markupAmount: 46.8,
                finalPrice: 306.8,
            },
            {
                id: '2',
                category: 'transport' as const,
                description: 'Coach transport to religious sites',
                quantity: 2,
                unit: 'days',
                unitCost: 380,
                totalCost: 760,
                markup: 12,
                markupAmount: 91.2,
                finalPrice: 851.2,
            },
            {
                id: '3',
                category: 'guide' as const,
                description: 'Religious sites specialist guide',
                quantity: 3,
                unit: 'half-days',
                unitCost: 160,
                totalCost: 480,
                markup: 20,
                markupAmount: 96,
                finalPrice: 576,
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

const CategoryChip = styled(Chip)<{ category: string }>(({ category }) => {
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

    const addFromTemplate = useCallback((template: { services: ServiceItem[] }) => {
        template.services.forEach((templateService: ServiceItem) => {
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

    const addFromSupplier = useCallback((supplier: { name: string; services: ServiceItem[] }) => {
        const services = supplier.services;
        services.forEach((serviceItem) => {
            const service: ServiceItem = {
                id: Date.now().toString() + Math.random(),
                category: serviceItem.category,
                description: `${supplier.name} - ${serviceItem.description}`,
                supplier: supplier.name,
                quantity: 1,
                unit: serviceItem.unit.split(' ')[1] || 'items',
                unitCost: 100,
                totalCost: serviceItem.totalCost,
                markup: 20,
                markupAmount: serviceItem.totalCost * 0.2,
                finalPrice: serviceItem.totalCost * 1.2,
                notes: serviceItem.notes
            };
            append(service);
        });

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

    const renderSupplierCard = (supplier: { id: string; name: string; category: string; rating: number; verified: boolean; services: ServiceItem[] }) => (
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
                            €{supplier.services.reduce((sum, svc) => sum + svc.totalCost, 0).toLocaleString()}
                        </Typography>
                    </Stack>

                    <Typography variant="caption" color="text.secondary">
                        {supplier.name} • {supplier.category}
                    </Typography>

                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="caption">
                            ⭐ {supplier.rating}
                        </Typography>
                        <Typography variant="caption" color="success.main">
                            {supplier.services[0].markup}% commission
                        </Typography>
                    </Stack>

                    {supplier.rating && (
                        <Typography variant="caption" color="text.secondary" sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}>
                            {supplier.rating}
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
                    <Grid>
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
                                                            <Grid size={{ xs: 12, md: 3 }}>
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
                                                            <Grid size={{ xs: 6, md: 2 }}>
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
                                                            <Grid size={{ xs: 6, md: 2 }}>
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
                                                            <Grid size={{ xs: 6, md: 2 }}>
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
                                                            <Grid size={{ xs: 6, md: 3 }}>
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
                                                                <Grid size={{ xs: 3 }}>
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        Net Cost
                                                                    </Typography>
                                                                    <Typography variant="subtitle2" fontWeight={600}>
                                                                        €{(service?.totalCost || 0).toLocaleString()}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid size={{ xs: 3 }}>
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        Markup
                                                                    </Typography>
                                                                    <Typography variant="subtitle2" fontWeight={600} color="success.main">
                                                                        €{(service?.markupAmount || 0).toLocaleString()}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid size={{ xs: 3 }}>
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        Margin
                                                                    </Typography>
                                                                    <Typography variant="subtitle2" fontWeight={600}>
                                                                        {margin.toFixed(1)}%
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid size={{ xs: 3 }}>
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
                                                            <Grid size={{ xs: 12, md: 6 }}>
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
                                                            <Grid size={{ xs: 12, md: 6 }}>
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
                    <Grid size={{ xs: 12, lg: 4 }}>
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
                            <Grid size={{ xs: 12, md: 6 }} key={template.id}>
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
                            <Grid size={{ xs: 12 }} key={category}>
                                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ textTransform: 'capitalize' }}>
                                    {category}
                                </Typography>
                                <Grid container spacing={2}>
                                    {suppliers.map((supplier) => (
                                        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={supplier.id}>
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

