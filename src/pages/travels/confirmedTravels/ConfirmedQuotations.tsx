import useConfirmedTableActions from "./logic/useConfirmedTableActions";
import ConfirmedQuotationsTable from "./ui/ConfirmedQuotationsTable";

const ConfirmedQuotations = () => {

    const { manageBookings, viewTripFile, createItinerary } = useConfirmedTableActions();

    return (
        <ConfirmedQuotationsTable
            onManageBookings={manageBookings}
            onViewTripFile={viewTripFile}
            onEditItinerary={createItinerary}
        />
    )
}

export default ConfirmedQuotations;