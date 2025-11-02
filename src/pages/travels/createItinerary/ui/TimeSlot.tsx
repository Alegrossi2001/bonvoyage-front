import { Box, Typography, Stack } from "@mui/material";
import { Add } from "@mui/icons-material";
import { Droppable } from "@hello-pangea/dnd";
import ServiceCard from "./ServiceCard";
import type { ServiceItem } from "../../createTravels/interfaces/ServiceItem";

interface TimeSlotProps {
    slot: {
        id: string;
        label: string;
        time: string;
        services: ServiceItem[];
    };
    dayId: string;
}

const TimeSlot: React.FC<TimeSlotProps> = ({ slot, dayId }) => {
    const droppableId = `timeline-${dayId.split('-')[1]}-${slot.id}`;

    return (
        <Stack direction="row" spacing={3} alignItems="flex-start">
            {/* Time Label */}
            <Box sx={{ minWidth: 80, textAlign: 'right', pt: 1 }}>
                <Typography variant="subtitle2" fontWeight={600} color="primary.main">
                    {slot.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {slot.time}
                </Typography>
            </Box>

            {/* Drop Zone */}
            <Box sx={{ flex: 1 }}>
                <Droppable droppableId={droppableId}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            style={{
                                minHeight: 80,
                                border: `2px dashed ${snapshot.isDraggingOver ? '#1976d2' : '#e0e0e0'}`,
                                borderRadius: 8,
                                padding: 16,
                                backgroundColor: snapshot.isDraggingOver ? '#e3f2fd' : 'transparent',
                                transition: 'all 0.2s ease-in-out',
                            }}
                        >
                            {slot.services.length === 0 ? (
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                    justifyContent="center"
                                    sx={{
                                        height: '100%',
                                        color: snapshot.isDraggingOver ? 'primary.main' : 'text.secondary',
                                        opacity: snapshot.isDraggingOver ? 1 : 0.6,
                                    }}
                                >
                                    <Add sx={{ fontSize: 20 }} />
                                    <Typography variant="body2">
                                        {snapshot.isDraggingOver ? 'Drop service here' : 'Drop services here'}
                                    </Typography>
                                </Stack>
                            ) : (
                                <Stack spacing={1}>
                                    {slot.services.map((service, index) => (
                                        <ServiceCard
                                            key={service.id || index}
                                            service={service}
                                            index={index}
                                            isDraggable={false}
                                        />
                                    ))}
                                </Stack>
                            )}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </Box>
        </Stack>
    );
};

export default TimeSlot;