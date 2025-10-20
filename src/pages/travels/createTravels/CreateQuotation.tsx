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

const CreateQuotation = () => {

    const theme = useTheme();
    const stepValidation = useStepValidation();
    const { steps, activeStep, handleNext, handleBack } = useStepper(stepValidation);

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
                return <CustomerRequirements />

            case 2:
                return <ServicesComponents />

            case 3:
                return <SummaryPriceBreakdown />;

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