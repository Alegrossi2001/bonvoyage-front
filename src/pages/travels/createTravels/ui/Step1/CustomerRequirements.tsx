/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from 'react';
import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import {
    Box,
    Typography,
    TextField,
    Autocomplete,
    Card,
    CardContent,
    Stack,
    Chip,
    Alert,
    InputAdornment,
    alpha,
    Grid,
} from '@mui/material';
import {
    PersonOutlined,
    BusinessOutlined,
    FlightTakeoffOutlined,
    LocationOnOutlined,
    CalendarTodayOutlined,
    GroupOutlined,
    InfoOutlined,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { FormCard } from '../Primitives';
import CustomerDropdown from './CustomerDropdown';
import type { Theme } from '@mui/system';
import type { Customer } from '../../interfaces/Customer';
import type { QuotationStepData } from '../../interfaces/QuotationStepData';
import renderClientOption from './RenderClientOption';

// Mock data - replace with API calls
const mockClients = [
    {
        id: '1',
        name: 'Sacred Heart College',
        type: 'School',
        contactPerson: 'Sister Mary Catherine',
        email: 'admissions@sacredheart.edu',
        phone: '+44 20 7946 0958',
        isFavorite: true,
        previousTrips: 12,
        lastTrip: '2024-03-15'
    },
    {
        id: '2',
        name: 'St. Patrick\'s Pilgrimage Group',
        type: 'Religious',
        contactPerson: 'Father Michael O\'Brien',
        email: 'pilgrimages@stpatricks.ie',
        phone: '+353 1 234 5678',
        isFavorite: true,
        previousTrips: 8,
        lastTrip: '2024-02-20'
    },
    {
        id: '3',
        name: 'Thompson Corporate Events',
        type: 'Corporate',
        contactPerson: 'Sarah Thompson',
        email: 'events@thompsoncorp.com',
        phone: '+44 161 234 5678',
        isFavorite: false,
        previousTrips: 3,
        lastTrip: '2023-11-10'
    },
    {
        id: '4',
        name: 'Westfield Grammar School',
        type: 'School',
        contactPerson: 'Mr. James Wilson',
        email: 'trips@westfieldgrammar.uk',
        phone: '+44 151 987 6543',
        isFavorite: true,
        previousTrips: 15,
        lastTrip: '2024-01-28'
    },
];

const tripTypes = [
    { value: 'school_group', label: 'School Group', icon: '🎓', description: 'Educational trips for students' },
    { value: 'pilgrimage', label: 'Pilgrimage', icon: '⛪', description: 'Religious/spiritual journeys' },
    { value: 'corporate', label: 'Corporate', icon: '💼', description: 'Business travel and events' },
    { value: 'fit', label: 'FIT (Free Independent Travel)', icon: '🧳', description: 'Individual/family leisure travel' },
    { value: 'cultural', label: 'Cultural Tour', icon: '🏛️', description: 'Art, history, and cultural experiences' },
    { value: 'adventure', label: 'Adventure Travel', icon: '🏔️', description: 'Active and outdoor experiences' },
];

const popularDestinations = [
    'Rome, Italy',
    'Paris, France',
    'Barcelona, Spain',
    'London, UK',
    'Dublin, Ireland',
    'Amsterdam, Netherlands',
    'Prague, Czech Republic',
    'Vienna, Austria',
    'Florence, Italy',
    'Venice, Italy',
    'Madrid, Spain',
    'Brussels, Belgium',
    'Lourdes, France',
    'Fatima, Portugal',
    'Santiago de Compostela, Spain',
];

interface CustomerRequirementsProps {
    theme: Theme;
    onSubmit: () => void;
    watchedValues: any;
    handleClientSelect: (client: Customer) => void;
    control: Control<Partial<QuotationStepData>>
    errors: FieldErrors<Partial<QuotationStepData>>;
}

const CustomerRequirements: React.FC<CustomerRequirementsProps> = ({ theme, onSubmit, watchedValues, handleClientSelect, control, errors }) => {
    const [clientSearch, setClientSearch] = useState('');

    const selectedClient = mockClients.find(c => c.name === watchedValues.clientName);

    // Calculate trip duration
    const tripDuration = useMemo(() => {
        if (watchedValues.dateFrom && watchedValues.dateTo) {
            return dayjs(watchedValues.dateTo).diff(dayjs(watchedValues.dateFrom), 'day') + 1;
        }
        return 0;
    }, [watchedValues.dateFrom, watchedValues.dateTo]);

    // Filter clients based on search
    const filteredClients = useMemo(() => {
        if (!clientSearch) return mockClients;
        return mockClients.filter(client =>
            client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
            client.contactPerson.toLowerCase().includes(clientSearch.toLowerCase())
        );
    }, [clientSearch]);

    const renderClientOptions = renderClientOption;


    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ maxWidth: 1000, mx: 'auto', p: 4 }}>
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Client & Trip Details
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Capture essential information about your client and their travel requirements
                    </Typography>
                </Box>

                <form onSubmit={onSubmit}>
                    <Stack spacing={4}>
                        {/* Client Information */}
                        <FormCard>
                            <CardContent>
                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                                    <BusinessOutlined color="primary" />
                                    <Typography variant="h6" fontWeight={600}>
                                        Client Information
                                    </Typography>
                                </Stack>

                                <Grid container spacing={3}>
                                    <CustomerDropdown
                                        control={control}
                                        errors={errors}
                                        filteredClients={filteredClients}
                                        setClientSearch={setClientSearch}
                                        handleClientSelect={handleClientSelect}
                                        renderClientOption={renderClientOptions}
                                    />
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <Controller
                                            name="step1.customer.name"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    label="Contact Person"
                                                    placeholder="e.g., Sister Mary Catherine"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <PersonOutlined color="action" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    {/* Client Details Display */}
                                    {selectedClient && (
                                        <Grid size={{ xs: 12 }}>
                                            <Alert
                                                severity="info"
                                                icon={<InfoOutlined />}
                                                sx={{ backgroundColor: alpha(theme.palette.info.main, 0.05) }}
                                            >
                                                <Stack spacing={1}>
                                                    <Typography variant="subtitle2">
                                                        Returning Client • {selectedClient.previousTrips} previous trips
                                                    </Typography>
                                                    <Stack direction="row" spacing={2}>
                                                        <Typography variant="caption">
                                                            📧 {selectedClient.email}
                                                        </Typography>
                                                        <Typography variant="caption">
                                                            📞 {selectedClient.phone}
                                                        </Typography>
                                                        <Typography variant="caption">
                                                            🗓️ Last trip: {dayjs(selectedClient.lastTrip).format('MMM DD, YYYY')}
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                            </Alert>
                                        </Grid>
                                    )}
                                </Grid>
                            </CardContent>
                        </FormCard>

                        {/* Trip Details */}
                        <FormCard>
                            <CardContent>
                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                                    <FlightTakeoffOutlined color="primary" />
                                    <Typography variant="h6" fontWeight={600}>
                                        Trip Details
                                    </Typography>
                                </Stack>

                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12 }}>
                                        <Controller
                                            name="step1.tripDetails.tripName"
                                            control={control}
                                            rules={{ required: 'Trip title is required' }}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    label="Trip Title / Reference"
                                                    placeholder="e.g., Spring 2024 Educational Trip to Rome"
                                                    error={!!errors.step1?.tripDetails?.tripName}
                                                    helperText={errors.step1?.tripDetails?.tripName?.message || 'This helps identify the quote in your system'}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12 }}>
                                        <Controller
                                            name="step1.tripDetails.destinations"
                                            control={control}
                                            rules={{
                                                required: 'At least one destination is required',
                                                validate: (value) => value ? value.length > 0 || 'At least one destination is required' : true,
                                            }}
                                            render={({ field }) => (
                                                <Autocomplete
                                                    {...field}
                                                    multiple
                                                    options={popularDestinations}
                                                    freeSolo
                                                    renderTags={(value, getTagProps) =>
                                                        value.map((option, index) => (
                                                            <Chip
                                                                variant="outlined"
                                                                label={option}
                                                                {...getTagProps({ index })}
                                                                key={index}
                                                            />
                                                        ))
                                                    }
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Destination(s)"
                                                            placeholder="Add destinations..."
                                                            error={!!errors.step1?.tripDetails?.destinations}
                                                            helperText={errors.step1?.tripDetails?.destinations?.message || 'Add multiple destinations for multi-city trips'}
                                                            InputProps={{
                                                                ...params.InputProps,
                                                                startAdornment: (
                                                                    <>
                                                                        <InputAdornment position="start">
                                                                            <LocationOnOutlined color="action" />
                                                                        </InputAdornment>
                                                                        {params.InputProps.startAdornment}
                                                                    </>
                                                                ),
                                                            }}
                                                        />
                                                    )}
                                                    onChange={(_, newValue) => field.onChange(newValue)}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Controller
                                            name="step1.tripDetails.startDate"
                                            control={control}
                                            rules={{ required: 'Start date is required' }}
                                            render={({ field }) => (
                                                <DatePicker
                                                    {...field}
                                                    value={field.value ? dayjs(field.value) : null}
                                                    onChange={(date) => field.onChange(date?.toISOString())}
                                                    label="Date From"
                                                    minDate={dayjs()}
                                                    slotProps={{
                                                        textField: {
                                                            fullWidth: true,
                                                            error: !!errors.step1?.tripDetails?.startDate,
                                                            helperText: errors.step1?.tripDetails?.startDate?.message,
                                                            InputProps: {
                                                                startAdornment: (
                                                                    <InputAdornment position="start">
                                                                        <CalendarTodayOutlined color="action" />
                                                                    </InputAdornment>
                                                                ),
                                                            },
                                                        }
                                                    }}
                                                />
                                            )}
                                        />
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <Controller
                                                name="step1.tripDetails.endDate"
                                                control={control}
                                                rules={{
                                                    required: 'End date is required',
                                                    validate: (value) => {
                                                        if (watchedValues.dateFrom && value) {
                                                            return dayjs(value).isAfter(dayjs(watchedValues.dateFrom)) || 'End date must be after start date';
                                                        }
                                                        return true;
                                                    }
                                                }}
                                                render={({ field }) => (
                                                    <DatePicker
                                                        {...field}
                                                        value={field.value ? dayjs(field.value) : null}
                                                        onChange={(date) => field.onChange(date?.toISOString())}
                                                        label="Date To"
                                                        minDate={watchedValues.dateFrom ? dayjs(watchedValues.dateFrom).add(1, 'day') : dayjs()}
                                                        slotProps={{
                                                            textField: {
                                                                fullWidth: true,
                                                                error: !!errors.step1?.tripDetails?.endDate,
                                                                helperText: errors.step1?.tripDetails?.endDate?.message || (tripDuration > 0 ? `${tripDuration} day${tripDuration > 1 ? 's' : ''}` : ''),
                                                                InputProps: {
                                                                    startAdornment: (
                                                                        <InputAdornment position="start">
                                                                            <CalendarTodayOutlined color="action" />
                                                                        </InputAdornment>
                                                                    ),
                                                                },
                                                            }
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>

                                    </Grid>
                                </Grid>
                            </CardContent>
                        </FormCard>

                        {/* Group Information */}
                        <FormCard>
                            <CardContent>
                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                                    <GroupOutlined color="primary" />
                                    <Typography variant="h6" fontWeight={600}>
                                        Group Information
                                    </Typography>
                                </Stack>

                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <Controller
                                            name="step1.tripDetails.participants"
                                            control={control}
                                            rules={{
                                                required: 'Number of travellers is required',
                                                min: { value: 1, message: 'Must be at least 1 traveller' }
                                            }}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    type="number"
                                                    label="Total Number of Travellers"
                                                    error={!!errors.step1?.tripDetails?.participants}
                                                    helperText={errors.step1?.tripDetails?.participants?.message}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <GroupOutlined color="action" />
                                                            </InputAdornment>
                                                        ),
                                                        inputProps: { min: 1 }
                                                    }}
                                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <Controller
                                            name="step1.tripDetails.numberOfGroups"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    type="number"
                                                    label="Number of Groups (Optional)"
                                                    placeholder="e.g., 3"
                                                    helperText="For organized group travel"
                                                    InputProps={{
                                                        inputProps: { min: 1 }
                                                    }}
                                                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <Controller
                                            name="step1.tripDetails.groupSize"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    type="number"
                                                    label="Average Group Size (Optional)"
                                                    placeholder="e.g., 15"
                                                    helperText="People per group"
                                                    InputProps={{
                                                        inputProps: { min: 1 }
                                                    }}
                                                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </FormCard>

                        {/* Trip Type */}
                        <FormCard>
                            <CardContent>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    Trip Type
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    Select the type of trip to help us provide better recommendations
                                </Typography>

                                <Controller
                                    name="step1.tripDetails.tripType"
                                    control={control}
                                    rules={{ required: 'Trip type is required' }}
                                    render={({ field }) => (
                                        <Grid container spacing={2}>
                                            {tripTypes.map((type) => (
                                                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={type.value}>
                                                    <Card
                                                        sx={{
                                                            cursor: 'pointer',
                                                            border: field.value === type.value
                                                                ? `2px solid ${theme.palette.primary.main}`
                                                                : `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                                                            backgroundColor: field.value === type.value
                                                                ? alpha(theme.palette.primary.main, 0.04)
                                                                : 'transparent',
                                                            transition: 'all 0.2s ease-in-out',
                                                            '&:hover': {
                                                                borderColor: theme.palette.primary.main,
                                                                backgroundColor: alpha(theme.palette.primary.main, 0.02),
                                                            }
                                                        }}
                                                        onClick={() => field.onChange(type.value)}
                                                    >
                                                        <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                                            <Typography variant="h4" sx={{ mb: 1 }}>
                                                                {type.icon}
                                                            </Typography>
                                                            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                                                {type.label}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {type.description}
                                                            </Typography>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    )}
                                />
                                {errors.step1?.tripDetails?.tripType && (
                                    <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                                        {errors.step1.tripDetails.tripType.message}
                                    </Typography>
                                )}
                            </CardContent>
                        </FormCard>

                        {/* Special Requirements */}
                        <FormCard>
                            <CardContent>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    Special Requirements (Optional)
                                </Typography>

                                <Controller
                                    name="step1.requirements"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            multiline
                                            rows={4}
                                            placeholder="Any special requirements, dietary restrictions, accessibility needs, or additional notes..."
                                            helperText="This information will help us customize the trip experience"
                                        />
                                    )}
                                />
                            </CardContent>
                        </FormCard>
                    </Stack>
                </form>
            </Box>
        </LocalizationProvider>
    );
};

export default CustomerRequirements;

