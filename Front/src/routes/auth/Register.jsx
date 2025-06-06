import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BackgroundGrid, GradientOrbs } from "@/components/ui/background";
import { BASE_API, API_VERSION, CLOUDFLARE_SITE_KEY, CAPTCHA_ENABLED } from "../../config.json";

export default function Register() {
    const [datas, setDatas] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState('');
    const turnstileRef = useRef(null);
    const navigate = useNavigate();

    const fadeInVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.1 * i,
                duration: 0.5,
                ease: [0.25, 0.4, 0.25, 1],
            },
        }),
    };

    async function register() {
        if (!datas.username) return setError('Username is required.');
        if (!datas.email) return setError('Email is required.');
        if (!datas.password) return setError('Password is required.');
        if (!datas.confirmPassword) return setError('Password is required.');
        if (datas.password !== datas.confirmPassword) return setError('Passwords are not matching.');
        if (CAPTCHA_ENABLED && !turnstileToken) return setError('Please complete the CAPTCHA verification.');

        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${BASE_API}/v${API_VERSION}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...datas, ...(CAPTCHA_ENABLED && { turnstileToken }) })
            });

            const json = await response.json();

            if (json.requiresVerification && json.userId) {
                navigate('/auth/verifyotp', {
                    state: {
                        userId: json.userId,
                        username: datas.username
                    }
                });
            } else if (json.token) {
                localStorage.setItem('token', json.token);
                window.location.replace('/dash/dashboard');
            } else {
                setError(json.message || 'An error occurred.');
            }
        } catch (err) {
            setError('Login error.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-black via-black to-black/95">
            <BackgroundGrid />
            <GradientOrbs />
            
            <div className="absolute inset-0 bg-gradient-to-br from-[#2563eb]/[0.05] via-transparent to-white/[0.05] blur-3xl" />

            <motion.div
                initial="hidden"
                animate="visible"
                className="relative z-10 w-full max-w-md px-4"
            >
                <Card className="relative border border-white/10 bg-background/40 backdrop-blur-md overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg blur-xl"></div>
                    
                    <div className="relative">
                        <motion.div
                            variants={fadeInVariants}
                            custom={0}
                            className="p-6 text-center border-b border-white/10"
                        >
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-white">
                                Registration
                            </h1>
                        </motion.div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 mt-4 text-center"
                            >
                                {error}
                            </motion.p>
                        )}

                        <motion.div
                            variants={fadeInVariants}
                            custom={1}
                            className="p-6 space-y-4"
                        >
                            <div className="space-y-4">
                                <Input
                                    className="w-full px-4 py-2 bg-white/5 border-white/10 rounded-lg focus:ring-primary/50 focus:border-primary/50 text-white placeholder-white/40"
                                    type="text"
                                    name="username"
                                    id="username"
                                    placeholder="Username"
                                    value={datas.username}
                                    onChange={(e) => setDatas({ ...datas, username: e.target.value })}
                                />
                                <Input
                                    className="w-full px-4 py-2 bg-white/5 border-white/10 rounded-lg focus:ring-primary/50 focus:border-primary/50 text-white placeholder-white/40"
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="Email"
                                    value={datas.email}
                                    onChange={(e) => setDatas({ ...datas, email: e.target.value })}
                                />
                                <Input
                                    className="w-full px-4 py-2 bg-white/5 border-white/10 rounded-lg focus:ring-primary/50 focus:border-primary/50 text-white placeholder-white/40"
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="Password"
                                    value={datas.password}
                                    onChange={(e) => setDatas({ ...datas, password: e.target.value })}
                                />
                                <Input
                                    className="w-full px-4 py-2 bg-white/5 border-white/10 rounded-lg focus:ring-primary/50 focus:border-primary/50 text-white placeholder-white/40"
                                    type="password"
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    placeholder="Confirm password"
                                    onChange={(e) => setDatas(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                />
                            </div>

                            {CAPTCHA_ENABLED && (
                                <div className="flex justify-center">
                                    <div
                                        className="cf-turnstile"
                                        data-sitekey={CLOUDFLARE_SITE_KEY}
                                        data-callback={(token) => setTurnstileToken(token)}
                                        data-expired-callback={() => setTurnstileToken('')}
                                        data-error-callback={() => setTurnstileToken('')}
                                        data-theme="dark"
                                        ref={turnstileRef}
                                    ></div>
                                </div>
                            )}

                            <Button
                                className="w-full py-2 bg-primary/90 hover:bg-primary text-white rounded-lg transition-all duration-200 backdrop-blur-sm"
                                onClick={register}
                                disabled={loading}
                            >
                                {loading ? 'Inscription...' : 'Register'}
                            </Button>
                        </motion.div>

                        <motion.p
                            variants={fadeInVariants}
                            custom={2}
                            className="p-6 text-center text-white/60 border-t border-white/10"
                        >
                            Already registered?{" "}
                            <Link
                                to="/auth/login"
                                className="text-primary hover:text-primary/80 transition-colors"
                            >
                                Login here
                            </Link>
                        </motion.p>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
