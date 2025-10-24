import { useState } from "react";
import type { InboxItem } from "../interfaces/InboxItem";

const useSearch = (items: InboxItem[]) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filteredItems, setFilteredItems] = useState<InboxItem[]>(items);

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

    return {
        searchTerm,
        setSearchTerm,
        filteredItems
    }
}

export default useSearch;
