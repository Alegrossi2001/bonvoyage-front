import { useState, useEffect } from "react";
import type { InboxItem } from "../interfaces/InboxItem";
import { STAT_TYPE } from "../interfaces/InboxStats";

const useSearch = (items: InboxItem[]) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filteredItems, setFilteredItems] = useState<InboxItem[]>(items);
    const [filterType, setFilterType] = useState<InboxItem["type"]>("any");
    const [priorityFilter, setPriorityFilter] = useState<typeof STAT_TYPE[number] | null>(null);

    // Always re-apply filters when any filter state changes
    useEffect(() => {
        setFilteredItems(
            items.filter(item => {
                // Search filter
                const matchesSearch =
                    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.preview.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.sender.name.toLowerCase().includes(searchTerm.toLowerCase());

                // Type filter
                const matchesType = filterType === "any" || item.type === filterType;

                // Priority filter (assumes item.priority exists)
                const matchesPriority =
                    !priorityFilter || (item.priority && item.priority.toLowerCase() === priorityFilter);

                return matchesSearch && matchesType && matchesPriority;
            })
        );
    }, [items, searchTerm, filterType, priorityFilter]);

    const onSearchChange = (term: string) => {
        setSearchTerm(term);
    };

    const onFilterTypeChange = (type: InboxItem["type"]) => {
        setFilterType(type);
    };

    const setPriority = (priority: typeof STAT_TYPE[number]) => {
        if (priority === "total" || priority === "all") {
            setPriorityFilter(null);
            return;
        }
        if (!STAT_TYPE.includes(priority)) {
            console.error(`Invalid priority type: ${priority}`);
        }
        setPriorityFilter(priority);
    };

    return {
        searchTerm,
        setSearchTerm,
        filteredItems,
        onSearchChange,
        filterType,
        onFilterTypeChange,
        priorityFilter,
        setPriority,
    };
};

export default useSearch;
