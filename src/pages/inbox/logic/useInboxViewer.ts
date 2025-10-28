import { useState } from "react"
import type { InboxItem } from "../interfaces/InboxItem"

const useInboxViewer = () => {
    const [item, setItem] = useState<InboxItem | null>(null)

    const openItem = (newItem: InboxItem) => {
        setItem(newItem)
    }

    return {
        item,
        openItem,
    }
}

export default useInboxViewer