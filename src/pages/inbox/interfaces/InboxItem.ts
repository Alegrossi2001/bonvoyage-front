export const INBOX_ITEM_TYPES = [
    'quote_request',
    'supplier_update',
    'client_message',
    'task_alert',
    'system_notification',
    'trip_update',
    'any'
]

export const ENTITY_TYPES = ['quote', 'trip', 'client', 'supplier']

export interface InboxItem {
    id: string;
    type: typeof INBOX_ITEM_TYPES[number];
    title: string;
    preview: string;
    isRead: boolean;
    priority: 'low' | 'normal' | 'high' | 'urgent';
    createdAt: string;
    entityId?: string;
    entityType?: typeof ENTITY_TYPES[number];
    sender: {
        name: string;
        avatar?: string;
        type: 'client' | 'supplier' | 'internal' | 'system';
    };
    actionRequired: boolean;
    category: string;
    relatedCount?: number; // for grouped items
    metadata?: {
        clientName?: string;
        tripId?: string;
        value?: number;
        currency?: string;
        dueDate?: string;
    };
    thread?: InboxMessage[];
}

export interface InboxMessage {
    id: string;
    content: string;
    sender: string;
    timestamp: string;
    isInternal: boolean;
}