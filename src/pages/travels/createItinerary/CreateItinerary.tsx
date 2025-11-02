import { Box, Grid, Typography } from "@mui/material";
import { useParams } from "react-router";
import useGetServices from "./logic/useGetServices";
import ServiceLibrary from "./ui/ServiceLibrary";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import TimelineBuilder from "./ui/TimelineBuilder";
import { useMemo, useState, useCallback } from "react";
import type { ServiceItem } from "../createTravels/interfaces/ServiceItem";

// Define proper types
interface TimeSlot {
    id: string;
    label: string;
    time: string;
    services: ServiceItem[];
}

interface ItineraryDay {
    id: string;
    date: string;
    timeSlots: TimeSlot[];
}

const CreateItinerary = () => {
    const { id } = useParams<{ id: string }>();
    const services = useGetServices(id);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Memoized initial state to prevent recreation
    const initialDays = useMemo((): ItineraryDay[] => [
        {
            id: "day-1",
            date: "2024-03-15",
            timeSlots: [
                { id: "morning", label: "Morning", time: "09:00", services: [] },
                { id: "afternoon", label: "Afternoon", time: "14:00", services: [] },
                { id: "evening", label: "Evening", time: "19:00", services: [] },
            ]
        },
        {
            id: "day-2",
            date: "2024-03-16",
            timeSlots: [
                { id: "morning", label: "Morning", time: "09:00", services: [] },
                { id: "afternoon", label: "Afternoon", time: "14:00", services: [] },
                { id: "evening", label: "Evening", time: "19:00", services: [] },
            ]
        },
        {
            id: "day-3",
            date: "2024-03-17",
            timeSlots: [
                { id: "morning", label: "Morning", time: "09:00", services: [] },
                { id: "afternoon", label: "Afternoon", time: "14:00", services: [] },
                { id: "evening", label: "Evening", time: "19:00", services: [] },
            ]
        },
    ], []);

    const [itineraryDays, setItineraryDays] = useState<ItineraryDay[]>(initialDays);

    // Memoized categories to prevent recreation
    const categories = useMemo(() => [
        { key: "accommodation", label: "Hotels", icon: "🏨", color: "#1976d2" },
        { key: "transport", label: "Transport", icon: "🚗", color: "#388e3c" },
        { key: "activities", label: "Activities", icon: "🎯", color: "#f57c00" },
        { key: "dining", label: "Dining", icon: "🍽️", color: "#d32f2f" },
    ], []);

    // Optimized filtering with early returns
    const filteredServices = useMemo(() => {
        if (!services?.length) return [];

        return services.filter(service => {
            // Category filter first (cheaper check)
            if (selectedCategory && service.category !== selectedCategory) return false;

            // Search filter only if category passes
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                return (
                    service.name?.toLowerCase().includes(searchLower) ||
                    service.description?.toLowerCase().includes(searchLower)
                );
            }

            return true;
        });
    }, [services, searchTerm, selectedCategory]);

    // Memoized callbacks to prevent unnecessary re-renders
    const handleSearchChange = useCallback((term: string) => {
        setSearchTerm(term);
    }, []);

    const handleCategoryChange = useCallback((category: string | null) => {
        setSelectedCategory(category);
    }, []);

    const addDayToItinerary = useCallback(() => {
        setItineraryDays(prevDays => {
            const nextDay = new Date();
            nextDay.setDate(nextDay.getDate() + prevDays.length);
            const newDay: ItineraryDay = {
                id: `day-${prevDays.length + 1}`,
                date: nextDay.toISOString().split('T')[0],
                timeSlots: [
                    { id: "morning", label: "Morning", time: "09:00", services: [] },
                    { id: "afternoon", label: "Afternoon", time: "14:00", services: [] },
                    { id: "evening", label: "Evening", time: "19:00", services: [] },
                ]
            };
            return [...prevDays, newDay];
        });
    }, []);

    // Optimized drag handler with early returns and minimal state updates
    const handleDragEnd = useCallback((result: DropResult) => {
        const { destination, source, draggableId } = result;

        // Early returns for invalid drops
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        // Only process service library to timeline drops for now
        if (source.droppableId !== 'service-library' || !destination.droppableId.startsWith('timeline-')) {
            return;
        }

        // Find service more efficiently
        const draggedService = filteredServices.find(service => service.id === draggableId);
        if (!draggedService) return;

        const [, dayId, timeSlot] = destination.droppableId.split('-');

        // Use functional update with minimal object creation
        setItineraryDays(prevDays => {
            return prevDays.map(day => {
                if (day.id !== `day-${dayId}`) return day;

                return {
                    ...day,
                    timeSlots: day.timeSlots.map(slot => {
                        if (slot.id !== timeSlot) return slot;

                        return {
                            ...slot,
                            services: [...slot.services, {
                                ...draggedService,
                                id: `${draggedService.id}-${Date.now()}`
                            }]
                        };
                    })
                };
            });
        });
    }, [filteredServices]);

    return (
        <Box sx={{ padding: '2rem', height: '100vh', overflow: 'hidden' }}>
            {/* Page Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" fontWeight={600} gutterBottom>
                    Create Itinerary
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Travel ID: {id} • Drag services from the library to build your itinerary
                </Typography>
            </Box>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Grid container spacing={3} sx={{ height: 'calc(100vh - 200px)' }}>
                    <Grid size={4}>
                        <ServiceLibrary
                            services={filteredServices}
                            searchTerm={searchTerm}
                            setSearchTerm={handleSearchChange}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={handleCategoryChange}
                            categories={categories}
                        />
                    </Grid>
                    <Grid size={8}>
                        <TimelineBuilder
                            itineraryDays={itineraryDays}
                            onAddDay={addDayToItinerary}
                        />
                    </Grid>
                </Grid>
            </DragDropContext>
        </Box>
    );
}

export default CreateItinerary;