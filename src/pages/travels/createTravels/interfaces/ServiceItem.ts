import type { ActivityType } from "../../../../interfaces/Values/Plans";
import type { Supplier } from "./Supplier";

export interface ServiceItem {
    id: string;
    category: ActivityType;
    name: string;
    description: string;
    unit: string;
    supplier?: Supplier;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    markup: number;
    finalPrice: number;
    isIncluded: boolean;
    notes?: string;
}

export interface ServiceTemplate {
    id: string;
    name: string;
    icon: string;
    description: string;
    services: ServiceItem[];
}