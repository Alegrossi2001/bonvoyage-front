import useConfirmedTableActions from "./logic/useConfirmedTableActions";
import ConfirmedQuotationsTable from "./ui/ConfirmedQuotationsTable";

const ConfirmedQuotations = () => {

    const { manageBookings, viewTripFile } = useConfirmedTableActions();

    return (
        <ConfirmedQuotationsTable
            onManageBookings={manageBookings}
            onViewTripFile={viewTripFile}
        />
    )
}

export default ConfirmedQuotations;