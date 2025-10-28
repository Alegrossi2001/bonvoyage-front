import { Box, Card, Stack, Typography, Avatar, Badge, Chip, IconButton, Tooltip, Menu, MenuItem, Collapse, Divider } from '@mui/material';
import type { InboxItem } from '../interfaces/InboxItem';
import TOperatorInboxItem from './TOperatorInboxItem';
import type { Theme } from '@mui/system';
import { NotificationsOutlined } from '@mui/icons-material';

interface TOperatorInboxProps {
    theme: Theme;
    filteredItems: InboxItem[];
    expandedItems: string[];
    searchTerm?: string;
    filterType?: string;
    handleItemAction: (item: InboxItem) => void;

}

const ToperatorInbox: React.FC<TOperatorInboxProps> = ({ theme, filteredItems, expandedItems, searchTerm, filterType, handleItemAction }) => (
    <Box>
        <Card>
            <Box sx={{ maxHeight: '70vh', overflow: 'auto' }}>
                {filteredItems.map((item, index) => (
                    <TOperatorInboxItem
                        item={item}
                        theme={theme}
                        hasThread={false}
                        isExpanded={expandedItems.includes(item.id)}
                        index={index}
                        filteredItems={filteredItems}
                        handleItemAction={handleItemAction}
                        handleMarkAsRead={() => { }}
                        handleMarkAsUnread={() => { }}
                        toggleExpanded={() => { }}
                        handleMenuOpen={() => { }}
                    />))}

            </Box>

            {filteredItems.length === 0 && (
                <Box sx={{ p: 6, textAlign: 'center' }}>
                    <NotificationsOutlined sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No messages found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {searchTerm || filterType !== 'all'
                            ? 'Try adjusting your search or filters'
                            : 'All caught up! No new messages.'
                        }
                    </Typography>
                </Box>
            )}
        </Card>

        {/* Actions Menu 
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
        >
            <MenuItem onClick={() => handleItemAction(filteredItems.find(i => i.id === selectedItem)!)}>
                <OpenInNewOutlined sx={{ mr: 1 }} />
                Open
            </MenuItem>
            <MenuItem onClick={() => handleArchive(selectedItem!)}>
                <ArchiveOutlined sx={{ mr: 1 }} />
                Archive
            </MenuItem>
        </Menu>
        */}
    </Box>
);

export default ToperatorInbox;