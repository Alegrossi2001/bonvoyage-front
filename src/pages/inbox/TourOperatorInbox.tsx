import { Box, Grid, useTheme } from "@mui/system";
import useSearch from "./logic/useSearch";
import InboxHeader from "./ui/InboxHeader";
import useInboxStats from "./logic/useInboxStats";
import { mockInboxItems } from "../../DEMO/SampleInbox";
import InboxStatisticsBar from "./ui/StatisticsBar";
import InboxSearchBar from "./ui/InboxSearchBar";
import ToperatorInbox from "./ui/TOperatorInbox";
import InboxItemViewer from "./ui/InboxItemViewer";

const TourOperatorInbox = () => {

    const theme = useTheme();
    const { searchTerm, setSearchTerm, filteredItems } = useSearch(mockInboxItems);
    const stats = useInboxStats(mockInboxItems);
    return (
        <Box sx={{ p: 3 }}>
            <InboxHeader />
            <InboxStatisticsBar
                theme={theme}
                stats={stats}
            />
            <InboxSearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterType={'all'}
                setFilterType={() => { }}
                selectedCategory={'all'}
                setSelectedCategory={() => { }}
                stats={stats}
            />
            <Grid container>
                <Grid size={5}>
                    <ToperatorInbox
                        theme={theme}
                        filteredItems={filteredItems}
                        expandedItems={[]}
                        searchTerm={searchTerm}
                        filterType={'all'}
                    />
                </Grid>
                <Grid size={7}>
                    <InboxItemViewer
                        item={mockInboxItems[0]}
                        theme={theme}
                        onClose={() => { }}
                        onReply={() => { }}
                        onArchive={() => { }}
                        onMarkRead={() => { }}
                        onMarkUnread={() => { }}
                    />
                </Grid>
            </Grid>

        </Box>
    )
};

export default TourOperatorInbox;