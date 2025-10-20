import React, { useState, useCallback, useMemo } from 'react';
import {
    Box,
    Typography,
    TextField,
    InputAdornment,
    Divider,
    Alert,
    Skeleton,
    useTheme,
    Grid
} from '@mui/material';
import {
    SearchOutlined,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { mockPreviousQuotes } from '../../../../../DEMO/SampleQuotationTemplate';
import type { PreviousQuotation } from '../../interfaces/Quotation';
import QuoteStartCard from './QuoteStartCard';
import PrevQuotationCard from './PrevQuotationCard';
import { QuotationStatuses } from '../../../../../interfaces/Values/Plans';

interface ChooseTemplateProps {
    onNewTrip: () => void;
    onCloneQuote: (quote: PreviousQuotation) => void;
    loading?: boolean;
}

const ChooseTemplate: React.FC<ChooseTemplateProps> = ({
    onNewTrip,
    onCloneQuote,
    loading = false,
}) => {
    const theme = useTheme();
    const [selectedOption, setSelectedOption] = useState<'new' | 'clone' | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState<dayjs.Dayjs | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [quotesLoading, setQuotesLoading] = useState(false);

    const filteredQuotes = useMemo(() => {
        let filtered = mockPreviousQuotes;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(quote =>
                quote.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                quote.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                quote.destinations.some(dest => dest.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Date filter
        if (dateFilter) {
            filtered = filtered.filter(quote =>
                dayjs(quote.createdAt).isAfter(dateFilter.startOf('month')) &&
                dayjs(quote.createdAt).isBefore(dateFilter.endOf('month'))
            );
        }

        // Status filter
        if (statusFilter) {
            filtered = filtered.filter(quote => quote.status === statusFilter);
        }

        return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }, [searchTerm, dateFilter, statusFilter]);

    const handleOptionSelect = useCallback((option: 'new' | 'clone') => {
        setSelectedOption(option);

        if (option === 'new') {
            // Small delay for UX, then proceed
            setTimeout(() => {
                onNewTrip();
            }, 300);
        }
    }, [onNewTrip]);

    const handleQuoteSelect = useCallback((quote: PreviousQuotation) => {
        setQuotesLoading(true);

        // Simulate API call delay
        setTimeout(() => {
            onCloneQuote(quote);
            setQuotesLoading(false);
        }, 800);
    }, [onCloneQuote]);

    if (loading || quotesLoading) {
        return (
            <Box sx={{ p: 4 }}>
                <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
                <Skeleton variant="text" height={40} sx={{ mb: 4 }} />
                <Grid container spacing={3}>
                    {Array.from({ length: 4 }).map((_, index) => (
                        <Grid key={index} size={12}>
                            <Skeleton variant="rectangular" height={200} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ maxWidth: 1200, mx: 'auto', p: 4 }}>
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="h3" fontWeight={800} gutterBottom>
                        Create New Quote
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                        Start fresh or save time by building on a previous quote
                    </Typography>
                </Box>

                {/* Main Options - Side by Side */}
                <Box sx={{ mb: 6 }}>
                    <Grid container spacing={4} justifyContent="center">
                        {/* New Trip Option */}
                        <QuoteStartCard
                            selectedOption={selectedOption}
                            type='new'
                            handleOptionSelect={handleOptionSelect}
                            theme={theme}
                            tips={[
                                'Comprehensive guided workflow',
                                'Customizable itineraries',
                                'Accurate pricing calculations',
                            ]}
                        />

                        {/* Clone Quote Option */}
                        <QuoteStartCard
                            selectedOption={selectedOption}
                            type='clone'
                            handleOptionSelect={handleOptionSelect}
                            theme={theme}
                            tips={[
                                'Leverage past quotes',
                                'Maintain consistency',
                                'Speed up the quoting process',
                            ]}
                        />
                    </Grid>
                </Box>

                {/* Quote Selection - Shows when Clone option is selected */}
                {selectedOption === 'clone' && (
                    <Box>
                        <Divider sx={{ mb: 4 }} />

                        <Typography variant="h5" fontWeight={700} gutterBottom>
                            Select a Quote to Clone
                        </Typography>

                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                            Choose from your recent quotes to use as a starting point
                        </Typography>

                        {/* Search & Filters */}
                        <Grid container spacing={2} sx={{ mb: 4 }}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    placeholder="Search by customer name, email, or destination..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchOutlined />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <DatePicker
                                    label="Filter by Month"
                                    value={dateFilter}
                                    onChange={setDateFilter}
                                    views={['year', 'month']}
                                    slotProps={{
                                        textField: { fullWidth: true }
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Status"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    SelectProps={{ native: true }}
                                >
                                    {QuotationStatuses.map((status) => (
                                        <option key={status} value={status}>
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </option>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>

                        {/* Results Count */}
                        <Alert severity="info" sx={{ mb: 3 }}>
                            Found {filteredQuotes.length} quote{filteredQuotes.length !== 1 ? 's' : ''} matching your criteria
                        </Alert>

                        {/* Quote List */}
                        <Grid container spacing={3}>
                            {filteredQuotes.map((quote) => (
                                <Grid key={quote.id} size={{ xs: 12, md: 6, lg: 4 }}>
                                    <PrevQuotationCard
                                        quote={quote}
                                        handleQuoteSelect={handleQuoteSelect}
                                    />
                                </Grid>
                            ))}
                        </Grid>

                        {filteredQuotes.length === 0 && (
                            <Alert severity="warning" sx={{ mt: 3 }}>
                                No quotes found matching your search criteria. Try adjusting your filters or create a new quote instead.
                            </Alert>
                        )}
                    </Box>
                )}
            </Box>
        </LocalizationProvider>
    );
};

export default ChooseTemplate;

