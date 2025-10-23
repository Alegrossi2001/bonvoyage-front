import type { OperationalStatuses } from "../../../../interfaces/Values/Plans";
import type { PreviousQuotation } from "../../createTravels/interfaces/Quotation";

export interface ConfirmedQuotation extends PreviousQuotation {
    tripStartDate: string;
    operationalStatus: OperationalStatuses;
}