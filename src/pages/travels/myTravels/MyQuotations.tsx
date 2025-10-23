import useGetQuotations from "./logic/useGetQuotations";
import QuotationTable from "./ui/QuotationTable";

const MyQuotations = () => {

    const quotations = useGetQuotations();

    return (
        <QuotationTable
            mockQuotations={quotations}
        />
    );
}

export default MyQuotations;