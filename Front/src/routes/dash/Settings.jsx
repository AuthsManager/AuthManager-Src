import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { toast } from "sonner";
import { 
    Mail, 
    Lock, 
    Moon,
    Sun,
    Check,
    Send,
    User
} from "lucide-react";
import { BASE_API, API_VERSION } from "../../config.json";
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
    const { user, updateUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [emailVerification, setEmailVerification] = useState({
        isVerifying: false,
        verificationCode: '',
        codeSent: false,
        isVerified: user?.isEmailVerified || false
    });
    const [settings, setSettings] = useState({
        email: user?.email || "",
        username: user?.username || "",
        theme: "dark",
        language: "en",
        twoFactor: false
    });

    useEffect(() => {
        if (user) {
            const savedTheme = localStorage.getItem('theme');
            const savedLanguage = localStorage.getItem('language');
            
            setSettings({
                email: user.email || "",
                username: user.username || "",
                theme: savedTheme || "dark",
                language: savedLanguage || "en",
                twoFactor: user.settings?.twoFactor || false
            });
            
            setEmailVerification(prev => ({
                ...prev,
                isVerified: user.isEmailVerified || false
            }));
        }
    }, [user]);

    const updateSettings = async (section, data) => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            let response;

            if (section === "profile") {
                 response = await fetch(`${BASE_API}/v${API_VERSION}/users/profile`, {
                     method: 'PATCH',
                     headers: {
                         'Content-Type': 'application/json',
                         'Authorization': `User ${token}`
                     },
                     body: JSON.stringify(data)
                 });
             } else if (section === "security" && data.twoFactor !== undefined) {
                 response = await fetch(`${BASE_API}/v${API_VERSION}/users/settings`, {
                     method: 'PATCH',
                     headers: {
                         'Content-Type': 'application/json',
                         'Authorization': `User ${token}`
                     },
                     body: JSON.stringify({ twoFactor: data.twoFactor })
                 });
             } else {
                 if (data.theme) {
                     localStorage.setItem('theme', data.theme);
                 }
                 if (data.language) {
                     localStorage.setItem('language', data.language);
                 }
                 
                  response = { ok: true };
              }
 
             if (response.ok) {
                  setSettings(prev => ({ ...prev, ...data }));
                  
                  if (section === "profile") {
                      const result = await response.json();
                      updateUser({ ...user, email: data.email });
                      toast.success(result.message || "Settings updated successfully");
                  } else if (section === "security" && data.twoFactor !== undefined) {
                      const result = await response.json();
                      const updatedSettings = { ...user.settings, twoFactor: data.twoFactor };
                      updateUser({ ...user, settings: updatedSettings });
                      toast.success(result.message || "Settings updated successfully");
                  } else {
                      toast.success("Settings updated successfully");
                  }
              } else {
                  const result = await response.json();
                  toast.error(result.message || "Failed to update settings");
              }
        } catch (error) {
            console.error('Error updating settings:', error);
            toast.error("Failed to update settings");
        } finally {
            setIsLoading(false);
        }
    };

    const manageSendVerificationCode = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_API}/v${API_VERSION}/users/send-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `User ${token}`
                }
            });

            const result = await response.json();

            if (response.ok) {
                setEmailVerification(prev => ({ ...prev, codeSent: true }));
                toast.success(result.message || "Verification code sent to your email");
            } else {
                toast.error(result.message || "Failed to send verification code");
            }
        } catch (error) {
            console.error('Error sending verification code:', error);
            toast.error("Failed to send verification code");
        } finally {
            setIsLoading(false);
        }
    };

    const manageVerifyEmail = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_API}/v${API_VERSION}/users/verify-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `User ${token}`
                },
                body: JSON.stringify({
                    verificationCode: emailVerification.verificationCode
                })
            });

            const result = await response.json();

            if (response.ok) {
                setEmailVerification({
                    isVerifying: false,
                    verificationCode: '',
                    codeSent: false,
                    isVerified: true
                });
                updateUser({ ...user, isEmailVerified: true });
                toast.success(result.message || "Email verified successfully!");
            } else {
                toast.error(result.message || "Failed to verify email");
            }
        } catch (error) {
            console.error('Error verifying email:', error);
            toast.error("Failed to verify email");
        } finally {
            setIsLoading(false);
        }
    };

    const managePasswordChange = async (e) => {
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
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_API}/v${API_VERSION}/users/password`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `User ${token}`
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                    confirmPassword
                })
            });

            const result = await response.json();

            if (response.ok) {
                toast.success(result.message || "Password updated successfully");
                e.target.reset();
            } else {
                toast.error(result.message || "Failed to update password");
            }
        } catch (error) {
            console.error('Error updating password:', error);
            toast.error("Failed to update password");
        } finally {
            setIsLoading(false);
        }
    };

    const manageUsernameChange = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newUsername = formData.get("newUsername");

        if (!newUsername || newUsername.trim() === "") {
            return toast.error("Username cannot be empty");
        }

        if (newUsername === settings.username) {
            return toast.error("New username must be different from current username");
        }

        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_API}/v${API_VERSION}/users/username`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `User ${token}`
                },
                body: JSON.stringify({
                    username: newUsername
                })
            });

            const result = await response.json();

            if (response.ok) {
                setSettings(prev => ({ ...prev, username: newUsername }));
                updateUser({ ...user, username: newUsername });
                toast.success(result.message || "Username updated successfully");
                e.target.reset();
            } else {
                toast.error(result.message || "Failed to update username");
            }
        } catch (error) {
            console.error('Error updating username:', error);
            toast.error("Failed to update username");
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

                        {emailVerification.isVerified ? (
                            <div className="flex items-center justify-center p-3 bg-green-800 border border-green-600 rounded-lg">
                                <Check className="w-4 h-4 mr-2 text-green-200" />
                                <span className="text-green-100 font-medium">Email Verified</span>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {!emailVerification.codeSent ? (
                                    <Button 
                                        variant="outline" 
                                        onClick={manageSendVerificationCode}
                                        disabled={isLoading}
                                        className="w-full"
                                    >
                                        <Send className="w-4 h-4 mr-2" />
                                        Send Verification Code
                                    </Button>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="space-y-2">
                                            <Label>Verification Code</Label>
                                            <Input
                                                type="text"
                                                placeholder="Enter 6-digit code"
                                                value={emailVerification.verificationCode}
                                                onChange={(e) => setEmailVerification(prev => ({
                                                    ...prev,
                                                    verificationCode: e.target.value
                                                }))}
                                                maxLength={6}
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button 
                                                onClick={manageVerifyEmail}
                                                disabled={isLoading || emailVerification.verificationCode.length !== 6}
                                                className="flex-1"
                                            >
                                                <Mail className="w-4 h-4 mr-2" />
                                                Verify Email
                                            </Button>
                                            <Button 
                                                variant="outline"
                                                onClick={manageSendVerificationCode}
                                                disabled={isLoading}
                                            >
                                                Resend
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        <form onSubmit={manageUsernameChange} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Current Username</Label>
                                <Input
                                    type="text"
                                    value={settings.username}
                                    disabled
                                    placeholder="Current username"
                                    className="bg-muted"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>New Username</Label>
                                <Input
                                    type="text"
                                    name="newUsername"
                                    placeholder="Enter new username"
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                <User className="w-4 h-4 mr-2" />
                                Update Username
                            </Button>
                        </form>

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
                        <form onSubmit={managePasswordChange} className="space-y-4">
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