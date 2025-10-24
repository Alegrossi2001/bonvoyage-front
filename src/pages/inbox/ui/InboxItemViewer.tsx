import React from 'react';
import {
    Box,
    Card,
    Typography,
    Stack,
    Chip,
    Avatar,
    IconButton,
    Divider,
    Tooltip,
    Button,
    useTheme,
    alpha,
} from '@mui/material';
import {
    ReplyOutlined,
    ArchiveOutlined,
    OpenInNewOutlined,
    MarkEmailReadOutlined,
    MarkEmailUnreadOutlined,
    WarningAmberOutlined,
    InfoOutlined,
    RequestQuoteOutlined,
    UpdateOutlined,
    MessageOutlined,
    AssignmentOutlined,
    NotificationsOutlined,
    AttachMoneyOutlined,
    CalendarTodayOutlined,
} from '@mui/icons-material';
import { formatDistanceToNow, parseISO } from 'date-fns';
import type { InboxItem } from '../interfaces/InboxItem';
import type { Theme } from '@mui/system';

interface InboxItemViewerProps {
    item: InboxItem | null;
    theme: Theme;
    onClose: () => void;
    onReply?: (item: InboxItem) => void;
    onArchive?: (item: InboxItem) => void;
    onMarkRead?: (item: InboxItem) => void;
    onMarkUnread?: (item: InboxItem) => void;
}

const getTypeConfig = (type: InboxItem['type'], theme: Theme) => {
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
    return configs[type] || configs.system_notification;
};

const InboxItemViewer: React.FC<InboxItemViewerProps> = ({
    item,
    theme,
    onClose,
    onReply,
    onArchive,
    onMarkRead,
    onMarkUnread,
}) => {
    if (!item) {
        return (
            <Box sx={{ p: 6, textAlign: 'center', color: 'text.secondary' }}>
                <InfoOutlined sx={{ fontSize: 64, mb: 2 }} />
                <Typography variant="h6">No message selected</Typography>
                <Typography variant="body2">Select a message to view its details.</Typography>
            </Box>
        );
    }

    const typeConfig = getTypeConfig(item.type, theme);

    return (
        <Card
            sx={{
                p: 4,
                borderRadius: 3,
                boxShadow: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: `linear-gradient(135deg, #fff, ${alpha(typeConfig.color, 0.04)})`,
            }}
        >
            {/* Header */}
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <Avatar
                    sx={{
                        bgcolor: typeConfig.bgColor,
                        color: typeConfig.color,
                        width: 56,
                        height: 56,
                        fontSize: 32,
                    }}
                >
                    {typeConfig.icon}
                </Avatar>
                <Box flex={1}>
                    <Typography variant="h5" fontWeight={700} color="text.primary" gutterBottom>
                        {item.title}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                            label={item.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            size="small"
                            sx={{
                                bgcolor: typeConfig.bgColor,
                                color: typeConfig.color,
                                fontWeight: 600,
                                fontSize: '0.85rem',
                            }}
                        />
                        {item.actionRequired && (
                            <Chip
                                label="Action Required"
                                size="small"
                                color="error"
                                icon={<WarningAmberOutlined />}
                                sx={{ fontWeight: 600, fontSize: '0.85rem' }}
                            />
                        )}
                        {item.relatedCount && (
                            <Chip
                                label={`${item.relatedCount} updates`}
                                size="small"
                                color="info"
                                sx={{ fontWeight: 600, fontSize: '0.85rem' }}
                            />
                        )}
                        <Chip
                            label={item.category}
                            size="small"
                            variant="outlined"
                            sx={{ fontWeight: 600, fontSize: '0.85rem' }}
                        />
                        {item.priority === 'urgent' && (
                            <Chip
                                label="Urgent"
                                size="small"
                                color="error"
                                icon={<WarningAmberOutlined />}
                                sx={{ fontWeight: 600, fontSize: '0.85rem' }}
                            />
                        )}
                    </Stack>
                </Box>
                <Stack direction="row" spacing={1}>
                    {item.isRead ? (
                        <Tooltip title="Mark as unread">
                            <IconButton onClick={() => onMarkUnread?.(item)}>
                                <MarkEmailUnreadOutlined />
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <Tooltip title="Mark as read">
                            <IconButton onClick={() => onMarkRead?.(item)}>
                                <MarkEmailReadOutlined />
                            </IconButton>
                        </Tooltip>
                    )}
                    <Tooltip title="Archive">
                        <IconButton onClick={() => onArchive?.(item)}>
                            <ArchiveOutlined />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Open in new tab">
                        <IconButton>
                            <OpenInNewOutlined />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Stack>

            {/* Sender & Meta */}
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <Avatar
                    src={item.sender.avatar}
                    sx={{
                        width: 36,
                        height: 36,
                        bgcolor: theme.palette.grey[200],
                        color: theme.palette.text.primary,
                        fontWeight: 700,
                        fontSize: 18,
                    }}
                >
                    {item.sender.name.charAt(0)}
                </Avatar>
                <Typography variant="body1" fontWeight={600}>
                    {item.sender.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {item.sender.type.charAt(0).toUpperCase() + item.sender.type.slice(1)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {formatDistanceToNow(parseISO(item.createdAt), { addSuffix: true })}
                </Typography>
                {item.metadata?.value && (
                    <Chip
                        label={new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: item.metadata.currency || 'EUR'
                        }).format(item.metadata.value)}
                        size="small"
                        color="primary"
                        icon={<AttachMoneyOutlined />}
                        sx={{ fontWeight: 600, fontSize: '0.85rem' }}
                    />
                )}
                {item.metadata?.dueDate && (
                    <Chip
                        label={`Due: ${item.metadata.dueDate}`}
                        size="small"
                        color="warning"
                        icon={<CalendarTodayOutlined />}
                        sx={{ fontWeight: 600, fontSize: '0.85rem' }}
                    />
                )}
            </Stack>

            <Divider sx={{ mb: 2 }} />

            {/* Main Content */}
            <Box sx={{ flex: 1, minHeight: 120, mb: 2 }}>
                <Typography
                    variant="body1"
                    sx={{
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        fontSize: '1.1rem',
                        color: 'text.primary',
                    }}
                >
                    {item.preview}
                </Typography>
            </Box>

            {/* Thread (if any) */}
            {item.thread && item.thread.length > 0 && (
                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                        Conversation Thread
                    </Typography>
                    <Stack spacing={2}>
                        {item.thread.map((msg) => (
                            <Box
                                key={msg.id}
                                sx={{
                                    p: 2,
                                    bgcolor: msg.isInternal
                                        ? alpha(theme.palette.primary.main, 0.05)
                                        : 'white',
                                    borderRadius: 1,
                                    border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                                }}
                            >
                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                    <Typography variant="caption" fontWeight={600}>
                                        {msg.sender}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {formatDistanceToNow(parseISO(msg.timestamp), { addSuffix: true })}
                                    </Typography>
                                    {msg.isInternal && (
                                        <Chip
                                            label="Internal"
                                            size="small"
                                            color="primary"
                                            sx={{ height: 16, fontSize: '0.65rem' }}
                                        />
                                    )}
                                </Stack>
                                <Typography variant="body2">{msg.content}</Typography>
                            </Box>
                        ))}
                    </Stack>
                </Box>
            )}

            <Divider sx={{ mb: 2 }} />

            {/* Actions */}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ReplyOutlined />}
                    onClick={() => onReply?.(item)}
                >
                    Reply
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={onClose}
                >
                    Close
                </Button>
            </Stack>
        </Card>
    );
};

export default InboxItemViewer;