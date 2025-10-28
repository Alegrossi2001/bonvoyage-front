import { Box, Button, Card, Chip, InputAdornment, Stack, TextField, Divider } from '@mui/material';
import { SearchOutlined, FilterListOutlined, WarningAmberOutlined } from '@mui/icons-material';
import { INBOX_ITEM_TYPES, type InboxItem } from '../interfaces/InboxItem';
import type { InboxStats, STAT_TYPE } from '../interfaces/InboxStats';
import type { Theme } from '@mui/system';
import { alpha } from '@mui/system';

interface InboxSearchBarProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filterType: InboxItem["type"];
    setFilterType: (type: InboxItem["type"]) => void;
    stats: InboxStats;
    theme: Theme;
    priorityFilter: typeof STAT_TYPE[number] | null;
    setPriorityFilter: (priority: typeof STAT_TYPE[number]) => void;
}
const InboxSearchBar: React.FC<InboxSearchBarProps> = ({
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    stats,
    theme,
    priorityFilter,
    setPriorityFilter,
}) => (
    <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 2 }}>
        <Box sx={{ p: 3 }}>
            <Stack spacing={2}>
                {/* Search Field */}
                <TextField
                    placeholder="Search messages, clients, suppliers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchOutlined />
                            </InputAdornment>
                        )
                    }}
                    sx={{ width: '100%' }}
                    variant="outlined"
                    size="medium"
                />

                {/* Divider for clarity */}
                <Divider />

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                    <WarningAmberOutlined />
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', flex: 1 }}>
                        {[
                            { label: 'Total', value: stats.total, color: theme.palette.primary.main },
                            { label: 'Unread', value: stats.unread, color: theme.palette.warning.main },
                            { label: 'Action Required', value: stats.actionRequired, color: theme.palette.error.main },
                            { label: 'Urgent', value: stats.urgent, color: '#FF1744' }
                        ].map((stat, index) => (
                            <Chip
                                key={index}
                                onClick={() => setPriorityFilter(stat.label.toLowerCase() as typeof STAT_TYPE[number])}
                                label={`${stat.label}: ${stat.value}`}
                                sx={{
                                    bgcolor: alpha(stat.color, 0.1),
                                    color: stat.color,
                                    fontWeight: 600,
                                }}
                            />
                        ))}
                    </Box>
                </Stack>

                {/* Filter Types */}
                <Stack direction="row" spacing={1} alignItems="center">
                    <FilterListOutlined color="action" />
                    {INBOX_ITEM_TYPES.map((type) => (
                        <Button
                            key={type}
                            variant={filterType === type ? 'contained' : 'outlined'}
                            size="small"
                            onClick={() => setFilterType(type as InboxItem["type"])}
                            sx={{ textTransform: 'capitalize', borderRadius: 2, fontWeight: 600 }}
                        >
                            {type.replace('_', ' ')}
                        </Button>
                    ))}
                </Stack>

            </Stack>
        </Box>
    </Card>
)

export default InboxSearchBar;