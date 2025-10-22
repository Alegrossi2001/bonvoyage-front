import type { Customer } from "./Customer";
import type { PricingBreakdown } from "./PricingBreakdown";
import type { RequirementItem } from "./Requirements";
import type { ServiceItem } from "./ServiceItem";

export interface QuotationStepData {
    step0: {
        templateId?: string;
        clonedFromId?: string;
    };
    step1: {
        customer: Partial<Customer>;
        tripDetails: {
            tripName: string;
            destinations: string[];
            startDate: string;
            endDate: string;
            participants: number;
            numberOfGroups?: number;
            groupSize?: number;
            tripType?: string;
        };
        requirements: RequirementItem[];
    };
    step2: {
        services: ServiceItem[];
        //usesDayByDay: boolean;
        //days: DayPlan[];
    };
    step3: {
        pricing: PricingBreakdown;
        terms: string;
        validUntil: string;
    };
    step4: {
        internalNotes: string;
        clientNotes: string;
        sendOptions: {
            sendEmail: boolean;
            includeTerms: boolean;
            includeBreakdown: boolean;
        };
    };
}