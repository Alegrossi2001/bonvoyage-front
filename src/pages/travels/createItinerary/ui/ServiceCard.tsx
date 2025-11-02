import { Paper, Box, Typography, Chip, Stack } from "@mui/material";
import { DragIndicator, AccessTime, Euro } from "@mui/icons-material";
import { Draggable } from "@hello-pangea/dnd";
import { memo } from "react";
import type { ServiceItem } from "../../createTravels/interfaces/ServiceItem";

interface ServiceCardProps {
    service: ServiceItem;
    index: number;
    isDraggable?: boolean;
}

const ServiceCard = memo<ServiceCardProps>(({ service, index, isDraggable = false }) => {
    const getCategoryIcon = (category: string) => {
        const icons: Record<string, string> = {
            accommodation: "🏨",
            transport: "🚗",
            activities: "🎯",
            dining: "🍽️",
            other: "📋"
        };
        return icons[category] || icons.other;
    };

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            accommodation: "#1976d2",
            transport: "#388e3c",
            activities: "#f57c00",
            dining: "#d32f2f",
            other: "#757575"
        };
        return colors[category] || colors.other;
    };

    const CardContent = (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                border: 1,
                borderColor: 'divider',
                transition: 'border-color 0.2s ease-in-out',
                '&:hover': {
                    borderColor: 'primary.main',
                }
            }}
        >
            <Stack direction="row" spacing={2} alignItems="flex-start">
                {isDraggable && (
                    <DragIndicator sx={{ color: 'text.secondary', mt: 0.5, cursor: 'grab' }} />
                )}

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                        <Typography variant="body2" sx={{ fontSize: '1rem' }}>
                            {getCategoryIcon(service.category)}
                        </Typography>
                        <Chip
                            label={service.category}
                            size="small"
                            sx={{
                                backgroundColor: getCategoryColor(service.category),
                                color: 'white',
                                fontSize: '0.7rem',
                                height: 20,
                            }}
                        />
                    </Stack>

                    <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        gutterBottom
                        sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {service.name || service.description}
                    </Typography>

                    <Stack direction="row" spacing={2} alignItems="center">
                        {service.quantity && service.unit && (
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <AccessTime sx={{ fontSize: 14, color: 'text.secondary' }} />
                                <Typography variant="caption" color="text.secondary">
                                    {service.quantity} {service.unit}
                                </Typography>
                            </Stack>
                        )}

                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <Euro sx={{ fontSize: 14, color: 'success.main' }} />
                            <Typography variant="caption" color="success.main" fontWeight={600}>
                                €{(service.finalPrice || service.totalPrice || 0).toLocaleString()}
                            </Typography>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Paper>
    );

    if (!isDraggable) {
        return CardContent;
    }

    return (
        <Draggable draggableId={service.id.toString()} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                        ...provided.draggableProps.style,
                        opacity: snapshot.isDragging ? 0.8 : 1,
                        transform: snapshot.isDragging
                            ? `${provided.draggableProps.style?.transform} rotate(2deg)`
                            : provided.draggableProps.style?.transform,
                    }}
                >
                    {CardContent}
                </div>
            )}
        </Draggable>
    );
});

ServiceCard.displayName = 'ServiceCard';

export default ServiceCard;