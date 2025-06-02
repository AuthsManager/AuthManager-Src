import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight, Search, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';
import 'highlight.js/styles/tokyo-night-dark.css';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('bash', bash);

const CodeBlock = ({ language, children }) => {
    const [highlighted, setHighlighted] = useState('');

    useEffect(() => {
        if (children) {
            const highlighted = hljs.highlight(children, { language }).value;
            setHighlighted(highlighted);
        }
    }, [children, language]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(children);
        toast.success("Code copied to clipboard!");
    };

    return (
        <div className="relative mt-4 rounded-lg overflow-hidden bg-[#1a1b26] border border-white/10">
            <div className="absolute top-0 left-0 right-0 px-4 py-2 text-sm text-white/60 border-b border-white/10 flex items-center justify-between">
                <span>{language}</span>
                <button 
                    onClick={copyToClipboard}
                    className="hover:text-white/80 transition-colors ml-auto" 
                    aria-label="Copy code"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                    </svg>
                </button>
            </div>
            <pre className="mt-12 p-4 overflow-x-auto">
                <code 
                    className={`text-sm font-mono`}
                    dangerouslySetInnerHTML={{ __html: highlighted }}
                />
            </pre>
        </div>
    );
};

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

const Section = ({ title, description, children, noGradient = false }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
    >
        <div className="mb-6">
            <h2 className={`text-2xl font-bold mb-2 ${noGradient ? 'text-white' : 'bg-clip-text text-transparent bg-gradient-to-r from-white to-primary'}`}>
                {title}
            </h2>
            {description && (
                <p className="text-lg text-white/60">{description}</p>
            )}
        </div>
        {children}
    </motion.div>
);

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value);
    };

    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search documentation..."
                className="w-full h-8 pl-9 pr-4 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-white/80 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
        </div>
    );
};

export default function Docs() {
    const [activeSection, setActiveSection] = useState("getting-started");
    const [expandedSections, setExpandedSections] = useState(["getting-started"]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

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

    const handleSearch = (value) => {
        setSearchTerm(value.toLowerCase());
        if (value) {
            setExpandedSections(Object.keys(sections));
        } else {
            setExpandedSections(["getting-started"]);
        }
    };

    const apiRefClick = () => {
        setActiveSection('api-reference.apps');
        if (!expandedSections.includes('api-reference')) {
            setExpandedSections(prev => [...prev, 'api-reference']);
        }
        if (isMobile) {
            setIsSidebarOpen(false);
        }
    };

    const quickSetupClick = () => {
        setActiveSection('getting-started.installation');
        if (!expandedSections.includes('getting-started')) {
            setExpandedSections(prev => [...prev, 'getting-started']);
        }
        if (isMobile) {
            setIsSidebarOpen(false);
        }
    };

    const toggleSection = (sectionKey) => {
        setExpandedSections(prev =>
            prev.includes(sectionKey)
                ? prev.filter(s => s !== sectionKey)
                : [...prev, sectionKey]
        );
    };

    const setActiveSubsection = (sectionKey, subsectionKey) => {
        setActiveSection(`${sectionKey}.${subsectionKey}`);
        if (isMobile) {
            setIsSidebarOpen(false);
        }
    };

    const sections = {
        "getting-started": {
            title: "Getting Started",
            subsections: {
                "introduction": {
                    title: "Introduction",
                    content: (
                        <>
                            <Section title="Welcome to AuthManager" description="A powerful authentication service for your applications.">
                                <p className="text-white/80 leading-relaxed mb-4">
                                    AuthManager is a robust authentication service that helps you manage user authentication across your applications.
                                    With our API, you can easily implement secure user authentication, manage applications, and handle user sessions.
                                </p>
                                <div className="grid md:grid-cols-2 gap-4 mb-8">
                                    <button 
                                        onClick={quickSetupClick}
                                        className="block w-full text-left"
                                    >
                                        <Card
                                            title="Quick Setup"
                                            description="Get started with AuthManager in minutes"
                                            icon={ChevronRight}
                                        />
                                    </button>
                                    <button 
                                        onClick={apiRefClick}
                                        className="block w-full text-left"
                                    >
                                        <Card
                                            title="API Reference"
                                            description="Explore our comprehensive API documentation"
                                            icon={ExternalLink}
                                        />
                                    </button>
                                </div>
                            </Section>
                        </>
                    )
                },
                "installation": {
                    title: "Installation",
                    content: (
                        <>
                            <Section title="Installation Guide" description="Follow these steps to set up AuthManager locally.">
                                <h3 className="text-xl font-semibold mb-4 text-white/90">1. Clone the Repository</h3>
                                <CodeBlock language="bash">
{`git clone https://github.com/AuthsManager/AuthManager-Src.git
cd AuthManager-Src`}
                                </CodeBlock>

                                <h3 className="text-xl font-semibold mt-8 mb-4 text-white/90">2. Install Dependencies</h3>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    Install the required packages for both the frontend and backend:
                                </p>
                                <CodeBlock language="bash">
{`# Install Frontend Dependencies
cd Front
npm install

# Install Backend Dependencies
cd ../Back
npm install`}
                                </CodeBlock>

                                <h3 className="text-xl font-semibold mt-8 mb-4 text-white/90">3. Configure Environment</h3>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    Create a .env file in the Back directory with your MongoDB connection URL:
                                </p>
                                <CodeBlock language="bash">
{`# Back/.env
MONGO_URL=your_mongodb_connection_url`}
                                </CodeBlock>

                                <h3 className="text-xl font-semibold mt-8 mb-4 text-white/90">4. Start the Services</h3>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    Run both the frontend and backend services:
                                </p>
                                <CodeBlock language="bash">
{`# Start Frontend (in Front directory)
npm run dev

# Start Backend (in Back directory)
node index.js`}
                                </CodeBlock>
                            </Section>
                        </>
                    )
                },
                "api-keys": {
                    title: "Getting Your API Key",
                    content: (
                        <>
                            <Section title="API Keys" description="Learn how to obtain and manage your API keys.">
                                <h3 className="text-xl font-semibold mb-4 text-white/90">Obtaining Your API Key</h3>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    To get your API key, follow these steps:
                                </p>
                                <ol className="list-decimal list-inside space-y-4 text-white/80 mb-6">
                                    <li>Log in to your AuthManager dashboard</li>
                                    <li>Navigate to the "Apps" section</li>
                                    <li>Create a new application or select an existing one</li>
                                    <li>Your API key will be displayed in the application details</li>
                                </ol>
                                
                                <div className="bg-white/5 rounded-lg p-4 mb-6">
                                    <h4 className="text-lg font-semibold mb-2 text-white/90">Security Best Practices</h4>
                                    <ul className="list-disc list-inside space-y-2 text-white/80">
                                        <li>Never share your API key publicly</li>
                                        <li>Store your API key securely in environment variables</li>
                                        <li>Rotate your API keys periodically for enhanced security</li>
                                        <li>Use different API keys for development and production environments</li>
                                    </ul>
                                </div>
                            </Section>
                        </>
                    )
                },
                "best-practices": {
                    title: "Best Practices",
                    content: (
                        <>
                            <Section title="Best Practices" description="Recommended practices for using AuthManager effectively.">
                                <h3 className="text-xl font-semibold mb-4 text-white/90">Error Handling</h3>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    Implement proper error handling to manage API responses:
                                </p>
                                <CodeBlock language="javascript">
{`try {
    const response = await fetch('https://api.authmanager.xyz/v1/apps', {
        headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
    });
    
    if (!response.ok) {
        throw new Error('API request failed');
    }
    
    const data = await response.json();
} catch (error) {
    console.error('Error:', error.message);
    // Handle error appropriately
}`}
                                </CodeBlock>

                                <h3 className="text-xl font-semibold mt-8 mb-4 text-white/90">Rate Limiting</h3>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    Be mindful of API rate limits and implement appropriate handling:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-white/80 mb-6">
                                    <li>Implement exponential backoff for retries</li>
                                    <li>Cache responses when appropriate</li>
                                    <li>Monitor your API usage</li>
                                </ul>

                                <h3 className="text-xl font-semibold mt-8 mb-4 text-white/90">Security</h3>
                                <p className="text-white/80 leading-relaxed mb-4">
                                    Follow these security guidelines:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-white/80 mb-6">
                                    <li>Use HTTPS for all API requests</li>
                                    <li>Implement proper session management</li>
                                    <li>Validate user input</li>
                                    <li>Keep your dependencies updated</li>
                                </ul>
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
                            <Section title="Apps API" description="Create and manage your applications through our Apps API." noGradient>
                                <h3 className="text-xl font-semibold mb-4 text-white/90">Create an App</h3>
                                <CodeBlock language="javascript">
{`// POST /apps
{
    "name": "My Application"
}`}
                                </CodeBlock>

                                <h3 className="text-xl font-semibold mt-8 mb-4 text-white/90">List Apps</h3>
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
                            </Section>
                        </>
                    )
                },
                "users": {
                    title: "User Management",
                    content: (
                        <>
                            <Section title="Users API" description="Manage users and their access to your applications." noGradient>
                                <h3 className="text-xl font-semibold mb-4 text-white/90">Create User</h3>
                                <CodeBlock language="javascript">
{`// POST /apps/{app_id}/users
{
    "email": "user@example.com",
    "password": "secure_password"
}`}
                                </CodeBlock>

                                <h3 className="text-xl font-semibold mt-8 mb-4 text-white/90">List Users</h3>
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
                            </Section>
                        </>
                    )
                },
                "licenses": {
                    title: "License Management",
                    content: (
                        <>
                            <Section title="Licenses API" description="Create and manage licenses for your applications." noGradient>
                                <h3 className="text-xl font-semibold mb-4 text-white/90">Create License</h3>
                                <CodeBlock language="javascript">
{`// POST /apps/{app_id}/licenses
{
    "duration": "30d",  // Duration format: Xd (days), Xw (weeks), Xm (months), Xy (years)
    "type": "premium",  // License type (e.g., basic, premium, enterprise)
    "maxUses": 1       // Maximum number of activations allowed
}`}
                                </CodeBlock>

                                <h3 className="text-xl font-semibold mt-8 mb-4 text-white/90">Verify License</h3>
                                <CodeBlock language="javascript">
{`// POST /apps/{app_id}/licenses/verify
{
    "licenseKey": "LICENSE_KEY_HERE"
}`}
                                </CodeBlock>

                                <h3 className="text-xl font-semibold mt-8 mb-4 text-white/90">List Licenses</h3>
                                <CodeBlock language="javascript">
{`// GET /apps/{app_id}/licenses
// Response
{
    "licenses": [
        {
            "id": "license_123",
            "key": "XXXX-XXXX-XXXX-XXXX",
            "type": "premium",
            "status": "active",
            "created_at": "2024-02-20T12:00:00Z",
            "expires_at": "2024-03-20T12:00:00Z",
            "uses": 0,
            "maxUses": 1
        }
    ]
}`}
                                </CodeBlock>

                                <h3 className="text-xl font-semibold mt-8 mb-4 text-white/90">Revoke License</h3>
                                <CodeBlock language="javascript">
{`// DELETE /apps/{app_id}/licenses/{license_id}
// Response: 204 No Content`}
                                </CodeBlock>
                            </Section>
                        </>
                    )
                }
            }
        }
    };

    const filteredSections = useMemo(() => {
        if (!searchTerm) return sections;

        const filtered = {};
        Object.entries(sections).forEach(([sectionKey, section]) => {
            const matchingSubsections = {};
            Object.entries(section.subsections).forEach(([subsectionKey, subsection]) => {
                const getTextContent = (element) => {
                    if (!element || typeof element !== 'object') return '';
                    if (Array.isArray(element)) {
                        return element.map(getTextContent).join(' ');
                    }
                    if (element.props) {
                        const { children, description, title } = element.props;
                        return `${title || ''} ${description || ''} ${getTextContent(children)}`;
                    }
                    return '';
                };

                const contentText = getTextContent(subsection.content);
                const matchesTitle = subsection.title.toLowerCase().includes(searchTerm);
                const matchesContent = contentText.toLowerCase().includes(searchTerm);
                
                if (matchesTitle || matchesContent) {
                    matchingSubsections[subsectionKey] = subsection;
                }
            });

            if (Object.keys(matchingSubsections).length > 0 || section.title.toLowerCase().includes(searchTerm)) {
                filtered[sectionKey] = {
                    ...section,
                    subsections: matchingSubsections
                };
            }
        });

        return filtered;
    }, [searchTerm, sections]);

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
            
            <Toaster />
            
            {isMobile && (
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                >
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            )}
            
            <div className="relative z-10 flex min-h-screen">
                <aside
                    className={`
                        fixed md:relative
                        w-[280px] md:w-64 h-screen
                        bg-[#0a0b14]/95 md:bg-[#0a0b14]/40 backdrop-blur-md
                        border-r border-white/10
                        transition-transform duration-300 ease-in-out
                        ${isMobile ? (isSidebarOpen ? "translate-x-0" : "-translate-x-full") : ""}
                        z-40
                    `}
                >
                    <div className="h-full overflow-y-auto p-4 pt-16 md:pt-4">
                        <a href="/" className="text-xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-primary">
                            Documentation
                        </a>

                        <div className="my-6">
                            <SearchBar onSearch={handleSearch} />
                        </div>

                        <nav className="space-y-1">
                            {Object.entries(filteredSections).map(([sectionKey, section]) => (
                                <div key={sectionKey}>
                                    <button
                                        onClick={() => toggleSection(sectionKey)}
                                        className="flex items-center w-full px-4 py-2 text-left rounded-lg transition-colors text-white/80 hover:bg-white/5"
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
                                                <div className="ml-6 space-y-1 mt-1">
                                                    {Object.entries(section.subsections).map(([subsectionKey, subsection]) => (
                                                        <button
                                                            key={subsectionKey}
                                                            onClick={() => setActiveSubsection(sectionKey, subsectionKey)}
                                                            className={`w-full px-4 py-1.5 text-sm text-left rounded-lg transition-colors ${
                                                                activeSection === `${sectionKey}.${subsectionKey}`
                                                                    ? "bg-primary text-white"
                                                                    : "text-white/60 hover:bg-white/5"
                                                            }`}
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
                </aside>

                <main className="flex-1 w-full md:w-auto h-screen overflow-y-auto">
                    <div className="max-w-4xl mx-auto p-4 md:p-8">
                        {renderContent()}
                    </div>
                </main>

                {isMobile && isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-30"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
            </div>
        </div>
    );
}