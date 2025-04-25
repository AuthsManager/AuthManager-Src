import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/hooks/useAuth";
import { ChevronLeft, ChevronRight, Home, PenTool, Users, Key, Settings, LogOut, X } from "lucide-react";
import logo from "/logo.png";

export default function Sidebar({ isOpen, onClose }) {
    const [opened, setOpened] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const { user } = useAuth();
    const location = useLocation();

    useEffect(() => {
        const manageResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) {
                setOpened(false);
            } else {
                setOpened(true);
            }
        };

        manageResize();

        window.addEventListener('resize', manageResize);

        return () => window.removeEventListener('resize', manageResize);
    }, []);

    function logout() {
        localStorage.removeItem('token');
        window.location.replace('/auth/login');
    }

    const NavLink = ({ to, icon: Icon, children }) => {
        const isActive = location.pathname.startsWith(to);
        return (
            <Link 
                to={to} 
                onClick={isMobile ? onClose : undefined}
                className={`flex items-center gap-3 w-full rounded-lg p-3 transition-all duration-200
                    ${isActive 
                        ? 'bg-primary/20 text-primary border border-primary/30' 
                        : 'text-white/70 hover:bg-white/5 hover:text-white border border-transparent'
                    }`}
            >
                <Icon className="h-[20px] w-[20px] min-w-[20px]" />
                <span className={`block overflow-hidden whitespace-nowrap ${!opened && !isMobile ? 'hidden' : ''}`}>
                    {children}
                </span>
            </Link>
        );
    };

    const sidebarBaseStyle = "fixed md:relative h-screen transition-all duration-300 ease-in-out z-50";
    const sidebarWidthStyle = opened && !isMobile ? 'w-64' : 'w-20';
    const sidebarMobileStyle = isMobile ? `${isOpen ? 'translate-x-0' : '-translate-x-full'} w-64` : sidebarWidthStyle;

    return (
        <>
            {isMobile && isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={onClose}
                />
            )}

            <nav className={`${sidebarBaseStyle} ${sidebarMobileStyle}`}>
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 opacity-50"></div>
                <div className="relative h-full backdrop-blur-sm bg-background/30 border-r border-white/5">
                    <div className="flex flex-col h-full">
                        <div className={`h-20 flex items-center justify-between px-4 sm:px-6 border-b border-white/5`}>
                            {(opened || isMobile) && (
                                <Link to="/" className="text-xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent no-underline hover:opacity-90 transition-opacity">
                                    AuthManager
                                </Link>
                            )}
                            {!isMobile ? (
                                <button
                                    onClick={() => setOpened(!opened)}
                                    className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                                >
                                    {opened ? (
                                        <ChevronLeft className="w-5 h-5 text-white/70" />
                                    ) : (
                                        <ChevronRight className="w-5 h-5 text-white/70" />
                                    )}
                                </button>
                            ) : (
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                                >
                                    <X className="w-5 h-5 text-white/70" />
                                </button>
                            )}
                        </div>

                        <div className="flex-grow p-4 space-y-2">
                            <NavLink to="/" icon={Home}>Home</NavLink>
                            {user.applications.length > 0 && (
                                <>
                                    <NavLink 
                                        to={`/${location.pathname.includes('admin') ? 'admin' : 'dash'}/dashboard`} 
                                        icon={PenTool}
                                    >
                                        Dashboard
                                    </NavLink>
                                    <NavLink 
                                        to={`/${location.pathname.includes('admin') ? 'admin' : 'dash'}/users`} 
                                        icon={Users}
                                    >
                                        Manage Users
                                    </NavLink>
                                    <NavLink 
                                        to={`/${location.pathname.includes('admin') ? 'admin' : 'dash'}/licenses`} 
                                        icon={Key}
                                    >
                                        Manage Licenses
                                    </NavLink>
                                </>
                            )}
                            <NavLink 
                                to={`/${location.pathname.includes('admin') ? 'admin' : 'dash'}/apps`} 
                                icon={Settings}
                            >
                                Manage Apps
                            </NavLink>
                            <NavLink 
                                to={`/${location.pathname.includes('admin') ? 'admin' : 'dash'}/settings`} 
                                icon={Settings}
                            >
                                Settings
                            </NavLink>
                        </div>

                        <div className="p-4 border-t border-white/5">
                            <button
                                onClick={logout}
                                className="flex items-center gap-3 w-full rounded-lg p-3 text-red-500 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/30"
                            >
                                <LogOut className="h-[20px] w-[20px] min-w-[20px]" />
                                <span className={`block ${!opened && !isMobile ? 'hidden' : ''}`}>Log out</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}
