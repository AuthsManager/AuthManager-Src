import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/lib/hooks/useAuth";
import Users from "./Users";
import Licenses from "./Licenses";
import Apps from "./Apps";

export default function Dashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    
    useEffect(() => {
        if (!user.applications.length) return navigate('/dash/apps');
    }, [user]);

    return (
        <>
            <Users />
            <Licenses />
            <Apps />
        </>
    );
}
