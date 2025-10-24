import React, { useState, useMemo } from 'react';
import {
    Box,
    Card,
    Typography,
    Stack,
    Chip,
    IconButton,
    Avatar,
    Badge,
    Button,
    TextField,
    InputAdornment,
    Divider,
    Menu,
    MenuItem,
    Tooltip,
    Collapse,
    alpha,
    useTheme,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import {
    SearchOutlined,
    MarkEmailReadOutlined,
    MarkEmailUnreadOutlined,
    ArchiveOutlined,
    ReplyOutlined,
    OpenInNewOutlined,
    MoreVertOutlined,
    NotificationsOutlined,
    MessageOutlined,
    AssignmentOutlined,
    RequestQuoteOutlined,
    UpdateOutlined,
    WarningAmberOutlined,
    InfoOutlined,
    CheckCircleOutlined,
    BusinessOutlined,
    PersonOutlined,
    GroupOutlined,
    AttachMoneyOutlined,
    CalendarTodayOutlined,
    KeyboardArrowDownOutlined,
    KeyboardArrowUpOutlined,
    PriorityHighOutlined,
    AccessTimeOutlined,
    SendOutlined,
    CloseOutlined,
} from '@mui/icons-material';
import { formatDistanceToNow, parseISO, isToday, isYesterday, format } from 'date-fns';




// Mock data

interface TourOperatorInboxProps {
    onOpenQuoteBuilder?: (leadId: string) => void;
    onViewTrip?: (tripId: string) => void;
    onOpenChat?: (itemId: string) => void;
    onMarkTask?: (taskId: string) => void;
}

const ToperatorInbox: React.FC<TourOperatorInboxProps> = ({
    onOpenQuoteBuilder,
    onViewTrip,
    onOpenChat,
    onMarkTask
}) => {
    const theme = useTheme();

    // State management
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'unread' | 'action_required' | 'archived'>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [replyDialogOpen, setReplyDialogOpen] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [items, setItems] = useState<InboxItem[]>(mockInboxItems);

    // Filtered items
    const filteredItems = useMemo(() => {
        const filtered = items.filter(item => {
            const matchesSearch =
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.preview.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.sender.name.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesFilter =
                filterType === 'all' ||
                (filterType === 'unread' && !item.isRead) ||
                (filterType === 'action_required' && item.actionRequired) ||
                (filterType === 'archived' && false); // Add archived logic

            const matchesCategory =
                selectedCategory === 'all' || item.category === selectedCategory;

            return matchesSearch && matchesFilter && matchesCategory;
        });

        // Sort by priority and date
        return filtered.sort((a, b) => {
            const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 };
            const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
            if (priorityDiff !== 0) return priorityDiff;

            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    }, [items, searchTerm, filterType, selectedCategory]);

    // Get type configuration
    const getTypeConfig = (type: string) => {
        const configs = {
            quote_request: {
                icon: <RequestQuoteOutlined />,
                color: theme.palette.primary.main,
                bgColor: alpha(theme.palette.primary.main, 0.1)
            },
            supplier_update: {
                icon: <UpdateOutlined />,
                color: theme.palette.info.main,
                bgColor: alpha(theme.palette.info.main, 0.1)
            },
            client_message: {
                icon: <MessageOutlined />,
                color: theme.palette.secondary.main,
                bgColor: alpha(theme.palette.secondary.main, 0.1)
            },
            task_alert: {
                icon: <AssignmentOutlined />,
                color: theme.palette.warning.main,
                bgColor: alpha(theme.palette.warning.main, 0.1)
            },
            system_notification: {
                icon: <InfoOutlined />,
                color: theme.palette.grey[600],
                bgColor: alpha(theme.palette.grey[600], 0.1)
            },
            trip_update: {
                icon: <NotificationsOutlined />,
                color: theme.palette.success.main,
                bgColor: alpha(theme.palette.success.main, 0.1)
            }
        };
        return configs[type as keyof typeof configs] || configs.system_notification;
    };

    // Action handlers
    const handleItemAction = (item: InboxItem) => {
        switch (item.type) {
            case 'quote_request':
                onOpenQuoteBuilder?.(item.entityId!);
                break;
            case 'supplier_update':
            case 'trip_update':
                onViewTrip?.(item.entityId!);
                break;
            case 'client_message':
                onOpenChat?.(item.id);
                break;
            case 'task_alert':
                onMarkTask?.(item.id);
                break;
            default:
                console.log('Open item:', item.id);
        }
    };

    const handleMarkAsRead = (itemId: string) => {
        setItems(prev => prev.map(item =>
            item.id === itemId ? { ...item, isRead: true } : item
        ));
    };

    const handleMarkAsUnread = (itemId: string) => {
        setItems(prev => prev.map(item =>
            item.id === itemId ? { ...item, isRead: false } : item
        ));
    };

    const handleArchive = (itemId: string) => {
        setItems(prev => prev.filter(item => item.id !== itemId));
    };

    const toggleExpanded = (itemId: string) => {
        setExpandedItems(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };



    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, itemId: string) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedItem(itemId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedItem(null);
    };

    const handleSendReply = () => {
        // Handle reply logic here
        console.log('Sending reply:', replyContent);
        setReplyDialogOpen(false);
        setReplyContent('');
    };

    return (
        <Box>

            {/* Inbox Items */}
            <Card>
                <Box sx={{ maxHeight: '70vh', overflow: 'auto' }}>
                    {filteredItems.map((item, index) => {
                        const typeConfig = getTypeConfig(item.type);
                        const isExpanded = expandedItems.includes(item.id);
                        const hasThread = item.thread && item.thread.length > 0;

                        return (
                            <React.Fragment key={item.id}>
                                <Box
                                    sx={{
                                        p: 3,
                                        cursor: 'pointer',
                                        bgcolor: item.isRead ? 'transparent' : alpha(theme.palette.primary.main, 0.02),
                                        borderLeft: `4px solid ${item.isRead ? 'transparent' : getPriorityColor(item.priority)}`,
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            bgcolor: alpha(theme.palette.action.hover, 0.5),
                                        }
                                    }}
                                    onClick={() => handleItemAction(item)}
                                >
                                    <Stack direction="row" spacing={2} alignItems="flex-start">
                                        {/* Type Icon */}
                                        <Avatar sx={{
                                            width: 48,
                                            height: 48,
                                            bgcolor: typeConfig.bgColor,
                                            color: typeConfig.color
                                        }}>
                                            {typeConfig.icon}
                                        </Avatar>

                                        {/* Content */}
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                                                        <Typography variant="body1" fontWeight={item.isRead ? 400 : 700} noWrap>
                                                            {item.title}
                                                        </Typography>
                                                        {!item.isRead && (
                                                            <Badge color="primary" variant="dot" />
                                                        )}
                                                        {item.actionRequired && (
                                                            <Chip
                                                                label="Action Required"
                                                                size="small"
                                                                color="error"
                                                                sx={{ height: 20, fontSize: '0.7rem' }}
                                                            />
                                                        )}
                                                        {item.relatedCount && (
                                                            <Chip
                                                                label={`${item.relatedCount} updates`}
                                                                size="small"
                                                                color="info"
                                                                sx={{ height: 20, fontSize: '0.7rem' }}
                                                            />
                                                        )}
                                                    </Stack>

                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{
                                                            mb: 1,
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden'
                                                        }}
                                                    >
                                                        {item.preview}
                                                    </Typography>

                                                    <Stack direction="row" alignItems="center" spacing={2}>
                                                        <Stack direction="row" alignItems="center" spacing={0.5}>
                                                            <Avatar sx={{ width: 20, height: 20, fontSize: '0.7rem' }}>
                                                                {item.sender.name.charAt(0)}
                                                            </Avatar>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {item.sender.name}
                                                            </Typography>
                                                        </Stack>

                                                        <Typography variant="caption" color="text.secondary">
                                                            {formatTimeAgo(item.createdAt)}
                                                        </Typography>

                                                        <Chip
                                                            label={item.category}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ height: 20, fontSize: '0.7rem' }}
                                                        />

                                                        {item.metadata?.value && (
                                                            <Typography variant="caption" fontWeight={600} color="primary">
                                                                {new Intl.NumberFormat('en-US', {
                                                                    style: 'currency',
                                                                    currency: item.metadata.currency || 'EUR'
                                                                }).format(item.metadata.value)}
                                                            </Typography>
                                                        )}
                                                    </Stack>
                                                </Box>

                                                {/* Quick Actions */}
                                                <Stack direction="row" spacing={0.5} onClick={(e) => e.stopPropagation()}>
                                                    {!item.isRead ? (
                                                        <Tooltip title="Mark as read">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleMarkAsRead(item.id)}
                                                            >
                                                                <MarkEmailReadOutlined fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    ) : (
                                                        <Tooltip title="Mark as unread">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleMarkAsUnread(item.id)}
                                                            >
                                                                <MarkEmailUnreadOutlined fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}

                                                    {hasThread && (
                                                        <Tooltip title={isExpanded ? "Collapse thread" : "Show thread"}>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => toggleExpanded(item.id)}
                                                            >
                                                                {isExpanded ? <KeyboardArrowUpOutlined /> : <KeyboardArrowDownOutlined />}
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}

                                                    <Tooltip title="Reply">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => setReplyDialogOpen(true)}
                                                        >
                                                            <ReplyOutlined fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>

                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => handleMenuOpen(e, item.id)}
                                                    >
                                                        <MoreVertOutlined fontSize="small" />
                                                    </IconButton>
                                                </Stack>
                                            </Stack>
                                        </Box>
                                    </Stack>
                                </Box>

                                {/* Thread Expansion */}
                                {hasThread && (
                                    <Collapse in={isExpanded}>
                                        <Box sx={{
                                            ml: 8,
                                            mr: 3,
                                            mb: 2,
                                            p: 2,
                                            bgcolor: alpha(theme.palette.grey[50], 0.5),
                                            borderRadius: 1,
                                            borderLeft: `3px solid ${typeConfig.color}`
                                        }}>
                                            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                                Conversation Thread
                                            </Typography>
                                            <Stack spacing={2}>
                                                {item.thread!.map((message) => (
                                                    <Box key={message.id} sx={{
                                                        p: 2,
                                                        bgcolor: message.isInternal ? alpha(theme.palette.primary.main, 0.05) : 'white',
                                                        borderRadius: 1,
                                                        border: `1px solid ${alpha(theme.palette.divider, 0.5)}`
                                                    }}>
                                                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                                            <Typography variant="caption" fontWeight={600}>
                                                                {message.sender}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {formatTimeAgo(message.timestamp)}
                                                            </Typography>
                                                            {message.isInternal && (
                                                                <Chip label="Internal" size="small" color="primary" sx={{ height: 16, fontSize: '0.65rem' }} />
                                                            )}
                                                        </Stack>
                                                        <Typography variant="body2">
                                                            {message.content}
                                                        </Typography>
                                                    </Box>
                                                ))}
                                            </Stack>
                                        </Box>
                                    </Collapse>
                                )}

                                {index < filteredItems.length - 1 && <Divider />}
                            </React.Fragment>
                        );
                    })}
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

            {/* Actions Menu */}
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
                <MenuItem onClick={() => setReplyDialogOpen(true)}>
                    <ReplyOutlined sx={{ mr: 1 }} />
                    Reply
                </MenuItem>
                <MenuItem onClick={() => handleArchive(selectedItem!)}>
                    <ArchiveOutlined sx={{ mr: 1 }} />
                    Archive
                </MenuItem>
            </Menu>

            {/* Reply Dialog */}
            <Dialog open={replyDialogOpen} onClose={() => setReplyDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="h6">Quick Reply</Typography>
                        <IconButton onClick={() => setReplyDialogOpen(false)}>
                            <CloseOutlined />
                        </IconButton>
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        placeholder="Type your reply..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        sx={{ mt: 1 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setReplyDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<SendOutlined />}
                        onClick={handleSendReply}
                        disabled={!replyContent.trim()}
                    >
                        Send Reply
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ToperatorInbox;