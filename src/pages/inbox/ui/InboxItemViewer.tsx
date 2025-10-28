import React, { useState } from 'react';
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
    alpha,
    TextField,
    Collapse,
    CircularProgress,
    Menu,
    MenuItem,
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
    ForwardToInboxOutlined,
    DeleteOutline,
    MoreVert,
    FileDownloadOutlined,
} from '@mui/icons-material';
import { formatDistanceToNow, parseISO } from 'date-fns';
import type { InboxItem } from '../interfaces/InboxItem';
import type { Theme } from '@mui/system';
import ConfirmAlert from '../../../components/modal/ConfirmAlert';

interface InboxItemViewerProps {
    item: InboxItem | null;
    theme: Theme;
    onClose: () => void;
    onReply?: (item: InboxItem, message: string) => Promise<void> | void;
    onArchive?: (item: InboxItem) => void;
    onMarkRead?: (item: InboxItem) => void;
    onMarkUnread?: (item: InboxItem) => void;
    onForward?: (item: InboxItem, email: string) => Promise<void> | void;
    onDelete?: (item: InboxItem) => void;
    onDownload?: (item: InboxItem) => void;
    onStar?: (item: InboxItem, starred: boolean) => void;
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
    return configs[type as keyof typeof configs] || configs.system_notification;
};

const InboxItemViewer: React.FC<InboxItemViewerProps> = ({
    item,
    theme,
    onClose,
    onReply,
    onArchive,
    onMarkRead,
    onMarkUnread,
    onForward,
    onDelete,
    onDownload,
}) => {
    const [replyOpen, setReplyOpen] = useState(false);
    const [replyMessage, setReplyMessage] = useState('');
    const [replyLoading, setReplyLoading] = useState(false);
    const [forwardOpen, setForwardOpen] = useState(false);
    const [forwardEmail, setForwardEmail] = useState('');
    const [forwardLoading, setForwardLoading] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openConfirmConvert, setOpenConfirmConvert] = useState(false);
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

    // Starred state (mock, should come from item)


    const handleReply = async () => {
        setReplyLoading(true);
        await onReply?.(item, replyMessage);
        setReplyLoading(false);
        setReplyOpen(false);
        setReplyMessage('');
    };

    const handleForward = async () => {
        setForwardLoading(true);
        await onForward?.(item, forwardEmail);
        setForwardLoading(false);
        setForwardOpen(false);
        setForwardEmail('');
    };

    const convertToQuotation = () => {
        if (item.type !== "quote_request") {
            //Open the modal asking if the user is sure they want to convert it to a quotation.
            setOpenConfirmConvert(true);
        }
    }

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
                position: 'relative',
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
                    <Tooltip title="Download">
                        <IconButton onClick={() => onDownload?.(item)}>
                            <FileDownloadOutlined />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton onClick={() => onDelete?.(item)}>
                            <DeleteOutline />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="More">
                        <IconButton onClick={e => setAnchorEl(e.currentTarget)}>
                            <MoreVert />
                        </IconButton>
                    </Tooltip>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                    >
                        <MenuItem onClick={() => { setForwardOpen(true); setAnchorEl(null); }}>
                            <ForwardToInboxOutlined sx={{ mr: 1 }} /> Forward
                        </MenuItem>
                        <MenuItem onClick={() => { setReplyOpen(true); setAnchorEl(null); }}>
                            <ReplyOutlined sx={{ mr: 1 }} /> Reply
                        </MenuItem>
                        <MenuItem onClick={() => { convertToQuotation(); setAnchorEl(null); }}>
                            <RequestQuoteOutlined sx={{ mr: 1 }} /> Open to Quotation
                        </MenuItem>
                    </Menu>
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

            {/* Attachments (mock) */}
            {item.attachments && item.attachments.length > 0 && (
                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                        Attachments
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        {item.attachments.map((att: any, idx: number) => (
                            <Chip
                                key={idx}
                                icon={<FileDownloadOutlined />}
                                label={att.name}
                                onClick={() => onDownload?.(item)}
                                sx={{ fontWeight: 600 }}
                            />
                        ))}
                    </Stack>
                </Box>
            )}

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
                    onClick={() => setReplyOpen(true)}
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

            {/* Reply Section */}
            <Collapse in={replyOpen}>
                <Box sx={{
                    mt: 3,
                    p: 3,
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                    borderRadius: 2,
                    boxShadow: 1,
                }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                        Reply to {item.sender.name}
                    </Typography>
                    <TextField
                        multiline
                        minRows={4}
                        fullWidth
                        placeholder="Type your reply..."
                        value={replyMessage}
                        onChange={e => setReplyMessage(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={replyLoading ? <CircularProgress size={18} /> : <ReplyOutlined />}
                            onClick={handleReply}
                            disabled={replyLoading || !replyMessage}
                        >
                            Send Reply
                        </Button>
                        <Button
                            variant="text"
                            color="secondary"
                            onClick={() => setReplyOpen(false)}
                        >
                            Cancel
                        </Button>
                    </Stack>
                </Box>
            </Collapse>

            {/* Forward Section */}
            <Collapse in={forwardOpen}>
                <Box sx={{
                    mt: 3,
                    p: 3,
                    bgcolor: alpha(theme.palette.info.main, 0.04),
                    borderRadius: 2,
                    boxShadow: 1,
                }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                        Forward to Email
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder="Recipient email address"
                        value={forwardEmail}
                        onChange={e => setForwardEmail(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="contained"
                            color="info"
                            startIcon={forwardLoading ? <CircularProgress size={18} /> : <ForwardToInboxOutlined />}
                            onClick={handleForward}
                            disabled={forwardLoading || !forwardEmail}
                        >
                            Forward
                        </Button>
                        <Button
                            variant="text"
                            color="secondary"
                            onClick={() => setForwardOpen(false)}
                        >
                            Cancel
                        </Button>
                    </Stack>
                </Box>
            </Collapse>
            <ConfirmAlert
                open={openConfirmConvert}
                title="Open Quote Generation"
                description="This email has not been marked as a quote request. Are you sure you want to start it as a quotation?"
                onConfirm={convertToQuotation}
                onCancel={() => setOpenConfirmConvert(false)}
                confirmText="Yes, I am sure!"
                cancelText="Cancel"
                color='warning'
                iconType='warning'
            />
        </Card>
    );
};

export default InboxItemViewer;