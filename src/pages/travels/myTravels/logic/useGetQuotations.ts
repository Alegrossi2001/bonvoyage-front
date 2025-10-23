import { useEffect, useState } from "react";
import type { PreviousQuotation } from "../../createTravels/interfaces/Quotation";
import { mockPreviousQuotes } from "../../../../DEMO/SampleQuotationTemplate";

const useGetQuotations = () => {
    const [quotations, setQuotations] = useState<PreviousQuotation[]>([]);

    useEffect(() => {
        const fetchQuotations = async () => {
            setQuotations(mockPreviousQuotes);
        };
        fetchQuotations();
    }, []);

    return quotations;
};

export default useGetQuotations;