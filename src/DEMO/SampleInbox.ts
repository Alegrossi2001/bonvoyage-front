import type { InboxItem } from "../pages/inbox/interfaces/InboxItem";

export const mockInboxItems: InboxItem[] = [
    {
        id: 'inbox-001',
        type: 'quote_request',
        title: 'New Quote Request from Sacred Heart College',
        preview: 'Educational trip to Rome for 30 students, 5 days in March 2024. Budget: €15,000',
        isRead: false,
        priority: 'high',
        createdAt: '2024-01-23T14:30:00Z',
        entityId: 'lead-001',
        entityType: 'quote',
        sender: {
            name: 'Sister Mary Catherine',
            type: 'client'
        },
        actionRequired: true,
        category: 'New Business',
        metadata: {
            clientName: 'Sacred Heart College',
            value: 15000,
            currency: 'EUR'
        }
    },
    {
        id: 'inbox-002',
        type: 'supplier_update',
        title: 'Hotel Roma Palace - Booking Confirmed',
        preview: 'Your reservation for 15 twin rooms from March 15-20 has been confirmed. Confirmation #RP2024001',
        isRead: false,
        priority: 'normal',
        createdAt: '2024-01-23T11:45:00Z',
        entityId: 'QT-2024-001',
        entityType: 'trip',
        sender: {
            name: 'Hotel Roma Palace',
            type: 'supplier'
        },
        actionRequired: false,
        category: 'Supplier Updates',
        metadata: {
            tripId: 'QT-2024-001',
            clientName: 'Sacred Heart College'
        }
    },
    {
        id: 'inbox-003',
        type: 'client_message',
        title: 'Itinerary Change Request',
        preview: 'Could we adjust the Vatican tour time from 9 AM to 2 PM? Some students have morning commitments.',
        isRead: true,
        priority: 'normal',
        createdAt: '2024-01-23T09:15:00Z',
        entityId: 'QT-2024-001',
        entityType: 'trip',
        sender: {
            name: 'Amanda Rodriguez',
            type: 'client'
        },
        actionRequired: true,
        category: 'Trip Changes',
        metadata: {
            tripId: 'QT-2024-001',
            clientName: 'Corporate Events Plus'
        },
        thread: [
            {
                id: 'msg-001',
                content: 'Could we adjust the Vatican tour time from 9 AM to 2 PM?',
                sender: 'Amanda Rodriguez',
                timestamp: '2024-01-23T09:15:00Z',
                isInternal: false
            },
            {
                id: 'msg-002',
                content: 'Let me check with the Vatican guides for availability.',
                sender: 'Sarah Johnson',
                timestamp: '2024-01-23T09:30:00Z',
                isInternal: true
            }
        ]
    },
    {
        id: 'inbox-004',
        type: 'task_alert',
        title: 'Payment Reminder: Corporate Events Plus',
        preview: 'Deposit payment of €7,425 is due in 3 days. Send reminder to client.',
        isRead: false,
        priority: 'urgent',
        createdAt: '2024-01-22T16:00:00Z',
        entityId: 'QT-2024-003',
        entityType: 'trip',
        sender: {
            name: 'BonVoyage System',
            type: 'system'
        },
        actionRequired: true,
        category: 'Payments',
        metadata: {
            clientName: 'Corporate Events Plus',
            value: 7425,
            currency: 'EUR',
            dueDate: '2024-01-26T00:00:00Z'
        }
    },
    {
        id: 'inbox-005',
        type: 'supplier_update',
        title: 'Multiple Supplier Confirmations',
        preview: 'Restaurant booking confirmed, guide assignment updated, transport schedule finalized',
        isRead: false,
        priority: 'normal',
        createdAt: '2024-01-22T14:20:00Z',
        entityId: 'QT-2024-005',
        entityType: 'trip',
        sender: {
            name: 'Multiple Suppliers',
            type: 'supplier'
        },
        actionRequired: false,
        category: 'Supplier Updates',
        relatedCount: 3,
        metadata: {
            tripId: 'QT-2024-005',
            clientName: 'University of Excellence'
        }
    },
    {
        id: 'inbox-006',
        type: 'system_notification',
        title: 'Weekly Operations Summary',
        preview: '5 trips departing next week, 12 pending bookings, 3 payment reminders needed',
        isRead: true,
        priority: 'low',
        createdAt: '2024-01-22T08:00:00Z',
        sender: {
            name: 'BonVoyage Analytics',
            type: 'system'
        },
        actionRequired: false,
        category: 'Reports'
    }
];
