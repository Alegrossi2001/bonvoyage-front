import type { ActivityItem } from "./Activity";
import type { Supplier } from "./Supplier";

export interface DayPlan {
    id: string;
    date: string;
    dayNumber: number;
    title: string;
    city: string;
    accommodation?: Supplier;
    accommodationBookingRef?: string;
    activities: ActivityItem[];
    totalCost: number;
    estimatedDistance: number;
    notes?: string;
    status: 'draft' | 'confirmed' | 'locked';
    weather?: string;
    emergencyContacts?: string;
}