import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/hooks/useAuth";
import { useMediaQuery } from 'react-responsive';
import logo from "/logo.png";

export default function Sidebar() {
    const [opened, setOpened] = useState(false);
    const { user } = useAuth();
    const location = useLocation();
    const isMobile = useMediaQuery({ maxWidth: 768 }); 

    useEffect(() => {
        if (isMobile) {
            setOpened(false);
        }
    }, [isMobile]);

    function logout() {
        localStorage.removeItem('token');
        window.location.replace('/');
    }

    return (
        <nav className={`flex flex-col h-screen bg-gray-900 transition-all ease-in shadow-md ${opened && !isMobile ? 'w-64' : 'w-16'}`}>
            <ul className={`list-none flex flex-col items-center gap-4`}>
                <li className={`w-full bg-[#111011] mb-6 h-20 flex items-center ${opened && !isMobile ? 'px-6 justify-between' : 'px-2 justify-center'}`}>
                    {opened && !isMobile && <h1 className="w-full text-white text-xl font-bold">AuthManager</h1>}
                    {isMobile && <img src={logo} alt="Logo" className="h-10 w-10" />} 
                    {!isMobile && (
                        <box-icon onClick={() => setOpened(!opened)} class="w-8 h-8 cursor-pointer" name={`chevrons-${opened ? 'left' : 'right'}`} color="white"></box-icon>
                    )}
                </li>
                <li className="w-full px-2 flex items-center whitespace-nowrap">
                    <Link to="/" className="flex items-center gap-3 w-full rounded-md p-3 text-white transition-colors hover:bg-blue-500">
                        <box-icon
                            name="home-alt"
                            color="white" 
                            class="h-[24px] w-[24px] min-w-[24px]"
                        ></box-icon>
                        {opened && !isMobile && <span className="block overflow-hidden">Home</span>}
                    </Link>
                </li>
                {user.applications.length ? <li className="w-full px-2 flex items-center whitespace-nowrap">
                    <Link to={`/${location.pathname.includes('admin') ? 'admin' : 'dash'}/dashboard`} className={`flex items-center gap-3 w-full rounded-md p-3 text-white transition-colors hover:bg-blue-500 ${(location.pathname.startsWith('/dash/dashboard') || location.pathname.startsWith('/admin/dashboard')) ? 'bg-blue-500' : ''}`}>
                        <box-icon
                            name="pencil"
                            color="white"
                            class="h-[24px] w-[24px] min-w-[24px]"
                        ></box-icon>
                        {opened && !isMobile && <span className="block overflow-hidden">Dashboard</span>}
                    </Link>
                </li> : null}
                {user.applications.length ? <li className="w-full px-2 flex items-center whitespace-nowrap">
                    <Link to={`/${location.pathname.includes('admin') ? 'admin' : 'dash'}/users`} className={`flex items-center gap-3 w-full rounded-md p-3 text-white transition-colors hover:bg-blue-500 ${(location.pathname.startsWith('/dash/users') || location.pathname.startsWith('/admin/users')) ? 'bg-blue-500' : ''}`}>
                        <box-icon
                            name="user-circle"
                            color="white"
                            class="h-[24px] w-[24px] min-w-[24px]"
                        ></box-icon>
                        {opened && !isMobile && <span className="block overflow-hidden">Manage Users</span>}
                    </Link>
                </li> : null}
                {user.applications.length ? <li className="w-full px-2 flex items-center whitespace-nowrap">
                    <Link to={`/${location.pathname.includes('admin') ? 'admin' : 'dash'}/licenses`} className={`flex items-center gap-3 w-full rounded-md p-3 text-white transition-colors hover:bg-blue-500 ${(location.pathname.startsWith('/dash/licenses') || location.pathname.startsWith('/admin/licenses')) ? 'bg-blue-500' : ''}`}>
                        <box-icon
                            name="key"
                            color="white"
                            class="h-[24px] w-[24px] min-w-[24px]"
                        ></box-icon>
                        {opened && !isMobile && <span className="block overflow-hidden">Manage Licenses</span>}
                    </Link>
                </li> : null}
                <li className="w-full px-2 flex items-center whitespace-nowrap">
                    <Link to={`/${location.pathname.includes('admin') ? 'admin' : 'dash'}/apps`} className={`flex items-center gap-3 w-full rounded-md p-3 text-white transition-colors hover:bg-blue-500 ${(location.pathname.startsWith('/dash/apps') || location.pathname.startsWith('/admin/apps')) ? 'bg-blue-500' : ''}`}>
                        <box-icon
                            name="cog"
                            color="white"
                            class="h-[24px] w-[24px] min-w-[24px]"
                        ></box-icon>
                        {opened && !isMobile && <span className="block overflow-hidden">Manage Apps</span>}
                    </Link>
                </li>
            </ul>
            <div className="mt-auto w-full mb-8">
                <li onClick={() => logout()} className="w-full px-2 flex items-center whitespace-nowrap">
                    <Link className="bg-red-500 flex items-center gap-3 w-full rounded-md px-3 py-2 text-white transition-colors hover:bg-red-600">
                        <box-icon
                            name="log-out"
                            color="white"
                            class="h-[24px] w-[24px] min-w-[24px]"
                        ></box-icon>
                        {opened && !isMobile && <span className="block overflow-hidden">Log out</span>}
                    </Link>
                </li>
            </div>
        </nav>
    );
}
