import React, { useState } from 'react';
import {
    Box,
    Fab,
    Tooltip,
    Stack,
    Typography,
    IconButton,
    Zoom,
    Backdrop,
    alpha,
    useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    AddOutlined,
    SearchOutlined,
    CalendarTodayOutlined,
    InboxOutlined,
    CloseOutlined,
    RequestQuoteOutlined,
    PeopleOutlined,
    FlightTakeoffOutlined,
    NotificationsOutlined,
    MenuOutlined,
    SpeedOutlined,
    BusinessOutlined,
    AssignmentOutlined,
} from '@mui/icons-material';

// Styled Components
const QuickActionContainer = styled(Box)(({ theme }) => ({
    position: 'fixed',
    bottom: 24,
    right: 24,
    zIndex: 1300,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
        bottom: 16,
        right: 16,
    }
}));

const MainActionButton = styled(Fab)(({ theme }) => ({
    width: 64,
    height: 64,
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.4)}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
        transform: 'scale(1.1) rotate(90deg)',
        boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.5)}`,
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.main} 100%)`,
    },
    '&.open': {
        transform: 'rotate(45deg)',
        background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
    }
}));

const ActionButton = styled(Fab)(({ theme }) => ({
    width: 48,
    height: 48,
    background: `linear-gradient(135deg, ${alpha('#fff', 0.95)} 0%, ${alpha('#fff', 0.9)} 100%)`,
    backdropFilter: 'blur(20px)',
    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
    boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.1)}`,
    color: theme.palette.primary.main,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
        transform: 'scale(1.15) translateY(-2px)',
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: 'white',
        boxShadow: `0 8px 30px ${alpha(theme.palette.primary.main, 0.3)}`,
    }
}));

const ActionTooltip = styled(Box)(({ theme }) => ({
    background: `linear-gradient(135deg, ${alpha('#000', 0.9)} 0%, ${alpha('#000', 0.8)} 100%)`,
    backdropFilter: 'blur(10px)',
    color: 'white',
    padding: theme.spacing(1, 2),
    borderRadius: 8,
    fontSize: '0.875rem',
    fontWeight: 500,
    marginRight: theme.spacing(1),
    whiteSpace: 'nowrap',
    boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.3)}`,
}));

const SpeedDialContainer = styled(Stack)(({ theme }) => ({
    alignItems: 'flex-end',
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(1),
}));

const ActionItem = styled(Stack)(({ theme }) => ({
    alignItems: 'center',
    gap: theme.spacing(2),
    animation: 'slideInUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '@keyframes slideInUp': {
        '0%': {
            opacity: 0,
            transform: 'translateY(30px) scale(0.8)',
        },
        '100%': {
            opacity: 1,
            transform: 'translateY(0) scale(1)',
        }
    }
}));

// Quick action definitions
const quickActions = [
    {
        id: 'new-quote',
        label: 'New Quote',
        icon: <RequestQuoteOutlined />,
        color: '#4CAF50',
        shortcut: 'Ctrl+N',
        description: 'Create a new quotation'
    },
    {
        id: 'search-client',
        label: 'Search Client',
        icon: <SearchOutlined />,
        color: '#2196F3',
        shortcut: 'Ctrl+F',
        description: 'Find existing clients'
    },
    {
        id: 'upcoming-trips',
        label: 'Upcoming Trips',
        icon: <CalendarTodayOutlined />,
        color: '#FF9800',
        shortcut: 'Ctrl+U',
        description: 'View scheduled departures'
    },
    {
        id: 'inbox',
        label: 'Inbox',
        icon: <InboxOutlined />,
        color: '#9C27B0',
        shortcut: 'Ctrl+I',
        description: 'Check messages & notifications'
    },
    {
        id: 'active-trips',
        label: 'Active Trips',
        icon: <FlightTakeoffOutlined />,
        color: '#FF5722',
        shortcut: 'Ctrl+T',
        description: 'Manage current operations'
    }
];

interface QuickActionsProps {
    onNewQuote?: () => void;
    onSearchClient?: () => void;
    onViewUpcomingTrips?: () => void;
    onOpenInbox?: () => void;
    onViewActiveTrips?: () => void;
    notificationCount?: number;
}

const QuickActions: React.FC<QuickActionsProps> = ({
    onNewQuote,
    onSearchClient,
    onViewUpcomingTrips,
    onOpenInbox,
    onViewActiveTrips,
    notificationCount = 0
}) => {
    const theme = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleAction = (actionId: string) => {
        setIsOpen(false);

        switch (actionId) {
            case 'new-quote':
                onNewQuote?.();
                break;
            case 'search-client':
                onSearchClient?.();
                break;
            case 'upcoming-trips':
                onViewUpcomingTrips?.();
                break;
            case 'inbox':
                onOpenInbox?.();
                break;
            case 'active-trips':
                onViewActiveTrips?.();
                break;
        }
    };

    return (
        <>
            {/* Backdrop */}
            <Backdrop
                open={isOpen}
                onClick={() => setIsOpen(false)}
                sx={{
                    zIndex: 1250,
                    background: alpha('#000', 0.2),
                    backdropFilter: 'blur(4px)'
                }}
            />

            <QuickActionContainer>
                {/* Speed Dial Actions */}
                {isOpen && (
                    <SpeedDialContainer>
                        {quickActions.map((action, index) => (
                            <Zoom
                                key={action.id}
                                in={isOpen}
                                timeout={200 + (index * 100)}
                                style={{ transitionDelay: `${index * 50}ms` }}
                            >
                                <ActionItem>
                                    <ActionItem direction="row">
                                        <ActionTooltip>
                                            {action.description}
                                        </ActionTooltip>

                                        <Box sx={{ position: 'relative' }}>
                                            <ActionButton
                                                size="medium"
                                                onClick={() => handleAction(action.id)}
                                                sx={{
                                                    '&:hover': {
                                                        background: `linear-gradient(135deg, ${action.color} 0%, ${alpha(action.color, 0.8)} 100%)`,
                                                    }
                                                }}
                                            >
                                                {action.icon}
                                            </ActionButton>

                                            {/* Notification badge for inbox */}
                                            {action.id === 'inbox' && notificationCount > 0 && (
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        top: -4,
                                                        right: -4,
                                                        background: `linear-gradient(45deg, #FF1744 30%, #FF5722 90%)`,
                                                        color: 'white',
                                                        borderRadius: '50%',
                                                        width: 20,
                                                        height: 20,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 700,
                                                        boxShadow: `0 2px 8px ${alpha('#FF1744', 0.3)}`,
                                                        animation: 'pulse 2s infinite',
                                                        '@keyframes pulse': {
                                                            '0%': { transform: 'scale(1)' },
                                                            '50%': { transform: 'scale(1.1)' },
                                                            '100%': { transform: 'scale(1)' },
                                                        }
                                                    }}
                                                >
                                                    {notificationCount > 99 ? '99+' : notificationCount}
                                                </Box>
                                            )}
                                        </Box>
                                    </ActionItem>
                                </ActionItem>
                            </Zoom>
                        ))}
                    </SpeedDialContainer>
                )}

                {/* Main Toggle Button */}
                <Tooltip
                    title={isOpen ? "Close quick actions" : "Quick actions (Ctrl+Space)"}
                    placement="left"
                >
                    <MainActionButton
                        color="primary"
                        onClick={handleToggle}
                        className={isOpen ? 'open' : ''}
                    >
                        {isOpen ? <CloseOutlined /> : <SpeedOutlined />}
                    </MainActionButton>
                </Tooltip>
            </QuickActionContainer>

        </>
    );
};

export default QuickActions;