import { Box, Stack, Typography } from '@mui/material';
import type { Customer } from '../../interfaces/Customer';


const renderClientOption = (option: Customer) => (
    <Box component="li">
        <Stack direction="row" alignItems="center" spacing={2} width="100%">
            <Box>
                <Typography variant="subtitle2" fontWeight={600}>
                    {option.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {option.name} • {option.type}
                </Typography>
            </Box>
            {/*<Box sx={{ ml: 'auto' }}>
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
                </Box>*/}
        </Stack>
    </Box>
);

export default renderClientOption;