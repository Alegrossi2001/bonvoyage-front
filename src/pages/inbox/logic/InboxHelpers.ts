import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';

export const formatTimeAgo = (timestamp: string) => {
    const date = parseISO(timestamp);
    if (isToday(date)) {
        return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
        return 'Yesterday';
    } else {
        return formatDistanceToNow(date, { addSuffix: true });
    }
};

export const getPriorityColor = (priority: string) => {
    const colors = {
        urgent: '#FF1744',
        high: '#FF5722',
        normal: '#2196F3',
        low: '#4CAF50'
    };
    return colors[priority as keyof typeof colors];
};