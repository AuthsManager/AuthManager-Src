import useSwr from 'swr';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from "sonner";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/hooks/useAuth";
import { LicenseManagement } from "@/components/tables/management";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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

export default function AdminLicenses() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [date, setDate] = useState();
    const [appId, setAppId] = useState('');
    const [licenseName, setLicenseName] = useState('');

    const fetcher = (url) => fetch(url, { headers: { 'Authorization': `Admin ${localStorage.getItem('token')}` } }).then(response => response.json()).catch(() => null);
    const { data: licenses, mutate } = useSwr(`${BASE_API}/v${API_VERSION}/admin/licenses`, fetcher, { revalidateIfStale: false, revalidateOnFocus: false, revalidateOnReconnect: false });

    useEffect(() => {
        if (!user.applications.length) return navigate('/admin/apps');
        if (appId && !user.applications.find(app => app.id === appId)) setAppId('');
    }, [user, appId, licenses]);

    const createLicense = async () => {
        const response = await fetch(`${BASE_API}/v${API_VERSION}/admin/licenses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Admin ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                appId,
                name: licenseName,
                expiration: new Date(date).getTime()
            })
        }).catch(() => null);

        if (!response) return toast.error('Create license', { description: 'Failed to create your license. Try again.' });

        const json = await response.json().catch(() => null);

        if (response?.ok) {
            if (!json) return toast.error('Create license', { description: 'Failed to create your license. Try again.' });

            mutate([...licenses, json], { revalidate: false });
            setLicenseName('');
            setAppId('');
            setDate('');

            toast.success('Create license', { description: 'Successfully created your license.' });
        } else {
            toast.error('Create license', { description: json?.message || 'Failed to create your license. Try again.' });
        }
    };

    async function renewLicense(licenseId) {
        const response = await fetch(`${BASE_API}/v${API_VERSION}/admin/licenses/${licenseId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Admin ${localStorage.getItem('token')}`
            }
        }).catch(() => null);

        if (!response) return toast.error('Renew license', { description: 'Failed to renew your license. Try again.' });

        const json = await response.json().catch(() => null);

        if (response.ok) {
            if (!json) return toast.error('Renew license', { description: 'Failed to renew your license. Try again.' });

            mutate(data => data.map(license => license.id === licenseId ? { ...license, expiration: json.expiration } : license), { revalidate: false });
            
            toast.success('Renew license', { description: 'Successfully renewed your license.' });
        } else {
            toast.error('Renew license', { description: json?.message || 'Failed to renew your license. Try again.' });
        }
    }

    async function deleteLicense(licenseId) {
        const response = await fetch(`${BASE_API}/v${API_VERSION}/admin/licenses/${licenseId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Admin ${localStorage.getItem('token')}`
            }
        }).catch(() => null);

        if (!response) return toast.error('Delete license', { description: 'Failed to delete your license. Try again.' });

        if (response.ok) {
            mutate(licenses.filter(l => l.id !== licenseId), { revalidate: false });
            
            toast.success('Delete license', { description: 'Successfully deleted your license.' });
        } else {
            const json = await response.json().catch(() => null);
            toast.error('Delete license', { description: json?.message || 'Failed to delete your license. Try again.' });
        }
    }

    return (
        <div className="bg-[#0A1323] py-4 px-6 rounded-lg border border-[#1B2B4B]">
            <h2 className="text-xl md:text-2xl font-bold mb-4">License management</h2>
            <AlertDialog>
                <AlertDialogTrigger><Button className="mb-4">Create License</Button></AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader className="mb-2">
                        <AlertDialogTitle>Create a new license</AlertDialogTitle>
                        <AlertDialogDescription>Create a unique license with your name and an expiration date</AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex flex-col gap-2">
                        <Label>License name</Label>
                        <Input 
                            placeholder="License1"
                            value={licenseName}
                            onChange={(e) => setLicenseName(e.target.value)}
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
                    <div className="flex flex-col gap-2 mt-2">
                        <Label>Expiration date</Label>
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
                    <AlertDialogFooter className="mt-4">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction disabled={!(licenseName && appId && date)} onClick={createLicense}>Create</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <LicenseManagement licenses={licenses} renewLicense={renewLicense} deleteLicense={deleteLicense} />
        </div>
    );
}