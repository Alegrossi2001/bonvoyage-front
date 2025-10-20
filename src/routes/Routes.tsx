// filepath: [Routes.tsx](http://_vscodecontentref_/0)
import React from 'react';
import {
    BookmarkAddOutlined,
    BookOnline,
    Dashboard as DashboardIcon,
    Email,
    TrendingUp,

} from "@mui/icons-material";
import type { Role } from '../interfaces/Auth/Auth';
import CreateQuotation from '../pages/travels/createTravels/CreateQuotation';

export interface NavigationalRoutes {
    type: "collapse" | "title" | "divider" | "hidden";
    name: string;
    key: string;
    icon?: React.ReactNode;
    route?: string;
    component?: React.ReactNode;
    subRoutes?: NavigationalRoutes[];
    badge?: number | string;
    new?: boolean;
    premium?: boolean;
    permissions?: Role[];
}

export const NavigationalRoutes: NavigationalRoutes[] = [
    {
        type: "title",
        name: "Overview",
        key: "overview"
    },
    {
        type: "collapse",
        name: "Dashboard",
        key: "dashboard",
        icon: <DashboardIcon />,
        route: "/dashboard",
        component: <div>Dashboard Page</div>,
        badge: "LIVE"
    },
    {
        type: "collapse",
        name: "Analytics",
        key: "analytics",
        icon: <TrendingUp />,
        route: "/analytics",
        component: <div>Analytics Page</div>,
        premium: true,
        permissions: ["admin", "user"]
    },
    {
        type: "divider",
        name: "Divider 1",
        key: "divider-1"
    },
    {
        type: "title",
        name: "Gestisci i tuoi viaggi",
        key: "booking-management"
    },
    {
        type: "collapse",
        name: "Viaggi",
        key: "bookings",
        icon: <DashboardIcon />,
        route: "/bookings",
        subRoutes: [
            {
                type: "collapse",
                name: "Nuovo viaggio",
                key: "new-booking",
                route: "/bookings/new",
                icon: <BookOnline />,
                component: <CreateQuotation />
            },
            {
                type: "collapse",
                name: "I miei viaggi",
                key: "my-bookings",
                route: "/bookings/my",
                icon: <BookmarkAddOutlined />,
                component: <div>My Bookings Page</div>,
            },
        ],
    },
    {
        type: "collapse",
        name: "Inbox",
        key: "inbox",
        icon: <Email />,
        route: "/inbox",
        component: <div>Inbox</div>
    }

];