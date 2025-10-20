import React, { useState, useCallback, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    Box,
    Grid,
    Typography,
    TextField,
    Autocomplete,
    Card,
    CardContent,
    Stack,
    Chip,
    Button,
    IconButton,
    Alert,
    InputAdornment,
    alpha,
    useTheme,
} from '@mui/material';
import {
    PersonOutlined,
    BusinessOutlined,
    FlightTakeoffOutlined,
    LocationOnOutlined,
    CalendarTodayOutlined,
    GroupOutlined,
    StarOutlined,
    StarBorderOutlined,
    InfoOutlined,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { styled } from '@mui/material/styles';
import dayjs, { Dayjs } from 'dayjs';

// Form data interface
interface CustomerRequirementsForm {
    clientName: string;
    contactPerson: string;
    tripTitle: string;
    destinations: string[];
    dateFrom: Dayjs | null;
    dateTo: Dayjs | null;
    numberOfTravellers: number;
    numberOfGroups?: number;
    groupSize?: number;
    tripType: string;
    specialRequirements?: string;
}

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

const FormCard = styled(Card)(({ theme }) => ({
    border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
    borderRadius: theme.spacing(2),
    boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.04)}`,

    '&:hover': {
        boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.08)}`,
    },
}));

const CustomerRequirements: React.FC = () => {
    const theme = useTheme();
    const [clientSearch, setClientSearch] = useState('');
    const [favoriteClients, setFavoriteClients] = useState<string[]>(
        mockClients.filter(c => c.isFavorite).map(c => c.id)
    );

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isValid }
    } = useForm<CustomerRequirementsForm>({
        defaultValues: {
            clientName: '',
            contactPerson: '',
            tripTitle: '',
            destinations: [],
            dateFrom: null,
            dateTo: null,
            numberOfTravellers: 1,
            numberOfGroups: undefined,
            groupSize: undefined,
            tripType: '',
            specialRequirements: '',
        },
        mode: 'onChange'
    });

    const watchedValues = watch();
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

    const handleClientSelect = useCallback((client: any) => {
        if (client) {
            setValue('clientName', client.name);
            setValue('contactPerson', client.contactPerson);

            // Auto-suggest trip title based on client type and current date
            const month = dayjs().format('MMMM');
            const year = dayjs().year();
            let suggestedTitle = '';

            switch (client.type) {
                case 'School':
                    suggestedTitle = `${month} ${year} Educational Trip`;
                    break;
                case 'Religious':
                    suggestedTitle = `${month} ${year} Pilgrimage`;
                    break;
                case 'Corporate':
                    suggestedTitle = `${month} ${year} Corporate Event`;
                    break;
                default:
                    suggestedTitle = `${month} ${year} Trip`;
            }

            if (!watchedValues.tripTitle) {
                setValue('tripTitle', suggestedTitle);
            }
        }
    }, [setValue, watchedValues.tripTitle]);

    const toggleFavoriteClient = useCallback((clientId: string) => {
        setFavoriteClients(prev =>
            prev.includes(clientId)
                ? prev.filter(id => id !== clientId)
                : [...prev, clientId]
        );
    }, []);

    const onSubmit = (data: CustomerRequirementsForm) => {
        console.log('Form submitted:', data);
        // Handle form submission - pass to parent component or API
    };

    const renderClientOption = (props: any, option: any) => (
        <Box component="li" {...props}>
            <Stack direction="row" alignItems="center" spacing={2} width="100%">
                <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                        {option.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {option.contactPerson} • {option.previousTrips} previous trips
                    </Typography>
                </Box>
                <Box sx={{ ml: 'auto' }}>
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleFavoriteClient(option.id);
                        }}
                    >
                        {favoriteClients.includes(option.id) ? (
                            <StarOutlined color="warning" fontSize="small" />
                        ) : (
                            <StarBorderOutlined fontSize="small" />
                        )}
                    </IconButton>
                </Box>
            </Stack>
        </Box>
    );

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

                <form onSubmit={handleSubmit(onSubmit)}>
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
                                    <Grid xs={12} md={8}>
                                        <Controller
                                            name="clientName"
                                            control={control}
                                            rules={{ required: 'Client name is required' }}
                                            render={({ field }) => (
                                                <Autocomplete
                                                    {...field}
                                                    options={filteredClients}
                                                    getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
                                                    renderOption={renderClientOption}
                                                    freeSolo
                                                    filterOptions={(options, { inputValue }) =>
                                                        options.filter(option =>
                                                            option.name.toLowerCase().includes(inputValue.toLowerCase())
                                                        )
                                                    }
                                                    onInputChange={(_, value) => setClientSearch(value)}
                                                    onChange={(_, value) => {
                                                        if (typeof value === 'object' && value !== null) {
                                                            handleClientSelect(value);
                                                        } else {
                                                            field.onChange(value);
                                                        }
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Client/Agency Name"
                                                            placeholder="Start typing to search existing clients..."
                                                            error={!!errors.clientName}
                                                            helperText={errors.clientName?.message}
                                                            InputProps={{
                                                                ...params.InputProps,
                                                                startAdornment: (
                                                                    <InputAdornment position="start">
                                                                        <BusinessOutlined color="action" />
                                                                    </InputAdornment>
                                                                ),
                                                            }}
                                                        />
                                                    )}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid xs={12} md={4}>
                                        <Controller
                                            name="contactPerson"
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
                                        <Grid xs={12}>
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
                                    <Grid xs={12}>
                                        <Controller
                                            name="tripTitle"
                                            control={control}
                                            rules={{ required: 'Trip title is required' }}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    label="Trip Title / Reference"
                                                    placeholder="e.g., Spring 2024 Educational Trip to Rome"
                                                    error={!!errors.tripTitle}
                                                    helperText={errors.tripTitle?.message || 'This helps identify the quote in your system'}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid xs={12}>
                                        <Controller
                                            name="destinations"
                                            control={control}
                                            rules={{
                                                required: 'At least one destination is required',
                                                validate: (value) => value.length > 0 || 'At least one destination is required'
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
                                                            error={!!errors.destinations}
                                                            helperText={errors.destinations?.message || 'Add multiple destinations for multi-city trips'}
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

                                    <Grid xs={12} md={6}>
                                        <Controller
                                            name="dateFrom"
                                            control={control}
                                            rules={{ required: 'Start date is required' }}
                                            render={({ field }) => (
                                                <DatePicker
                                                    {...field}
                                                    label="Date From"
                                                    minDate={dayjs()}
                                                    slotProps={{
                                                        textField: {
                                                            fullWidth: true,
                                                            error: !!errors.dateFrom,
                                                            helperText: errors.dateFrom?.message,
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

                                    <Grid xs={12} md={6}>
                                        <Controller
                                            name="dateTo"
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
                                                    label="Date To"
                                                    minDate={watchedValues.dateFrom ? dayjs(watchedValues.dateFrom).add(1, 'day') : dayjs()}
                                                    slotProps={{
                                                        textField: {
                                                            fullWidth: true,
                                                            error: !!errors.dateTo,
                                                            helperText: errors.dateTo?.message || (tripDuration > 0 ? `${tripDuration} day${tripDuration > 1 ? 's' : ''}` : ''),
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
                                    <Grid xs={12} md={4}>
                                        <Controller
                                            name="numberOfTravellers"
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
                                                    error={!!errors.numberOfTravellers}
                                                    helperText={errors.numberOfTravellers?.message}
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

                                    <Grid xs={12} md={4}>
                                        <Controller
                                            name="numberOfGroups"
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

                                    <Grid xs={12} md={4}>
                                        <Controller
                                            name="groupSize"
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
                                    name="tripType"
                                    control={control}
                                    rules={{ required: 'Trip type is required' }}
                                    render={({ field }) => (
                                        <Grid container spacing={2}>
                                            {tripTypes.map((type) => (
                                                <Grid xs={12} sm={6} md={4} key={type.value}>
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
                                {errors.tripType && (
                                    <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                                        {errors.tripType.message}
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
                                    name="specialRequirements"
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

                        {/* Submit Button */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                {isValid ? '✅ All required fields completed' : '⚠️ Please complete all required fields'}
                            </Typography>

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={!isValid}
                                sx={{ minWidth: 200 }}
                            >
                                Continue to Itinerary →
                            </Button>
                        </Box>
                    </Stack>
                </form>
            </Box>
        </LocalizationProvider>
    );
};

export default CustomerRequirements;