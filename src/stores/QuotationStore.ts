import { create } from "zustand";
import type { PricingBreakdown } from "../pages/travels/createTravels/interfaces/PricingBreakdown";
import type { CompleteQuotation } from "../pages/travels/createTravels/interfaces/Quotation";
import type { QuotationStepData } from "../pages/travels/createTravels/interfaces/QuotationStepData";
import type { RequirementItem } from "../pages/travels/createTravels/interfaces/Requirements";
import type { ServiceItem } from "../pages/travels/createTravels/interfaces/ServiceItem";
import { createJSONStorage, persist } from "zustand/middleware";
import dayjs from "dayjs";
import { immer } from "zustand/middleware/immer";

interface QuotationStore {

    // State
    quotation: Partial<CompleteQuotation>;
    stepData: Partial<QuotationStepData>;
    currentStep: number;
    isLoading: boolean;
    isSaving: boolean;
    errors: Record<string, string>;

    // Basic Actions
    updateQuotation: (data: Partial<CompleteQuotation>) => void;
    updateStepData: <K extends keyof QuotationStepData>(
        step: K,
        data: Partial<QuotationStepData[K]>
    ) => void;
    setCurrentStep: (step: number) => void;
    setLoading: (loading: boolean) => void;
    setSaving: (saving: boolean) => void;
    setError: (field: string, error: string) => void;
    clearError: (field: string) => void;
    clearErrors: () => void;

    // Advanced Actions
    initializeQuotation: (templateData?: Partial<CompleteQuotation>) => void;
    cloneQuotation: (sourceQuotation: CompleteQuotation) => void;
    resetQuotation: () => void;

    // Requirements Management
    addRequirement: (requirement: Omit<RequirementItem, 'id'>) => void;
    updateRequirement: (id: string, data: Partial<RequirementItem>) => void;
    removeRequirement: (id: string) => void;

    // Services Management
    addService: (service: Omit<ServiceItem, 'id'>) => void;
    updateService: (id: string, data: Partial<ServiceItem>) => void;
    removeService: (id: string) => void;

    // Pricing Calculations
    calculatePricing: () => void;
    updatePricing: (pricing: Partial<PricingBreakdown>) => void;

    // Validation
    validateStep: (step: number) => boolean;
    getValidationErrors: (step: number) => string[];

    // Computed Properties
    getTotalCost: () => number;
    getCompletionPercentage: () => number;
    getActivityCount: () => number;
    getPendingBookings: () => number;
}

export const useQuotationStore = create<QuotationStore>()(
    persist(
        immer((set, get) => ({
            // Initial State
            quotation: {},
            stepData: {},
            currentStep: 0,
            isLoading: false,
            isSaving: false,
            errors: {},

            // Basic Actions
            updateQuotation: (data) =>
                set((state) => {
                    Object.assign(state.quotation, data);
                    state.quotation.updatedAt = dayjs().toISOString();
                }),

            updateStepData: (step, data) =>
                set((state) => {
                    if (!state.stepData[step]) {
                        state.stepData[step] = {} as QuotationStepData[typeof step];
                    }
                    Object.assign(state.stepData[step], data);
                }),

            setCurrentStep: (step) =>
                set((state) => {
                    state.currentStep = step;
                }),

            setLoading: (loading) =>
                set((state) => {
                    state.isLoading = loading;
                }),

            setSaving: (saving) =>
                set((state) => {
                    state.isSaving = saving;
                }),

            setError: (field, error) =>
                set((state) => {
                    state.errors[field] = error;
                }),

            clearError: (field) =>
                set((state) => {
                    delete state.errors[field];
                }),

            clearErrors: () =>
                set((state) => {
                    state.errors = {};
                }),

            // Advanced Actions
            initializeQuotation: (templateData = {}) =>
                set((state) => {
                    const now = dayjs().toISOString();
                    state.quotation = {
                        version: 1,
                        status: 'draft',
                        createdAt: now,
                        updatedAt: now,
                        validUntil: dayjs().add(30, 'days').toISOString(),
                        participants: 30,
                        priority: 'medium',
                        requirements: [],
                        services: [],
                        days: [],
                        usesDayByDay: false,
                        pricing: {
                            subtotal: 0,
                            markup: 0,
                            taxes: 0,
                            discounts: 0,
                            total: 0,
                            currency: 'EUR',
                            breakdown: {
                                accommodation: 0,
                                transport: 0,
                                activities: 0,
                                meals: 0,
                                guides: 0,
                                other: 0,
                                sightseeing: 0,
                            },
                        },
                        customer: {
                            name: '',
                            email: '',
                        },
                        tripName: '',
                        destination: '',
                        startDate: '',
                        endDate: '',
                        duration: 0,
                        ...templateData,
                    };
                    state.stepData = {};
                    state.currentStep = 0;
                    state.errors = {};
                }),

            cloneQuotation: (sourceQuotation) =>
                set((state) => {
                    const now = dayjs().toISOString();
                    state.quotation = {
                        ...sourceQuotation,
                        id: undefined,
                        quotationNumber: undefined,
                        version: 1,
                        status: 'draft',
                        createdAt: now,
                        updatedAt: now,
                        validUntil: dayjs().add(30, 'days').toISOString(),
                    };
                    state.currentStep = 0;
                    state.errors = {};
                }),

            resetQuotation: () =>
                set((state) => {
                    state.quotation = {};
                    state.stepData = {};
                    state.currentStep = 0;
                    state.isLoading = false;
                    state.isSaving = false;
                    state.errors = {};
                }),

            // Requirements Management
            addRequirement: (requirement) =>
                set((state) => {
                    if (!state.quotation.requirements) {
                        state.quotation.requirements = [];
                    }
                    state.quotation.requirements.push({
                        ...requirement,
                        id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    });
                    state.quotation.updatedAt = dayjs().toISOString();
                }),

            updateRequirement: (id, data) =>
                set((state) => {
                    if (!state.quotation.requirements) return;
                    const index = state.quotation.requirements.findIndex(req => req.id === id);
                    if (index !== -1) {
                        Object.assign(state.quotation.requirements[index], data);
                        state.quotation.updatedAt = dayjs().toISOString();
                    }
                }),

            removeRequirement: (id) =>
                set((state) => {
                    if (!state.quotation.requirements) return;
                    state.quotation.requirements = state.quotation.requirements.filter(req => req.id !== id);
                    state.quotation.updatedAt = dayjs().toISOString();
                }),

            // Services Management
            addService: (service) =>
                set((state) => {
                    if (!state.quotation.services) {
                        state.quotation.services = [];
                    }
                    state.quotation.services.push({
                        ...service,
                        id: `svc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    });
                    state.quotation.updatedAt = dayjs().toISOString();
                    get().calculatePricing();
                }),

            updateService: (id, data) =>
                set((state) => {
                    if (!state.quotation.services) return;
                    const index = state.quotation.services.findIndex(svc => svc.id === id);
                    if (index !== -1) {
                        Object.assign(state.quotation.services[index], data);
                        state.quotation.updatedAt = dayjs().toISOString();
                        get().calculatePricing();
                    }
                }),

            removeService: (id) =>
                set((state) => {
                    if (!state.quotation.services) return;
                    state.quotation.services = state.quotation.services.filter(svc => svc.id !== id);
                    state.quotation.updatedAt = dayjs().toISOString();
                    get().calculatePricing();
                }),

            // Pricing Calculations
            calculatePricing: () =>
                set((state) => {
                    if (!state.quotation.pricing) {
                        state.quotation.pricing = {
                            subtotal: 0,
                            markup: 0,
                            taxes: 0,
                            discounts: 0,
                            total: 0,
                            currency: 'EUR',
                            breakdown: {
                                accommodation: 0,
                                transport: 0,
                                activities: 0,
                                meals: 0,
                                guides: 0,
                                other: 0,
                                sightseeing: 0,
                            },
                        };
                    }

                    let subtotal = 0;
                    const breakdown = {
                        accommodation: 0,
                        transport: 0,
                        activities: 0,
                        meals: 0,
                        guides: 0,
                        sightseeing: 0,
                        other: 0,
                    };

                    // Calculate from services
                    if (state.quotation.services) {
                        state.quotation.services.forEach(service => {
                            subtotal += service.finalPrice;
                            breakdown[service.category] += service.finalPrice;
                        });
                    }

                    // Calculate from day-by-day activities
                    if (state.quotation.days) {
                        state.quotation.days.forEach(day => {
                            day.activities.forEach(activity => {
                                if (activity.isIncluded) {
                                    subtotal += activity.finalPrice;
                                    breakdown[activity.type] += activity.finalPrice;
                                }
                            });
                        });
                    }

                    const taxes = subtotal * 0.1; // 10% tax example
                    const total = subtotal + taxes - (state.quotation.pricing.discounts || 0);

                    state.quotation.pricing = {
                        ...state.quotation.pricing,
                        subtotal,
                        taxes,
                        total,
                        breakdown,
                        perPersonPrice: state.quotation.participants
                            ? total / state.quotation.participants
                            : undefined,
                    };
                }),

            updatePricing: (pricing) =>
                set((state) => {
                    if (!state.quotation.pricing) {
                        state.quotation.pricing = {
                            subtotal: 0,
                            markup: 0,
                            taxes: 0,
                            discounts: 0,
                            total: 0,
                            currency: 'EUR',
                            breakdown: {
                                accommodation: 0,
                                transport: 0,
                                activities: 0,
                                meals: 0,
                                guides: 0,
                                other: 0,
                                sightseeing: 0,
                            },
                        };
                    }
                    Object.assign(state.quotation.pricing?.breakdown, pricing);
                    state.quotation.updatedAt = dayjs().toISOString();
                }),

            // Validation
            validateStep: (step) => {
                const errors = get().getValidationErrors(step);
                return errors.length === 0;
            },

            getValidationErrors: (step) => {
                const state = get();
                const errors: string[] = [];

                switch (step) {
                    case 0:
                        // Template selection - no validation needed
                        break;
                    case 1:
                        if (!state.quotation.customer?.name) errors.push('Customer name is required');
                        if (!state.quotation.customer?.email) errors.push('Customer email is required');
                        if (!state.quotation.tripName) errors.push('Trip name is required');
                        if (!state.quotation.destination) errors.push('Destination is required');
                        if (!state.quotation.startDate) errors.push('Start date is required');
                        if (!state.quotation.endDate) errors.push('End date is required');
                        if (!state.quotation.participants || state.quotation.participants <= 0) {
                            errors.push('Number of participants is required');
                        }
                        break;
                    case 2:
                        if (state.quotation.usesDayByDay) {
                            if (!state.quotation.days?.length) {
                                errors.push('At least one day must be planned');
                            }
                        } else {
                            if (!state.quotation.services?.length) {
                                errors.push('At least one service must be added');
                            }
                        }
                        break;
                    case 3:
                        if (!state.quotation.validUntil) errors.push('Quotation validity date is required');
                        break;
                    case 4:
                        // Review step - no additional validation
                        break;
                }

                return errors;
            },

            // Computed Properties
            getTotalCost: () => {
                const state = get();
                return state.quotation.pricing?.total || 0;
            },

            getCompletionPercentage: () => {
                const state = get();
                const totalSteps = 5;
                return ((state.currentStep + 1) / totalSteps) * 100;
            },

            getActivityCount: () => {
                const state = get();
                if (state.quotation.usesDayByDay && state.quotation.days) {
                    return state.quotation.days.reduce((count, day) => count + day.activities.length, 0);
                }
                return state.quotation.services?.length || 0;
            },

            getPendingBookings: () => {
                const state = get();
                if (state.quotation.usesDayByDay && state.quotation.days) {
                    return state.quotation.days.reduce((count, day) =>
                        count + day.activities.filter(activity => activity.status === 'pending').length, 0
                    );
                }
                return 0;
            },
        })),
        {
            name: 'bonvoyage-quotation-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                quotation: state.quotation,
                stepData: state.stepData,
                currentStep: state.currentStep,
            }),
        }
    )
);