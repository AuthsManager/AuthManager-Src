import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BackgroundGrid, GradientOrbs } from "@/components/ui/background";

export default function NotFound() {
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

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black">
      <BackgroundGrid />
      <GradientOrbs />
      
      <div className="absolute inset-0 bg-gradient-to-br from-[#2563eb]/[0.05] via-transparent to-white/[0.05] blur-3xl" />
      
      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div 
            custom={0} 
            variants={fadeUpVariants} 
            initial="hidden" 
            animate="visible"
            className="mb-4"
          >
            <span className="text-9xl font-bold text-white/10">404</span>
          </motion.div>
          
          <motion.div custom={1} variants={fadeUpVariants} initial="hidden" animate="visible">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-[#2563eb]/80">
                Page Not Found
              </span>
            </h1>
          </motion.div>
          
          <motion.div custom={2} variants={fadeUpVariants} initial="hidden" animate="visible">
            <p className="text-base sm:text-lg md:text-xl text-white/40 mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </motion.div>
          
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            custom={3}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/" className="px-8 py-3 text-white bg-[#2563eb] rounded-lg hover:bg-[#2563eb]/90 transition-colors">
              Return Home
            </Link>
            <Link to="/dash/dashboard" className="px-8 py-3 text-white bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
              Go to Dashboard
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
