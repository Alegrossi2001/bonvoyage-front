export interface PricingBreakdown {
    subtotal: number;
    markup: number;
    taxes: number;
    discounts: number;
    total: number;
    currency: string;
    perPersonPrice?: number;
    breakdown: {
        accommodation: number;
        transport: number;
        activities: number;
        meals: number;
        guides: number;
        sightseeing: number;
        other: number;
    };
}