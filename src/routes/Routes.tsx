import React from 'react';
import {
    BookmarkAddOutlined,
    BookOnline,
    CheckBoxOutlined,
    Dashboard as DashboardIcon,
    Email,
    Engineering,
    People,
    TrendingUp,

} from "@mui/icons-material";
import type { Role } from '../interfaces/Auth/Auth';
import CreateQuotation from '../pages/travels/createTravels/CreateQuotation';
import MyQuotations from '../pages/travels/myTravels/MyQuotations';
import ConfirmedQuotations from '../pages/travels/confirmedTravels/ConfirmedQuotations';
import TourOperatorInbox from '../pages/inbox/TourOperatorInbox';
import OperatorDashboard from '../pages/dashboards/operator/OperatorDashboard';
import AssignRequests from '../pages/assign/AssignRequests';
import CreateAutomation from '../pages/automations/create/CreateAutomation';
import ManagerDashboard from '../pages/dashboards/user/UserDashboard';
import CreateItinerary from '../pages/travels/createItinerary/CreateItinerary';

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
        key: "dashboard-operator",
        icon: <DashboardIcon />,
        route: "/dashboard-operator",
        component: <OperatorDashboard />,
        badge: "OPERATOR",
        permissions: ["operator", "admin"]
    },
    {
        type: "collapse",
        name: "Dashboard",
        key: "dashboard-user",
        icon: <DashboardIcon />,
        route: "/dashboard-user",
        component: <ManagerDashboard />,
        badge: "USER",
        permissions: ["user", "admin"]
    },
    {
        type: "collapse",
        name: "Assegna richieste",
        key: "assign",
        icon: <TrendingUp />,
        route: "/assign",
        component: <AssignRequests />,
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
                component: <MyQuotations />
            },
            {
                type: "collapse",
                name: "Viaggi confermati",
                key: "confirmed-bookings",
                route: "/bookings/confirmed",
                icon: <CheckBoxOutlined />,
                component: <ConfirmedQuotations />
            }
        ],
    },
    {
        type: "collapse",
        name: "Inbox",
        key: "inbox",
        icon: <Email />,
        route: "/inbox",
        component: <TourOperatorInbox />
    },
    {
        type: "divider",
        name: "Divider 2",
        key: "divider-2",
        permissions: ["admin", "user"]
    },
    {
        type: "title",
        name: "Zona amministrativa",
        key: "admin-section",
        permissions: ["admin", "user"]
    },
    {
        type: "collapse",
        name: "Crea automazioni",
        key: "create-automation",
        icon: <Engineering />,
        permissions: ["admin", "user"],
        route: "/admin/create-automation",
        component: <CreateAutomation />
    },
    {
        type: "collapse",
        name: "Gestisci utenti",
        key: "manage-roles",
        icon: <People />,
        permissions: ["admin", "user"],
        route: "/admin/manage-roles",
        component: <div>Role Management Page</div>
    },
    {
        type: "hidden",
        name: "Crea Itinerario",
        key: "create-itinerary",
        route: "/travels/create-itinerary/:id",
        component: <CreateItinerary />
    }

];