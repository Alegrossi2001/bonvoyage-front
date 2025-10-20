import { ActionBar } from "./Primitives"
import { Stack, Button } from "@mui/material";
import { SaveOutlined, SendOutlined } from "@mui/icons-material";
import type { WizardStep } from "../../../../interfaces/Reusable/Steps";

interface StepperActionBarProps {
    steps: WizardStep[];
    activeStep: number;
    stepValidation: boolean[];
    handleNext: () => void;
    handleBack: () => void;
    handleSave: () => void;
    handleSend: () => void;
    savingState: 'idle' | 'saving' | 'saved' | 'error';
}

const StepperActionBar: React.FC<StepperActionBarProps> = ({
    steps,
    activeStep,
    stepValidation,
    handleNext,
    handleBack,
    handleSave,
    handleSend,
    savingState,
}) => (
    <ActionBar>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2}>
                <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    variant="outlined"
                >
                    Back
                </Button>

                <Button
                    disabled={!stepValidation[activeStep]}
                    onClick={handleNext}
                    variant="contained"
                    sx={{ minWidth: 120 }}
                >
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
            </Stack>

            <Stack direction="row" spacing={1}>
                <Button
                    startIcon={<SaveOutlined />}
                    onClick={handleSave}
                    disabled={savingState === 'saving'}
                    variant="outlined"
                    size="small"
                >
                    {savingState === 'saving' ? 'Saving...' : 'Save Draft'}
                </Button>

                {activeStep === steps.length - 1 && (
                    <Button
                        startIcon={<SendOutlined />}
                        onClick={handleSend}
                        disabled={!stepValidation.every(Boolean)}
                        variant="contained"
                        color="success"
                    >
                        Send Quote
                    </Button>
                )}
            </Stack>
        </Stack>
    </ActionBar>
)

export default StepperActionBar;