import { Box, Stack, Typography, LinearProgress, Chip } from '@mui/material';
import { QuotationHeader } from '../ui/Primitives';
import { alpha } from '@mui/material';
import type { Quotation } from '../interfaces/Quotation';

interface StepHeaderProps {
    quotationState: Quotation;
    completionPercentage: number;
}
const StepHeader: React.FC<StepHeaderProps> = ({ quotationState, completionPercentage }) => (
    <QuotationHeader>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
                <Typography variant="h5" fontWeight={700}>
                    Quotation Builder
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {quotationState.customer.name || 'New Customer'} •
                    Quote #{quotationState.id.slice(-8)} •
                    v{quotationState.version}
                </Typography>
            </Box>

            <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ minWidth: 120 }}>
                    <Typography variant="caption" sx={{ opacity: 0.9 }}>
                        Completion: {completionPercentage}%
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={completionPercentage}
                        sx={{
                            backgroundColor: alpha('#fff', 0.3),
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: '#fff',
                            },
                        }}
                    />
                </Box>

                <Chip
                    label={quotationState.status.toUpperCase()}
                    size="small"
                    sx={{
                        backgroundColor: alpha('#fff', 0.2),
                        color: '#fff',
                        fontWeight: 600,
                    }}
                />
            </Stack>
        </Stack>
    </QuotationHeader>
)

export default StepHeader;