import useSwr from 'swr';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { useAuth } from "@/lib/hooks/useAuth";
import { UserManagement } from "@/components/tables/management";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { BASE_API, API_VERSION } from "../../config.json";

export default function Users() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [appId, setAppId] = useState('');

    const fetcher = (url) => fetch(url, { headers: { 'Authorization': `${location.pathname.includes('admin') ? 'Admin' : 'User'} ${localStorage.getItem('token')}` } }).then(response => response.json()).catch(() => null);
    const { data: users, mutate } = useSwr(`${BASE_API}/v${API_VERSION}/subusers`, fetcher, { revalidateIfStale: false, revalidateOnFocus: false, revalidateOnReconnect: false });

    useEffect(() => {
        if (!user.applications.length) return navigate('/dash/apps');
        if (appId && !user.applications.find(app => app.id === appId)) setAppId('');
        if (users && Array.isArray(users)) mutate(users.filter(u => user.applications.find(app => app.id === u.appId)), { revalidate: false });
    }, [user, appId, users]);

    const createSubuser = async () => {
        const response = await fetch(`${BASE_API}/v${API_VERSION}/subusers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${location.pathname.includes('admin') ? 'Admin' : 'User'} ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                username,
                password,
                appId
            })
        }).catch(() => null);

        if (!response) return toast.error('Create user', { description: 'Failed to create your user. Try again.' });

        const json = await response.json().catch(() => null);

        if (response?.ok) {
            if (!json) return toast.error('Create user', { description: 'Failed to create your user. Try again.' });

            mutate([...users, json], { revalidate: false });
            setUsername('');
            setPassword('');
            setAppId('');

            toast.success('Create user', { description: 'Successfully created your user.' });
        } else {
            toast.error('Create user', { description: json?.message || 'Failed to create your user. Try again.' });
        }
    };

    async function deleteUser(userId) {
        const response = await fetch(`${BASE_API}/v${API_VERSION}/subusers/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `${location.pathname.includes('admin') ? 'Admin' : 'User'} ${localStorage.getItem('token')}`
            }
        }).catch(() => null);

        if (!response) return toast.error('Delete user', { description: 'Failed to delete your user. Try again.' });

        if (response.ok) {
            mutate(users.filter(u => u.id !== userId), { revalidate: false });
            
            toast.success('Delete user', { description: 'Successfully deleted your user.' });
        } else {
            const json = await response.json().catch(() => null);
            toast.error('Delete user', { description: json?.message || 'Failed to delete your user. Try again.' });
        }
    }

    return (
        <div className="bg-[#0A1323] py-4 px-6 rounded-lg border border-[#1B2B4B]">
            <h2 className="text-xl md:text-2xl font-bold mb-4">User management</h2>
            <AlertDialog>
                <AlertDialogTrigger><Button className="mb-4">Create User</Button></AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader className="mb-2">
                        <AlertDialogTitle>Create a new user</AlertDialogTitle>
                        <AlertDialogDescription>Create an unique user with username and password</AlertDialogDescription>
                    </AlertDialogHeader>
                        <div className="flex flex-col gap-2">
                            <Label>Username</Label>
                            <Input 
                                placeholder="Username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>Password</Label>
                            <Input 
                                placeholder="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>Application</Label>
                            <Select disabled={!user.applications.length} value={appId} onValueChange={(value) => setAppId(value)}>
                                <SelectTrigger className="w-[280px]">
                                    <SelectValue placeholder="Select an app" />
                                </SelectTrigger>
                                <SelectContent>
                                    {user.applications.map(app => {
                                        return <SelectItem key={app.id} value={app.id}>{app.name}</SelectItem>
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                    <AlertDialogFooter className="mt-4">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction disabled={!(username && password)} onClick={createSubuser}>Create</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <UserManagement users={users} deleteUser={deleteUser} />
        </div>
    );
}