import { AttachMoneyOutlined, CloudDone, FlightTakeoffOutlined, HotelOutlined, PreviewOutlined } from '@mui/icons-material';
import { useCallback, useState } from 'react';
import type { WizardStep } from '../../../../interfaces/Reusable/Steps';

const steps: WizardStep[] = [
    {
        label: 'Pick your template',
        icon: <CloudDone />,
        description: 'Capture customer needs and preferences'
    },
    {
        label: 'Itinerary Planning',
        icon: <FlightTakeoffOutlined />,
        description: 'Design day-by-day travel plan'
    },
    {
        label: 'Service Selection',
        icon: <HotelOutlined />,
        description: 'Choose hotels, flights, and activities'
    },
    {
        label: 'Pricing & Margins',
        icon: <AttachMoneyOutlined />,
        description: 'Optimize pricing and profit margins'
    },
    {
        label: 'Quote Preview',
        icon: <PreviewOutlined />,
        description: 'Review and finalize quotation'
    }
];

const useStepper = (stepValidation: boolean[]) => {

    const [activeStep, setActiveStep] = useState(0);

    const handleNext = useCallback(() => {
        if (activeStep < steps.length - 1 && stepValidation[activeStep]) {
            setActiveStep(prev => prev + 1);
        }
    }, [activeStep, stepValidation]);

    const handleBack = useCallback(() => {
        if (activeStep > 0) {
            setActiveStep(prev => prev - 1);
        }
    }, [activeStep]);
    return { steps, activeStep, handleNext, handleBack };
}

export default useStepper;