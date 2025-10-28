import { Box, Grid, useTheme } from "@mui/system";
import useSearch from "./logic/useSearch";
import InboxHeader from "./ui/InboxHeader";
import useInboxStats from "./logic/useInboxStats";
import { mockInboxItems } from "../../DEMO/SampleInbox";
import InboxSearchBar from "./ui/InboxSearchBar";
import ToperatorInbox from "./ui/TOperatorInbox";
import InboxItemViewer from "./ui/InboxItemViewer";
import useInboxViewer from "./logic/useInboxViewer";

const TourOperatorInbox = () => {

    const theme = useTheme();
    const { searchTerm, filteredItems, onSearchChange, filterType, onFilterTypeChange, priorityFilter, setPriority } = useSearch(mockInboxItems);
    const stats = useInboxStats(mockInboxItems);
    const { item, openItem } = useInboxViewer();
    return (
        <Box sx={{ p: 3 }}>
            <InboxHeader />
            <InboxSearchBar
                searchTerm={searchTerm}
                setSearchTerm={onSearchChange}
                filterType={filterType}
                setFilterType={onFilterTypeChange}
                stats={stats}
                theme={theme}
                setPriorityFilter={setPriority}
                priorityFilter={priorityFilter}
            />
            <Grid container>
                <Grid size={5}>
                    <ToperatorInbox
                        theme={theme}
                        filteredItems={filteredItems}
                        expandedItems={[]}
                        searchTerm={searchTerm}
                        filterType={'all'}
                        handleItemAction={openItem}
                    />
                </Grid>
                <Grid size={7}>
                    <InboxItemViewer
                        item={item}
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