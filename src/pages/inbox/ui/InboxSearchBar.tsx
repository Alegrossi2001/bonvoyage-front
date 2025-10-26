import { Box, Button, Card, Chip, InputAdornment, Stack, TextField } from '@mui/material';
import { SearchOutlined } from '@mui/icons-material';
import { ENTITY_TYPES, INBOX_ITEM_TYPES, type InboxItem } from '../interfaces/InboxItem';

interface InboxSearchBarProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filterType: InboxItem["type"];
    setFilterType: (type: InboxItem["type"]) => void;
    selectedEntityType: InboxItem["entityType"];
    setSelectedEntityType: (category: InboxItem["entityType"]) => void;
}
const InboxSearchBar: React.FC<InboxSearchBarProps> = ({
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    selectedEntityType,
    setSelectedEntityType,
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
                    {INBOX_ITEM_TYPES.map((type) => (
                        <Button
                            key={type}
                            variant={filterType === type ? 'contained' : 'outlined'}
                            size="small"
                            onClick={() => setFilterType(type as InboxItem["type"])}
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
                    onClick={() => setSelectedEntityType('all')}
                    color={selectedEntityType === 'all' ? 'primary' : 'default'}
                    size="small"
                />
                {ENTITY_TYPES.map(category => (
                    <Chip
                        key={category}
                        label={category}
                        onClick={() => setSelectedEntityType(category)}
                        color={selectedEntityType === category ? 'primary' : 'default'}
                        size="small"
                        variant="outlined"
                    />
                ))}
            </Stack>
        </Box>
    </Card>
)

export default InboxSearchBar;