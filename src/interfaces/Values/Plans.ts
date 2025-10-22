export type PaymentPlan = 'free' | 'pro' | 'enterprise';
export type QuotationStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';
export type ActivityType = 'sightseeing' | 'adventure' | 'relaxation' | 'cultural' | 'culinary';
export type ActivityStatus = 'pending' | 'confirmed' | 'cancelled' | 'optional';

//CONSTANTS
export const QuotationStatuses: string[] = ['draft', 'sent', 'approved', 'rejected', 'expired'];