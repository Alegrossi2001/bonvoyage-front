import { AddCircleOutlined, ContentCopyOutlined } from '@mui/icons-material';
import { Box, CardContent, Grid, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { TemplateCard } from '../Primitives';
import type { Theme } from '@mui/system';

interface QuoteStartCardProps {
    type: 'new' | 'clone' | 'drafts';
    selectedOption: 'new' | 'clone' | 'drafts' | null;
    handleOptionSelect: (option: 'new' | 'clone' | 'drafts') => void;
    theme: Theme;
    tips: string[];
}

const QuoteStartCard = ({ type, selectedOption, handleOptionSelect, theme, tips }: QuoteStartCardProps) => {
    // Dynamic configuration based on type
    const config = {
        new: {
            icon: AddCircleOutlined,
            title: 'Start Fresh',
            description: 'Create a completely new quote from scratch with our guided workflow',
            colorPalette: 'primary',
            iconColor: theme.palette.primary.main,
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            tipColor: 'primary.main',
        },
        clone: {
            icon: ContentCopyOutlined,
            title: 'Clone Existing Quote',
            description: 'Save time by building on a previous quote with similar requirements',
            colorPalette: 'secondary',
            iconColor: theme.palette.secondary.main,
            backgroundColor: alpha(theme.palette.secondary.main, 0.1),
            tipColor: 'secondary.main',
        },
        drafts: {
            icon: ContentCopyOutlined,
            title: 'Continue Draft',
            description: 'Pick up where you left off with your saved draft quotations',
            colorPalette: 'grey',
            iconColor: theme.palette.grey[600],
            backgroundColor: alpha(theme.palette.grey[600], 0.1),
            tipColor: 'grey.main',
        }
    };

    const currentConfig = config[type];
    const IconComponent = currentConfig.icon;

    return (
        <Grid size={{ xs: 12, sm: 6, md: 5, lg: 4 }}>
            <TemplateCard
                selected={selectedOption === type}
                onClick={() => handleOptionSelect(type)}
            >
                <CardContent sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    textAlign: 'center',
                    p: 4,
                    minHeight: 320,
                }}>
                    <Box
                        sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            backgroundColor: currentConfig.backgroundColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 3,
                        }}
                    >
                        <IconComponent
                            sx={{
                                fontSize: 40,
                                color: currentConfig.iconColor
                            }}
                        />
                    </Box>

                    <Typography variant="h5" fontWeight={700} gutterBottom>
                        {currentConfig.title}
                    </Typography>

                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        {currentConfig.description}
                    </Typography>

                    <Stack spacing={1}>
                        {tips.map((tip, index) => (
                            <Typography
                                key={index}
                                variant="caption"
                                color={currentConfig.tipColor}
                                fontWeight={600}
                            >
                                {type === 'clone' ? '⚡ ' : '✓ '}{tip}
                            </Typography>
                        ))}
                    </Stack>
                </CardContent>
            </TemplateCard>
        </Grid>
    );
};

export default QuoteStartCard;