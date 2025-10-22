import type { ActivityStatus, ActivityType } from "../../../../interfaces/Values/Plans";
import type { Supplier } from "./Supplier";

export interface ActivityItem {
    id: string;
    time: string | null; // Store as ISO string for persistence
    duration: number;
    type: ActivityType;
    title: string;
    location: string;
    description: string;
    supplier?: Supplier;
    supplierId?: string;
    cost: number;
    netCost: number;
    markup: number;
    finalPrice: number;
    notes?: string;
    participants: number;
    status: ActivityStatus;
    bookingRef?: string;
    confirmationDeadline?: string;
    specialRequirements?: string;
    isIncluded: boolean;
}