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

// Types for inbox system
interface InboxItem {
    id: string;
    type: 'quote_request' | 'supplier_update' | 'client_message' | 'task_alert' | 'system_notification' | 'trip_update';
    title: string;
    preview: string;
    isRead: boolean;
    priority: 'low' | 'normal' | 'high' | 'urgent';
    createdAt: string;
    entityId?: string; // linked to quote, trip, etc.
    entityType?: 'quote' | 'trip' | 'client' | 'supplier';
    sender: {
        name: string;
        avatar?: string;
        type: 'client' | 'supplier' | 'internal' | 'system';
    };
    actionRequired: boolean;
    category: string;
    relatedCount?: number; // for grouped items
    metadata?: {
        clientName?: string;
        tripId?: string;
        value?: number;
        currency?: string;
        dueDate?: string;
    };
    thread?: InboxMessage[];
}

interface InboxMessage {
    id: string;
    content: string;
    sender: string;
    timestamp: string;
    isInternal: boolean;
}

// Mock data
const mockInboxItems: InboxItem[] = [
    {
        id: 'inbox-001',
        type: 'quote_request',
        title: 'New Quote Request from Sacred Heart College',
        preview: 'Educational trip to Rome for 30 students, 5 days in March 2024. Budget: €15,000',
        isRead: false,
        priority: 'high',
        createdAt: '2024-01-23T14:30:00Z',
        entityId: 'lead-001',
        entityType: 'quote',
        sender: {
            name: 'Sister Mary Catherine',
            type: 'client'
        },
        actionRequired: true,
        category: 'New Business',
        metadata: {
            clientName: 'Sacred Heart College',
            value: 15000,
            currency: 'EUR'
        }
    },
    {
        id: 'inbox-002',
        type: 'supplier_update',
        title: 'Hotel Roma Palace - Booking Confirmed',
        preview: 'Your reservation for 15 twin rooms from March 15-20 has been confirmed. Confirmation #RP2024001',
        isRead: false,
        priority: 'normal',
        createdAt: '2024-01-23T11:45:00Z',
        entityId: 'QT-2024-001',
        entityType: 'trip',
        sender: {
            name: 'Hotel Roma Palace',
            type: 'supplier'
        },
        actionRequired: false,
        category: 'Supplier Updates',
        metadata: {
            tripId: 'QT-2024-001',
            clientName: 'Sacred Heart College'
        }
    },
    {
        id: 'inbox-003',
        type: 'client_message',
        title: 'Itinerary Change Request',
        preview: 'Could we adjust the Vatican tour time from 9 AM to 2 PM? Some students have morning commitments.',
        isRead: true,
        priority: 'normal',
        createdAt: '2024-01-23T09:15:00Z',
        entityId: 'QT-2024-001',
        entityType: 'trip',
        sender: {
            name: 'Amanda Rodriguez',
            type: 'client'
        },
        actionRequired: true,
        category: 'Trip Changes',
        metadata: {
            tripId: 'QT-2024-001',
            clientName: 'Corporate Events Plus'
        },
        thread: [
            {
                id: 'msg-001',
                content: 'Could we adjust the Vatican tour time from 9 AM to 2 PM?',
                sender: 'Amanda Rodriguez',
                timestamp: '2024-01-23T09:15:00Z',
                isInternal: false
            },
            {
                id: 'msg-002',
                content: 'Let me check with the Vatican guides for availability.',
                sender: 'Sarah Johnson',
                timestamp: '2024-01-23T09:30:00Z',
                isInternal: true
            }
        ]
    },
    {
        id: 'inbox-004',
        type: 'task_alert',
        title: 'Payment Reminder: Corporate Events Plus',
        preview: 'Deposit payment of €7,425 is due in 3 days. Send reminder to client.',
        isRead: false,
        priority: 'urgent',
        createdAt: '2024-01-22T16:00:00Z',
        entityId: 'QT-2024-003',
        entityType: 'trip',
        sender: {
            name: 'BonVoyage System',
            type: 'system'
        },
        actionRequired: true,
        category: 'Payments',
        metadata: {
            clientName: 'Corporate Events Plus',
            value: 7425,
            currency: 'EUR',
            dueDate: '2024-01-26T00:00:00Z'
        }
    },
    {
        id: 'inbox-005',
        type: 'supplier_update',
        title: 'Multiple Supplier Confirmations',
        preview: 'Restaurant booking confirmed, guide assignment updated, transport schedule finalized',
        isRead: false,
        priority: 'normal',
        createdAt: '2024-01-22T14:20:00Z',
        entityId: 'QT-2024-005',
        entityType: 'trip',
        sender: {
            name: 'Multiple Suppliers',
            type: 'supplier'
        },
        actionRequired: false,
        category: 'Supplier Updates',
        relatedCount: 3,
        metadata: {
            tripId: 'QT-2024-005',
            clientName: 'University of Excellence'
        }
    },
    {
        id: 'inbox-006',
        type: 'system_notification',
        title: 'Weekly Operations Summary',
        preview: '5 trips departing next week, 12 pending bookings, 3 payment reminders needed',
        isRead: true,
        priority: 'low',
        createdAt: '2024-01-22T08:00:00Z',
        sender: {
            name: 'BonVoyage Analytics',
            type: 'system'
        },
        actionRequired: false,
        category: 'Reports'
    }
];

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

    // Statistics
    const stats = useMemo(() => {
        const total = items.length;
        const unread = items.filter(item => !item.isRead).length;
        const actionRequired = items.filter(item => item.actionRequired).length;
        const urgent = items.filter(item => item.priority === 'urgent').length;
        const categories = Array.from(new Set(items.map(item => item.category)));

        return { total, unread, actionRequired, urgent, categories };
    }, [items]);

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

    const getPriorityColor = (priority: string) => {
        const colors = {
            urgent: '#FF1744',
            high: '#FF5722',
            normal: '#2196F3',
            low: '#4CAF50'
        };
        return colors[priority as keyof typeof colors];
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

    const formatTimeAgo = (timestamp: string) => {
        const date = parseISO(timestamp);
        if (isToday(date)) {
            return format(date, 'HH:mm');
        } else if (isYesterday(date)) {
            return 'Yesterday';
        } else {
            return formatDistanceToNow(date, { addSuffix: true });
        }
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
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    Operations Inbox
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Stay on top of quotes, bookings, and client communications
                </Typography>
            </Box>

            {/* Statistics Bar */}
            <Card sx={{ mb: 3 }}>
                <Box sx={{ p: 3 }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', flex: 1 }}>
                            {[
                                { label: 'Total', value: stats.total, color: theme.palette.primary.main },
                                { label: 'Unread', value: stats.unread, color: theme.palette.warning.main },
                                { label: 'Action Required', value: stats.actionRequired, color: theme.palette.error.main },
                                { label: 'Urgent', value: stats.urgent, color: '#FF1744' }
                            ].map((stat, index) => (
                                <Chip
                                    key={index}
                                    label={`${stat.label}: ${stat.value}`}
                                    sx={{
                                        bgcolor: alpha(stat.color, 0.1),
                                        color: stat.color,
                                        fontWeight: 600
                                    }}
                                />
                            ))}
                        </Box>
                    </Stack>
                </Box>
            </Card>

            {/* Search and Filters */}
            <Card sx={{ mb: 3 }}>
                <Box sx={{ p: 3 }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                        <TextField
                            placeholder="Search messages, clients, suppliers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchOutlined />
                                    </InputAdornment>
                                )
                            }}
                            sx={{ flex: 1 }}
                        />

                        <Stack direction="row" spacing={1}>
                            {['all', 'unread', 'action_required'].map((type) => (
                                <Button
                                    key={type}
                                    variant={filterType === type ? 'contained' : 'outlined'}
                                    size="small"
                                    onClick={() => setFilterType(type as any)}
                                    sx={{ textTransform: 'capitalize' }}
                                >
                                    {type.replace('_', ' ')}
                                </Button>
                            ))}
                        </Stack>
                    </Stack>

                    {/* Category Chips */}
                    <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
                        <Chip
                            label="All Categories"
                            onClick={() => setSelectedCategory('all')}
                            color={selectedCategory === 'all' ? 'primary' : 'default'}
                            size="small"
                        />
                        {stats.categories.map(category => (
                            <Chip
                                key={category}
                                label={category}
                                onClick={() => setSelectedCategory(category)}
                                color={selectedCategory === category ? 'primary' : 'default'}
                                size="small"
                                variant="outlined"
                            />
                        ))}
                    </Stack>
                </Box>
            </Card>

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