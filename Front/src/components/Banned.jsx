import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BackgroundGrid, GradientOrbs } from "@/components/ui/background";

export default function Banned() {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.2 + i * 0.1,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  const manageLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/auth/login';
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black">
      <BackgroundGrid />
      <GradientOrbs />
      
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/[0.05] via-transparent to-red-500/[0.05] blur-3xl" />
      
      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div 
            custom={0} 
            variants={fadeUpVariants} 
            initial="hidden" 
            animate="visible"
            className="mb-4"
          >
            <svg className="w-32 h-32 text-red-500/20 mx-auto" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z"/>
            </svg>
          </motion.div>
          
          <motion.div custom={1} variants={fadeUpVariants} initial="hidden" animate="visible">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-red-500/80">
                Account Banned
              </span>
            </h1>
          </motion.div>
          
          <motion.div custom={2} variants={fadeUpVariants} initial="hidden" animate="visible">
            <p className="text-base sm:text-lg md:text-xl text-white/40 mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
              Your account has been suspended. Please contact support for more information.
            </p>
          </motion.div>
          
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            custom={3}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button 
              onClick={manageLogout}
              className="px-8 py-3 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
            <a 
              href="mailto:support@example.com" 
              className="px-8 py-3 text-white bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              Contact Support
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}