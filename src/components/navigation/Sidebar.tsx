import React, { useState } from 'react';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    useTheme,
    Collapse,
    Divider,
    Typography,
    alpha,
    IconButton,
    Tooltip,
    Avatar,
    Stack,
    Chip,
} from '@mui/material';
import { useTheme as useThemeContext } from '../../assets/theme';
import {
    ExpandMore,
    SettingsOutlined,
    PowerSettingsNew,
    Brightness4,
    Brightness7,

} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import type { NavigationalRoutes } from '../../routes/Routes';
import type { AuthUser, Status } from '../../interfaces/Auth/Auth';

interface NavigationSidebarProps {
    routes: NavigationalRoutes[];
    open?: boolean;
    onToggle?: () => void;
    width?: number;
    activeRoute?: string;
    onNavigate?: (route: string) => void;
    user?: AuthUser;
    logout?: () => void;
}


const slideIn = keyframes`
    from { transform: translateX(-100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
`;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
    '& .MuiDrawer-paper': {
        background: theme.palette.mode === 'dark'
            ? `linear-gradient(145deg, 
                ${alpha('#0a0a0a', 0.95)} 0%, 
                ${alpha('#1a1a1a', 0.98)} 25%,
                ${alpha('#0f0f23', 0.96)} 50%,
                ${alpha('#1a1a2e', 0.95)} 75%,
                ${alpha('#16213e', 0.98)} 100%)`
            : `linear-gradient(145deg, 
                ${alpha('#ffffff', 0.98)} 0%, 
                ${alpha('#f8fafc', 0.95)} 25%,
                ${alpha('#f1f5f9', 0.98)} 50%,
                ${alpha('#e2e8f0', 0.96)} 75%,
                ${alpha('#cbd5e1', 0.95)} 100%)`,
        backdropFilter: 'blur(40px) saturate(150%)',
        borderRight: theme.palette.mode === 'dark'
            ? `1px solid ${alpha('#4facfe', 0.2)}`
            : `1px solid ${alpha('#667eea', 0.15)}`,
        boxShadow: theme.palette.mode === 'dark'
            ? `20px 0 40px ${alpha('#000', 0.3)}, inset -1px 0 0 ${alpha('#4facfe', 0.1)}`
            : `20px 0 40px ${alpha('#667eea', 0.1)}, inset -1px 0 0 ${alpha('#667eea', 0.05)}`,
        transition: theme.transitions.create(['width', 'box-shadow'], {
            easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            duration: 350,
        }),
        position: 'relative',
        overflow: 'hidden',

        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, 
                ${theme.palette.primary.main} 0%, 
                ${theme.palette.secondary.main} 50%, 
                ${theme.palette.primary.main} 100%)`,
            backgroundSize: '200% 100%',
        },

        '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: theme.palette.mode === 'dark'
                ? 'radial-gradient(ellipse at top, rgba(79, 172, 254, 0.05) 0%, transparent 70%)'
                : 'radial-gradient(ellipse at top, rgba(102, 126, 234, 0.03) 0%, transparent 70%)',
            pointerEvents: 'none',
        },
    },
}));

const PremiumListItemButton = styled(ListItemButton)<{
    active?: boolean;
    nested?: boolean;
    premium?: boolean;
    isNew?: boolean;
}>(({ theme, active, nested, premium, isNew }) => ({
    borderRadius: theme.spacing(2),
    margin: theme.spacing(0.5, 2),
    minHeight: 56,
    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    position: 'relative',
    overflow: 'hidden',

    ...(nested && {
        marginLeft: theme.spacing(4),
        marginRight: theme.spacing(2),
        '&::before': {
            content: '""',
            position: 'absolute',
            left: -theme.spacing(2),
            top: '50%',
            width: 2,
            height: 20,
            borderRadius: 1,
            background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            transform: 'translateY(-50%)',
            opacity: active ? 1 : 0.3,
        },
    }),

    ...(active && {
        background: theme.palette.mode === 'dark'
            ? `linear-gradient(135deg, 
                ${alpha('#4facfe', 0.2)} 0%, 
                ${alpha('#00f2fe', 0.15)} 50%,
                ${alpha('#4facfe', 0.1)} 100%)`
            : `linear-gradient(135deg, 
                ${alpha('#667eea', 0.15)} 0%, 
                ${alpha('#764ba2', 0.1)} 50%,
                ${alpha('#667eea', 0.08)} 100%)`,
        color: theme.palette.mode === 'dark' ? '#4facfe' : '#667eea',
        boxShadow: theme.palette.mode === 'dark'
            ? `0 8px 32px ${alpha('#4facfe', 0.3)}, inset 0 1px 0 ${alpha('#fff', 0.1)}`
            : `0 8px 32px ${alpha('#667eea', 0.2)}, inset 0 1px 0 ${alpha('#fff', 0.6)}`,
        transform: 'translateY(-1px)',

        '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, ${alpha('#fff', 0.1)} 0%, transparent 50%)`,
            pointerEvents: 'none',
        },

        '& .MuiListItemIcon-root': {
            color: 'inherit',
            transform: 'scale(1.1)',
        },

        '& .MuiListItemText-primary': {
            fontWeight: 700,
            color: 'inherit',
        },
    }),

    ...(premium && {
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(45deg, transparent 30%, ${alpha('#ffd700', 0.1)} 50%, transparent 70%)`,
            backgroundSize: '200% 200%',
            pointerEvents: 'none',
        },
    }),

    ...(isNew && {
        '&::after': {
            content: '"NEW"',
            position: 'absolute',
            top: 4,
            right: 4,
            fontSize: '0.6rem',
            fontWeight: 700,
            color: '#fff',
            background: `linear-gradient(45deg, #ff6b6b, #ee5a24)`,
            padding: '2px 6px',
            borderRadius: 8,
        },
    }),

    '&:hover': {
        backgroundColor: active ? undefined : alpha(theme.palette.primary.main, 0.08),
        transform: active ? 'translateY(-1px) scale(1.02)' : 'translateX(4px) translateY(-1px)',
        boxShadow: theme.palette.mode === 'dark'
            ? `0 12px 40px ${alpha('#4facfe', 0.2)}`
            : `0 12px 40px ${alpha('#667eea', 0.15)}`,

        '& .MuiListItemIcon-root': {
            transform: 'scale(1.15) rotate(5deg)',
            color: theme.palette.primary.main,
        },
    },

    '&:active': {
        transform: 'scale(0.98)',
    },
}));

const PremiumListItemIcon = styled(ListItemIcon)(({ theme }) => ({
    minWidth: 48,
    color: theme.palette.text.secondary,
    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    '& > *': {
        fontSize: '1.3rem',
    },
}));

const BrandHeader = styled(Box)(({ theme }) => ({
    padding: theme.spacing(4, 3),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
    background: theme.palette.mode === 'dark'
        ? `linear-gradient(135deg, ${alpha('#1a1a2e', 0.8)} 0%, ${alpha('#16213e', 0.9)} 100%)`
        : `linear-gradient(135deg, ${alpha('#fff', 0.9)} 0%, ${alpha('#f8fafc', 0.8)} 100%)`,
    position: 'relative',
    animation: `${slideIn} 0.6s ease-out`,
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    padding: theme.spacing(3, 3, 1, 3),
    fontSize: '0.7rem',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    position: 'relative',

    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: theme.spacing(3),
        right: theme.spacing(3),
        height: 2,
        background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, transparent 100%)`,
        borderRadius: 1,
    },
}));

const UserProfile = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
    background: theme.palette.mode === 'dark'
        ? `linear-gradient(135deg, ${alpha('#1a1a2e', 0.6)} 0%, ${alpha('#16213e', 0.8)} 100%)`
        : `linear-gradient(135deg, ${alpha('#fff', 0.8)} 0%, ${alpha('#f8fafc', 0.6)} 100%)`,
}));

const StatusIndicator = styled(Box)<{ status?: Status }>(({ theme, status = 'online' }) => ({
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: '50%',
    border: `2px solid ${theme.palette.background.paper}`,
    background: status === 'online' ? '#4ade80' : status === 'away' ? '#fbbf24' : '#ef4444',
}));

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
    routes,
    open = true,
    width = 320,
    activeRoute = '',
    onNavigate,
    user,
    logout,
}) => {
    const theme = useTheme();
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['main-pages']));
    const { toggleTheme } = useThemeContext();

    const handleExpandClick = (key: string) => {
        setExpandedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(key)) {
                newSet.delete(key);
            } else {
                newSet.add(key);
            }
            return newSet;
        });
    };

    const handleNavigation = (route?: string) => {
        if (route && onNavigate) {
            onNavigate(route);
        }
    };

    const hasAccess = (item: NavigationalRoutes): boolean => {
        if (!item.permissions || item.permissions.length === 0) {
            return true;
        }
        if (!user) {
            return false;
        }
        return item.permissions.includes(user.role);
    };

    const filterRoutesByPermissions = (routeItems: NavigationalRoutes[]): NavigationalRoutes[] => {
        return routeItems
            .filter(item => {
                // Always show titles and dividers
                if (item.type === 'title' || item.type === 'divider') {
                    return true;
                }

                // For collapse items, check permissions
                if (item.type === 'collapse') {
                    return hasAccess(item);
                }

                return true;
            })
            .map(item => ({
                ...item,
                subRoutes: item.subRoutes ? filterRoutesByPermissions(item.subRoutes) : undefined
            }))
            .filter(item => {
                if (item.type === 'collapse' && item.subRoutes) {
                    const accessibleSubRoutes = item.subRoutes.filter(sub =>
                        sub.type !== 'collapse' || hasAccess(sub)
                    );
                    return accessibleSubRoutes.length > 0 || hasAccess(item);
                }
                return true;
            });
    };

    const renderNavItem = (item: NavigationalRoutes, nested = false) => {
        // Check permissions before rendering
        if (item.type === 'collapse' && !hasAccess(item)) {
            return null;
        }

        switch (item.type) {
            case 'title':
                return open ? (
                    <SectionTitle key={item.key} variant="overline">
                        {item.name}
                    </SectionTitle>
                ) : null;

            case 'divider':
                return open ? (
                    <Divider
                        key={item.key}
                        sx={{
                            my: 3,
                            mx: 3,
                            borderColor: alpha(theme.palette.primary.main, 0.1),
                            '&::before, &::after': {
                                borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                            },
                        }}
                    />
                ) : (
                    <Box key={item.key} sx={{ height: 24 }} />
                );

            case 'collapse': {
                const isExpanded = expandedItems.has(item.key);
                const isActive = activeRoute === item.route;
                const hasSubRoutes = item.subRoutes && item.subRoutes.length > 0;

                // Filter accessible sub-routes
                const accessibleSubRoutes = hasSubRoutes
                    ? item.subRoutes!.filter(sub =>
                        sub.type !== 'collapse' || hasAccess(sub)
                    )
                    : [];

                // Don't render if item is not accessible and has no accessible sub-routes
                if (!hasAccess(item) && accessibleSubRoutes.length === 0) {
                    return null;
                }

                return (
                    <React.Fragment key={item.key}>
                        <ListItem disablePadding>
                            <PremiumListItemButton
                                active={isActive}
                                nested={nested}
                                premium={item.premium}
                                isNew={item.new}
                                onClick={() => {
                                    if (hasSubRoutes && accessibleSubRoutes.length > 0) {
                                        handleExpandClick(item.key);
                                    } else if (hasAccess(item)) {
                                        handleNavigation(item.route);
                                    }
                                }}
                                disabled={!hasAccess(item) && accessibleSubRoutes.length === 0}
                            >
                                {item.icon && (
                                    <PremiumListItemIcon>
                                        {item.icon}
                                    </PremiumListItemIcon>
                                )}

                                {open && (
                                    <>
                                        <ListItemText
                                            primary={item.name}
                                            primaryTypographyProps={{
                                                fontSize: nested ? '0.85rem' : '0.9rem',
                                                fontWeight: nested ? 600 : 700,
                                                letterSpacing: '0.5px',
                                            }}
                                        />

                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            {item.badge && hasAccess(item) && (
                                                <Chip
                                                    label={item.badge}
                                                    size="small"
                                                    sx={{
                                                        height: 20,
                                                        fontSize: '0.7rem',
                                                        fontWeight: 700,
                                                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                                        color: 'white',
                                                        '& .MuiChip-label': { px: 1 },
                                                    }}
                                                />
                                            )}

                                            {/* Show locked icon for inaccessible items */}
                                            {!hasAccess(item) && accessibleSubRoutes.length === 0 && (
                                                <Chip
                                                    label="🔒"
                                                    size="small"
                                                    sx={{
                                                        height: 20,
                                                        fontSize: '0.7rem',
                                                        backgroundColor: alpha(theme.palette.warning.main, 0.2),
                                                        color: theme.palette.warning.main,
                                                    }}
                                                />
                                            )}

                                            {hasSubRoutes && accessibleSubRoutes.length > 0 && (
                                                <IconButton
                                                    size="small"
                                                    sx={{
                                                        color: 'inherit',
                                                        transition: 'transform 0.3s ease',
                                                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                                    }}
                                                >
                                                    <ExpandMore fontSize="small" />
                                                </IconButton>
                                            )}
                                        </Stack>
                                    </>
                                )}
                            </PremiumListItemButton>
                        </ListItem>

                        {hasSubRoutes && open && accessibleSubRoutes.length > 0 && (
                            <Collapse in={isExpanded} timeout={300} unmountOnExit>
                                <List component="div" disablePadding>
                                    {item.subRoutes?.map(subItem => renderNavItem(subItem, true))}
                                </List>
                            </Collapse>
                        )}
                    </React.Fragment>
                );
            }

            default:
                return null;
        }
    };

    // Filter routes before rendering
    const filteredRoutes = filterRoutesByPermissions(routes);

    return (
        <StyledDrawer
            variant="permanent"
            open={open}
            sx={{
                width: open ? width : 80,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: open ? width : 80,
                    overflowX: 'hidden',
                },
            }}
        >
            {/* Brand Header */}
            <BrandHeader>
                <Box
                    sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 800,
                        fontSize: '1.1rem',
                        boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
                        position: 'relative',

                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)',
                            borderRadius: 'inherit',
                        },
                    }}
                >
                    BV
                </Box>

                {open && (
                    <>
                        <Box sx={{ flex: 1 }}>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 800,
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    letterSpacing: '0.5px',
                                }}
                            >
                                BonVoyage
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: 'text.secondary',
                                    fontWeight: 600,
                                    letterSpacing: '1px',
                                    textTransform: 'uppercase',
                                }}
                            >
                                Enterprise Suite
                            </Typography>
                        </Box>
                    </>
                )}
            </BrandHeader>

            {/* Navigation List */}
            <Box sx={{ flex: 1, overflowY: 'auto', py: 2 }}>
                <List component="nav" disablePadding>
                    {filteredRoutes.map(item => renderNavItem(item))}
                </List>
            </Box>

            {/* Bottom Actions */}
            {open && (
                <Box
                    sx={{
                        p: 2,
                        borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                        background: theme.palette.mode === 'dark'
                            ? `linear-gradient(135deg, ${alpha('#1a1a2e', 0.6)} 0%, ${alpha('#16213e', 0.8)} 100%)`
                            : `linear-gradient(135deg, ${alpha('#fff', 0.8)} 0%, ${alpha('#f8fafc', 0.6)} 100%)`,
                    }}
                >
                    <Stack spacing={1}>
                        {/* User Profile */}
                        {user && (
                            <UserProfile>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Box sx={{ position: 'relative' }}>
                                        <Avatar
                                            src={user?.avatar || ''}
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                                fontWeight: 700,
                                                boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
                                            }}
                                        >
                                            {user?.name?.charAt(0) || 'U'}
                                        </Avatar>
                                        <StatusIndicator status={user?.status || 'offline'} />
                                    </Box>

                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                fontWeight: 700,
                                                color: 'text.primary',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            {user?.name || 'Unknown User'}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: 'text.secondary',
                                                fontWeight: 600,
                                                display: 'block',
                                                textTransform: 'capitalize',
                                            }}
                                        >
                                            {user?.role || 'Unknown Role'}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </UserProfile>
                        )}

                        <Stack direction="row" spacing={1}>
                            <Tooltip title="Settings">
                                <IconButton
                                    size="small"
                                    sx={{
                                        color: 'text.secondary',
                                        '&:hover': {
                                            color: theme.palette.primary.main,
                                            transform: 'rotate(90deg)',
                                        },
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    <SettingsOutlined fontSize="small" />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Toggle Theme">
                                <IconButton
                                    size="small"
                                    onClick={toggleTheme}
                                    sx={{
                                        color: 'text.secondary',
                                        '&:hover': { color: theme.palette.primary.main },
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    {theme.palette.mode === 'dark' ?
                                        <Brightness7 fontSize="small" /> :
                                        <Brightness4 fontSize="small" />
                                    }
                                </IconButton>
                            </Tooltip>

                            <Box sx={{ flex: 1 }} />

                            <Tooltip title="Sign Out">
                                <IconButton
                                    onClick={logout}
                                    size="small"
                                    sx={{
                                        color: 'text.secondary',
                                        '&:hover': {
                                            color: '#ef4444',
                                            transform: 'scale(1.1)',
                                        },
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    <PowerSettingsNew fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Stack>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                                textAlign: 'center',
                                fontWeight: 600,
                                letterSpacing: '0.5px',
                            }}
                        >
                            © 2025 BonVoyage Pro
                        </Typography>
                    </Stack>
                </Box>
            )}
        </StyledDrawer>
    );
};