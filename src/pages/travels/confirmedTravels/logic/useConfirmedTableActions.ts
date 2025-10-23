const useConfirmedTableActions = () => {

    const manageBookings = (quotationId: string) => {
        console.log(`Managing bookings for quotation ID: ${quotationId}`);
        // Implement navigation or modal opening logic here
    }

    const viewTripFile = (quotationId: string) => {
        console.log(`Viewing trip file for quotation ID: ${quotationId}`);
        // Implement navigation or modal opening logic here
    }

    return {
        manageBookings,
        viewTripFile,
    }
}

export default useConfirmedTableActions;