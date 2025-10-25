/*import React, { useState, useMemo } from 'react';
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
*/