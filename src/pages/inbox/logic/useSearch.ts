import { useState } from "react";
import type { InboxItem } from "../interfaces/InboxItem";

const useSearch = (items: InboxItem[]) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filteredItems, setFilteredItems] = useState<InboxItem[]>(items);
    const [filterType, setFilterType] = useState<InboxItem["type"]>("any");
    const [entityType, setEntityType] = useState<InboxItem["entityType"]>("all");
    const onSearchChange = (term: string) => {
        setSearchTerm(term);
        setFilteredItems(
            items.filter(item =>
                item.title.toLowerCase().includes(term.toLowerCase()) ||
                item.preview.toLowerCase().includes(term.toLowerCase()) ||
                item.sender.name.toLowerCase().includes(term.toLowerCase()
                )
            ));
    };

    const onFilterTypeChange = (type: InboxItem["type"]) => {
        setFilterType(type);
        setFilteredItems(
            items.filter(item =>
                item.type === type || type === "any"
            ));
    };

    const onEntityTypeChange = (type: InboxItem["entityType"]) => {
        setEntityType(type);
        setFilteredItems(
            items.filter(item =>
                item.entityType === type || type === "all"
            ));
    };

    return {
        searchTerm,
        setSearchTerm,
        filteredItems,
        onSearchChange,
        filterType,
        onFilterTypeChange,
        entityType,
        onEntityTypeChange,
    }
}

export default useSearch;
