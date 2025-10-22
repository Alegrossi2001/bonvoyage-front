import { useQuotationStore } from "../QuotationStore";
import dayjs from "dayjs";

export const useQuotationSelectors = () => {
    const store = useQuotationStore();

    return {
        // Basic selectors
        quotation: store.quotation,
        currentStep: store.currentStep,
        isLoading: store.isLoading,
        isSaving: store.isSaving,
        errors: store.errors,

        // Computed selectors
        totalCost: store.getTotalCost(),
        completionPercentage: store.getCompletionPercentage(),
        activityCount: store.getActivityCount(),
        pendingBookings: store.getPendingBookings(),

        // Validation selectors
        isCurrentStepValid: store.validateStep(store.currentStep),
        currentStepErrors: store.getValidationErrors(store.currentStep),

        // Status selectors
        isDraft: store.quotation.status === 'draft',
        isSent: store.quotation.status === 'sent',
        isAccepted: store.quotation.status === "approved",
        isExpired: store.quotation.validUntil ? dayjs().isAfter(dayjs(store.quotation.validUntil)) : false,
    };
};