import useSwr from 'swr';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from "sonner";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/hooks/useAuth";
import { UserManagement } from "@/components/tables/management";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Ban, CheckCircle, Search } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
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

export default function AdminUsers() {
    const location = useLocation();
    const { user } = useAuth();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [date, setDate] = useState();
    const [isAdmin, setIsAdmin] = useState(false);

    const fetcher = (url) => fetch(url, { 
        headers: { 'Authorization': `Admin ${localStorage.getItem('token')}` } 
    })
    .then(response => response.json())
    .catch(() => null);
    
    const { data: allUsers, mutate } = useSwr(`${BASE_API}/v${API_VERSION}/admin/users`, fetcher, { 
        revalidateIfStale: false, 
        revalidateOnFocus: false, 
        revalidateOnReconnect: false 
    });

    const createUser = async () => {
        const response = await fetch(`${BASE_API}/v${API_VERSION}/admin/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Admin ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                email,
                username,
                password,
                expiration: new Date(date).getTime(),
                isAdmin
            })
        }).catch(() => null);

        if (!response) return toast.error('Create user', { description: 'Failed to create user. Try again.' });

        const json = await response.json().catch(() => null);

        if (response?.ok) {
            if (!json) return toast.error('Create user', { description: 'Failed to create user. Try again.' });

            mutate([...allUsers, json], { revalidate: false });
            setUsername('');
            setPassword('');
            setIsAdmin(false);

            toast.success('Create user', { description: 'Successfully created user.' });
        } else {
            toast.error('Create user', { description: json?.message || 'Failed to create user. Try again.' });
        }
    };

    async function deleteUser(userId) {
        const response = await fetch(`${BASE_API}/v${API_VERSION}/admin/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Admin ${localStorage.getItem('token')}`
            }
        }).catch(() => null);

        if (!response) return toast.error('Delete user', { description: 'Failed to delete user. Try again.' });

        if (response.ok) {
            mutate(allUsers.filter(u => u.id !== userId), { revalidate: false });
            
            toast.success('Delete user', { description: 'Successfully deleted user.' });
        } else {
            const json = await response.json().catch(() => null);
            toast.error('Delete user', { description: json?.message || 'Failed to delete user. Try again.' });
        }
    }

    async function toggleBanUser(userId, currentStatus) {
        const response = await fetch(`${BASE_API}/v${API_VERSION}/admin/users/${userId}/ban`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Admin ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                banned: !currentStatus
            })
        }).catch(() => null);

        if (!response) return toast.error('Update user', { description: 'Failed to update user status. Try again.' });

        if (response.ok) {
            mutate(allUsers.map(u => u.id === userId ? {...u, banned: !currentStatus} : u), { revalidate: false });
            
            toast.success('Update user', { 
                description: `Successfully ${!currentStatus ? 'banned' : 'unbanned'} user.` 
            });
        } else {
            const json = await response.json().catch(() => null);
            toast.error('Update user', { description: json?.message || 'Failed to update user status. Try again.' });
        }
    }

    const filteredUsers = !allUsers ? [] : allUsers.filter(user => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            user.username?.toLowerCase().includes(query) ||
            user.id?.toLowerCase().includes(query)
        );
    });

    return (
        <div className="bg-[#0A1323] py-4 px-6 rounded-lg border border-[#1B2B4B]">
            <h2 className="text-xl md:text-2xl font-bold mb-4">Admin User Management</h2>
            
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                <AlertDialog>
                    <AlertDialogTrigger>
                        <Button className="w-full md:w-auto">Create User</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader className="mb-2">
                            <AlertDialogTitle>Create a new user</AlertDialogTitle>
                            <AlertDialogDescription>Create a user with username and password</AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <Label>Email</Label>
                                <Input 
                                    placeholder="Email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
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
                                <Label>Expiration</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[280px] justify-start text-left font-normal",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isAdmin"
                                    checked={isAdmin}
                                    onChange={(e) => setIsAdmin(e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <Label htmlFor="isAdmin">Admin privileges</Label>
                            </div>
                        </div>
                        <AlertDialogFooter className="mt-4">
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction disabled={!(username && password)} onClick={createUser}>Create</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                
                <div className="relative w-full md:w-64">
                    <Input
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
            </div>
            
            <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">Total users: {filteredUsers.length}</p>
            </div>
            
            <UserManagementAdmin users={filteredUsers} deleteUser={deleteUser} toggleBanUser={toggleBanUser} />
        </div>
    );
}

const UserManagementAdmin = ({ users, deleteUser, toggleBanUser }) => {
    const columns = ["ID", "Username", "Admin", "Status", "Created At", "Actions"];

    const data = !users || !Array.isArray(users) ? [] : users.map(({ id, username, isAdmin, banned, createdAt }) => ({
        id,
        username,
        admin: isAdmin ? (
            <span className="px-2 py-1 rounded-md text-sm font-medium bg-[#1B2B4B] text-blue-400">
                Admin
            </span>
        ) : (
            <span className="px-2 py-1 rounded-md text-sm font-medium bg-[#1B2B4B] text-gray-400">
                User
            </span>
        ),
        status: banned ? (
            <span className="px-2 py-1 rounded-md text-sm font-medium bg-[#1B2B4B] text-red-400">
                Banned
            </span>
        ) : (
            <span className="px-2 py-1 rounded-md text-sm font-medium bg-[#1B2B4B] text-green-400">
                Active
            </span>
        ),
        createdAt: new Date(createdAt).toLocaleDateString(),
        action: (
            <div className="flex items-center gap-2 justify-start md:justify-end">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`${banned ? 'text-green-400 hover:text-green-500' : 'text-red-400 hover:text-red-500'} bg-[#1B2B4B] hover:bg-[#2C3B5B]`}
                    onClick={() => toggleBanUser(id, banned)}
                >
                    {banned ? <CheckCircle className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                </Button>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-400 hover:text-red-500 bg-[#1B2B4B] hover:bg-[#2C3B5B]"
                    onClick={() => deleteUser(id)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                </Button>
            </div>
        )
    }));

    return <UserManagement columns={columns} data={data} />;
};