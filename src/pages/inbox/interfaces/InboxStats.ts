export const STAT_TYPE = ['total', 'unread', 'action required', 'urgent']

export interface InboxStats {
    total: number;
    unread: number;
    actionRequired: number;
    urgent: number;
    categories: string[];
}