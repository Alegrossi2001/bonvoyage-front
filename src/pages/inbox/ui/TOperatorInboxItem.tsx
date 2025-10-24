import React from 'react';
import { Box, Stack, Avatar, Typography, Chip, Badge, IconButton, Tooltip, Collapse, Divider } from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { InboxItem } from '../interfaces/InboxItem';
import type { Theme } from '@mui/system';
import { MoreVertOutlined, MarkEmailReadOutlined, KeyboardArrowUpOutlined, KeyboardArrowDownOutlined, ReplyOutlined, MarkEmailUnreadOutlined } from '@mui/icons-material';
import { formatTimeAgo, getPriorityColor } from "../logic/InboxHelpers"

interface TOperatorInboxItemProps {
    theme: Theme;
    item: InboxItem;
    hasThread: boolean;
    isExpanded: boolean;
    index: number;
    filteredItems: InboxItem[];
    handleItemAction: (item: InboxItem) => void;
    handleMarkAsRead: (id: string) => void;
    handleMarkAsUnread: (id: string) => void;
    toggleExpanded: (id: string) => void;
    handleMenuOpen: (event: React.MouseEvent<HTMLElement>, id: string) => void;
}

const TOperatorInboxItem: React.FC<TOperatorInboxItemProps> = ({ item, theme, hasThread, isExpanded, index, filteredItems, handleItemAction, handleMarkAsRead, handleMarkAsUnread, toggleExpanded, handleMenuOpen }) => (
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
                {/* Type Icon 
                <Avatar sx={{
                    width: 48,
                    height: 48,
                    bgcolor: typeConfig.bgColor,
                    color: typeConfig.color
                }}>
                    {typeConfig.icon}
                </Avatar>*/}

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
                    //borderLeft: `3px solid ${typeConfig.color}`
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
)

export default TOperatorInboxItem;