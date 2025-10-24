import { Box, Card, Chip, Stack } from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { Theme } from '@mui/system';
import type { InboxStats } from '../interfaces/InboxStats';

interface InboxStatisticsBar {
    theme: Theme;
    stats: InboxStats;
}
const InboxStatisticsBar: React.FC<InboxStatisticsBar> = ({ theme, stats }) => (
    <Card sx={{ mb: 3 }}>
        <Box sx={{ p: 3 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', flex: 1 }}>
                    {[
                        { label: 'Total', value: stats.total, color: theme.palette.primary.main },
                        { label: 'Unread', value: stats.unread, color: theme.palette.warning.main },
                        { label: 'Action Required', value: stats.actionRequired, color: theme.palette.error.main },
                        { label: 'Urgent', value: stats.urgent, color: '#FF1744' }
                    ].map((stat, index) => (
                        <Chip
                            key={index}
                            label={`${stat.label}: ${stat.value}`}
                            sx={{
                                bgcolor: alpha(stat.color, 0.1),
                                color: stat.color,
                                fontWeight: 600
                            }}
                        />
                    ))}
                </Box>
            </Stack>
        </Box>
    </Card>
)

export default InboxStatisticsBar;