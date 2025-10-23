import type { Role } from "../../../interfaces/Auth/Auth";

export interface InboxItem {
    id: string;
    itemType: 'message' | 'request' | 'update' | 'alert' | 'task';
    sourceId: string;
    title: string;
    preview: string;
    timestamp: string;
    read: boolean;
    actionable: boolean;
    role: Role
}