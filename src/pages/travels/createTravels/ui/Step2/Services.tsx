/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback, useMemo } from 'react';
import { Controller, type Control, type UseFieldArrayRemove } from 'react-hook-form';
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
    Button,
    IconButton,
    Alert,
    Divider,
    InputAdornment,
    alpha,
    Paper,
    Collapse,
    Grid,
} from '@mui/material';
import {
    AddOutlined,
    DeleteOutlined,
    ExpandMoreOutlined,
    ExpandLessOutlined,
    TrendingUpOutlined,
    CalculateOutlined,
    StarOutlined,
    AutoAwesomeOutlined,
    SpeedOutlined,
} from '@mui/icons-material';
import { ServiceCard, CategoryChip, MarginIndicator } from '../Primitives';
import type { ServiceItem, ServiceTemplate } from '../../interfaces/ServiceItem';
import TemplateModal from './TemplateModal';
import SupplierModal from './SupplierModal';
import type { Theme } from '@mui/system';
import type { Supplier } from '../../interfaces/Supplier';
import { categoryConfig } from '../../interfaces/constants';

// Mock data for suppliers
const supplierDataBase: Supplier[] = [
    {
        id: "1",
        name: "Supplier One",
        category: "accommodation",
        contact: {
            phone: "123-456-7890",
            email: "supplier1@example.com",
            website: "https://supplier1.com",
        },
        location: "Location One",
        rating: 4.5,
        commission: 10,
        paymentTerms: "Net 30",
        notes: "Preferred supplier for accommodations.",
        isPreferred: true,
    },
    {
        id: "2",
        name: "Supplier Two",
        category: "accommodation",
        contact: {
            phone: "123-456-7890",
            email: "supplier2@example.com",
            website: "https://supplier2.com",
        },
        location: "Location Two",
        rating: 4.5,
        commission: 10,
        paymentTerms: "Net 30",
        notes: "Preferred supplier for accommodations.",
        isPreferred: true,

    },
]

// Service templates
const serviceTemplates: ServiceTemplate[] = [
    {
        id: 'rome_3day_school',
        name: '3-Day Rome School Package',
        description: 'Complete package for educational groups',
        icon: '🎓',
        services: [
            {
                name: 'Hotel accommodation - twin rooms',
                isIncluded: true,
                id: '1',
                category: 'accommodation' as const,
                description: 'Hotel accommodation - twin rooms',
                quantity: 6,
                unit: 'room-nights',
                unitPrice: 85,
                totalPrice: 510,
                markup: 20,
                finalPrice: 612,
            },
            {
                id: '2',
                name: 'Airport transfers + city transport',
                isIncluded: true,
                category: 'transport' as const,
                description: 'Airport transfers + city transport',
                quantity: 3,
                unit: 'days',
                unitPrice: 450,
                totalPrice: 1350,
                markup: 15,
                finalPrice: 1552.5,
            },
            {
                id: '3',
                name: 'Licensed guide for historical sites',
                isIncluded: true,
                category: 'guides' as const,
                description: 'Licensed guide for historical sites',
                quantity: 2,
                unit: 'half-days',
                unitPrice: 180,
                totalPrice: 360,
                markup: 25,
                finalPrice: 450,
            },
            {
                id: '4',
                name: 'Traditional Italian lunches',
                isIncluded: true,
                category: 'meals' as const,
                description: 'Traditional Italian lunches',
                quantity: 30,
                unit: 'persons',
                unitPrice: 18,
                totalPrice: 540,
                markup: 15,
                finalPrice: 621,
            },
        ]
    }
];

interface ServicesComponentProps {
    theme: Theme;
    supplierModalOpen: boolean;
    templateModalOpen: boolean;
    setOpenModalType: (type: 'templates' | 'suppliers') => void;
    addFromSupplier: (supplier: Supplier) => void;
    control: Control,
    watchedServices: ServiceItem[];
    addService: () => void;
    addFromTemplate: (template: { services: ServiceItem[] }) => void;
    fields: Record<"id", string>[];
    remove: UseFieldArrayRemove;
    calculateServiceTotals: (index: number) => void;
    setValue: any;
    errors?: any;



}

const ServicesComponents: React.FC<ServicesComponentProps> = ({ theme, supplierModalOpen, templateModalOpen, setOpenModalType, addFromSupplier, control, watchedServices, addService, addFromTemplate, fields, remove, calculateServiceTotals, setValue, errors }) => {

    const [expandedServices, setExpandedServices] = useState<string[]>([]);

    // Calculate totals
    const totals = useMemo(() => {
        const totalNetCost = watchedServices.reduce((sum, service) => sum + (service.totalPrice || 0), 0);
        const totalMarkupAmount = watchedServices.reduce((sum, service) => sum + (service.markup || 0), 0);
        const totalGrossPrice = totalNetCost + totalMarkupAmount;
        const averageMargin = totalNetCost > 0 ? (totalMarkupAmount / totalNetCost) * 100 : 0;

        return {
            totalNetCost,
            totalMarkupAmount,
            totalGrossPrice,
            averageMargin,
        };
    }, [watchedServices]);

    const toggleServiceExpansion = useCallback((serviceId: string) => {
        setExpandedServices(prev =>
            prev.includes(serviceId)
                ? prev.filter(id => id !== serviceId)
                : [...prev, serviceId]
        );
    }, []);

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
                                    onClick={() => setOpenModalType("templates")}
                                >
                                    Use Template
                                </Button>

                                <Button
                                    variant="outlined"
                                    startIcon={<StarOutlined />}
                                    onClick={() => setOpenModalType("suppliers")}
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
                            const margin = service?.totalPrice > 0 ? ((service?.markup || 0) / service.totalPrice) * 100 : 0;

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
                                                                    €{(service?.totalPrice || 0).toLocaleString()}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid size={{ xs: 3 }}>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    Markup
                                                                </Typography>
                                                                <Typography variant="subtitle2" fontWeight={600} color="success.main">
                                                                    €{(service?.markup || 0).toLocaleString()}
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

            {/* Templates Dialog */}
            <TemplateModal
                templatesOpen={templateModalOpen}
                setTemplatesOpen={() => setOpenModalType("templates")}
                serviceTemplates={serviceTemplates}
                addFromTemplate={addFromTemplate}
                theme={theme}
            />

            {/* Suppliers Dialog */}
            <SupplierModal
                suppliersOpen={supplierModalOpen}
                setSuppliersOpen={() => setOpenModalType("suppliers")}
                supplierDatabase={supplierDataBase}
                addFromSupplier={addFromSupplier}
                theme={theme}
            />
        </Box>
    );
};

export default ServicesComponents;

