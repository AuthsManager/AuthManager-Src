import { Link } from "react-router-dom";
import Pricing from "@/components/cards/pricing";
import Navbar from "@/components/nav/navbar";
import dashboard from "/dashboard.png";

export default function Home() {
    return (
        <>
            <Navbar />
            <section className="pt-24 bg-background">
                <div className="px-12 mx-auto max-w-7xl">
                    <div className="w-full mx-auto text-left md:w-11/12 xl:w-9/12 md:text-center">
                        <h1 className="mb-8 text-4xl font-extrabold leading-none tracking-normal text-white md:text-6xl md:tracking-tight">
                            <span>Unleashing</span>{" "}
                            <span className="block w-full py-2 text-transparent bg-clip-text leading-12 bg-gradient-to-r from-blue-600 to-purple-500 lg:inline">
                                the Ultimate
                            </span>{" "}
                            <span>Power of Authentication</span>
                        </h1>
                        <p className="px-0 mb-8 text-lg text-gray-400 md:text-xl lg:px-24">
                            Start gaining the traction you've always wanted with
                            our next-level templates and designs. Crafted to
                            help you tell your story.
                        </p>
                        <div className="mb-4 space-x-0 md:space-x-4 md:mb-8">
                            <Link
                                to="/dash/dashboard"
                                className="inline-flex items-center justify-center w-full px-6 py-3 mb-2 text-lg text-white bg-blue-600 rounded-2xl sm:w-auto sm:mb-0 select-none transition-colors hover:bg-blue-700"
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
                            </Link>
                            <Link
                                to="/dash/dashboard"
                                className="inline-flex items-center justify-center text-blue-500 w-full px-6 py-3 mb-2 text-lg bg-gray-100 rounded-2xl sm:w-auto sm:mb-0 select-none transition-colors hover:bg-gray-200"
                            >
                                Client Area
                            </Link>
                        </div>
                    </div>
                    <div className="w-full mx-auto mt-20 text-center md:w-10/12">
                        <div className="relative z-0 w-full mt-8">
                            <div className="relative overflow-hidden shadow-2xl">
                                <div className="flex items-center flex-none px-4 bg-blue-600 rounded-b-none h-11 rounded-xl">
                                    <div className="flex space-x-1.5">
                                        <div className="w-3 h-3 border-2 border-white rounded-full"></div>
                                        <div className="w-3 h-3 border-2 border-white rounded-full"></div>
                                        <div className="w-3 h-3 border-2 border-white rounded-full"></div>
                                    </div>
                                </div>
                                <img src={dashboard} className="select-none" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="bg-[#0f0f0f]">
                <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                    <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
                        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-white">
                            Designed for business teams like yours
                        </h2>
                        <p className="mb-5 font-light sm:text-xl text-gray-400">
                            Here at Flowbite we focus on markets where technology, innovation, and capital can unlock
                            long-term value and drive economic growth.
                        </p>
                    </div>
                    <Pricing />
                </div>
            </section>
        </>
    );
}
