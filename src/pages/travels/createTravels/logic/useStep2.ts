import { useCallback, useMemo, useState } from "react";
import type { Supplier } from "../interfaces/Supplier";
import { useFieldArray, useForm } from "react-hook-form";
import type { QuotationStepData } from "../interfaces/QuotationStepData";
import type { ServiceItem } from "../interfaces/ServiceItem";

const useStep2 = () => {
    const [templateModalOpen, setTemplateModalOpen] = useState(false);
    const [supplierModalOpen, setSupplierModalOpen] = useState(false);

    const { control, watch, setValue, formState: { errors } } = useForm<Partial<QuotationStepData>>({
        defaultValues: {
            step2: {
                services: [],
                totalNetCost: 0,
                totalMarkup: 0,
                totalGrossPrice: 0,
                averageMargin: 0,
            }
        },
        mode: 'onChange'
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'step2.services'
    });

    const watchedServices = useMemo(() => watch('step2.services') || [], [watch]);

    const handleModalOpen = useCallback((type: 'templates' | 'suppliers') => {
        if (type === 'templates') {
            setTemplateModalOpen(!templateModalOpen);
        } else {
            setSupplierModalOpen(!supplierModalOpen);
        }
    }, [templateModalOpen, supplierModalOpen]);

    const addFromSupplier = useCallback((supplier: Supplier) => {
        console.log('Adding service from supplier:', supplier);
    }, []);

    const addService = useCallback(() => {
        const newService: ServiceItem = {
            id: Date.now().toString(),
            category: 'accommodation',
            name: '',
            isIncluded: false,
            description: '',
            quantity: 1,
            unit: 'room-nights',
            unitPrice: 0,
            totalPrice: 0,
            markup: 20,
            finalPrice: 0,
        };
        append(newService);
    }, [append]);

    const addFromTemplate = useCallback((template: { services: ServiceItem[] }) => {
        template.services.forEach((templateService: ServiceItem) => {
            const service: ServiceItem = {
                id: Date.now().toString() + Math.random(),
                name: templateService.name,
                isIncluded: templateService.isIncluded,
                category: templateService.category,
                description: templateService.description,
                quantity: templateService.quantity,
                unit: templateService.unit,
                unitPrice: templateService.unitPrice,
                totalPrice: templateService.quantity * templateService.unitPrice,
                markup: templateService.markup,
                finalPrice: (templateService.quantity * templateService.unitPrice) * (1 + templateService.markup / 100),
            };
            append(service);
        });
        handleModalOpen("templates");
    }, [append, handleModalOpen]);

    const calculateServiceTotals = useCallback((index: number) => {
        const service = watchedServices[index];
        if (service) {
            const totalCost = (service.quantity || 0) * (service.unitPrice || 0);
            const markupAmount = totalCost * ((service.markup || 0) / 100);
            const finalPrice = totalCost + markupAmount;
            console.log('Calculated Totals:', { totalCost, markupAmount, finalPrice });
            /*
            setValue(`services.${index}.totalCost`, totalCost);
            setValue(`services.${index}.markupAmount`, markupAmount);
            setValue(`services.${index}.finalPrice`, finalPrice);
            */
        }
    }, [watchedServices /*, setValue*/]);

    return {
        templateModalOpen,
        supplierModalOpen,
        handleModalOpen,
        addFromSupplier,
        control,
        watchedServices,
        addService,
        addFromTemplate,
        fields,
        remove,
        calculateServiceTotals,
        setValue,
        errors,
    };
}

export default useStep2;