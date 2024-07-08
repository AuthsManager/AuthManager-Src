import { Link } from "react-router-dom";
import logo from "/logo.png";

export default function Navbar() {
    return (
        <nav className="bg-[#0a0a0a] text-white p-4">
            <div className="container mx-auto flex flex-wrap justify-between items-center">
                <div className="flex items-center ml-auto sm:ml-0">
                    <img
                        src={logo}
                        alt="Logo"
                        className="mr-2 w-6 h-6 sm:w-12 sm:h-12 select-none"
                    />
                </div>
                <div className="flex flex-wrap justify-center space-x-4">
                    <Link to="/" className="text-white transition-colors hover:text-gray-400">
                        Home
                    </Link>
                    <Link
                        to="/features"
                        className="text-white transition-colors hover:text-gray-400"
                    >
                        Features
                    </Link>
                    <Link
                        to="/dash/dashboard"
                        className="text-white transition-colors hover:text-gray-400"
                    >
                        Client Area
                    </Link>
                </div>
                <div className="justify-center mt-4 sm:mt-0 hidden sm:flex">
                    <a
                        href="/dash/dashboard"
                        className="inline-flex items-center justify-center w-full px-6 py-3 text-lg text-white bg-blue-600 select-none transition-colors hover:bg-blue-700 rounded-2xl sm:w-auto"
                    >
                        Onboard Now
                        <svg
                            className="w-4 h-4 ml-1"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                    </a>
                </div>
            </div>
        </nav>
    );
}
