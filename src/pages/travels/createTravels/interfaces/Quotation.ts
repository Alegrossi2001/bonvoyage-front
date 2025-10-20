import type { QuotationStatus } from "../../../../interfaces/Values/Plans";

export interface Quotation {
    id: string;
    version: number;
    status: QuotationStatus;
    customer: {
        id: string;
        name: string;
        email: string;
    }
}

export interface PreviousQuotation extends Quotation {
    createdAt: Date;
    totalValue: number;
    currency: string;
    duration: number;
    travelers: number;
    destinations: string[];
    agent: string;
    tags: string[];
}