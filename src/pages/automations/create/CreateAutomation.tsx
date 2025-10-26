import React, { useState } from 'react';
import {
    Box,
    Card,
    Typography,
    Stack,
    Button,
    IconButton,
    Chip,
    MenuItem,
    Select,
    Divider,
    Tooltip,
    Avatar,
    Container,
    Tabs,
    Tab,
    Switch,
    FormControlLabel,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Badge,
    InputAdornment,
    Autocomplete,
    Checkbox,
    FormGroup,
    FormControl,
    FormLabel,
    OutlinedInput,
} from '@mui/material';
import {
    AddCircleOutline,
    DeleteOutline,
    ArrowForward,
    SettingsEthernet,
    EmailOutlined,
    ReceiptLongOutlined,
    PeopleAltOutlined,
    CheckCircleOutline,
    RateReviewOutlined,
    EventAvailableOutlined,
    CloseOutlined,
    GroupOutlined,
    PersonOutline,
    EditOutlined,
    VisibilityOutlined,
    HistoryOutlined,
    StarOutline,
    WarningAmberOutlined,
    SaveOutlined,
    PlayArrow,
    Pause,
    FilterAltOutlined,
    ScheduleOutlined,
    AttachMoneyOutlined,
    LocationOnOutlined,
    AssignmentTurnedInOutlined,
    AssignmentLateOutlined,
    AssignmentIndOutlined,
    AssignmentOutlined,
    SupervisorAccountOutlined,
    FlagOutlined,
    CalendarMonthOutlined,
    InfoOutlined,
} from '@mui/icons-material';

// Triggers and actions
const triggers = [
    { value: 'booking_confirmed', label: 'Booking is confirmed', icon: <CheckCircleOutline /> },
    { value: 'tour_closed', label: 'Tour is closed', icon: <CloseOutlined /> },
    { value: 'participant_added', label: 'Participant added', icon: <PeopleAltOutlined /> },
    { value: 'date_reached', label: 'Tour date reached', icon: <EventAvailableOutlined /> },
    { value: 'payment_received', label: 'Payment received', icon: <ReceiptLongOutlined /> },
    { value: 'task_overdue', label: 'Task overdue', icon: <AssignmentLateOutlined /> },
    { value: 'new_message', label: 'New message received', icon: <EmailOutlined /> },
    { value: 'location_changed', label: 'Tour location changed', icon: <LocationOnOutlined /> },
    { value: 'manager_flagged', label: 'Manager flagged issue', icon: <FlagOutlined /> },
];

const actions = [
    { value: 'generate_invoice', label: 'Generate invoice', icon: <ReceiptLongOutlined /> },
    { value: 'email_client', label: 'Email client', icon: <EmailOutlined /> },
    { value: 'email_supplier', label: 'Email supplier', icon: <EmailOutlined /> },
    { value: 'send_survey', label: 'Send survey', icon: <RateReviewOutlined /> },
    { value: 'notify_team', label: 'Notify team', icon: <GroupOutlined /> },
    { value: 'assign_task', label: 'Assign task', icon: <PersonOutline /> },
    { value: 'update_calendar', label: 'Update calendar', icon: <CalendarMonthOutlined /> },
    { value: 'flag_issue', label: 'Flag issue', icon: <FlagOutlined /> },
    { value: 'add_note', label: 'Add note to booking', icon: <AssignmentIndOutlined /> },
    { value: 'set_reminder', label: 'Set reminder', icon: <ScheduleOutlined /> },
    { value: 'update_budget', label: 'Update budget', icon: <AttachMoneyOutlined /> },
];

const scopes = [
    { value: 'team', label: 'Team-wide', icon: <GroupOutlined /> },
    { value: 'user', label: 'Just this user', icon: <PersonOutline /> },
    { value: 'custom', label: 'Custom selection', icon: <StarOutline /> },
    { value: 'role', label: 'By role', icon: <SupervisorAccountOutlined /> },
];

const variables = [
    { value: 'tour_id', label: 'Tour ID' },
    { value: 'booking_id', label: 'Booking ID' },
    { value: 'client_email', label: 'Client Email' },
    { value: 'supplier_email', label: 'Supplier Email' },
    { value: 'tour_date', label: 'Tour Date' },
    { value: 'manager_name', label: 'Manager Name' },
    { value: 'location', label: 'Location' },
    { value: 'budget', label: 'Budget' },
    { value: 'participant_count', label: 'Participant Count' },
    { value: 'task_id', label: 'Task ID' },
];

const conditions = [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Does not equal' },
    { value: 'contains', label: 'Contains' },
    { value: 'greater_than', label: 'Greater than' },
    { value: 'less_than', label: 'Less than' },
    { value: 'is_empty', label: 'Is empty' },
    { value: 'is_not_empty', label: 'Is not empty' },
];

interface Condition {
    variable: string;
    condition: string;
    value: string;
}

interface Rule {
    id: string;
    name: string;
    trigger: string;
    actions: string[];
    scope: string;
    enabled: boolean;
    lastRun?: string;
    error?: string;
    conditions?: Condition[];
    schedule?: string;
    notes?: string;
    priority?: string;
    tags?: string[];
}

const mockHistory = [
    { id: '1', ruleName: 'Booking Confirmed Automation', status: 'Success', time: '2025-10-25 14:32' },
    { id: '2', ruleName: 'Tour Closed Survey', status: 'Failed', time: '2025-10-24 09:12' },
];

const mockTemplates = [
    { id: 'tpl1', name: 'Invoice & Email on Booking', trigger: 'booking_confirmed', actions: ['generate_invoice', 'email_client', 'email_supplier'], scope: 'team' },
    { id: 'tpl2', name: 'Survey on Tour Close', trigger: 'tour_closed', actions: ['send_survey'], scope: 'team' },
    { id: 'tpl3', name: 'Flag Overdue Tasks', trigger: 'task_overdue', actions: ['flag_issue', 'notify_team'], scope: 'role' },
];

const tagOptions = ['Finance', 'Urgent', 'Survey', 'Supplier', 'Client', 'Internal', 'Follow-up'];

const CreateAutomation = () => {
    const [rules, setRules] = useState<Rule[]>([]);
    const [editingRule, setEditingRule] = useState<Rule | null>(null);
    const [tab, setTab] = useState(0);
    const [showTemplates, setShowTemplates] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    // Add new rule
    const handleAddRule = () => {
        setEditingRule({
            id: Date.now().toString(),
            name: '',
            trigger: '',
            actions: [],
            scope: 'team',
            enabled: true,
            conditions: [],
            schedule: '',
            notes: '',
            priority: 'Normal',
            tags: [],
        });
    };

    // Save rule
    const handleSaveRule = () => {
        if (!editingRule) return;
        setRules(prev =>
            prev.some(r => r.id === editingRule.id)
                ? prev.map(r => (r.id === editingRule.id ? editingRule : r))
                : [...prev, editingRule]
        );
        setEditingRule(null);
    };

    // Delete rule
    const handleDeleteRule = (id: string) => {
        setRules(prev => prev.filter(r => r.id !== id));
    };

    // Toggle rule enabled/disabled
    const handleToggleRule = (id: string) => {
        setRules(prev =>
            prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r)
        );
    };

    // Load template
    const handleLoadTemplate = (tpl: typeof mockTemplates[0]) => {
        setEditingRule({
            id: Date.now().toString(),
            name: tpl.name,
            trigger: tpl.trigger,
            actions: tpl.actions,
            scope: tpl.scope,
            enabled: true,
            conditions: [],
            schedule: '',
            notes: '',
            priority: 'Normal',
            tags: [],
        });
        setShowTemplates(false);
    };

    // Add condition
    const handleAddCondition = () => {
        if (!editingRule) return;
        setEditingRule({
            ...editingRule,
            conditions: [
                ...(editingRule.conditions || []),
                { variable: '', condition: '', value: '' }
            ]
        });
    };

    // Update condition
    const handleUpdateCondition = (idx: number, field: keyof Condition, value: string) => {
        if (!editingRule) return;
        const updated = [...(editingRule.conditions || [])];
        updated[idx][field] = value;
        setEditingRule({ ...editingRule, conditions: updated });
    };

    // Remove condition
    const handleRemoveCondition = (idx: number) => {
        if (!editingRule) return;
        const updated = [...(editingRule.conditions || [])];
        updated.splice(idx, 1);
        setEditingRule({ ...editingRule, conditions: updated });
    };

    return (
        <Container maxWidth="xl" sx={{ py: 6 }}>
            <Typography variant="h3" fontWeight={800} gutterBottom>
                Manager Automation Studio
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Build powerful automations and rules to cut workload, boost efficiency, and keep your team in sync. No code required.
            </Typography>

            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 4 }}>
                <Tab label="My Automations" />
                <Tab label="Templates" onClick={() => setShowTemplates(true)} />
                <Tab label="History" onClick={() => setShowHistory(true)} />
                <Tab label="Help & Tips" />
            </Tabs>

            {/* Main Automations Tab */}
            {tab === 0 && (
                <Card sx={{ p: 4, mb: 4, borderRadius: 3, boxShadow: 4 }}>
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                        <SettingsEthernet color="primary" sx={{ fontSize: 32 }} />
                        <Typography variant="h5" fontWeight={700}>
                            Your Automations
                        </Typography>
                        <Box flexGrow={1} />
                        <Button
                            variant="contained"
                            startIcon={<AddCircleOutline />}
                            onClick={handleAddRule}
                        >
                            Add Rule
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<StarOutline />}
                            onClick={() => setShowTemplates(true)}
                        >
                            Use Template
                        </Button>
                    </Stack>
                    <Divider sx={{ mb: 2 }} />

                    {/* List of rules */}
                    <Stack spacing={3}>
                        {rules.length === 0 && (
                            <Typography color="text.secondary">No automations yet. Click "Add Rule" or "Use Template" to get started!</Typography>
                        )}
                        {rules.map(rule => (
                            <Card key={rule.id} sx={{ p: 2, borderRadius: 2, boxShadow: 1, bgcolor: rule.enabled ? 'background.paper' : 'grey.100' }}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Chip
                                        avatar={<Avatar>{triggers.find(t => t.value === rule.trigger)?.icon}</Avatar>}
                                        label={triggers.find(t => t.value === rule.trigger)?.label || 'Select trigger'}
                                        color="primary"
                                        sx={{ fontWeight: 600, fontSize: '1rem' }}
                                    />
                                    <ArrowForward color="action" />
                                    <Stack direction="row" spacing={1}>
                                        {rule.actions.map(action => (
                                            <Chip
                                                key={action}
                                                avatar={<Avatar>{actions.find(a => a.value === action)?.icon}</Avatar>}
                                                label={actions.find(a => a.value === action)?.label}
                                                color="secondary"
                                                sx={{ fontWeight: 600, fontSize: '1rem' }}
                                            />
                                        ))}
                                    </Stack>
                                    <ArrowForward color="action" />
                                    <Chip
                                        avatar={<Avatar>{scopes.find(s => s.value === rule.scope)?.icon}</Avatar>}
                                        label={scopes.find(s => s.value === rule.scope)?.label}
                                        color="info"
                                        sx={{ fontWeight: 600, fontSize: '1rem' }}
                                    />
                                    <Box flexGrow={1} />
                                    <Stack direction="row" spacing={1}>
                                        {rule.tags?.map(tag => (
                                            <Chip key={tag} label={tag} size="small" color="default" />
                                        ))}
                                    </Stack>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={rule.enabled}
                                                onChange={() => handleToggleRule(rule.id)}
                                                color="success"
                                            />
                                        }
                                        label={rule.enabled ? "Enabled" : "Disabled"}
                                    />
                                    <Tooltip title="Edit">
                                        <IconButton onClick={() => setEditingRule(rule)}>
                                            <EditOutlined />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton onClick={() => handleDeleteRule(rule.id)}>
                                            <DeleteOutline />
                                        </IconButton>
                                    </Tooltip>
                                    {rule.error && (
                                        <Tooltip title={rule.error}>
                                            <WarningAmberOutlined color="error" />
                                        </Tooltip>
                                    )}
                                </Stack>
                                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        {rule.name || 'No name'}
                                    </Typography>
                                    {rule.lastRun && (
                                        <Typography variant="caption" color="text.secondary">
                                            Last run: {rule.lastRun}
                                        </Typography>
                                    )}
                                    {rule.priority && (
                                        <Chip label={rule.priority} size="small" color={rule.priority === 'Urgent' ? 'error' : 'primary'} />
                                    )}
                                </Stack>
                                {rule.conditions && rule.conditions.length > 0 && (
                                    <Box sx={{ mt: 1 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            <FilterAltOutlined fontSize="small" /> Conditions:
                                        </Typography>
                                        <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                                            {rule.conditions.map((cond, idx) => (
                                                <Chip
                                                    key={idx}
                                                    label={`${variables.find(v => v.value === cond.variable)?.label || cond.variable} ${conditions.find(c => c.value === cond.condition)?.label || cond.condition} ${cond.value}`}
                                                    size="small"
                                                    color="info"
                                                />
                                            ))}
                                        </Stack>
                                    </Box>
                                )}
                                {rule.schedule && (
                                    <Box sx={{ mt: 1 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            <ScheduleOutlined fontSize="small" /> Scheduled: {rule.schedule}
                                        </Typography>
                                    </Box>
                                )}
                                {rule.notes && (
                                    <Box sx={{ mt: 1 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            <InfoOutlined fontSize="small" /> {rule.notes}
                                        </Typography>
                                    </Box>
                                )}
                            </Card>
                        ))}
                    </Stack>
                </Card>
            )}

            {/* Rule editor */}
            {editingRule && (
                <Dialog
                    open={!!editingRule}
                    onClose={() => setEditingRule(null)}
                    maxWidth="md"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 4,
                            boxShadow: 12,
                            p: 0,
                            overflow: 'hidden',
                            background: 'linear-gradient(135deg, #f8fafc 0%, #fff 100%)',
                        }
                    }}
                >
                    <DialogTitle
                        sx={{
                            px: 4,
                            py: 3,
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            fontWeight: 700,
                            fontSize: '1.5rem',
                            letterSpacing: 0.5,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                        }}
                    >
                        <SettingsEthernet sx={{ mr: 1 }} />
                        {editingRule.id ? 'Edit Automation Rule' : 'Create Automation Rule'}
                    </DialogTitle>
                    <DialogContent sx={{ px: 4, py: 3 }}>
                        <Stack spacing={3}>
                            <TextField
                                label="Rule Name"
                                value={editingRule.name}
                                onChange={e => setEditingRule({ ...editingRule, name: e.target.value })}
                                fullWidth
                                required
                                variant="filled"
                                InputProps={{
                                    sx: { fontWeight: 700, fontSize: '1.2rem', bgcolor: '#f3f6fa' }
                                }}
                            />
                            <Autocomplete
                                options={tagOptions}
                                multiple
                                value={editingRule.tags || []}
                                onChange={(_, val) => setEditingRule({ ...editingRule, tags: val })}
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        label="Tags"
                                        variant="filled"
                                        InputProps={{
                                            ...params.InputProps,
                                            sx: { bgcolor: '#f3f6fa' }
                                        }}
                                    />
                                )}
                            />
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                <Select
                                    value={editingRule.trigger}
                                    onChange={e =>
                                        setEditingRule({ ...editingRule, trigger: e.target.value as string })
                                    }
                                    displayEmpty
                                    fullWidth
                                    variant="filled"
                                    sx={{ minWidth: 220, bgcolor: '#f3f6fa' }}
                                >
                                    <MenuItem value="" disabled>
                                        <Typography color="text.secondary">When...</Typography>
                                    </MenuItem>
                                    {triggers.map(trigger => (
                                        <MenuItem key={trigger.value} value={trigger.value}>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                {trigger.icon}
                                                <span>{trigger.label}</span>
                                            </Stack>
                                        </MenuItem>
                                    ))}
                                </Select>
                                <Select
                                    multiple
                                    value={editingRule.actions}
                                    onChange={e =>
                                        setEditingRule({
                                            ...editingRule,
                                            actions: typeof e.target.value === 'string'
                                                ? [e.target.value]
                                                : e.target.value as string[]
                                        })
                                    }
                                    displayEmpty
                                    fullWidth
                                    variant="filled"
                                    sx={{ minWidth: 220, bgcolor: '#f3f6fa' }}
                                    renderValue={selected => selected.length === 0
                                        ? 'Then...'
                                        : (selected as string[])
                                            .map(val => actions.find(a => a.value === val)?.label)
                                            .join(', ')
                                    }
                                >
                                    <MenuItem value="" disabled>
                                        <Typography color="text.secondary">Then...</Typography>
                                    </MenuItem>
                                    {actions.map(action => (
                                        <MenuItem key={action.value} value={action.value}>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                {action.icon}
                                                <span>{action.label}</span>
                                            </Stack>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Stack>
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                <Select
                                    value={editingRule.scope}
                                    onChange={e =>
                                        setEditingRule({ ...editingRule, scope: e.target.value as string })
                                    }
                                    displayEmpty
                                    fullWidth
                                    variant="filled"
                                    sx={{ minWidth: 220, bgcolor: '#f3f6fa' }}
                                >
                                    {scopes.map(scope => (
                                        <MenuItem key={scope.value} value={scope.value}>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                {scope.icon}
                                                <span>{scope.label}</span>
                                            </Stack>
                                        </MenuItem>
                                    ))}
                                </Select>
                                <Select
                                    value={editingRule.priority || 'Normal'}
                                    onChange={e => setEditingRule({ ...editingRule, priority: e.target.value as string })}
                                    fullWidth
                                    variant="filled"
                                    sx={{ minWidth: 220, bgcolor: '#f3f6fa' }}
                                >
                                    <MenuItem value="Normal">Normal</MenuItem>
                                    <MenuItem value="Urgent">Urgent</MenuItem>
                                    <MenuItem value="Low">Low</MenuItem>
                                </Select>
                            </Stack>
                            <TextField
                                label="Notes"
                                value={editingRule.notes}
                                onChange={e => setEditingRule({ ...editingRule, notes: e.target.value })}
                                fullWidth
                                multiline
                                minRows={2}
                                variant="filled"
                                InputProps={{ sx: { bgcolor: '#f3f6fa' } }}
                            />
                            <TextField
                                label="Schedule (e.g. Every Monday, 9am)"
                                value={editingRule.schedule}
                                onChange={e => setEditingRule({ ...editingRule, schedule: e.target.value })}
                                fullWidth
                                variant="filled"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <ScheduleOutlined />
                                        </InputAdornment>
                                    ),
                                    sx: { bgcolor: '#f3f6fa' }
                                }}
                            />
                            {/* Conditions */}
                            <Box>
                                <FormLabel sx={{ fontWeight: 700, mb: 1 }}>Conditions (optional)</FormLabel>
                                <Stack spacing={2}>
                                    {editingRule.conditions?.map((cond, idx) => (
                                        <Stack direction="row" spacing={1} alignItems="center" key={idx}>
                                            <Select
                                                value={cond.variable}
                                                onChange={e => handleUpdateCondition(idx, 'variable', e.target.value as string)}
                                                sx={{ minWidth: 120, bgcolor: '#f3f6fa' }}
                                                variant="filled"
                                            >
                                                {variables.map(v => (
                                                    <MenuItem key={v.value} value={v.value}>{v.label}</MenuItem>
                                                ))}
                                            </Select>
                                            <Select
                                                value={cond.condition}
                                                onChange={e => handleUpdateCondition(idx, 'condition', e.target.value as string)}
                                                sx={{ minWidth: 120, bgcolor: '#f3f6fa' }}
                                                variant="filled"
                                            >
                                                {conditions.map(c => (
                                                    <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>
                                                ))}
                                            </Select>
                                            <OutlinedInput
                                                value={cond.value}
                                                onChange={e => handleUpdateCondition(idx, 'value', e.target.value)}
                                                placeholder="Value"
                                                sx={{ minWidth: 120, bgcolor: '#f3f6fa' }}
                                            />
                                            <Tooltip title="Remove condition">
                                                <IconButton onClick={() => handleRemoveCondition(idx)} size="small" color="error">
                                                    <DeleteOutline />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    ))}
                                    <Button
                                        variant="outlined"
                                        startIcon={<FilterAltOutlined />}
                                        onClick={handleAddCondition}
                                        sx={{ mt: 1, alignSelf: 'flex-start' }}
                                    >
                                        Add Condition
                                    </Button>
                                </Stack>
                            </Box>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={editingRule.enabled}
                                        onChange={e =>
                                            setEditingRule({ ...editingRule, enabled: e.target.checked })
                                        }
                                        color="success"
                                    />
                                }
                                label={editingRule.enabled ? "Enabled" : "Disabled"}
                                sx={{ mt: 2, fontWeight: 700 }}
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ px: 4, py: 3, bgcolor: '#f8fafc', borderTop: '1px solid #e0e7ef' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSaveRule}
                            disabled={
                                !editingRule.name ||
                                !editingRule.trigger ||
                                editingRule.actions.length === 0
                            }
                            startIcon={<SaveOutlined />}
                            sx={{ fontWeight: 700, px: 4, py: 1.5, fontSize: '1.1rem', borderRadius: 2 }}
                        >
                            Save Rule
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => setEditingRule(null)}
                            sx={{ fontWeight: 700, px: 4, py: 1.5, fontSize: '1.1rem', borderRadius: 2 }}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            {/* Templates Dialog */}
            <Dialog open={showTemplates} onClose={() => setShowTemplates(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Automation Templates</DialogTitle>
                <DialogContent>
                    <List>
                        {mockTemplates.map(tpl => (
                            <ListItem key={tpl.id} button onClick={() => handleLoadTemplate(tpl)}>
                                <ListItemText
                                    primary={tpl.name}
                                    secondary={`When: ${triggers.find(t => t.value === tpl.trigger)?.label}, Then: ${tpl.actions.map(a => actions.find(act => act.value === a)?.label).join(', ')}`}
                                />
                                <ListItemSecondaryAction>
                                    <Chip
                                        avatar={<Avatar>{scopes.find(s => s.value === tpl.scope)?.icon}</Avatar>}
                                        label={scopes.find(s => s.value === tpl.scope)?.label}
                                        color="info"
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowTemplates(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* History Dialog */}
            <Dialog open={showHistory} onClose={() => setShowHistory(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Automation History</DialogTitle>
                <DialogContent>
                    <List>
                        {mockHistory.map(h => (
                            <ListItem key={h.id}>
                                <ListItemText
                                    primary={h.ruleName}
                                    secondary={`Status: ${h.status} • ${h.time}`}
                                />
                                <Badge
                                    color={h.status === 'Success' ? 'success' : 'error'}
                                    badgeContent={h.status}
                                />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowHistory(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Help & Tips Tab */}
            {tab === 3 && (
                <Card sx={{ p: 4, borderRadius: 3, boxShadow: 2 }}>
                    <Typography variant="h5" fontWeight={700} gutterBottom>
                        Help & Tips
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        <ul>
                            <li>Use <b>Templates</b> to quickly set up common automations.</li>
                            <li>Set <b>Scope</b> to control who the rule applies to: team-wide, just you, custom, or by role.</li>
                            <li>Enable/disable rules with the switch for easy control.</li>
                            <li>Check <b>History</b> for past automation runs and errors.</li>
                            <li>Give your rules clear names and tags for easy management.</li>
                            <li>Add <b>Conditions</b> to make rules context-aware (e.g. only for certain tours, budgets, or dates).</li>
                            <li>Set <b>Priority</b> and <b>Notes</b> for team clarity.</li>
                            <li>Use <b>Scheduling</b> for recurring automations.</li>
                        </ul>
                    </Typography>
                </Card>
            )}
        </Container>
    );
};

export default CreateAutomation;