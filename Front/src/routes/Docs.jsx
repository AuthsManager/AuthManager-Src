import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight, Search, ExternalLink } from "lucide-react";

const CodeBlock = ({ language, children, filename }) => (
    <div className="relative mt-4 rounded-lg overflow-hidden bg-[#1a1b26] border border-white/10">
        {filename && (
            <div className="absolute top-0 right-0 px-4 py-2 text-sm text-white/60 border-l border-b border-white/10 rounded-bl-lg bg-white/5">
                {filename}
            </div>
        )}
        <div className="absolute top-0 left-0 w-full px-4 py-2 text-sm text-white/60 border-b border-white/10 flex items-center">
            <span className="flex-1">{language}</span>
            <button className="hover:text-white/80 transition-colors" aria-label="Copy code">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                </svg>
            </button>
        </div>
        <pre className="mt-12 p-4 overflow-x-auto">
            <code className="text-sm text-white/90 font-mono">{children}</code>
        </pre>
    </div>
);

const Card = ({ title, description, icon: Icon }) => (
    <div className="p-6 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
        <div className="flex items-start gap-4">
            {Icon && <Icon className="w-6 h-6 text-primary" />}
            <div>
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-white/60">{description}</p>
            </div>
        </div>
    </div>
);

const Section = ({ title, description, children }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
    >
        <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-white">
                {title}
            </h2>
            {description && (
                <p className="text-lg text-white/60">{description}</p>
            )}
        </div>
        {children}
    </motion.div>
);

const SearchBar = () => (
    <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
        <input
            type="text"
            placeholder="Search documentation..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/80 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
    </div>
);

export default function Docs() {
    const [activeSection, setActiveSection] = useState("introduction");
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
                            <p className="text-lg text-white/80 leading-relaxed mb-8">
                                Welcome to the AuthManager API documentation. This comprehensive guide will help you integrate our authentication and license management system into your application.
                            </p>
                            
                            <div className="grid md:grid-cols-2 gap-4 mb-8">
                                <Card
                                    title="Quick Setup"
                                    description="Get started with AuthManager in minutes with our simple setup process."
                                    icon={ChevronRight}
                                />
                                <Card
                                    title="API Reference"
                                    description="Explore our complete API reference with examples and use cases."
                                    icon={ExternalLink}
                                />
                            </div>

                            <Section title="Base URL" description="All API requests should be made to the following base URL:">
                                <CodeBlock language="bash">
                                    https://api.authmanager.xyz/v1
                                </CodeBlock>
                            </Section>

                            <Section title="Authentication" description="Secure your API requests with authentication tokens.">
                                <p className="text-white/80 leading-relaxed mb-4">
                                    All API requests require authentication using a Bearer token. Include the token in the Authorization header:
                                </p>
                                <CodeBlock language="javascript" filename="example.js">
{`fetch('https://api.authmanager.xyz/v1/apps', {
    headers: {
        'Authorization': 'Bearer YOUR_TOKEN_HERE'
    }
});`}
                                </CodeBlock>
                            </Section>
                        </>
                    )
                }
            }
        },
        "api-reference": {
            title: "API Reference",
            subsections: {
                "apps": {
                    title: "Managing Apps",
                    content: (
                        <>
                            <Section title="Apps API" description="Create and manage your applications through our Apps API.">
                                <h3 className="text-xl font-semibold mb-4 text-white/90">Create an App</h3>
                                <CodeBlock language="javascript" filename="create-app.js">
{`// POST /apps
{
    "name": "My Application"
}`}
                                </CodeBlock>

                                <h3 className="text-xl font-semibold mt-8 mb-4 text-white/90">List Apps</h3>
                                <CodeBlock language="javascript" filename="list-apps.js">
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
                            </Section>
                        </>
                    )
                },
                "users": {
                    title: "User Management",
                    content: (
                        <>
                            <Section title="Users API" description="Manage users and their access to your applications.">
                                <h3 className="text-xl font-semibold mb-4 text-white/90">Create User</h3>
                                <CodeBlock language="javascript" filename="create-user.js">
{`// POST /apps/{app_id}/users
{
    "email": "user@example.com",
    "password": "secure_password"
}`}
                                </CodeBlock>

                                <h3 className="text-xl font-semibold mt-8 mb-4 text-white/90">List Users</h3>
                                <CodeBlock language="javascript" filename="list-users.js">
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
                            </Section>
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
        if (!subsectionKey && section) {
            const firstSubsectionKey = Object.keys(section.subsections)[0];
            return section.subsections[firstSubsectionKey].content;
        }
        return section?.subsections[subsectionKey]?.content;
    };

    return (
        <div className="relative min-h-screen bg-background overflow-hidden">
            <div className="absolute inset-0 bg-[#0a0b14]" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
            
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
                        bg-[#0a0b14]/95 md:bg-[#0a0b14]/40 backdrop-blur-md
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

                            <div className="mb-6">
                                <SearchBar />
                            </div>

                            <nav className="space-y-1">
                                {Object.entries(sections).map(([sectionKey, section]) => (
                                    <div key={sectionKey}>
                                        <button
                                            onClick={() => toggleSection(sectionKey)}
                                            className="flex items-center w-full px-4 py-2 text-left rounded-lg transition-colors text-white/80 hover:bg-white/5"
                                            aria-expanded={expandedSections.includes(sectionKey)}
                                        >
                                            <ChevronRight
                                                size={16}
                                                className={`mr-2 transition-transform ${
                                                    expandedSections.includes(sectionKey) ? "rotate-90" : ""
                                                }`}
                                            />
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
                                                                onClick={() => setActiveSubsection(sectionKey, subsectionKey)}
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
                        {renderContent()}
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