import type { ServiceItem } from "../pages/travels/createTravels/interfaces/ServiceItem";

export const SampleServices: ServiceItem[] = [
    {
        id: '1',
        category: 'accommodation',
        name: 'Hotel Sunshine',
        description: 'A comfortable 3-star hotel located in the city center.',
        unit: 'night',
        unitPrice: 80,
        quantity: 3,
        totalPrice: 240,
        markup: 10,
        finalPrice: 264,
        isIncluded: false,
        notes: 'Includes breakfast'
    },
    {
        id: '2',
        category: 'transport',
        name: 'City Taxi Service',
        description: 'Airport to hotel transfer service.',
        unit: 'ride',
        unitPrice: 30,
        quantity: 1,
        totalPrice: 30,
        markup: 5,
        finalPrice: 35,
        isIncluded: false,
        notes: 'Airport pickup included'
    },
    {
        id: '3',
        category: 'activities',
        name: 'City Tour',
        description: 'Guided tour of the main city attractions.',
        unit: 'person',
        unitPrice: 50,
        quantity: 2,
        totalPrice: 100,
        markup: 15,
        finalPrice: 115,
        isIncluded: false,
        notes: 'Lunch not included'
    }
]