import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Stack,
    IconButton,
    Box,
    useTheme,
    Fade,
} from '@mui/material';
import { WarningAmberOutlined, InfoOutlined, CheckCircleOutline, CloseOutlined } from '@mui/icons-material';

type ConfirmAlertProps = {
    open: boolean;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    iconType?: 'warning' | 'info' | 'success';
    loading?: boolean;
    color?: 'primary' | 'error' | 'warning' | 'success' | 'info';
    children?: React.ReactNode;
    disableBackdropClick?: boolean;
};

const iconMap = {
    warning: <WarningAmberOutlined fontSize="large" color="warning" />,
    info: <InfoOutlined fontSize="large" color="info" />,
    success: <CheckCircleOutline fontSize="large" color="success" />,
};

const ConfirmAlert: React.FC<ConfirmAlertProps> = ({
    open,
    title = 'Are you sure?',
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    iconType = 'warning',
    loading = false,
    color = 'primary',
    children,
    disableBackdropClick = false,
}) => {
    const theme = useTheme();

    return (
        <Dialog
            open={open}
            onClose={disableBackdropClick ? undefined : onCancel}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    boxShadow: 12,
                    p: 0,
                    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
                }
            }}
        >
            <DialogTitle
                sx={{
                    px: 4,
                    py: 3,
                    bgcolor: theme.palette[color].main,
                    color: theme.palette[color].contrastText,
                    fontWeight: 700,
                    fontSize: '1.3rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                <Box sx={{ mr: 1 }}>
                    {iconMap[iconType]}
                </Box>
                {title}
                <Box flexGrow={1} />
                <IconButton
                    onClick={onCancel}
                    sx={{
                        color: theme.palette[color].contrastText,
                        ml: 2,
                    }}
                    size="small"
                >
                    <CloseOutlined />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ px: 4, py: 3 }}>
                {description && (
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        {description}
                    </Typography>
                )}
                {children}
            </DialogContent>
            <DialogActions sx={{ px: 4, py: 3, bgcolor: theme.palette.background.default }}>
                <Stack direction="row" spacing={2} width="100%" justifyContent="flex-end">
                    <Button
                        variant="outlined"
                        color={color}
                        onClick={onCancel}
                        disabled={loading}
                        sx={{ fontWeight: 700, borderRadius: 2, px: 3 }}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant="contained"
                        color={color}
                        onClick={onConfirm}
                        disabled={loading}
                        sx={{ fontWeight: 700, borderRadius: 2, px: 3 }}
                    >
                        {loading ? (
                            <Fade in={loading} unmountOnExit>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <span>Processing...</span>
                                </Box>
                            </Fade>
                        ) : (
                            confirmText
                        )}
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmAlert;