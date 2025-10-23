import React, { useState, useMemo } from 'react';
import {
    Box,
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Chip,
    IconButton,
    Avatar,
    Tooltip,
    Stack,
    TextField,
    InputAdornment,
    Button,
    Menu,
    MenuItem,
    Divider,
    Fab,
    Badge,
    alpha,
    useTheme,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    Checkbox,
    ListItemText,
    Collapse,
    Alert,
} from '@mui/material';
import {
    SearchOutlined,
    FilterListOutlined,
    MoreVertOutlined,
    EditOutlined,
    SendOutlined,
    ContentCopyOutlined,
    PictureAsPdfOutlined,
    DeleteOutlined,
    VisibilityOutlined,
    PersonOutlined,
    LocationOnOutlined,
    AttachMoneyOutlined,
    NotificationsOutlined,
    CheckCircleOutlined,
    PendingOutlined,
    CancelOutlined,
    DraftsOutlined,
    BusinessOutlined,
    FlightTakeoffOutlined,
    AddOutlined,
    EmailOutlined,
    ShareOutlined,
    HistoryOutlined,
    LabelOutlined,
    SortOutlined,
    WhatsApp as WhatsAppOutlined
} from '@mui/icons-material';
import { format, differenceInDays, parseISO } from 'date-fns';
import type { PreviousQuotation } from '../../createTravels/interfaces/Quotation';
import useBonVoyageNavigate from '../../../../routes/navigate';

interface QuotationTableProps {
    onCreateNew?: () => void;
    onEdit?: (quotationId: string) => void;
    onView?: (quotationId: string) => void;
    onSendReminder?: (quotationId: string) => void;
    onDuplicate?: (quotationId: string) => void;
    onDelete?: (quotationId: string) => void;
    mockQuotations: PreviousQuotation[];
}

const QuotationTable: React.FC<QuotationTableProps> = ({
    onCreateNew,
    onEdit,
    onView,
    onSendReminder,
    onDuplicate,
    onDelete,
    mockQuotations
}) => {
    const theme = useTheme();

    //Nav
    const { quickNav } = useBonVoyageNavigate();
    // State management
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [agentFilter, setAgentFilter] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<'date' | 'value' | 'client'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [selectedQuotations, setSelectedQuotations] = useState<string[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedQuotation, setSelectedQuotation] = useState<string | null>(null);
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const [filterDialogOpen, setFilterDialogOpen] = useState(false);
    const [reminderDialogOpen, setReminderDialogOpen] = useState(false);

    // Get unique values for filters
    const uniqueStatuses = Array.from(new Set(mockQuotations.map(q => q.status)));
    const uniqueAgents = Array.from(new Set(mockQuotations.map(q => q.agent)));

    // Filtered and sorted data
    const filteredQuotations = useMemo(() => {
        const filtered = mockQuotations.filter(quotation => {
            const matchesSearch =
                quotation.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                quotation.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                quotation.destinations.some(dest => dest.toLowerCase().includes(searchTerm.toLowerCase())) ||
                quotation.agent.toLowerCase().includes(searchTerm.toLowerCase()) ||
                quotation.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesStatus = statusFilter.length === 0 || statusFilter.includes(quotation.status);
            const matchesAgent = agentFilter.length === 0 || agentFilter.includes(quotation.agent);

            return matchesSearch && matchesStatus && matchesAgent;
        });

        // Sort
        filtered.sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'date':
                    comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                    break;
                case 'value':
                    comparison = a.totalValue - b.totalValue;
                    break;
                case 'client':
                    comparison = a.customer.name.localeCompare(b.customer.name);
                    break;
            }
            return sortOrder === 'desc' ? -comparison : comparison;
        });

        return filtered;
    }, [mockQuotations, searchTerm, statusFilter, agentFilter, sortBy, sortOrder]);

    // Statistics
    const stats = useMemo(() => {
        const total = mockQuotations.length;
        const confirmed = mockQuotations.filter(q => q.status === "approved").length;
        const pending = mockQuotations.filter(q => q.status === "sent").length;
        const draft = mockQuotations.filter(q => q.status === "draft").length;
        const totalValue = mockQuotations.reduce((sum, q) => sum + q.totalValue, 0);
        const avgValue = total > 0 ? totalValue / total : 0;

        return { total, confirmed, pending, draft, totalValue, avgValue };
    }, [mockQuotations]);

    // Status configuration
    const getStatusConfig = (status: string) => {
        const configs = {
            draft: {
                color: 'default' as const,
                icon: <DraftsOutlined />,
                label: 'Draft',
                bgColor: theme.palette.grey[100],
                textColor: theme.palette.text.secondary
            },
            pending_client: {
                color: 'warning' as const,
                icon: <PendingOutlined />,
                label: 'Pending Client',
                bgColor: alpha(theme.palette.warning.main, 0.1),
                textColor: theme.palette.warning.main
            },
            revision_needed: {
                color: 'error' as const,
                icon: <EditOutlined />,
                label: 'Revision Needed',
                bgColor: alpha(theme.palette.error.main, 0.1),
                textColor: theme.palette.error.main
            },
            confirmed: {
                color: 'success' as const,
                icon: <CheckCircleOutlined />,
                label: 'Confirmed',
                bgColor: alpha(theme.palette.success.main, 0.1),
                textColor: theme.palette.success.main
            },
            expired: {
                color: 'error' as const,
                icon: <CancelOutlined />,
                label: 'Expired',
                bgColor: alpha(theme.palette.error.main, 0.1),
                textColor: theme.palette.error.main
            },
        };
        return configs[status as keyof typeof configs] || configs.draft;
    };

    // Priority calculation based on various factors
    const calculatePriority = (quotation: PreviousQuotation) => {
        let score = 0;

        // High value quotations
        if (quotation.totalValue > 20000) score += 3;
        else if (quotation.totalValue > 10000) score += 2;
        else if (quotation.totalValue > 5000) score += 1;

        // Premium customers
        //if (quotation.customer.tier === 'enterprise') score += 3;
        //else if (quotation.customer.tier === 'premium') score += 2;

        // Pending status urgency
        //if (quotation.status === 'pending_client') score += 2;
        //if (quotation.status === 'revision_needed') score += 3;

        // Time sensitivity (older quotations need attention)
        const daysOld = differenceInDays(new Date(), parseISO(quotation.createdAt));
        if (daysOld > 7) score += 2;
        if (daysOld > 14) score += 3;

        if (score >= 6) return 'urgent';
        if (score >= 4) return 'high';
        if (score >= 2) return 'medium';
        return 'low';
    };

    const getPriorityColor = (priority: string) => {
        const colors = {
            urgent: '#FF1744',
            high: '#FF5722',
            medium: '#FF9800',
            low: '#4CAF50'
        };
        return colors[priority as keyof typeof colors] || colors.low;
    };

    // Actions
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, quotationId: string) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedQuotation(quotationId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedQuotation(null);
    };

    const handleSelectQuotation = (quotationId: string) => {
        setSelectedQuotations(prev =>
            prev.includes(quotationId)
                ? prev.filter(id => id !== quotationId)
                : [...prev, quotationId]
        );
    };

    const handleSelectAll = () => {
        setSelectedQuotations(
            selectedQuotations.length === filteredQuotations.length
                ? []
                : filteredQuotations.map(q => q.id)
        );
    };

    const handleRowClick = (quotationId: string) => {
        setExpandedRow(expandedRow === quotationId ? null : quotationId);
    };

    const formatCurrency = (value: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header Statistics */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    Quotation Management
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Manage your travel quotations with powerful tools and insights
                </Typography>

                <Box sx={{
                    display: 'flex',
                    gap: 2,
                    mb: 3,
                    flexWrap: 'wrap'
                }}>
                    {[
                        {
                            label: 'Total Quotations',
                            value: stats.total,
                            color: theme.palette.primary.main,
                            icon: <BusinessOutlined />
                        },
                        {
                            label: 'Confirmed',
                            value: stats.confirmed,
                            color: theme.palette.success.main,
                            icon: <CheckCircleOutlined />
                        },
                        {
                            label: 'Pending',
                            value: stats.pending,
                            color: theme.palette.warning.main,
                            icon: <PendingOutlined />
                        },
                        {
                            label: 'Total Value',
                            value: formatCurrency(stats.totalValue, 'EUR'),
                            color: theme.palette.info.main,
                            icon: <AttachMoneyOutlined />
                        }
                    ].map((stat, index) => (
                        <Card key={index}
                            onClick={() => {
                                if (stat.label === 'Confirmed') {
                                    quickNav.confirmedTravels()
                                }
                            }}
                            sx={{
                                p: 2,
                                minWidth: 180,
                                background: `linear-gradient(135deg, ${alpha(stat.color, 0.1)} 0%, ${alpha(stat.color, 0.05)} 100%)`
                            }}>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar sx={{
                                    backgroundColor: stat.color,
                                    width: 48,
                                    height: 48
                                }}>
                                    {stat.icon}
                                </Avatar>
                                <Box>
                                    <Typography variant="h5" fontWeight={700} color={stat.color}>
                                        {typeof stat.value === 'string' ? stat.value : stat.value.toLocaleString()}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {stat.label}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Card>
                    ))}
                </Box>
            </Box>

            {/* Search and Filters */}
            <Card sx={{ mb: 3 }}>
                <Box sx={{ p: 3 }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                        <TextField
                            placeholder="Search by ID, client, destination, or agent..."
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

                        <Button
                            variant="outlined"
                            startIcon={<FilterListOutlined />}
                            onClick={() => setFilterDialogOpen(true)}
                            sx={{ minWidth: 120 }}
                        >
                            Filters
                            {(statusFilter.length > 0 || agentFilter.length > 0) && (
                                <Badge
                                    color="primary"
                                    variant="dot"
                                    sx={{ ml: 1 }}
                                />
                            )}
                        </Button>

                        <Button
                            variant="outlined"
                            startIcon={<SortOutlined />}
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            sx={{ minWidth: 120 }}
                        >
                            {sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<AddOutlined />}
                            onClick={onCreateNew}
                            sx={{
                                minWidth: 140,
                                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                            }}
                        >
                            New Quote
                        </Button>
                    </Stack>

                    {/* Active Filters Display */}
                    {(statusFilter.length > 0 || agentFilter.length > 0) && (
                        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {statusFilter.map(status => (
                                <Chip
                                    key={status}
                                    label={`Status: ${getStatusConfig(status).label}`}
                                    onDelete={() => setStatusFilter(prev => prev.filter(s => s !== status))}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                />
                            ))}
                            {agentFilter.map(agent => (
                                <Chip
                                    key={agent}
                                    label={`Agent: ${agent}`}
                                    onDelete={() => setAgentFilter(prev => prev.filter(a => a !== agent))}
                                    size="small"
                                    color="secondary"
                                    variant="outlined"
                                />
                            ))}
                        </Box>
                    )}
                </Box>
            </Card>

            {/* Bulk Actions */}
            {selectedQuotations.length > 0 && (
                <Card sx={{ mb: 2, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                    <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" fontWeight={600}>
                            {selectedQuotations.length} quotations selected
                        </Typography>
                        <Button size="small" startIcon={<EmailOutlined />}>
                            Send Bulk Reminder
                        </Button>
                        <Button size="small" startIcon={<PictureAsPdfOutlined />}>
                            Export PDF
                        </Button>
                        <Button size="small" startIcon={<LabelOutlined />}>
                            Add Tags
                        </Button>
                        <Button
                            size="small"
                            color="error"
                            startIcon={<DeleteOutlined />}
                        >
                            Delete Selected
                        </Button>
                    </Box>
                </Card>
            )}

            {/* Main Table */}
            <Card>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{
                                bgcolor: alpha(theme.palette.primary.main, 0.05),
                                '& .MuiTableCell-head': {
                                    fontWeight: 700,
                                    fontSize: '0.875rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: 0.5
                                }
                            }}>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selectedQuotations.length === filteredQuotations.length && filteredQuotations.length > 0}
                                        indeterminate={selectedQuotations.length > 0 && selectedQuotations.length < filteredQuotations.length}
                                        onChange={handleSelectAll}
                                    />
                                </TableCell>
                                <TableCell>Priority</TableCell>
                                <TableCell>Quotation</TableCell>
                                <TableCell>Client & Trip</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Value & Travelers</TableCell>
                                <TableCell>Agent</TableCell>
                                <TableCell>Created</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredQuotations.map((quotation) => {
                                const priority = calculatePriority(quotation);
                                const statusConfig = getStatusConfig(quotation.status);
                                const isSelected = selectedQuotations.includes(quotation.id);
                                const isExpanded = expandedRow === quotation.id;
                                const daysOld = differenceInDays(new Date(), parseISO(quotation.createdAt));

                                return (
                                    <React.Fragment key={quotation.id}>
                                        <TableRow
                                            sx={{
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
                                                '&:hover': {
                                                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                                                    transform: 'scale(1.001)',
                                                }
                                            }}
                                            onClick={() => handleRowClick(quotation.id)}
                                        >
                                            <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                                                <Checkbox
                                                    checked={isSelected}
                                                    onChange={() => handleSelectQuotation(quotation.id)}
                                                />
                                            </TableCell>

                                            <TableCell>
                                                <Tooltip title={`${priority.charAt(0).toUpperCase() + priority.slice(1)} Priority`}>
                                                    <Box sx={{
                                                        width: 12,
                                                        height: 12,
                                                        borderRadius: '50%',
                                                        bgcolor: getPriorityColor(priority),
                                                        boxShadow: `0 0 0 2px ${alpha(getPriorityColor(priority), 0.2)}`
                                                    }} />
                                                </Tooltip>
                                            </TableCell>

                                            <TableCell>
                                                <Box>
                                                    <Typography variant="body1" fontWeight={600}>
                                                        {quotation.id}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        v{quotation.version} • {quotation.duration} days
                                                    </Typography>
                                                </Box>
                                            </TableCell>

                                            <TableCell>
                                                <Stack spacing={0.5}>
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>
                                                            {quotation.customer.name.charAt(0)}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="body2" fontWeight={600}>
                                                                {quotation.customer.name}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {quotation.customer.company} / {quotation.customer.type}
                                                            </Typography>
                                                        </Box>
                                                    </Stack>
                                                    <Stack direction="row" alignItems="center" spacing={0.5}>
                                                        <LocationOnOutlined sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                        <Typography variant="caption" color="text.secondary">
                                                            {quotation.destinations.join(', ')}
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                            </TableCell>

                                            <TableCell>
                                                <Chip
                                                    icon={statusConfig.icon}
                                                    label={statusConfig.label}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: statusConfig.bgColor,
                                                        color: statusConfig.textColor,
                                                        fontWeight: 600,
                                                        '& .MuiChip-icon': {
                                                            color: statusConfig.textColor
                                                        }
                                                    }}
                                                />
                                            </TableCell>

                                            <TableCell>
                                                <Box>
                                                    <Typography variant="body1" fontWeight={700} color="primary">
                                                        {formatCurrency(quotation.totalValue, quotation.currency)}
                                                    </Typography>
                                                    <Stack direction="row" alignItems="center" spacing={0.5}>
                                                        <PersonOutlined sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                        <Typography variant="caption" color="text.secondary">
                                                            {quotation.travelers} travelers
                                                        </Typography>
                                                    </Stack>
                                                </Box>
                                            </TableCell>

                                            <TableCell>
                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                    <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem' }}>
                                                        {quotation.agent.split(' ').map(n => n[0]).join('')}
                                                    </Avatar>
                                                    <Typography variant="body2">
                                                        {quotation.agent}
                                                    </Typography>
                                                </Stack>
                                            </TableCell>

                                            <TableCell>
                                                <Box>
                                                    <Typography variant="body2">
                                                        {format(parseISO(quotation.createdAt), 'MMM dd, yyyy')}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {daysOld === 0 ? 'Today' : `${daysOld} days ago`}
                                                    </Typography>
                                                </Box>
                                            </TableCell>

                                            <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                                                <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                                    <Tooltip title="View Details">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => onView?.(quotation.id)}
                                                        >
                                                            <VisibilityOutlined fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Edit">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => onEdit?.(quotation.id)}
                                                        >
                                                            <EditOutlined fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    {quotation.status === "sent" && (
                                                        <Tooltip title="Send Reminder">
                                                            <IconButton
                                                                size="small"
                                                                color="warning"
                                                                onClick={() => onSendReminder?.(quotation.id)}
                                                            >
                                                                <NotificationsOutlined fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => handleMenuOpen(e, quotation.id)}
                                                    >
                                                        <MoreVertOutlined fontSize="small" />
                                                    </IconButton>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>

                                        {/* Expanded Row Details */}
                                        <TableRow>
                                            <TableCell colSpan={9} sx={{ p: 0, borderBottom: isExpanded ? 1 : 0 }}>
                                                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                                    <Box sx={{ p: 3, bgcolor: alpha(theme.palette.grey[50], 0.5) }}>
                                                        <Stack spacing={3}>
                                                            {/* Tags and Customer Info */}
                                                            <Box sx={{
                                                                display: 'flex',
                                                                gap: 3,
                                                                flexDirection: { xs: 'column', md: 'row' }
                                                            }}>
                                                                <Box sx={{ flex: 1 }}>
                                                                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                                                        Tags
                                                                    </Typography>
                                                                    <Stack direction="row" spacing={1} flexWrap="wrap">
                                                                        {quotation.tags.map(tag => (
                                                                            <Chip
                                                                                key={tag}
                                                                                label={tag}
                                                                                size="small"
                                                                                variant="outlined"
                                                                                color="primary"
                                                                            />
                                                                        ))}
                                                                    </Stack>
                                                                </Box>

                                                                <Box sx={{ flex: 1 }}>
                                                                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                                                        Customer Details
                                                                    </Typography>
                                                                    <Stack spacing={0.5}>
                                                                        <Typography variant="body2">
                                                                            <strong>Email:</strong> {quotation.customer.email}
                                                                        </Typography>
                                                                        <Typography variant="body2">
                                                                            <strong>Phone:</strong> {quotation.customer.phone}
                                                                        </Typography>
                                                                        <Typography variant="body2">
                                                                            <strong>Type:</strong> {quotation.customer.type}
                                                                        </Typography>
                                                                    </Stack>
                                                                </Box>
                                                            </Box>

                                                            {/* Quick Actions */}
                                                            <Box>
                                                                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                                                    Quick Actions
                                                                </Typography>
                                                                <Stack direction="row" spacing={1} flexWrap="wrap">
                                                                    <Button
                                                                        size="small"
                                                                        startIcon={<EmailOutlined />}
                                                                        variant="outlined"
                                                                    >
                                                                        Send Email
                                                                    </Button>
                                                                    <Button
                                                                        size="small"
                                                                        startIcon={<WhatsAppOutlined />}
                                                                        variant="outlined"
                                                                        color="success"
                                                                    >
                                                                        WhatsApp
                                                                    </Button>
                                                                    <Button
                                                                        size="small"
                                                                        startIcon={<PictureAsPdfOutlined />}
                                                                        variant="outlined"
                                                                        color="error"
                                                                    >
                                                                        Generate PDF
                                                                    </Button>
                                                                    <Button
                                                                        size="small"
                                                                        startIcon={<ContentCopyOutlined />}
                                                                        variant="outlined"
                                                                    >
                                                                        Duplicate
                                                                    </Button>
                                                                    <Button
                                                                        size="small"
                                                                        startIcon={<HistoryOutlined />}
                                                                        variant="outlined"
                                                                    >
                                                                        View History
                                                                    </Button>
                                                                </Stack>
                                                            </Box>
                                                        </Stack>
                                                    </Box>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </React.Fragment>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>

                {filteredQuotations.length === 0 && (
                    <Box sx={{ p: 6, textAlign: 'center' }}>
                        <FlightTakeoffOutlined sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            No quotations found
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            {searchTerm || statusFilter.length > 0 || agentFilter.length > 0
                                ? 'Try adjusting your search or filters'
                                : 'Create your first quotation to get started'
                            }
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddOutlined />}
                            onClick={onCreateNew}
                        >
                            Create New Quotation
                        </Button>
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
                <MenuItem onClick={() => onView?.(selectedQuotation!)}>
                    <VisibilityOutlined sx={{ mr: 1 }} />
                    View Details
                </MenuItem>
                <MenuItem onClick={() => onEdit?.(selectedQuotation!)}>
                    <EditOutlined sx={{ mr: 1 }} />
                    Edit Quotation
                </MenuItem>
                <MenuItem onClick={() => onDuplicate?.(selectedQuotation!)}>
                    <ContentCopyOutlined sx={{ mr: 1 }} />
                    Duplicate
                </MenuItem>
                <Divider />
                <MenuItem>
                    <PictureAsPdfOutlined sx={{ mr: 1 }} />
                    Export PDF
                </MenuItem>
                <MenuItem>
                    <ShareOutlined sx={{ mr: 1 }} />
                    Share Link
                </MenuItem>
                <MenuItem onClick={() => setReminderDialogOpen(true)}>
                    <NotificationsOutlined sx={{ mr: 1 }} />
                    Send Reminder
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => onDelete?.(selectedQuotation!)} sx={{ color: 'error.main' }}>
                    <DeleteOutlined sx={{ mr: 1 }} />
                    Delete
                </MenuItem>
            </Menu>

            {/* Filter Dialog */}
            <Dialog open={filterDialogOpen} onClose={() => setFilterDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Advanced Filters</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                multiple
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as string[])}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip key={value} label={getStatusConfig(value).label} size="small" />
                                        ))}
                                    </Box>
                                )}
                            >
                                {uniqueStatuses.map((status) => (
                                    <MenuItem key={status} value={status}>
                                        <Checkbox checked={statusFilter.indexOf(status) > -1} />
                                        <ListItemText primary={getStatusConfig(status).label} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Agent</InputLabel>
                            <Select
                                multiple
                                value={agentFilter}
                                onChange={(e) => setAgentFilter(e.target.value as string[])}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip key={value} label={value} size="small" />
                                        ))}
                                    </Box>
                                )}
                            >
                                {uniqueAgents.map((agent) => (
                                    <MenuItem key={agent} value={agent}>
                                        <Checkbox checked={agentFilter.indexOf(agent) > -1} />
                                        <ListItemText primary={agent} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Sort By</InputLabel>
                            <Select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as 'date' | 'value' | 'client')}
                            >
                                <MenuItem value="date">Creation Date</MenuItem>
                                <MenuItem value="value">Total Value</MenuItem>
                                <MenuItem value="client">Client Name</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setStatusFilter([]);
                        setAgentFilter([]);
                        setSortBy('date');
                        setSortOrder('desc');
                    }}>
                        Clear All
                    </Button>
                    <Button onClick={() => setFilterDialogOpen(false)}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Reminder Dialog */}
            <Dialog open={reminderDialogOpen} onClose={() => setReminderDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Send Reminder</DialogTitle>
                <DialogContent>
                    <Alert severity="info" sx={{ mb: 2 }}>
                        Send a polite reminder to the client about their pending quotation.
                    </Alert>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Custom Message (Optional)"
                        placeholder="Add a personal touch to your reminder..."
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setReminderDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="contained" startIcon={<SendOutlined />}>
                        Send Reminder
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Floating Action Button */}
            <Fab
                color="primary"
                aria-label="create new quotation"
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                }}
                onClick={onCreateNew}
            >
                <AddOutlined />
            </Fab>
        </Box>
    );
};

export default QuotationTable;