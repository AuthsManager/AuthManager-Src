import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BackgroundGrid, GradientOrbs } from "@/components/ui/background";
import { BASE_API, API_VERSION } from "../../config.json";

export default function Login() {
    const [datas, setDatas] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

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

    async function login() {
        if (!datas.email) return setError('Email is required.');
        if (!datas.password) return setError('Password is required.');

        setError('');

        fetch(`${BASE_API}/v${API_VERSION}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datas)
        })
            .then(response => response.json())
            .then(json => {
                if (json.token) {
                    localStorage.setItem('token', json.token);
                    window.location.replace('/dash/dashboard');
                } else {
                    setError(json.message || 'An error occured.');
                }
            })
            .catch(() => setError('An error occured.'));
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
                                Welcome Back
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
                            </div>

                            <Button
                                className="w-full py-2 bg-primary/90 hover:bg-primary text-white rounded-lg transition-all duration-200 backdrop-blur-sm"
                                onClick={login}
                            >
                                Login
                            </Button>
                        </motion.div>

                        <motion.p
                            variants={fadeInVariants}
                            custom={2}
                            className="p-6 text-center text-white/60 border-t border-white/10"
                        >
                            Don't have an account?{" "}
                            <Link
                                to="/auth/register"
                                className="text-primary hover:text-primary/80 transition-colors"
                            >
                                Register here
                            </Link>
                        </motion.p>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}