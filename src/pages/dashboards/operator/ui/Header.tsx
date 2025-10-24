import type { User } from "../../../../interfaces/Auth/Auth";

interface DashboardHeaderProps {
    user: User
}
const DashboardHeader = ({ user }: DashboardHeaderProps) => {
    return <div>Header Component - Welcome {user.name}</div>;
}

export default DashboardHeader;