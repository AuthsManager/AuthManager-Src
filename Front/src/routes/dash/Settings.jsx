import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { toast } from "sonner";
import { 
    Mail, 
    Lock, 
    Moon,
    Sun
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function Settings() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [settings, setSettings] = useState({
        email: user.email || "",
        notifications: {
            updates: true,
            security: true,
            marketing: false
        },
        theme: "dark",
        language: "en",
        twoFactor: false
    });

    const updateSettings = async (section, data) => {
        setIsLoading(true);
        try {
            // await new Promise(resolve => setTimeout(resolve, 1000));
            setSettings(prev => ({ ...prev, ...data }));
            toast.success("Settings updated successfully");
        } catch (error) {
            toast.error("Failed to update settings");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const currentPassword = formData.get("currentPassword");
        const newPassword = formData.get("newPassword");
        const confirmPassword = formData.get("confirmPassword");

        if (newPassword !== confirmPassword) {
            return toast.error("Passwords do not match");
        }

        setIsLoading(true);
        try {
            // await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success("Password updated successfully");
            e.target.reset();
        } catch (error) {
            toast.error("Failed to update password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>
                            Update your email and manage your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={settings.email}
                                onChange={(e) => updateSettings("profile", { email: e.target.value })}
                                placeholder="Enter your email"
                            />
                        </div>
                        <Button 
                            variant="outline" 
                            onClick={() => toast.info("Email verification sent")}
                            className="w-full"
                        >
                            <Mail className="w-4 h-4 mr-2" />
                            Verify Email
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Security</CardTitle>
                        <CardDescription>
                            Protect your account with security features
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Current Password</Label>
                                <Input
                                    type="password"
                                    name="currentPassword"
                                    placeholder="Enter current password"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>New Password</Label>
                                <Input
                                    type="password"
                                    name="newPassword"
                                    placeholder="Enter new password"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Confirm Password</Label>
                                <Input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm new password"
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                <Lock className="w-4 h-4 mr-2" />
                                Update Password
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>
                            Choose what updates you want to receive
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Product Updates</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive notifications about new features and improvements
                                </p>
                            </div>
                            <Switch
                                checked={settings.notifications.updates}
                                onCheckedChange={(checked) =>
                                    updateSettings("notifications", {
                                        notifications: { ...settings.notifications, updates: checked }
                                    })
                                }
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Security Alerts</Label>
                                <p className="text-sm text-muted-foreground">
                                    Get notified about security updates and unusual activity
                                </p>
                            </div>
                            <Switch
                                checked={settings.notifications.security}
                                onCheckedChange={(checked) =>
                                    updateSettings("notifications", {
                                        notifications: { ...settings.notifications, security: checked }
                                    })
                                }
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Marketing</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive emails about new products, features and more
                                </p>
                            </div>
                            <Switch
                                checked={settings.notifications.marketing}
                                onCheckedChange={(checked) =>
                                    updateSettings("notifications", {
                                        notifications: { ...settings.notifications, marketing: checked }
                                    })
                                }
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Preferences</CardTitle>
                        <CardDescription>
                            Customize your application experience
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Theme</Label>
                                <p className="text-sm text-muted-foreground">
                                    Choose between light and dark mode
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant={settings.theme === "light" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => updateSettings("preferences", { theme: "light" })}
                                >
                                    <Sun className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={settings.theme === "dark" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => updateSettings("preferences", { theme: "dark" })}
                                >
                                    <Moon className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Two-Factor Authentication</Label>
                                <p className="text-sm text-muted-foreground">
                                    Add an extra layer of security to your account
                                </p>
                            </div>
                            <Switch
                                checked={settings.twoFactor}
                                onCheckedChange={(checked) =>
                                    updateSettings("security", { twoFactor: checked })
                                }
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}