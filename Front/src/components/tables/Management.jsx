import { useState } from "react";
import { toast } from "sonner";
import moment from 'moment';
import TableManagement from "./Table";
import { Ban, RefreshCw, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const UserManagement = ({ users, deleteUser }) => {
    const { user } = useAuth();
    const columns = ["ID", "Username", "Linked App", "Actions"];

    const data = !users || !Array.isArray(users) ? [] : users.map(({ id, username, appId }) => ({
        id,
        username,
        linkedApp: user.applications.find(app => app.id === appId)?.name || 'Unknown',
        action: (
            <div className="flex items-center gap-2 justify-start md:justify-end">
                <TooltipProvider delayDuration={100}>
                    <Tooltip>
                        <TooltipTrigger>
                            <div className="flex items-center justify-center px-2 py-1 bg-red-500 rounded-md cursor-pointer transition-colors hover:bg-red-600"><Ban width={18} /></div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Ban</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider delayDuration={100}>
                    <Tooltip>
                        <TooltipTrigger>
                            <div onClick={() => deleteUser(id)} className="flex items-center justify-center px-2 py-1 bg-red-500 rounded-md cursor-pointer transition-colors hover:bg-red-600"><Trash2 width={18} /></div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Delete</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        )
        }),
    );

    return <TableManagement columns={columns} data={data} />;
};

const LicenseManagement = ({ licenses, renewLicense, deleteLicense }) => {
    const { user } = useAuth();
    const columns = [
        "ID",
        "Name of license",
        "Expiration Date",
        "Status",
        "Linked App",
        "Actions"
    ];

    const data = !licenses || !Array.isArray(licenses) ? [] : licenses.map(({ id, name, appId, expiration, used }) => ({
        id,
        name,
        expiration: moment(expiration).format('DD/MM/YYYY'),
        status: used ? 'Used' : Date.now() < expiration ? 'Active' : 'Expired',
        linkedApp: user.applications.find(app => app.id === appId)?.name || 'Unknown',
        actions: (
            <div className="flex items-center gap-2 justify-start md:justify-end">
                <TooltipProvider delayDuration={100}>
                    <Tooltip>
                        <TooltipTrigger>
                            <div onClick={() => renewLicense(id)} className="flex items-center justify-center px-2 py-1 bg-blue-500 rounded-md cursor-pointer transition-colors hover:bg-blue-600"><RefreshCw width={18} /></div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Renew</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider delayDuration={100}>
                    <Tooltip>
                        <TooltipTrigger>
                            <div onClick={() => deleteLicense(id)} className="flex items-center justify-center px-2 py-1 bg-red-500 rounded-md cursor-pointer transition-colors hover:bg-red-600"><Trash2 width={18} /></div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Delete</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        )
    }));

    return <TableManagement columns={columns} data={data} />;
};

const AppManagement = ({ apps, renameApp, deleteApp }) => {
    const [name, setName] = useState('');

    const SecretSpoiler = ({ secret }) => {
        const [copied, setCopied] = useState(false);

        const copyToClipboard = () => {
            navigator.clipboard.writeText(secret).then(() => {
                toast.success('App Secret', { description: 'Successfully copied to clipboard.' });
                setCopied(true);
                setTimeout(() => setCopied(false), 2000); 
            });
        };

        const handleClick = () => {
            copyToClipboard();
        };

        return (
            <TooltipProvider delayDuration={100}>
                <Tooltip>
                    <TooltipTrigger>
                        <span onClick={handleClick} className={`cursor-pointer relative ${copied ? 'blur-none' : 'blur-sm'} transition duration-300`}>
                            {secret}
                        </span>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{copied ? "Copied" : "Click to copy"}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    };

    const columns = ["ID", "Name", "Owner ID", "Secret", "Actions"];

    const data = apps.map(app => ({
        id: app.id,
        name: app.name,
        ownerId: app.ownerId,
        secret: <SecretSpoiler secret={app.secret} />,
        actions: (
            <div className="flex items-center gap-2 justify-start md:justify-end">
                <AlertDialog>
                    <AlertDialogTrigger>
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger>
                                    <div className="flex items-center justify-center px-2 py-1 bg-blue-500 rounded-md cursor-pointer transition-colors hover:bg-blue-600"><Pencil width={18} /></div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Rename</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader className="mb-2">
                            <AlertDialogTitle>Rename app</AlertDialogTitle>
                        </AlertDialogHeader>
                        <div className="flex flex-col gap-2">
                            <Label>App name</Label>
                            <Input 
                                placeholder={app.name}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <AlertDialogFooter className="mt-4">
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                                disabled={!(name)} 
                                onClick={() => renameApp(app.id, name)}
                            >
                                Rename
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <TooltipProvider delayDuration={200}>
                    <Tooltip>
                        <TooltipTrigger>
                            <div onClick={() => deleteApp(app.id)} className="flex items-center justify-center px-2 py-1 bg-red-500 rounded-md cursor-pointer transition-colors hover:bg-red-600"><Trash2 width={18} /></div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Delete</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        )
    }));

    return <TableManagement columns={columns} data={data} />;
};

export { UserManagement, LicenseManagement, AppManagement };
