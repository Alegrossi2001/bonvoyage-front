import type { ActivityType } from "../../../../interfaces/Values/Plans";

export interface Supplier {
    id: string;
    name: string;
    category: ActivityType;
    contact: {
        phone?: string;
        email?: string;
        website?: string;
    };
    location: string;
    rating: number;
    commission: number;
    paymentTerms: string;
    notes: string;
    isPreferred: boolean;
}