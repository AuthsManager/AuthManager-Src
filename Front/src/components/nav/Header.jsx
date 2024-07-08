import { useLocation } from "react-router-dom";
import { useAuth } from "@/lib/hooks/useAuth";

export default function Header() {
    const { user } = useAuth();
    const location = useLocation();

    const getName = () => {
        const routes = {
            '/dashboard': location.pathname.includes('/admin') ? 'Admin Dashboard' : 'Dashboard',
            '/users': 'Manage Users',
            '/licenses': 'Manage Licenses',
            '/apps': 'Manage Apps'
        };

        for (const [key, value] of Object.entries(routes)) {
            if (location.pathname.startsWith('/dash' + key) || location.pathname.startsWith('/admin' + key)) return value;
        }

        return location.pathname.includes('/admin') ? 'Admin Dashboard' : 'Dashboard';
    }

    return (
        <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold">{getName()}</h1>  
            <p className="hidden md:block text-md">Welcome, {user.username}!</p> 
        </div>
    );
}
