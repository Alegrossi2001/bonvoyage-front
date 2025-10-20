import type { PreviousQuotation } from "../../interfaces/Quotation"
import { Avatar, Box, CardContent, Chip, Grid, Stack, Typography } from "@mui/material"
import { LocationOnOutlined, CalendarTodayOutlined, PersonOutlined } from "@mui/icons-material"
import dayjs from "dayjs"
import { StatusChip, QuoteCard } from "../Primitives"

interface PrevQuotationCardProps {
    quote: PreviousQuotation;
    handleQuoteSelect: (quote: PreviousQuotation) => void;
}

const PrevQuotationCard: React.FC<PrevQuotationCardProps> = ({ quote, handleQuoteSelect }) => (
    <QuoteCard onClick={() => handleQuoteSelect(quote)}>
        <CardContent>
            <Stack spacing={2}>
                {/* Header */}
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {quote.customer.name.charAt(0)}
                    </Avatar>
                    <Box flex={1}>
                        <Typography variant="subtitle1" fontWeight={600}>
                            {quote.customer.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Quote #{quote.id}
                        </Typography>
                    </Box>
                    <StatusChip
                        label={quote.status}
                        status={quote.status}
                        size="small"
                    />
                </Stack>

                {/* Destinations */}
                <Stack direction="row" alignItems="center" spacing={1}>
                    <LocationOnOutlined fontSize="small" color="action" />
                    <Typography variant="body2">
                        {quote.destinations.join(' → ')}
                    </Typography>
                </Stack>

                {/* Details */}
                <Grid container spacing={2}>
                    <Grid size={6}>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                            <CalendarTodayOutlined fontSize="small" color="action" />
                            <Typography variant="caption">
                                {quote.duration} days
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid size={6}>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                            <PersonOutlined fontSize="small" color="action" />
                            <Typography variant="caption">
                                {quote.travelers} travelers
                            </Typography>
                        </Stack>
                    </Grid>
                </Grid>

                {/* Value & Date */}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" color="primary.main" fontWeight={700}>
                        €{quote.totalValue.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {dayjs(quote.createdAt).format('MMM DD, YYYY')}
                    </Typography>
                </Stack>

                {/* Tags */}
                {quote.tags && quote.tags.length > 0 && (
                    <Stack direction="row" spacing={0.5} flexWrap="wrap">
                        {quote.tags.map((tag) => (
                            <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.7rem' }}
                            />
                        ))}
                    </Stack>
                )}
            </Stack>
        </CardContent>
    </QuoteCard>
);

export default PrevQuotationCard;