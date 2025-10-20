import React, { useState, useCallback, useMemo } from 'react';
import {
    Box,
    Grid2 as Grid,
    Typography,
    Card,
    CardContent,
    Stack,
    Chip,
    Button,
    IconButton,
    Alert,
    Divider,
    Paper,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    FormControlLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Badge,
    Tooltip,
    alpha,
    useTheme,
    Avatar,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Stepper,
    Step,
    StepLabel,
    StepContent,
} from '@mui/material';
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineOppositeContent,
} from '@mui/lab';
import {
    SendOutlined,
    EditOutlined,
    SaveOutlined,
    VisibilityOutlined,
    EmailOutlined,
    AttachFileOutlined,
    HistoryOutlined,
    ExpandMoreOutlined,
    CheckCircleOutlined,
    CalendarTodayOutlined,
    AccessTimeOutlined,
    ContentCopyOutlined,
    DownloadOutlined,
    InfoOutlined,
    AttachMoneyOutlined,
    GroupOutlined,
    PrintOutlined,
    AutorenewOutlined,
    EventAvailableOutlined,
    ExpandLessOutlined,
    Schedule,
    Timer,
    Alarm,
    Drafts,
    Send,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Enable relative time plugin
dayjs.extend(relativeTime);

// Mock quote data (would come from previous steps)
const mockQuoteData = {
    id: 'QT-2024-001',
    version: 'v1',
    status: 'draft',
    client: {
        name: 'Sacred Heart College',
        contactPerson: 'Sister Mary Catherine',
        email: 'admissions@sacredheart.edu',
        phone: '+44 20 7946 0958',
    },
    trip: {
        title: 'Spring 2024 Educational Trip to Rome',
        destinations: ['Rome', 'Vatican City', 'Florence'],
        dateFrom: '2024-06-15',
        dateTo: '2024-06-20',
        duration: 5,
        travelers: 30,
        tripType: 'school_group',
    },
    pricing: {
        subtotal: 12405,
        markup: 2242.5,
        total: 14647.5,
        pricePerPerson: 488.25,
        margin: 18.1,
    },
    services: [
        {
            id: '1',
            category: 'accommodation',
            description: 'Hotel Roma Palace - Twin rooms with breakfast',
            finalPrice: 7650,
        },
        {
            id: '2',
            category: 'transport',
            description: 'Coach transport + airport transfers',
            finalPrice: 2587.5,
        },
        {
            id: '3',
            category: 'guide',
            description: 'Licensed guide for historical sites',
            finalPrice: 1200,
        },
        {
            id: '4',
            category: 'meal',
            description: 'Traditional Italian lunches',
            finalPrice: 2484,
        },
        {
            id: '5',
            category: 'activity',
            description: 'Vatican Museums + Colosseum entry',
            finalPrice: 726,
        },
    ],
    activityLog: [
        {
            id: '1',
            type: 'created',
            user: 'John Smith',
            timestamp: dayjs().subtract(2, 'hour').toISOString(),
            details: 'Quote created from template "3-Day Rome School Package"',
        },
        {
            id: '2',
            type: 'modified',
            user: 'John Smith',
            timestamp: dayjs().subtract(1, 'hour').subtract(30, 'minute').toISOString(),
            details: 'Added Vatican Museums entry tickets',
        },
        {
            id: '3',
            type: 'priced',
            user: 'John Smith',
            timestamp: dayjs().subtract(45, 'minute').toISOString(),
            details: 'Pricing completed - 18.1% margin achieved',
        },
        {
            id: '4',
            type: 'reviewed',
            user: 'John Smith',
            timestamp: dayjs().subtract(10, 'minute').toISOString(),
            details: 'Quote reviewed and ready for sending',
        },
    ],
    createdBy: 'John Smith',
    createdAt: dayjs().subtract(2, 'hour').toISOString(),
    validUntil: dayjs().add(30, 'day').toISOString(),
    clonedFrom: null,
    estimatedResponseTime: dayjs().add(3, 'day'),
    reminderDate: dayjs().add(5, 'day'),
};

const ActivityLogCard = styled(Card)(({ theme }) => ({
    border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
    borderRadius: theme.spacing(2),
    '& .MuiTimelineItem-root': {
        '&::before': {
            display: 'none',
        },
    },
    '& .MuiTimelineContent-root': {
        paddingLeft: theme.spacing(1),
        paddingRight: 0,
    },
    '& .MuiTimelineDot-root': {
        boxShadow: 'none',
        margin: 0,
        padding: theme.spacing(1),
    },
}));

const VersionChip = styled(Chip)(({ theme }) => ({
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
    fontFamily: 'monospace',
    fontWeight: 700,
    fontSize: '0.875rem',
}));

const CountdownCard = styled(Card)(({ theme }) => ({
    background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)}, ${alpha(theme.palette.error.main, 0.1)})`,
    border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
}));

interface EmailTemplate {
    subject: string;
    greeting: string;
    body: string;
    closing: string;
    signature: string;
}

const defaultEmailTemplate: EmailTemplate = {
    subject: 'Travel Quote - {{tripTitle}} ({{quoteId}})',
    greeting: 'Dear {{contactPerson}},',
    body: `Thank you for your interest in our travel services. Please find attached your personalized quote for {{tripTitle}}.

This quote includes:
• {{duration}} days of carefully planned travel
• Accommodation, transport, and guided experiences
• All activities and meals as specified

The total cost is €{{totalPrice}} for {{travelers}} travelers (€{{pricePerPerson}} per person).

This quote is valid until {{validUntil}}. We would be happy to discuss any adjustments or answer any questions you may have.`,
    closing: 'We look forward to creating an unforgettable experience for your group.',
    signature: 'Best regards,\nBonVoyage Travel Team'
};

const ReviewAndSend: React.FC = () => {
    const theme = useTheme();
    const [quoteVersion, setQuoteVersion] = useState(mockQuoteData.version);
    const [quoteStatus, setQuoteStatus] = useState(mockQuoteData.status);
    const [emailDialogOpen, setEmailDialogOpen] = useState(false);
    const [emailTemplate, setEmailTemplate] = useState(defaultEmailTemplate);
    const [followUpEnabled, setFollowUpEnabled] = useState(true);
    const [followUpDays, setFollowUpDays] = useState(5);
    const [followUpDate, setFollowUpDate] = useState<Dayjs | null>(mockQuoteData.reminderDate);
    const [editMode, setEditMode] = useState<string | null>(null);
    const [activityLogExpanded, setActivityLogExpanded] = useState(false);

    // Real-time countdown calculations
    const timeCalculations = useMemo(() => {
        const now = dayjs();
        const validUntil = dayjs(mockQuoteData.validUntil);
        const created = dayjs(mockQuoteData.createdAt);
        const reminder = dayjs(mockQuoteData.reminderDate);

        const daysUntilExpiry = validUntil.diff(now, 'day');
        const hoursUntilExpiry = validUntil.diff(now, 'hour') % 24;
        const ageInHours = now.diff(created, 'hour');
        const ageInDays = now.diff(created, 'day');
        const daysUntilReminder = reminder.diff(now, 'day');

        return {
            daysUntilExpiry,
            hoursUntilExpiry,
            ageInHours,
            ageInDays,
            daysUntilReminder,
            isExpiringSoon: daysUntilExpiry <= 7,
            isOld: ageInDays >= 3,
        };
    }, []);

    // Generate next version number
    const generateNextVersion = useCallback(() => {
        const currentVersion = quoteVersion;
        if (currentVersion.includes('-')) {
            // Handle versions like "v1-A", "v1-B"
            const [base, suffix] = currentVersion.split('-');
            const nextSuffix = String.fromCharCode(suffix.charCodeAt(0) + 1);
            return `${base}-${nextSuffix}`;
        } else {
            // Handle versions like "v1", "v2"
            const versionNumber = parseInt(currentVersion.substring(1)) + 1;
            return `v${versionNumber}`;
        }
    }, [quoteVersion]);

    // Process email template with variables
    const processEmailTemplate = useCallback((template: string) => {
        return template
            .replace(/{{tripTitle}}/g, mockQuoteData.trip.title)
            .replace(/{{quoteId}}/g, mockQuoteData.id)
            .replace(/{{contactPerson}}/g, mockQuoteData.client.contactPerson)
            .replace(/{{duration}}/g, mockQuoteData.trip.duration.toString())
            .replace(/{{travelers}}/g, mockQuoteData.trip.travelers.toString())
            .replace(/{{totalPrice}}/g, mockQuoteData.pricing.total.toLocaleString())
            .replace(/{{pricePerPerson}}/g, mockQuoteData.pricing.pricePerPerson.toLocaleString())
            .replace(/{{validUntil}}/g, dayjs(mockQuoteData.validUntil).format('MMMM DD, YYYY'));
    }, []);

    const handleSendQuote = useCallback(() => {
        // Update status and timestamp
        setQuoteStatus('sent');

        // Add to activity log
        const newActivity = {
            id: Date.now().toString(),
            type: 'sent',
            user: 'John Smith',
            timestamp: new Date().toISOString(),
            details: `Quote sent to ${mockQuoteData.client.email}`,
        };

        console.log('Quote sent successfully!');
        setEmailDialogOpen(false);
    }, []);

    const handleCreateNewVersion = useCallback(() => {
        const newVersion = generateNextVersion();
        setQuoteVersion(newVersion);
        setQuoteStatus('draft');

        console.log('New version created:', newVersion);
    }, [generateNextVersion]);

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'created':
                return <Drafts />;
            case 'modified':
                return <EditOutlined />;
            case 'priced':
                return <AttachMoneyOutlined />;
            case 'sent':
                return <Send />;
            case 'versioned':
                return <AutorenewOutlined />;
            case 'viewed':
                return <VisibilityOutlined />;
            case 'approved':
                return <CheckCircleOutlined />;
            case 'reviewed':
                return <CheckCircleOutlined />;
            default:
                return <InfoOutlined />;
        }
    };

    const getActivityColor = (type: string) => {
        switch (type) {
            case 'created':
                return 'primary';
            case 'modified':
                return 'warning';
            case 'priced':
                return 'success';
            case 'sent':
                return 'info';
            case 'approved':
                return 'success';
            case 'reviewed':
                return 'success';
            default:
                return 'grey';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'draft':
                return 'warning';
            case 'sent':
                return 'info';
            case 'approved':
                return 'success';
            case 'rejected':
                return 'error';
            default:
                return 'default';
        }
    };

    const renderEditableSection = (section: string, title: string, content: React.ReactNode) => (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Typography variant="h6" fontWeight={600}>
                        {title}
                    </Typography>
                    <IconButton
                        size="small"
                        onClick={() => setEditMode(editMode === section ? null : section)}
                        color={editMode === section ? 'primary' : 'default'}
                    >
                        <EditOutlined />
                    </IconButton>
                </Stack>
                {content}
            </CardContent>
        </Card>
    );

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ maxWidth: 1400, mx: 'auto', p: 4 }}>
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
                        <Box>
                            <Typography variant="h4" fontWeight={700} gutterBottom>
                                Review & Send Quote
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Final review before sending to client
                            </Typography>
                        </Box>

                        <Stack direction="row" spacing={2} alignItems="center">
                            <VersionChip
                                label={quoteVersion}
                                icon={<ContentCopyOutlined />}
                            />
                            <Chip
                                label={quoteStatus}
                                color={getStatusColor(quoteStatus) as any}
                                variant="filled"
                            />
                            <Typography variant="caption" color="text.secondary">
                                ID: {mockQuoteData.id}
                            </Typography>
                        </Stack>
                    </Stack>
                </Box>

                <Grid container spacing={4}>
                    {/* Main Content */}
                    <Grid xs={12} lg={8}>
                        <Stack spacing={3}>
                            {/* Quote Timer/Status */}
                            <CountdownCard>
                                <CardContent>
                                    <Grid container spacing={3}>
                                        <Grid xs={12} md={3}>
                                            <Stack alignItems="center" spacing={1}>
                                                <Timer color="warning" sx={{ fontSize: 32 }} />
                                                <Typography variant="h6" fontWeight={700}>
                                                    {timeCalculations.daysUntilExpiry}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" textAlign="center">
                                                    Days until expiry
                                                </Typography>
                                            </Stack>
                                        </Grid>

                                        <Grid xs={12} md={3}>
                                            <Stack alignItems="center" spacing={1}>
                                                <AccessTimeOutlined color="info" sx={{ fontSize: 32 }} />
                                                <Typography variant="h6" fontWeight={700}>
                                                    {timeCalculations.ageInHours}h
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" textAlign="center">
                                                    Quote age
                                                </Typography>
                                            </Stack>
                                        </Grid>

                                        <Grid xs={12} md={3}>
                                            <Stack alignItems="center" spacing={1}>
                                                <Alarm color="primary" sx={{ fontSize: 32 }} />
                                                <Typography variant="h6" fontWeight={700}>
                                                    {timeCalculations.daysUntilReminder}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" textAlign="center">
                                                    Days to reminder
                                                </Typography>
                                            </Stack>
                                        </Grid>

                                        <Grid xs={12} md={3}>
                                            <Stack alignItems="center" spacing={1}>
                                                <Schedule color="success" sx={{ fontSize: 32 }} />
                                                <Typography variant="h6" fontWeight={700}>
                                                    {dayjs(mockQuoteData.estimatedResponseTime).fromNow()}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" textAlign="center">
                                                    Expected response
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                    </Grid>

                                    {timeCalculations.isExpiringSoon && (
                                        <Alert severity="warning" sx={{ mt: 2 }}>
                                            Quote expires in {timeCalculations.daysUntilExpiry} days! Consider extending validity or following up.
                                        </Alert>
                                    )}

                                    {timeCalculations.isOld && quoteStatus === 'draft' && (
                                        <Alert severity="info" sx={{ mt: 2 }}>
                                            This quote is {timeCalculations.ageInDays} days old. Consider sending it soon to maintain relevance.
                                        </Alert>
                                    )}
                                </CardContent>
                            </CountdownCard>

                            {/* Quote Overview */}
                            {renderEditableSection(
                                'overview',
                                'Quote Overview',
                                <Grid container spacing={3}>
                                    <Grid xs={12} md={6}>
                                        <Stack spacing={2}>
                                            <Box>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    Client
                                                </Typography>
                                                <Typography variant="body1" fontWeight={600}>
                                                    {mockQuoteData.client.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {mockQuoteData.client.contactPerson}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {mockQuoteData.client.email}
                                                </Typography>
                                            </Box>

                                            <Box>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    Trip Details
                                                </Typography>
                                                <Typography variant="body1" fontWeight={600}>
                                                    {mockQuoteData.trip.title}
                                                </Typography>
                                                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                                                    <Chip
                                                        icon={<CalendarTodayOutlined />}
                                                        label={`${dayjs(mockQuoteData.trip.dateFrom).format('MMM DD')} - ${dayjs(mockQuoteData.trip.dateTo).format('MMM DD, YYYY')}`}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                    <Chip
                                                        icon={<GroupOutlined />}
                                                        label={`${mockQuoteData.trip.travelers} travelers`}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                </Stack>
                                            </Box>
                                        </Stack>
                                    </Grid>

                                    <Grid xs={12} md={6}>
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Pricing Summary
                                            </Typography>
                                            <Paper sx={{ p: 2, mt: 1, backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                                                <Stack spacing={1}>
                                                    <Stack direction="row" justifyContent="space-between">
                                                        <Typography variant="body2">
                                                            Total Quote Value
                                                        </Typography>
                                                        <Typography variant="h6" fontWeight={700} color="primary.main">
                                                            €{mockQuoteData.pricing.total.toLocaleString()}
                                                        </Typography>
                                                    </Stack>
                                                    <Stack direction="row" justifyContent="space-between">
                                                        <Typography variant="body2">
                                                            Price per Person
                                                        </Typography>
                                                        <Typography variant="body1" fontWeight={600}>
                                                            €{mockQuoteData.pricing.pricePerPerson.toLocaleString()}
                                                        </Typography>
                                                    </Stack>
                                                    <Stack direction="row" justifyContent="space-between">
                                                        <Typography variant="body2">
                                                            Margin
                                                        </Typography>
                                                        <Chip
                                                            label={`${mockQuoteData.pricing.margin}%`}
                                                            size="small"
                                                            color={mockQuoteData.pricing.margin >= 20 ? 'success' : mockQuoteData.pricing.margin >= 15 ? 'warning' : 'error'}
                                                        />
                                                    </Stack>
                                                </Stack>
                                            </Paper>
                                        </Box>
                                    </Grid>
                                </Grid>
                            )}

                            {/* Services Summary */}
                            {renderEditableSection(
                                'services',
                                'Services Included',
                                <Stack spacing={2}>
                                    {mockQuoteData.services.map((service, index) => (
                                        <Stack key={service.id} direction="row" justifyContent="space-between" alignItems="center">
                                            <Box>
                                                <Typography variant="body2" fontWeight={600}>
                                                    {service.description}
                                                </Typography>
                                                <Chip
                                                    label={service.category}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ mt: 0.5, textTransform: 'capitalize' }}
                                                />
                                            </Box>
                                            <Typography variant="body1" fontWeight={600}>
                                                €{service.finalPrice.toLocaleString()}
                                            </Typography>
                                        </Stack>
                                    ))}
                                </Stack>
                            )}

                            {/* Terms & Conditions */}
                            {renderEditableSection(
                                'terms',
                                'Terms & Conditions',
                                <Stack spacing={2}>
                                    <Alert severity="info">
                                        <Typography variant="body2">
                                            • Quote valid until {dayjs(mockQuoteData.validUntil).format('MMMM DD, YYYY')}<br />
                                            • Prices subject to availability and confirmation<br />
                                            • 20% deposit required to secure booking<br />
                                            • Full payment due 30 days before departure<br />
                                            • Cancellation terms apply as per our standard conditions
                                        </Typography>
                                    </Alert>
                                </Stack>
                            )}

                            {/* Version Control */}
                            <Card>
                                <CardContent>
                                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                                        <Typography variant="h6" fontWeight={600}>
                                            Version Control
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            startIcon={<AutorenewOutlined />}
                                            onClick={handleCreateNewVersion}
                                            disabled={quoteStatus === 'sent'}
                                        >
                                            Create New Version
                                        </Button>
                                    </Stack>

                                    <Grid container spacing={2}>
                                        <Grid xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Version Number"
                                                value={quoteVersion}
                                                onChange={(e) => setQuoteVersion(e.target.value)}
                                                disabled={quoteStatus === 'sent'}
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid xs={12} md={6}>
                                            <FormControl fullWidth size="small">
                                                <InputLabel>Status</InputLabel>
                                                <Select
                                                    value={quoteStatus}
                                                    label="Status"
                                                    onChange={(e) => setQuoteStatus(e.target.value)}
                                                >
                                                    <MenuItem value="draft">Draft</MenuItem>
                                                    <MenuItem value="sent">Sent</MenuItem>
                                                    <MenuItem value="approved">Approved</MenuItem>
                                                    <MenuItem value="rejected">Rejected</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>

                                    {quoteStatus === 'sent' && (
                                        <Alert severity="warning" sx={{ mt: 2 }}>
                                            Quote has been sent. Create a new version to make changes.
                                        </Alert>
                                    )}
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>

                    {/* Sidebar */}
                    <Grid xs={12} lg={4}>
                        <Stack spacing={3}>
                            {/* Actions */}
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" fontWeight={600} gutterBottom>
                                        Actions
                                    </Typography>

                                    <Stack spacing={2}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            size="large"
                                            startIcon={<EmailOutlined />}
                                            onClick={() => setEmailDialogOpen(true)}
                                            disabled={quoteStatus === 'sent'}
                                        >
                                            Send to Client
                                        </Button>

                                        <Stack direction="row" spacing={1}>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                startIcon={<SaveOutlined />}
                                                onClick={() => console.log('Save draft')}
                                            >
                                                Save Draft
                                            </Button>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                startIcon={<VisibilityOutlined />}
                                                onClick={() => console.log('Preview PDF')}
                                            >
                                                Preview
                                            </Button>
                                        </Stack>

                                        <Stack direction="row" spacing={1}>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                startIcon={<DownloadOutlined />}
                                                onClick={() => console.log('Download PDF')}
                                            >
                                                Download
                                            </Button>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                startIcon={<PrintOutlined />}
                                                onClick={() => console.log('Print')}
                                            >
                                                Print
                                            </Button>
                                        </Stack>
                                    </Stack>
                                </CardContent>
                            </Card>

                            {/* Follow-up Reminder */}
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" fontWeight={600} gutterBottom>
                                        Follow-up Reminder
                                    </Typography>

                                    <Stack spacing={2}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={followUpEnabled}
                                                    onChange={(e) => setFollowUpEnabled(e.target.checked)}
                                                />
                                            }
                                            label="Enable automatic reminder"
                                        />

                                        {followUpEnabled && (
                                            <>
                                                <TextField
                                                    fullWidth
                                                    type="number"
                                                    label="Days after sending"
                                                    value={followUpDays}
                                                    onChange={(e) => {
                                                        const days = parseInt(e.target.value) || 0;
                                                        setFollowUpDays(days);
                                                        setFollowUpDate(dayjs().add(days, 'day'));
                                                    }}
                                                    size="small"
                                                    InputProps={{
                                                        endAdornment: 'days'
                                                    }}
                                                />

                                                <DateTimePicker
                                                    label="Reminder Date"
                                                    value={followUpDate}
                                                    onChange={setFollowUpDate}
                                                    slotProps={{
                                                        textField: {
                                                            fullWidth: true,
                                                            size: 'small'
                                                        }
                                                    }}
                                                />

                                                <Alert severity="info">
                                                    Reminder will be sent if no response received by {followUpDate?.format('MMM DD, YYYY HH:mm')}
                                                </Alert>
                                            </>
                                        )}
                                    </Stack>
                                </CardContent>
                            </Card>

                            {/* Activity Log with Timeline */}
                            <ActivityLogCard>
                                <CardContent>
                                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                                        <Typography variant="h6" fontWeight={600}>
                                            <HistoryOutlined sx={{ mr: 1, verticalAlign: 'middle' }} />
                                            Activity Timeline
                                        </Typography>
                                        <IconButton
                                            size="small"
                                            onClick={() => setActivityLogExpanded(!activityLogExpanded)}
                                        >
                                            {activityLogExpanded ? <ExpandLessOutlined /> : <ExpandMoreOutlined />}
                                        </IconButton>
                                    </Stack>

                                    <Timeline position="left">
                                        {mockQuoteData.activityLog
                                            .slice(0, activityLogExpanded ? undefined : 3)
                                            .map((activity) => (
                                                <TimelineItem key={activity.id}>
                                                    <TimelineOppositeContent sx={{ flex: 0.3 }}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {dayjs(activity.timestamp).format('HH:mm')}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary" display="block">
                                                            {dayjs(activity.timestamp).fromNow()}
                                                        </Typography>
                                                    </TimelineOppositeContent>
                                                    <TimelineSeparator>
                                                        <TimelineDot color={getActivityColor(activity.type) as any}>
                                                            {getActivityIcon(activity.type)}
                                                        </TimelineDot>
                                                        <TimelineConnector />
                                                    </TimelineSeparator>
                                                    <TimelineContent>
                                                        <Typography variant="body2" fontWeight={600}>
                                                            {activity.details}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            by {activity.user}
                                                        </Typography>
                                                    </TimelineContent>
                                                </TimelineItem>
                                            ))}
                                    </Timeline>

                                    {mockQuoteData.activityLog.length > 3 && (
                                        <Button
                                            size="small"
                                            onClick={() => setActivityLogExpanded(!activityLogExpanded)}
                                            sx={{ mt: 1 }}
                                        >
                                            {activityLogExpanded ? 'Show Less' : `Show All (${mockQuoteData.activityLog.length})`}
                                        </Button>
                                    )}
                                </CardContent>
                            </ActivityLogCard>

                            {/* Quote Metadata */}
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" fontWeight={600} gutterBottom>
                                        Quote Information
                                    </Typography>

                                    <Stack spacing={2}>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography variant="body2" color="text.secondary">
                                                Created by:
                                            </Typography>
                                            <Typography variant="body2" fontWeight={600}>
                                                {mockQuoteData.createdBy}
                                            </Typography>
                                        </Stack>

                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography variant="body2" color="text.secondary">
                                                Created:
                                            </Typography>
                                            <Typography variant="body2" fontWeight={600}>
                                                {dayjs(mockQuoteData.createdAt).format('MMM DD, YYYY HH:mm')}
                                            </Typography>
                                        </Stack>

                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography variant="body2" color="text.secondary">
                                                Valid until:
                                            </Typography>
                                            <Typography variant="body2" fontWeight={600}>
                                                {dayjs(mockQuoteData.validUntil).format('MMM DD, YYYY')}
                                            </Typography>
                                        </Stack>

                                        {mockQuoteData.clonedFrom && (
                                            <Stack direction="row" justifyContent="space-between">
                                                <Typography variant="body2" color="text.secondary">
                                                    Cloned from:
                                                </Typography>
                                                <Typography variant="body2" fontWeight={600}>
                                                    {mockQuoteData.clonedFrom}
                                                </Typography>
                                            </Stack>
                                        )}

                                        <Divider />

                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography variant="body2" color="text.secondary">
                                                Current version:
                                            </Typography>
                                            <VersionChip label={quoteVersion} size="small" />
                                        </Stack>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>
                </Grid>

                {/* Email Dialog */}
                <Dialog open={emailDialogOpen} onClose={() => setEmailDialogOpen(false)} maxWidth="md" fullWidth>
                    <DialogTitle>
                        <EmailOutlined sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Send Quote to Client
                    </DialogTitle>
                    <DialogContent>
                        <Stack spacing={3} sx={{ mt: 1 }}>
                            <Grid container spacing={2}>
                                <Grid xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="To"
                                        value={mockQuoteData.client.email}
                                        disabled
                                        size="small"
                                    />
                                </Grid>
                                <Grid xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="CC (Optional)"
                                        placeholder="additional@email.com"
                                        size="small"
                                    />
                                </Grid>
                            </Grid>

                            <TextField
                                fullWidth
                                label="Subject"
                                value={processEmailTemplate(emailTemplate.subject)}
                                onChange={(e) => setEmailTemplate({
                                    ...emailTemplate,
                                    subject: e.target.value
                                })}
                                size="small"
                            />

                            <TextField
                                fullWidth
                                multiline
                                rows={12}
                                label="Email Message"
                                value={`${processEmailTemplate(emailTemplate.greeting)}

${processEmailTemplate(emailTemplate.body)}

${processEmailTemplate(emailTemplate.closing)}

${processEmailTemplate(emailTemplate.signature)}`}
                                onChange={() => {
                                    console.log('Email content updated');
                                }}
                            />

                            <Alert severity="info" icon={<AttachFileOutlined />}>
                                Quote PDF will be automatically attached to this email
                            </Alert>

                            {followUpEnabled && (
                                <Alert severity="success" icon={<EventAvailableOutlined />}>
                                    Follow-up reminder scheduled for {followUpDate?.format('MMM DD, YYYY HH:mm')}
                                </Alert>
                            )}
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setEmailDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSendQuote}
                            startIcon={<SendOutlined />}
                        >
                            Send Quote
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </LocalizationProvider>
    );
};

export default ReviewAndSend;