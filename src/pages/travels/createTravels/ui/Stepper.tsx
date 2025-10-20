import { Box, Step, StepLabel, Typography, Stepper } from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { Theme } from '@mui/system';

import type React from 'react';
interface StepperProps {
    steps: {
        label: string;
        description: string;
        icon?: React.ReactNode;
    }[];
    activeStep: number;
    stepValidation: boolean[];
    theme: Theme;
}

const BonVoyageStepper: React.FC<StepperProps> = ({ steps, activeStep, stepValidation, theme }) => (
    <Box sx={{ p: 3, backgroundColor: alpha(theme.palette.primary.main, 0.04) }}>
        <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((step, index) => (
                <Step key={step.label} completed={stepValidation[index]}>
                    <StepLabel
                        icon={step.icon}
                        error={!stepValidation[index] && index < activeStep}
                    >
                        <Typography variant="subtitle2" fontWeight={600}>
                            {step.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {step.description}
                        </Typography>
                    </StepLabel>
                </Step>
            ))}
        </Stepper>
    </Box>
);

export default BonVoyageStepper;