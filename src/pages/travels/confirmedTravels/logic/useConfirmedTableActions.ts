import useBonVoyageNavigate from "../../../../routes/navigate";

const useConfirmedTableActions = () => {

    const { quickNav } = useBonVoyageNavigate();
    const manageBookings = (quotationId: string) => {
        console.log(`Managing bookings for quotation ID: ${quotationId}`);
        // Implement navigation or modal opening logic here
    }

    const viewTripFile = (quotationId: string) => {
        console.log(`Viewing trip file for quotation ID: ${quotationId}`);
        // Implement navigation or modal opening logic here
    }

    const createItinerary = (id: string) => {
        quickNav.createItinerary(id);
    }

    return {
        manageBookings,
        viewTripFile,
        createItinerary,
    }
}

export default useConfirmedTableActions;