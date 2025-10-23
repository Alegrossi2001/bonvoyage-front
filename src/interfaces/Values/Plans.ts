//PAYMENT PLANS
export type PaymentPlan = 'free' | 'pro' | 'enterprise';

// Quotation Statuses
export type QuotationStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';

// Activity Types
export type ActivityType = 'accommodation' | 'transport' | 'activities' | 'meals' | 'guides' | 'sightseeing' | 'other';

// Activity Statuses
export type ActivityStatus = 'pending' | 'confirmed' | 'cancelled' | 'optional';

// Trip Types
export type TripType = 'Individual' | 'Corporate' | 'School' | 'Religious' | 'Travel Agency' | 'Other'

// Operational Statuses for Confirmed Quotations
export type OperationalStatuses = 'bookings_pending' | 'bookings_confirmed' | 'trip_file_created' | 'itinerary_locked' | 'ready_to_travel' | 'in_progress' | 'completed';

//CONSTANTS
export const QuotationStatuses: string[] = ['draft', 'sent', 'approved', 'rejected', 'expired'];