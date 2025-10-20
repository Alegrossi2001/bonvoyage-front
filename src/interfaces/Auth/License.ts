import type { PaymentPlan } from "../Values/Plans";

export interface OrganisationLicense {
    id: string;
    name: string;
    slug: string;
    plan: PaymentPlan;
}

export interface Organisation extends OrganisationLicense {
    something: string;
}