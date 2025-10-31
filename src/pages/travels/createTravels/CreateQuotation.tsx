import { useTheme } from "@mui/system";
import useStepper from "./logic/useStepper";
import useStepValidation from "./logic/useStepValidation";
import { QuotationContainer, StepContent } from "./ui/Primitives";
import StepHeader from "./ui/StepHeader";
import BonVoyageStepper from "./ui/Stepper";
import StepperActionBar from "./ui/ActionBar";
import ChooseTemplate from "./ui/Step0/ChooseTemplate";
import CustomerRequirements from "./ui/Step1/CustomerRequirements";
import ServicesComponents from "./ui/Step2/Services";
import SummaryPriceBreakdown from "./ui/Step3/SummaryPriceBreakdown";
import ReviewAndSend from "./ui/Step4/ReviewAndSend";
import { useStep1 } from "./logic/useStep1";
import useStep2 from "./logic/useStep2";


const CreateQuotation = () => {

    const theme = useTheme();
    const stepValidation = useStepValidation();
    const { steps, activeStep, handleNext, handleBack } = useStepper(stepValidation);
    //Step 1
    const { onSubmit: onSubmitStep1, handleClientSelect, watchedValues, errors, control: Step1Control } = useStep1();

    //Step 2
    const { templateModalOpen, supplierModalOpen, handleModalOpen, addFromSupplier, watchedServices, control: Step2Control, addService, addFromTemplate, fields, remove, calculateServiceTotals, setValue, errors: Step2Errors } = useStep2();

    //Step 3

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return <ChooseTemplate
                    onNewTrip={handleNext}
                    onCloneQuote={(quote) => {
                        console.log(quote);
                    }}
                />;
            case 1:
                return <CustomerRequirements
                    theme={theme}
                    onSubmit={onSubmitStep1}
                    handleClientSelect={handleClientSelect}
                    watchedValues={watchedValues}
                    control={Step1Control}
                    errors={errors}
                />

            case 2:
                return <ServicesComponents
                    theme={theme}
                    supplierModalOpen={supplierModalOpen}
                    templateModalOpen={templateModalOpen}
                    setOpenModalType={handleModalOpen}
                    addFromSupplier={addFromSupplier}
                    control={Step2Control}
                    watchedServices={watchedServices}
                    addService={addService}
                    addFromTemplate={addFromTemplate}
                    fields={fields}
                    remove={remove}
                    calculateServiceTotals={calculateServiceTotals}
                    setValue={setValue}
                    errors={Step2Errors}
                />;

            case 3:
                return <SummaryPriceBreakdown
                    theme={theme}
                    customer={watchedValues.step1?.customer}
                    tripDetails={watchedValues.step1?.tripDetails}
                    services={watchedServices}
                    validUntil={watchedValues.step3?.validUntil}

                />;

            case 4:
                return <ReviewAndSend />

            default:
                return null;
        }
    };

    return (
        <QuotationContainer>
            <StepHeader
                quotationState={{
                    id: 'QUO12345678',
                    version: 1,
                    status: 'draft',
                    customer: {
                        id: 'CUST1234',
                        name: 'John Doe',
                        email: 'john.doe@example.com'
                    }
                }}
                completionPercentage={40}
            />
            <BonVoyageStepper
                steps={steps}
                activeStep={activeStep}
                stepValidation={stepValidation}
                theme={theme}
            />
            <StepContent>
                {renderStepContent()}
            </StepContent>
            <StepperActionBar
                steps={steps}
                activeStep={activeStep}
                stepValidation={stepValidation}
                handleNext={handleNext}
                handleBack={handleBack}
                handleSave={() => { }}
                handleSend={() => { }}
                savingState={"idle"}
            />
        </QuotationContainer>
    )
}

export default CreateQuotation;