import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="w-full fixed top-0 left-0 z-50 bg-[#030303]/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-white font-bold text-xl">
                            AuthManager
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link to="/" className="text-white hover:bg-[#2563eb]/20 px-3 py-2 rounded-md text-sm font-medium">
                                Home
                            </Link>
                            <Link
                                to="/features"
                                className="text-white hover:bg-[#2563eb]/20 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Features
                            </Link>
                            <Link
                                to="/pricing"
                                className="text-white hover:bg-[#2563eb]/20 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Pricing
                            </Link>
                            <Link
                                to="/dash/dashboard"
                                className="ml-4 bg-[#2563eb] hover:bg-[#2563eb]/90 px-4 py-2 rounded-md text-white"
                            >
                                Onboard Now
                            </Link>
                        </div>
                    </div>
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-[#2563eb]/20 focus:outline-none"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>
            
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link
                            to="/"
                            className="text-white hover:bg-[#2563eb]/20 block px-3 py-2 rounded-md text-base font-medium"
                        >
                            Home
                        </Link>
                        <Link
                            to="/features"
                            className="text-white hover:bg-[#2563eb]/20 block px-3 py-2 rounded-md text-base font-medium"
                        >
                            Features
                        </Link>
                        <Link
                            to="/pricing"
                            className="text-white hover:bg-[#2563eb]/20 block px-3 py-2 rounded-md text-base font-medium"
                        >
                            Pricing
                        </Link>
                        <Link
                            to="/dash/dashboard"
                            className="w-full mt-4 bg-[#2563eb] hover:bg-[#2563eb]/90 px-4 py-2 rounded-md text-white block text-center"
                        >
                            Onboard Now
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
