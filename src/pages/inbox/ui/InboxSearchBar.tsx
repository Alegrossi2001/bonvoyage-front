import { Box, Button, Card, Chip, InputAdornment, Stack, TextField } from '@mui/material';
import { SearchOutlined } from '@mui/icons-material';
import type { InboxStats } from '../interfaces/InboxStats';

interface InboxSearchBarProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filterType: 'all' | 'unread' | 'action_required';
    setFilterType: (type: 'all' | 'unread' | 'action_required') => void;
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    stats: InboxStats;
}
const InboxSearchBar: React.FC<InboxSearchBarProps> = ({
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    selectedCategory,
    setSelectedCategory,
    stats
}) => (
    <Card sx={{ mb: 3 }}>
        <Box sx={{ p: 3 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
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
                    sx={{ flex: 1 }}
                />

                <Stack direction="row" spacing={1}>
                    {['all', 'unread', 'action_required'].map((type) => (
                        <Button
                            key={type}
                            variant={filterType === type ? 'contained' : 'outlined'}
                            size="small"
                            onClick={() => setFilterType(type as string as 'all' | 'unread' | 'action_required')}
                            sx={{ textTransform: 'capitalize' }}
                        >
                            {type.replace('_', ' ')}
                        </Button>
                    ))}
                </Stack>
            </Stack>

            {/* Category Chips */}
            <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
                <Chip
                    label="All Categories"
                    onClick={() => setSelectedCategory('all')}
                    color={selectedCategory === 'all' ? 'primary' : 'default'}
                    size="small"
                />
                {stats.categories.map(category => (
                    <Chip
                        key={category}
                        label={category}
                        onClick={() => setSelectedCategory(category)}
                        color={selectedCategory === category ? 'primary' : 'default'}
                        size="small"
                        variant="outlined"
                    />
                ))}
            </Stack>
        </Box>
    </Card>
)

export default InboxSearchBar;