import { useState, useEffect } from "react";
import { BackgroundGrid, GradientOrbs } from "@/components/ui/background";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const CodeBlock = ({ language, children }) => (
    <div className="relative mt-4 rounded-lg overflow-hidden">
        <div className="absolute top-0 left-0 w-full px-4 py-2 bg-white/5 text-sm text-white/60">
            {language}
        </div>
        <pre className="mt-8 p-4 bg-black/30 rounded-lg overflow-x-auto">
            <code className="text-sm text-white/80">{children}</code>
        </pre>
    </div>
);

const Section = ({ title, children }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
    >
        <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-white">
            {title}
        </h2>
        {children}
    </motion.div>
);

export default function Docs() {
    const [activeSection, setActiveSection] = useState("getting-started");
    const [expandedSections, setExpandedSections] = useState(["getting-started"]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setIsSidebarOpen(false);
            }
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const sections = {
        "getting-started": {
            title: "Getting Started",
            subsections: {
                "introduction": {
                    title: "Introduction",
                    content: (
                        <>
                            <p className="text-white/80 leading-relaxed mb-4">
                                Welcome to the AuthManager API documentation. This guide will help you integrate our authentication and license management system into your application.
                            </p>
                        </>
                    )
                },
                "authentication": {
                    title: "Authentication",
                    content: (
                        <>
                            <h3 className="text-xl font-semibold mb-2 text-white/90">Base URL</h3>
                            <CodeBlock language="bash">
                                https://api.authmanager.xyz/v1
                            </CodeBlock>
                            <h3 className="text-xl font-semibold mt-6 mb-2 text-white/90">Authentication</h3>
                            <p className="text-white/80 leading-relaxed mb-4">
                                All API requests require authentication using a Bearer token. Include the token in the Authorization header:
                            </p>
                            <CodeBlock language="javascript">
{`fetch('https://api.authmanager.xyz/v1/apps', {
    headers: {
        'Authorization': 'Bearer YOUR_TOKEN_HERE'
    }
});`}
                            </CodeBlock>
                        </>
                    )
                }
            }
        },
        "apps": {
            title: "Managing Apps",
            subsections: {
                "create-app": {
                    title: "Create an App",
                    content: (
                        <>
                            <p className="text-white/80 leading-relaxed mb-4">
                                Create a new application to manage users and licenses.
                            </p>
                            <CodeBlock language="javascript">
{`// POST /apps
{
    "name": "My Application"
}`}
                            </CodeBlock>
                        </>
                    )
                },
                "list-apps": {
                    title: "List Apps",
                    content: (
                        <>
                            <p className="text-white/80 leading-relaxed mb-4">
                                Retrieve a list of all your applications.
                            </p>
                            <CodeBlock language="javascript">
{`// GET /apps
// Response
{
    "apps": [
        {
            "id": "app_123",
            "name": "My Application",
            "created_at": "2024-02-20T12:00:00Z"
        }
    ]
}`}
                            </CodeBlock>
                        </>
                    )
                }
            }
        },
        "users": {
            title: "User Management",
            subsections: {
                "create-user": {
                    title: "Create User",
                    content: (
                        <>
                            <p className="text-white/80 leading-relaxed mb-4">
                                Create a new user for your application.
                            </p>
                            <CodeBlock language="javascript">
{`// POST /apps/{app_id}/users
{
    "email": "user@example.com",
    "password": "secure_password"
}`}
                            </CodeBlock>
                        </>
                    )
                },
                "list-users": {
                    title: "List Users",
                    content: (
                        <>
                            <p className="text-white/80 leading-relaxed mb-4">
                                Retrieve a list of all users in your application.
                            </p>
                            <CodeBlock language="javascript">
{`// GET /apps/{app_id}/users
// Response
{
    "users": [
        {
            "id": "user_123",
            "email": "user@example.com",
            "created_at": "2024-02-20T12:00:00Z"
        }
    ]
}`}
                            </CodeBlock>
                        </>
                    )
                }
            }
        },
        "licenses": {
            title: "License Management",
            subsections: {
                "create-license": {
                    title: "Create License",
                    content: (
                        <>
                            <p className="text-white/80 leading-relaxed mb-4">
                                Create a new license for a user.
                            </p>
                            <CodeBlock language="javascript">
{`// POST /apps/{app_id}/licenses
{
    "user_id": "user_123",
    "type": "premium",
    "expires_at": "2025-02-20T12:00:00Z"
}`}
                            </CodeBlock>
                        </>
                    )
                },
                "verify-license": {
                    title: "Verify License",
                    content: (
                        <>
                            <p className="text-white/80 leading-relaxed mb-4">
                                Verify if a license key is valid.
                            </p>
                            <CodeBlock language="javascript">
{`// GET /apps/{app_id}/licenses/verify
{
    "license_key": "LICENSE_KEY_HERE"
}`}
                            </CodeBlock>
                        </>
                    )
                }
            }
        }
    };

    const toggleSection = (sectionKey) => {
        setExpandedSections(prev => 
            prev.includes(sectionKey)
                ? prev.filter(key => key !== sectionKey)
                : [...prev, sectionKey]
        );
    };

    const setActiveSubsection = (sectionKey, subsectionKey) => {
        setActiveSection(`${sectionKey}.${subsectionKey}`);
        if (!expandedSections.includes(sectionKey)) {
            setExpandedSections(prev => [...prev, sectionKey]);
        }
    };

    const renderContent = () => {
        const [sectionKey, subsectionKey] = activeSection.split('.');
        const section = sections[sectionKey];
        if (!subsectionKey) {
            const firstSubsectionKey = Object.keys(section.subsections)[0];
            return section.subsections[firstSubsectionKey].content;
        }
        return section.subsections[subsectionKey].content;
    };

    return (
        <div className="relative min-h-screen bg-background overflow-hidden">
            <BackgroundGrid />
            <GradientOrbs />
            
            {isMobile && (
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                    aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isSidebarOpen}
                    aria-controls="mobile-nav"
                >
                    {isSidebarOpen ? (
                        <X size={24} aria-hidden="true" />
                    ) : (
                        <Menu size={24} aria-hidden="true" />
                    )}
                </button>
            )}
            
            <div className="relative z-10 flex min-h-screen">
                <div
                    id="mobile-nav"
                    role="navigation"
                    aria-label="Main navigation"
                    className={`
                        fixed md:relative
                        w-[280px] md:w-64 h-screen
                        bg-background/95 md:bg-background/40 backdrop-blur-md
                        border-r border-white/10
                        transition-transform duration-300 ease-in-out
                        ${isMobile ? (isSidebarOpen ? "translate-x-0" : "-translate-x-full") : ""}
                        z-50
                    `}
                >
                    <div className="h-full overflow-y-auto">
                        <div className="p-4 pt-16 md:pt-4">
                            <h1 className="text-xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-primary">
                                API Documentation
                            </h1>
                            <nav className="space-y-1">
                                {Object.entries(sections).map(([sectionKey, section]) => (
                                    <div key={sectionKey}>
                                        <button
                                            onClick={() => {
                                                toggleSection(sectionKey);
                                                if (isMobile) setIsSidebarOpen(false);
                                            }}
                                            className="flex items-center w-full px-4 py-2 text-left rounded-lg transition-colors text-white/80 hover:bg-white/5"
                                            aria-expanded={expandedSections.includes(sectionKey)}
                                        >
                                            <svg
                                                className={`w-4 h-4 mr-2 transition-transform ${
                                                    expandedSections.includes(sectionKey) ? "rotate-90" : ""
                                                }`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                            {section.title}
                                        </button>
                                        <AnimatePresence>
                                            {expandedSections.includes(sectionKey) && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="ml-6 space-y-1 mt-1" role="menu">
                                                        {Object.entries(section.subsections).map(([subsectionKey, subsection]) => (
                                                            <button
                                                                key={subsectionKey}
                                                                onClick={() => {
                                                                    setActiveSubsection(sectionKey, subsectionKey);
                                                                    if (isMobile) setIsSidebarOpen(false);
                                                                }}
                                                                className={`w-full px-4 py-1.5 text-sm text-left rounded-lg transition-colors ${
                                                                    activeSection === `${sectionKey}.${subsectionKey}`
                                                                        ? "bg-primary text-white"
                                                                        : "text-white/60 hover:bg-white/5"
                                                                }`}
                                                                role="menuitem"
                                                                aria-current={activeSection === `${sectionKey}.${subsectionKey}`}
                                                            >
                                                                {subsection.title}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>

                <div className="flex-1 w-full md:w-auto h-screen overflow-y-auto">
                    <div className="max-w-4xl mx-auto p-4 md:p-8">
                        <Section title={sections[activeSection.split('.')[0]].title}>
                            {renderContent()}
                        </Section>
                    </div>
                </div>
            </div>

            {isMobile && isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}
        </div>
    );
}