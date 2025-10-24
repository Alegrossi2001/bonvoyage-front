import { useMemo } from "react";
import type { InboxItem } from "../interfaces/InboxItem";

const useInboxStats = (items: InboxItem[]) => {
    const stats = useMemo(() => {
        const total = items.length;
        const unread = items.filter(item => !item.isRead).length;
        const actionRequired = items.filter(item => item.actionRequired).length;
        const urgent = items.filter(item => item.priority === 'urgent').length;
        const categories = Array.from(new Set(items.map(item => item.category)));

        return { total, unread, actionRequired, urgent, categories };
    }, [items]);

    return stats;
}

export default useInboxStats;