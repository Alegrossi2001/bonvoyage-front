import {
    HotelOutlined,
    DirectionsBusOutlined,
    RestaurantOutlined,
    TourOutlined,
    PersonOutlined,
    MoreHorizOutlined,
} from '@mui/icons-material';

export const categoryConfig = {
    accommodation: {
        icon: HotelOutlined,
        color: '#1976d2',
        units: ['room-nights', 'bed-nights', 'apartments', 'nights'],
        description: 'Hotels, hostels, apartments, and lodging'
    },
    transport: {
        icon: DirectionsBusOutlined,
        color: '#388e3c',
        units: ['days', 'transfers', 'km', 'hours'],
        description: 'Coaches, transfers, flights, and transportation'
    },
    guides: {
        icon: PersonOutlined,
        color: '#f57c00',
        units: ['days', 'half-days', 'hours', 'tours'],
        description: 'Tour guides and local specialists'
    },
    meals: {
        icon: RestaurantOutlined,
        color: '#d32f2f',
        units: ['persons', 'meals', 'days', 'groups'],
        description: 'Restaurants, catering, and dining experiences'
    },
    activities: {
        icon: TourOutlined,
        color: '#7b1fa2',
        units: ['persons', 'entries', 'activities', 'groups'],
        description: 'Museums, tours, experiences, and activities'
    },
    other: {
        icon: MoreHorizOutlined,
        color: '#455a64',
        units: ['items', 'services', 'days', 'persons'],
        description: 'Insurance, visas, and miscellaneous services'
    },
    sightseeing: {
        icon: TourOutlined,
        color: '#00796b',
        units: ['persons', 'tours', 'entries', 'groups'],
        description: 'Sightseeing tours and excursions'
    },
};