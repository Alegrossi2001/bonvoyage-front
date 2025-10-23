import { Dialog, DialogTitle, DialogContent, DialogActions, Grid, Card, CardContent, Stack, Typography, Button } from "@mui/material";
import { AutoAwesomeOutlined } from "@mui/icons-material";
import { alpha } from "@mui/material/styles";
import type { Theme } from "@mui/system";
import type { ServiceTemplate } from "../../interfaces/ServiceItem";

interface TemplateModalProps {
    templatesOpen: boolean;
    setTemplatesOpen: (open: boolean) => void;
    serviceTemplates: ServiceTemplate[];
    addFromTemplate: (template: ServiceTemplate) => void;
    theme: Theme;
}
const TemplateModal = ({ templatesOpen, setTemplatesOpen, serviceTemplates, addFromTemplate, theme }: TemplateModalProps) => (
    <Dialog
        open={templatesOpen}
        onClose={() => setTemplatesOpen(false)}
        maxWidth="md"
        fullWidth
    >
        <DialogTitle>
            <AutoAwesomeOutlined sx={{ mr: 1, verticalAlign: 'middle' }} />
            Service Templates
        </DialogTitle>
        <DialogContent>
            <Grid container spacing={2}>
                {serviceTemplates.map((template) => (
                    <Grid size={{ xs: 12, md: 6 }} key={template.id}>
                        <Card
                            sx={{
                                cursor: 'pointer',
                                border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                                '&:hover': {
                                    borderColor: theme.palette.primary.main,
                                    boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.12)}`,
                                }
                            }}
                            onClick={() => addFromTemplate(template)}
                        >
                            <CardContent>
                                <Stack spacing={2}>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <Typography variant="h5">{template.icon}</Typography>
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            {template.name}
                                        </Typography>
                                    </Stack>

                                    <Typography variant="body2" color="text.secondary">
                                        {template.description}
                                    </Typography>

                                    <Typography variant="caption" color="primary.main">
                                        {template.services.length} services included
                                    </Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setTemplatesOpen(false)}>Close</Button>
        </DialogActions>
    </Dialog>
)

export default TemplateModal;