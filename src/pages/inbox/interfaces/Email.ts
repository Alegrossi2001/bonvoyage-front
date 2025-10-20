export type EmailPriority = 'high' | 'medium' | 'low' | 'normal';

export interface EmailContact {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    company?: string;
}

export interface EmailLabel {
    id: string;
    name: string;
    color: string;
    description?: string;
}

export interface EmailAttachment {
    id: string;
    filename: string;
    size: number;
    mimeType: string;
    url?: string;
    isInline?: boolean;
}

export interface Email {
    id: string;
    messageId?: string;
    threadId?: string;

    // Recipients
    sender: EmailContact;
    recipients?: EmailContact[];
    cc?: EmailContact[];
    bcc?: EmailContact[];

    // Content
    subject: string;
    content: string;
    preview?: string;

    // Metadata
    receivedAt: Date;
    sentAt?: Date;
    isRead: boolean;
    isStarred: boolean;
    isImportant: boolean;
    priority: EmailPriority;

    // Organization
    folder: string;
    labels?: EmailLabel[];
    attachments?: EmailAttachment[];

    // Flags
    isSpam?: boolean;
    isArchived?: boolean;
    isDeleted?: boolean;
    isFlagged?: boolean;

    // Tour operator specific
    bookingId?: string;
    customerId?: string;
    tourId?: string;
    isBookingInquiry?: boolean;
    isPaymentRelated?: boolean;
    isSupportTicket?: boolean;
}

export interface EmailThread {
    id: string;
    subject: string;
    emails: Email[];
    participants: EmailContact[];
    lastActivity: Date;
    isRead: boolean;
    isStarred: boolean;
    messageCount: number;
}

export interface EmailFolder {
    id: string;
    name: string;
    type: 'system' | 'custom';
    icon?: string;
    color?: string;
    unreadCount: number;
    totalCount: number;
    parentId?: string;
}

export interface EmailFilter {
    folder?: string;
    isRead?: boolean;
    isStarred?: boolean;
    priority?: EmailPriority;
    labels?: string[];
    hasAttachments?: boolean;
    dateRange?: {
        start: Date;
        end: Date;
    };
    search?: string;
    sender?: string;
}

export interface EmailConnection {
    id: string;
    name: string;
    email: string;
    provider: 'gmail' | 'outlook' | 'imap' | 'exchange';
    isConnected: boolean;
    lastSync?: Date;
    syncInterval: number;
    settings: {
        autoSync: boolean;
        markAsRead: boolean;
        downloadAttachments: boolean;
        syncSent: boolean;
        syncDrafts: boolean;
    };
}