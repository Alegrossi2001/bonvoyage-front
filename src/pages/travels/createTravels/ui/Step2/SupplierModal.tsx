import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Typography, alpha, CardContent, Stack } from '@mui/material';
import { StarOutlined } from '@mui/icons-material';
import type { Supplier } from '../../interfaces/Supplier';
import { Card } from '../../../../../assets/atoms';
import type { Theme } from '@mui/system';

interface SupplierModalProps {
    suppliersOpen: boolean;
    setSuppliersOpen: (open: boolean) => void;
    supplierDatabase: Supplier[];
    theme: Theme;
    addFromSupplier: (supplier: Supplier) => void;
}

const SupplierModal: React.FC<SupplierModalProps> = ({
    suppliersOpen,
    setSuppliersOpen,
    supplierDatabase,
    theme,
    addFromSupplier,
}) => (
    <Dialog
        open={suppliersOpen}
        onClose={() => setSuppliersOpen(false)}
        maxWidth="lg"
        fullWidth
    >
        <DialogTitle>
            <StarOutlined sx={{ mr: 1, verticalAlign: 'middle' }} />
            Supplier Database
        </DialogTitle>
        <DialogContent>
            <Grid container spacing={3}>
                {supplierDatabase.map((supplier) => (
                    <Grid size={{ xs: 12 }} key={supplier.id}>
                        <Typography variant="h6" fontWeight={600} gutterBottom sx={{ textTransform: 'capitalize' }}>
                            {supplier.category}
                        </Typography>
                        <Grid container spacing={2}>
                            {supplierDatabase.map((supplier) => (
                                <Grid size={{ xs: 12, md: 6, lg: 4 }} key={supplier.id}>
                                    <Card
                                        key={supplier.id}
                                        sx={{
                                            cursor: 'pointer',
                                            border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                                            '&:hover': {
                                                borderColor: theme.palette.primary.main,
                                                boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.12)}`,
                                            }
                                        }}
                                        onClick={() => addFromSupplier(supplier)}
                                    >
                                        <CardContent sx={{ pb: 2 }}>
                                            <Stack spacing={1}>
                                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                                    <Typography variant="subtitle2" fontWeight={600}>
                                                        {supplier.name}
                                                    </Typography>
                                                    <Typography variant="h6" color="primary.main" fontWeight={700}>
                                                        €{supplier.category}
                                                    </Typography>
                                                </Stack>

                                                <Typography variant="caption" color="text.secondary">
                                                    {supplier.name} • {supplier.category}
                                                </Typography>

                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                    <Typography variant="caption">
                                                        ⭐ {supplier.rating}
                                                    </Typography>
                                                    <Typography variant="caption" color="success.main">
                                                        {supplier.commission}% commission
                                                    </Typography>
                                                </Stack>

                                                {supplier.rating && (
                                                    <Typography variant="caption" color="text.secondary" sx={{
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                    }}>
                                                        {supplier.rating}
                                                    </Typography>
                                                )}
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                ))}
            </Grid>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setSuppliersOpen(false)}>Close</Button>
        </DialogActions>
    </Dialog>
)

export default SupplierModal;