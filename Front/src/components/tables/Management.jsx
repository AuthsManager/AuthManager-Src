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

const ActionButton = ({ onClick, icon: Icon, color = "red", tooltip }) => (
    <TooltipProvider delayDuration={100}>
        <Tooltip>
            <TooltipTrigger>
                <div 
                    onClick={onClick} 
                    className={`flex items-center justify-center p-2 rounded-lg transition-colors duration-200
                        ${color === "red" 
                            ? "bg-[#1B2B4B] text-red-400 hover:bg-red-500/20" 
                            : "bg-[#1B2B4B] text-blue-400 hover:bg-blue-500/20"}`}
                >
                    <Icon className="w-4 h-4" />
                </div>
            </TooltipTrigger>
            <TooltipContent>
                <p>{tooltip}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);

const UserManagement = ({ users, deleteUser }) => {
    const { user } = useAuth();
    const columns = ["ID", "Username", "Linked App", "Actions"];

    const data = !users || !Array.isArray(users) ? [] : users.map(({ id, username, appId }) => ({
        id,
        username,
        linkedApp: user.applications.find(app => app.id === appId)?.name || 'Unknown',
        action: (
            <div className="flex items-center gap-2 justify-start md:justify-end">
                <ActionButton icon={Ban} tooltip="Ban" onClick={() => {}} />
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <div>
                            <ActionButton icon={Trash2} tooltip="Delete" />
                        </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Do you really want to delete this user ?</AlertDialogTitle>
                        </AlertDialogHeader>
                        <p className="text-sm text-muted-foreground">
                            This action is irreversible. The user "{username}" will be permanently deleted.
                        </p>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                                onClick={() => deleteUser(id)}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        )
    }));

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
        status: (
            <span className={`px-2 py-1 rounded-md text-sm font-medium bg-[#1B2B4B]
                ${used ? 'text-yellow-400' :
                Date.now() < expiration ? 'text-green-400' :
                'text-red-400'}`}>
                {used ? 'Used' : Date.now() < expiration ? 'Active' : 'Expired'}
            </span>
        ),
        linkedApp: user.applications.find(app => app.id === appId)?.name || 'Unknown',
        actions: (
            <div className="flex items-center gap-2 justify-start md:justify-end">
                <ActionButton icon={RefreshCw} color="blue" tooltip="Renew" onClick={() => renewLicense(id)} />
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <div>
                            <ActionButton icon={Trash2} tooltip="Delete" />
                        </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Do you really want to delete this license ?</AlertDialogTitle>
                        </AlertDialogHeader>
                        <p className="text-sm text-muted-foreground">
                            This action is irreversible. The “{name}” license will be permanently deleted.                        
                        </p>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                                onClick={() => deleteLicense(id)}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
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
                        <span 
                            onClick={handleClick} 
                            className={`cursor-pointer font-mono text-sm px-3 py-1 rounded-md bg-[#1B2B4B]
                                ${copied ? 'blur-none' : 'blur-sm'} transition duration-300`}
                        >
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
                    <AlertDialogTrigger asChild>
                        <div>
                            <ActionButton icon={Pencil} color="blue" tooltip="Rename" />
                        </div>
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
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <div>
                            <ActionButton icon={Trash2} tooltip="Delete" />
                        </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Do you really want to delete this application?</AlertDialogTitle>
                        </AlertDialogHeader>
                        <p className="text-sm text-muted-foreground">
                            This action is irreversible. The “{app.name}” application and all its associated data will be permanently deleted.                        
                        </p>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction 
                                onClick={() => deleteApp(app.id)}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        )
    }));

    return <TableManagement columns={columns} data={data} />;
};

export { UserManagement, LicenseManagement, AppManagement };
