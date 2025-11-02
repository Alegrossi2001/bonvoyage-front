import { Paper, Box, Typography, Stack, IconButton } from "@mui/material";
import { Add } from "@mui/icons-material";
import TimelineDay from "./TimelineDay";
import type { ServiceItem } from "../../createTravels/interfaces/ServiceItem";

interface TimelineBuilderProps {
    itineraryDays: Array<{
        id: string;
        date: string;
        timeSlots: Array<{
            id: string;
            label: string;
            time: string;
            services: ServiceItem[];
        }>;
    }>;
    onAddDay: () => void;
}

const TimelineBuilder: React.FC<TimelineBuilderProps> = ({ itineraryDays, onAddDay }) => {
    return (
        <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Timeline Header */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight={600}>
                        Itinerary Timeline
                    </Typography>
                    <IconButton onClick={onAddDay} color="primary">
                        <Add />
                    </IconButton>
                </Stack>
            </Box>

            {/* Timeline Days */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                <Stack spacing={3}>
                    {itineraryDays.map((day, index) => (
                        <TimelineDay
                            key={day.id}
                            day={day}
                            dayNumber={index + 1}
                        />
                    ))}
                </Stack>
            </Box>
        </Paper>
    );
};

export default TimelineBuilder;