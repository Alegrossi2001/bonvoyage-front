import { Box, Grid } from "@mui/material";
import { useAuthStore } from "../../../stores/AuthStore";
import DashboardHeader from "./ui/Header";
import UpcomingDepartures from "./ui/UpcomingDepartures";
import QuickActions from "./ui/QuickActions";
import PerformanceDashboard from "./ui/PerformanceDashboard";
import DashboardCharts from "./ui/Charts";
import QuickNotes from "./ui/QuickNotes";

const OperatorDashboard = () => {
    const { user } = useAuthStore();
    if (!user) return null;
    return (
        <Box sx={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0
        }}>
            <Box p={2} mb={2}>
                <DashboardHeader user={user} />
            </Box>
            <Grid container spacing={2} mb={2} px={2}>
                <Grid size={7}>
                    <UpcomingDepartures />
                </Grid>
                <Grid size={5}>
                    <QuickNotes />
                </Grid>
            </Grid>
            <Box sx={{ flexGrow: 1, mb: 6, px: 2 }}>
                <PerformanceDashboard />
            </Box>
            <Box>
                <DashboardCharts />
            </Box>
            <QuickActions />
        </Box>
    );
};

export default OperatorDashboard;