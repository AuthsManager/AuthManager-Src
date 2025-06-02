import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BackgroundGrid, GradientOrbs } from "@/components/ui/background";
import { BASE_API, API_VERSION } from "../../config.json";
import { toast } from "sonner";

export default function VerifyOTP() {
    const [otpCode, setOtpCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);
    
    const location = useLocation();
    const navigate = useNavigate();
    const userId = location.state?.userId;
    const username = location.state?.username;

    useEffect(() => {
        if (!userId) {
            navigate('/auth/register');
        }
    }, [userId, navigate]);

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

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

    const verifyOTP = async () => {
        if (!otpCode) return setError('OTP Code required.');
        if (otpCode.length !== 6) return setError('The OTP code must be 6 digits.');

        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${BASE_API}/v${API_VERSION}/auth/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId, otpCode })
            });

            const json = await response.json();

            if (json.token) {
                localStorage.setItem('token', json.token);
                toast.success('Account  !');
                navigate('/dash/dashboard');
            } else {
                setError(json.message || 'Error while verifying.');
            }
        } catch (err) {
            setError('Login error.');
        } finally {
            setLoading(false);
        }
    };

    const resendOTP = async () => {
        setResendLoading(true);
        setError('');

        try {
            const response = await fetch(`${BASE_API}/v${API_VERSION}/auth/resend-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId })
            });

            const json = await response.json();

            if (response.ok) {
                toast.success('New otp code sent !');
                setCountdown(60); 
            } else {
                setError(json.message || 'Failed to send.');
            }
        } catch (err) {
            setError('Login error.');
        } finally {
            setResendLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            verifyOTP();
        }
    };

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
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent text-white">
                                Verify OTP
                            </h1>
                            <p className="text-white/60 mt-2">
                                {username ? `Hello ${username} !` : ''} Enter the OTP code sent to your email.
                            </p>
                        </motion.div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 mt-4 text-center px-6"
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
                                <div className="flex justify-center items-center">
                                    <InputOTP
                                        maxLength={6}
                                        value={otpCode}
                                        onChange={setOtpCode}
                                        onKeyDown={handleKeyPress}
                                        className="flex justify-center items-center"
                                    >
                                        <InputOTPGroup className="gap-2">
                                            <InputOTPSlot index={0} className="w-12 h-12 text-xl bg-white/5 border-white/10 text-white" />
                                            <InputOTPSlot index={1} className="w-12 h-12 text-xl bg-white/5 border-white/10 text-white" />
                                            <InputOTPSlot index={2} className="w-12 h-12 text-xl bg-white/5 border-white/10 text-white" />
                                        </InputOTPGroup>
                                        <InputOTPSeparator />
                                        <InputOTPGroup className="gap-2">
                                            <InputOTPSlot index={3} className="w-12 h-12 text-xl bg-white/5 border-white/10 text-white" />
                                            <InputOTPSlot index={4} className="w-12 h-12 text-xl bg-white/5 border-white/10 text-white" />
                                            <InputOTPSlot index={5} className="w-12 h-12 text-xl bg-white/5 border-white/10 text-white" />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                                    <p className="text-white/40 text-sm mt-2 text-center">
                                        6 digits code
                                    </p>
                            </div>

                            <Button
                                className="w-full py-2 bg-primary/90 hover:bg-primary text-white rounded-lg transition-all duration-200 backdrop-blur-sm"
                                onClick={verifyOTP}
                                disabled={loading || otpCode.length !== 6}
                            >
                                {loading ? 'Verification...' : 'Verify'}
                            </Button>

                            <div className="text-center">
                                <Button
                                    variant="ghost"
                                    className="text-white/60 hover:text-white font-light"
                                    onClick={resendOTP}
                                    disabled={resendLoading || countdown > 0}
                                >
                                    {resendLoading ? 'Envoi...' : 
                                     countdown > 0 ? `Resend in ${countdown}s` : 
                                     'Resend code'}
                                </Button>
                            </div>
                        </motion.div>

                        <motion.p
                            variants={fadeInVariants}
                            custom={2}
                            className="p-6 text-center text-white/60 border-t border-white/10"
                        >
                            Back to{" "}
                            <Link
                                to="/auth/register"
                                className="text-primary hover:text-primary/80 transition-colors"
                            >
                                register
                            </Link>
                        </motion.p>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}