import { useForm } from "react-hook-form";
import type { QuotationStepData } from "../interfaces/QuotationStepData";
import { useCallback } from "react";
import type { Customer } from "../interfaces/Customer";
import dayjs from "dayjs";

export const useStep1 = () => {
    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm<Partial<QuotationStepData>>({
        defaultValues: {
            step1: {
                customer: {
                    name: '',
                    company: '',
                    email: '',
                    phone: '',
                },
                tripDetails: {
                    tripName: '',
                    destinations: [],
                    startDate: new Date().toISOString(),
                    endDate: new Date().toISOString(),
                    participants: 0,
                },
                requirements: [],
            }
        },
        mode: 'onChange'
    });

    const onSubmit = useCallback(() => {
        handleSubmit((data) => {
            console.log('Step 1 Data:', data);
        })();
    }, [handleSubmit]);

    const watchedValues = watch();

    const handleClientSelect = useCallback((client: Customer) => {
        if (client) {
            setValue('step1.customer.name', client.name);
            setValue('step1.customer.company', client.company);
            setValue('step1.customer.email', client.email);
            setValue('step1.customer.phone', client.phone);

            // Auto-suggest trip title based on client type and current date
            const month = dayjs().format('MMMM');
            const year = dayjs().year();
            let suggestedTitle = '';

            switch (client.type) {
                case 'School':
                    suggestedTitle = `${month} ${year} Educational Trip`;
                    break;
                case 'Religious':
                    suggestedTitle = `${month} ${year} Pilgrimage`;
                    break;
                case 'Corporate':
                    suggestedTitle = `${month} ${year} Corporate Event`;
                    break;
                default:
                    suggestedTitle = `${month} ${year} Trip`;
            }

            if (!watchedValues.step1?.tripDetails.tripName) {
                setValue('step1.tripDetails.tripName', suggestedTitle);
            }
        }
    }, [setValue, watchedValues.step1?.tripDetails.tripName]);

    return {
        control,
        handleSubmit,
        watch,
        setValue,
        errors,
        onSubmit,
        handleClientSelect,
        watchedValues,
    };
}