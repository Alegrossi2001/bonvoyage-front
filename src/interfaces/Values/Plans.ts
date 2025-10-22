export type PaymentPlan = 'free' | 'pro' | 'enterprise';
export type QuotationStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';
export type ActivityType = 'accommodation' | 'transport' | 'activities' | 'meals' | 'guides' | 'sightseeing' | 'other';
export type ActivityStatus = 'pending' | 'confirmed' | 'cancelled' | 'optional';
export type TripType = 'Individual' | 'Corporate' | 'School' | 'Religious' | 'Travel Agency' | 'Other'
//CONSTANTS
export const QuotationStatuses: string[] = ['draft', 'sent', 'approved', 'rejected', 'expired'];