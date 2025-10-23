import React, { useState } from 'react';
import {
    Box,
    Avatar,
    Typography,
    IconButton,
    Badge,
    Menu,
    MenuItem,
    Divider,
    Stack,
    Chip,
    Button,
    alpha,
    useTheme,
    Tooltip,
    Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    NotificationsOutlined,
    SettingsOutlined,
    SearchOutlined,
    MenuOutlined,
    KeyboardArrowDownOutlined,
    LogoutOutlined,
    PersonOutlined,
    DarkModeOutlined,
    LightModeOutlined,
    HelpOutlineOutlined,
    BusinessOutlined,
    TrendingUpOutlined,
    FlightTakeoffOutlined,
} from '@mui/icons-material';
import type { User } from '../../../../interfaces/Auth/Auth';

// Styled Components
const HeaderContainer = styled(Box)(({ theme }) => ({
    background: `linear-gradient(135deg, 
        ${theme.palette.primary.main} 0%, 
        ${theme.palette.primary.dark} 50%, 
        ${theme.palette.secondary.main} 100%)`,
    backdropFilter: 'blur(20px)',
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    position: 'sticky',
    top: 0,
    zIndex: 1200,
    padding: theme.spacing(2, 3),
    boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.15)}`,
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `linear-gradient(45deg, 
            ${alpha('#fff', 0.1)} 25%, 
            transparent 25%, 
            transparent 50%, 
            ${alpha('#fff', 0.1)} 50%, 
            ${alpha('#fff', 0.1)} 75%, 
            transparent 75%)`,
        backgroundSize: '20px 20px',
        opacity: 0.3,
        animation: 'shimmer 20s linear infinite',
        pointerEvents: 'none',
    },
    '@keyframes shimmer': {
        '0%': { backgroundPosition: '0 0' },
        '100%': { backgroundPosition: '20px 20px' },
    },
}));

const BrandSection = styled(Stack)(({ theme }) => ({
    alignItems: 'center',
    gap: theme.spacing(2),
    color: 'white',
    position: 'relative',
    zIndex: 1,
    '& .brand-logo': {
        width: 48,
        height: 48,
        background: `linear-gradient(135deg, ${alpha('#fff', 0.2)} 0%, ${alpha('#fff', 0.1)} 100%)`,
        backdropFilter: 'blur(10px)',
        border: `2px solid ${alpha('#fff', 0.3)}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '12px',
        boxShadow: `0 8px 25px ${alpha(theme.palette.primary.dark, 0.3)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
            transform: 'rotate(5deg) scale(1.05)',
            boxShadow: `0 12px 35px ${alpha(theme.palette.primary.dark, 0.4)}`,
        }
    },
    '& .brand-text': {
        display: { xs: 'none', md: 'block' }
    }
}));

const StatusIndicator = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(0.5, 1.5),
    background: alpha('#fff', 0.15),
    backdropFilter: 'blur(10px)',
    border: `1px solid ${alpha('#fff', 0.2)}`,
    borderRadius: 20,
    color: 'white',
    fontSize: '0.875rem',
    fontWeight: 500,
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
    color: 'white',
    background: alpha('#fff', 0.1),
    backdropFilter: 'blur(10px)',
    border: `1px solid ${alpha('#fff', 0.2)}`,
    width: 44,
    height: 44,
    transition: 'all 0.3s ease',
    '&:hover': {
        background: alpha('#fff', 0.2),
        transform: 'translateY(-2px)',
        boxShadow: `0 8px 25px ${alpha(theme.palette.primary.dark, 0.3)}`,
    }
}));

const UserSection = styled(Stack)(({ theme }) => ({
    alignItems: 'center',
    gap: theme.spacing(2),
    color: 'white',
    cursor: 'pointer',
    padding: theme.spacing(1, 2),
    borderRadius: 16,
    transition: 'all 0.3s ease',
    background: alpha('#fff', 0.1),
    backdropFilter: 'blur(10px)',
    border: `1px solid ${alpha('#fff', 0.2)}`,
    '&:hover': {
        background: alpha('#fff', 0.2),
        transform: 'translateY(-2px)',
        boxShadow: `0 8px 25px ${alpha(theme.palette.primary.dark, 0.2)}`,
    }
}));

const StatsCard = styled(Paper)(({ theme }) => ({
    background: alpha('#fff', 0.15),
    backdropFilter: 'blur(15px)',
    border: `1px solid ${alpha('#fff', 0.2)}`,
    borderRadius: 16,
    padding: theme.spacing(1.5, 2),
    color: 'white',
    textAlign: 'center',
    minWidth: 120,
    transition: 'all 0.3s ease',
    '&:hover': {
        background: alpha('#fff', 0.25),
        transform: 'translateY(-3px)',
        boxShadow: `0 12px 35px ${alpha(theme.palette.primary.dark, 0.3)}`,
    }
}));

const NotificationBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        background: `linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)`,
        color: 'white',
        fontWeight: 600,
        boxShadow: `0 2px 8px ${alpha('#FF6B6B', 0.3)}`,
        animation: 'pulse 2s infinite',
    },
    '@keyframes pulse': {
        '0%': { transform: 'scale(1)' },
        '50%': { transform: 'scale(1.1)' },
        '100%': { transform: 'scale(1)' },
    },
}));

interface DashboardHeaderProps {
    user: User;
    onMenuToggle?: () => void;
    onThemeToggle?: () => void;
    isDarkMode?: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    user,
    onMenuToggle,
    onThemeToggle,
    isDarkMode = false
}) => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);

    // Mock data for demonstration
    const mockStats = {
        activeTrips: 12,
        pendingQuotes: 8,
        revenue: '€45.2K',
        satisfaction: '98%'
    };

    const mockNotifications = [
        { id: 1, title: 'New quote request from Sacred Heart College', time: '5 min ago', urgent: true },
        { id: 2, title: 'Hotel booking confirmed for Trip #QT-001', time: '1 hour ago', urgent: false },
        { id: 3, title: 'Payment received from Corporate Events Plus', time: '2 hours ago', urgent: false },
    ];

    const getStatusColor = (status: string) => {
        const colors = {
            online: '#4CAF50',
            offline: '#757575',
            busy: '#FF5722',
            away: '#FF9800'
        };
        return colors[status as keyof typeof colors] || colors.offline;
    };

    const getRoleLabel = (role: string) => {
        const labels = {
            user: 'Team Member',
            operator: 'Tour Operator',
            admin: 'Administrator'
        };
        return labels[role as keyof typeof labels] || role;
    };

    const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationOpen = (event: React.MouseEvent<HTMLElement>) => {
        setNotificationAnchor(event.currentTarget);
    };

    const handleNotificationClose = () => {
        setNotificationAnchor(null);
    };

    return (
        <>
            <HeaderContainer>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ position: 'relative', zIndex: 1 }}>
                    {/* Left Section - Brand & Navigation */}
                    <Stack direction="row" alignItems="center" spacing={3}>
                        <IconButton
                            sx={{ color: 'white', display: { xs: 'flex', md: 'none' } }}
                            onClick={onMenuToggle}
                        >
                            <MenuOutlined />
                        </IconButton>

                        <BrandSection direction="row">
                            <Box className="brand-logo">
                                <FlightTakeoffOutlined sx={{ fontSize: 24, color: 'white' }} />
                            </Box>
                            <Box className="brand-text">
                                <Typography variant="h5" fontWeight={800} sx={{
                                    background: 'linear-gradient(45deg, #fff 30%, rgba(255,255,255,0.8) 90%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}>
                                    BonVoyage
                                </Typography>
                                <Typography variant="caption" sx={{ opacity: 0.8, mt: -0.5, display: 'block' }}>
                                    Tour Operations Platform
                                </Typography>
                            </Box>
                        </BrandSection>

                        {/* Quick Stats - Hidden on small screens */}
                        <Stack direction="row" spacing={2} sx={{ display: { xs: 'none', lg: 'flex' } }}>
                            <StatsCard elevation={0}>
                                <Typography variant="h6" fontWeight={700}>
                                    {mockStats.activeTrips}
                                </Typography>
                                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                    Active Trips
                                </Typography>
                            </StatsCard>
                            <StatsCard elevation={0}>
                                <Typography variant="h6" fontWeight={700}>
                                    {mockStats.pendingQuotes}
                                </Typography>
                                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                    Pending Quotes
                                </Typography>
                            </StatsCard>
                            <StatsCard elevation={0}>
                                <Typography variant="h6" fontWeight={700} color="#4CAF50">
                                    {mockStats.revenue}
                                </Typography>
                                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                    This Month
                                </Typography>
                            </StatsCard>
                        </Stack>
                    </Stack>

                    {/* Right Section - Actions & User */}
                    <Stack direction="row" alignItems="center" spacing={2}>
                        {/* Status Indicator */}
                        <StatusIndicator sx={{ display: { xs: 'none', sm: 'flex' } }}>
                            <Box sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: getStatusColor(user.status),
                                boxShadow: `0 0 0 2px ${alpha(getStatusColor(user.status), 0.3)}`
                            }} />
                            <Typography variant="caption" sx={{ textTransform: 'capitalize' }}>
                                {user.status}
                            </Typography>
                        </StatusIndicator>

                        {/* Action Buttons */}
                        <Tooltip title="Search">
                            <ActionButton>
                                <SearchOutlined />
                            </ActionButton>
                        </Tooltip>

                        <Tooltip title="Notifications">
                            <NotificationBadge badgeContent={mockNotifications.filter(n => n.urgent).length} color="error">
                                <ActionButton onClick={handleNotificationOpen}>
                                    <NotificationsOutlined />
                                </ActionButton>
                            </NotificationBadge>
                        </Tooltip>

                        <Tooltip title="Settings">
                            <ActionButton>
                                <SettingsOutlined />
                            </ActionButton>
                        </Tooltip>

                        <Tooltip title="Toggle Theme">
                            <ActionButton onClick={onThemeToggle}>
                                {isDarkMode ? <LightModeOutlined /> : <DarkModeOutlined />}
                            </ActionButton>
                        </Tooltip>

                        {/* User Section */}
                        <UserSection direction="row" onClick={handleUserMenuOpen}>
                            <Avatar
                                src={user.avatar}
                                sx={{
                                    width: 40,
                                    height: 40,
                                    border: `2px solid ${alpha('#fff', 0.3)}`,
                                    boxShadow: `0 4px 15px ${alpha(theme.palette.primary.dark, 0.3)}`
                                }}
                            >
                                {user.firstName?.charAt(0) || user.name?.charAt(0)}
                            </Avatar>
                            <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'left' }}>
                                <Typography variant="body2" fontWeight={600}>
                                    {user.firstName ? `${user.firstName} ${user.lastName}` : user.name}
                                </Typography>
                                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                    {getRoleLabel(user.role)}
                                </Typography>
                            </Box>
                            <KeyboardArrowDownOutlined sx={{ display: { xs: 'none', sm: 'block' } }} />
                        </UserSection>
                    </Stack>
                </Stack>
            </HeaderContainer>

            {/* User Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleUserMenuClose}
                PaperProps={{
                    sx: {
                        mt: 1,
                        minWidth: 220,
                        borderRadius: 2,
                        boxShadow: `0 8px 25px ${alpha(theme.palette.common.black, 0.15)}`,
                        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
                    }
                }}
            >
                <Box sx={{ p: 2, pb: 1 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar src={user.avatar} sx={{ width: 48, height: 48 }}>
                            {user.firstName?.charAt(0) || user.name?.charAt(0)}
                        </Avatar>
                        <Box>
                            <Typography variant="body1" fontWeight={600}>
                                {user.firstName ? `${user.firstName} ${user.lastName}` : user.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {user.email}
                            </Typography>
                            <Chip
                                label={getRoleLabel(user.role)}
                                size="small"
                                color="primary"
                                sx={{ mt: 0.5, height: 20, fontSize: '0.7rem' }}
                            />
                        </Box>
                    </Stack>
                </Box>
                <Divider />
                <MenuItem onClick={handleUserMenuClose}>
                    <PersonOutlined sx={{ mr: 2 }} />
                    Profile Settings
                </MenuItem>
                <MenuItem onClick={handleUserMenuClose}>
                    <BusinessOutlined sx={{ mr: 2 }} />
                    Organization
                </MenuItem>
                <MenuItem onClick={handleUserMenuClose}>
                    <HelpOutlineOutlined sx={{ mr: 2 }} />
                    Help & Support
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleUserMenuClose} sx={{ color: 'error.main' }}>
                    <LogoutOutlined sx={{ mr: 2 }} />
                    Sign Out
                </MenuItem>
            </Menu>

            {/* Notifications Menu */}
            <Menu
                anchorEl={notificationAnchor}
                open={Boolean(notificationAnchor)}
                onClose={handleNotificationClose}
                PaperProps={{
                    sx: {
                        mt: 1,
                        minWidth: 320,
                        maxHeight: 400,
                        borderRadius: 2,
                        boxShadow: `0 8px 25px ${alpha(theme.palette.common.black, 0.15)}`,
                    }
                }}
            >
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="h6" fontWeight={600}>
                            Notifications
                        </Typography>
                        <Chip
                            label={`${mockNotifications.length} new`}
                            size="small"
                            color="primary"
                        />
                    </Stack>
                </Box>
                {mockNotifications.map((notification) => (
                    <MenuItem key={notification.id} onClick={handleNotificationClose}>
                        <Stack spacing={0.5} sx={{ width: '100%' }}>
                            <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
                                <Typography variant="body2" fontWeight={500} sx={{ flex: 1 }}>
                                    {notification.title}
                                </Typography>
                                {notification.urgent && (
                                    <Chip
                                        label="Urgent"
                                        size="small"
                                        color="error"
                                        sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                                    />
                                )}
                            </Stack>
                            <Typography variant="caption" color="text.secondary">
                                {notification.time}
                            </Typography>
                        </Stack>
                    </MenuItem>
                ))}
                <Divider />
                <Box sx={{ p: 1 }}>
                    <Button fullWidth size="small">
                        View All Notifications
                    </Button>
                </Box>
            </Menu>
        </>
    );
};

export default DashboardHeader;