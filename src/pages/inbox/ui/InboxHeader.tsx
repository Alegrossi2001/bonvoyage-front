import { Box } from "@mui/system";
import { Typography } from "@mui/material";

const InboxHeader = () => (
    <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
            Operations Inbox
        </Typography>
        <Typography variant="body1" color="text.secondary">
            Stay on top of quotes, bookings, and client communications
        </Typography>
    </Box>
)

export default InboxHeader;