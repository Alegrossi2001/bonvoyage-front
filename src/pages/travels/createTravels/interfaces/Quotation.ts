import type { QuotationStatus } from "../../../../interfaces/Values/Plans";
import type { Customer } from "./Customer";
import type { DayPlan } from "./DayPlan";
import type { PricingBreakdown } from "./PricingBreakdown";
import type { RequirementItem } from "./Requirements";
import type { ServiceItem } from "./ServiceItem";

export interface Quotation {
    id: string;
    version: number;
    status: QuotationStatus;
    customer: Customer;
}

export interface PreviousQuotation extends Quotation {
    createdAt: string;
    totalValue: number;
    currency: string;
    duration: number;
    travelers: number;
    destinations: string[];
    agent: string;
    tags: string[];
}

export interface CompleteQuotation extends PreviousQuotation {
    quotationNumber?: string;
    version: number;
    status: QuotationStatus;
    updatedAt: string;
    validUntil: string;

    // Trip Details
    tripName: string;
    destination: string;
    startDate: string;
    endDate: string;
    duration: number;
    participants: number;

    // Requirements & Services
    requirements: RequirementItem[];
    services: ServiceItem[];

    // Day-by-Day Planning
    days: DayPlan[];
    usesDayByDay: boolean;

    // Pricing
    pricing: PricingBreakdown;

    // Notes & Communication
    internalNotes?: string;
    clientNotes?: string;
    terms?: string;

    // Metadata
    assignedTo?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
}