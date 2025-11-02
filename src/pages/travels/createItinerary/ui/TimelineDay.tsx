import { Paper, Box, Typography, Stack, Divider } from "@mui/material";
import { CalendarToday } from "@mui/icons-material";
import TimeSlot from "./TimeSlot";
import type { ServiceItem } from "../../createTravels/interfaces/ServiceItem";

interface TimelineDayProps {
    day: {
        id: string;
        date: string;
        timeSlots: Array<{
            id: string;
            label: string;
            time: string;
            services: ServiceItem[];
        }>;
    };
    dayNumber: number;
}

const TimelineDay: React.FC<TimelineDayProps> = ({ day, dayNumber }) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <Paper sx={{ p: 3, border: 1, borderColor: 'divider' }}>
            {/* Day Header */}
            <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <CalendarToday sx={{ color: 'primary.main' }} />
                <Box>
                    <Typography variant="h6" fontWeight={600}>
                        Day {dayNumber}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {formatDate(day.date)}
                    </Typography>
                </Box>
            </Stack>

            {/* Time Slots */}
            <Stack spacing={2}>
                {day.timeSlots.map((slot, index) => (
                    <Box key={slot.id}>
                        <TimeSlot
                            slot={slot}
                            dayId={day.id}
                        />
                        {index < day.timeSlots.length - 1 && (
                            <Divider sx={{ my: 1, borderStyle: 'dashed' }} />
                        )}
                    </Box>
                ))}
            </Stack>
        </Paper>
    );
};

export default TimelineDay;