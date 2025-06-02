import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "@/lib/hooks/useAuth";
import Users from "./Users";
import Licenses from "./Licenses";
import Apps from "./Apps";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    
    useEffect(() => {
        if (!user.applications.length) return navigate('/admin/apps');
    }, [user]);

    return (
        <div className="space-y-8">
            <Users />
            <Licenses />
            <Apps />
        </div>
    );
}