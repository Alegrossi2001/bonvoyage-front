import { Paper, Box, Typography, Stack, Chip, TextField, InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";
import { Droppable } from "@hello-pangea/dnd";
import ServiceCard from "./ServiceCard";
import type { ServiceItem } from "../../createTravels/interfaces/ServiceItem";

interface ServiceLibraryProps {
    services: ServiceItem[];
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedCategory: string | null;
    setSelectedCategory: (category: string | null) => void;
    categories: Array<{
        key: string;
        label: string;
        icon: string;
        color: string;
    }>;
}

const ServiceLibrary: React.FC<ServiceLibraryProps> = ({
    services,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    categories
}) => {
    return (
        <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Search & Filters */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <TextField
                    fullWidth
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    size="small"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ mb: 2 }}
                />

                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    <Chip
                        label="All"
                        variant={!selectedCategory ? "filled" : "outlined"}
                        onClick={() => setSelectedCategory(null)}
                        size="small"
                    />
                    {categories.map((category) => (
                        <Chip
                            key={category.key}
                            label={`${category.icon} ${category.label}`}
                            variant={selectedCategory === category.key ? "filled" : "outlined"}
                            onClick={() => setSelectedCategory(
                                selectedCategory === category.key ? null : category.key
                            )}
                            size="small"
                            sx={{
                                backgroundColor: selectedCategory === category.key ? category.color : undefined,
                                color: selectedCategory === category.key ? 'white' : undefined,
                            }}
                        />
                    ))}
                </Stack>
            </Box>

            {/* Service List */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
                <Droppable droppableId="service-library">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            style={{
                                backgroundColor: snapshot.isDraggingOver ? '#f5f5f5' : 'transparent',
                                minHeight: '100%',
                            }}
                        >
                            <Stack spacing={1}>
                                {services.map((service, index) => (
                                    <ServiceCard
                                        key={service.id || index}
                                        service={service}
                                        index={index}
                                        isDraggable={true}
                                    />
                                ))}
                                {services.length === 0 && (
                                    <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                                        <Typography variant="body2">
                                            {searchTerm ? 'No services match your search' : 'No services available'}
                                        </Typography>
                                    </Box>
                                )}
                            </Stack>
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </Box>
        </Paper>
    );
};

export default ServiceLibrary;