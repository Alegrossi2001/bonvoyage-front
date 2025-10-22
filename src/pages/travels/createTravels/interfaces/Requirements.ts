export interface RequirementItem {
    id: string;
    title: string;
    description: string;
    category: 'accommodation' | 'transport' | 'activities' | 'dining' | 'special_needs' | 'other';
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'pending' | 'addressed' | 'not_applicable';
    notes?: string;
    estimatedCost?: number;
}