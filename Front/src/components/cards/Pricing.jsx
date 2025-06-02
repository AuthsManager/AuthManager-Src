import React from 'react';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const PricingCard = ({ title, price, features, popular, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.1 });

  return (
    <motion.div 
      ref={ref}
      className="flex-1 relative group"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
      <Card className={`relative p-6 h-full border bg-background/40 backdrop-blur-md ${
        popular 
          ? 'border-primary/50 relative hover:border-primary shadow-[0_0_50px_20px_rgba(37,99,235,0.25)] shadow-primary/20' 
          : 'border-border/30 hover:border-border/60 shadow-lg shadow-background/5'
      } transition-all duration-300 hover:-translate-y-1`}>
        {popular && (
          <motion.div 
            className="absolute -top-3 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
          >
            <span className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm shadow-lg shadow-primary/20">
              Most popular
            </span>
          </motion.div>
        )}
        <div className="flex flex-col h-full">
          <div className="text-center flex-1">
            <motion.h3 
              className="text-2xl font-bold mb-2 text-card-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.1 + 0.1 }}
            >
              {title}
            </motion.h3>
            <motion.div 
              className="mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
            >
              <span className="text-4xl font-bold text-card-foreground">{price}€</span>
              <span className="text-muted-foreground">/month</span>
            </motion.div>
            <ul className="space-y-3">
              {features.map((feature, featureIndex) => (
                <motion.li 
                  key={featureIndex} 
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.6, delay: index * 0.1 + featureIndex * 0.05 + 0.3 }}
                >
                  <Check className="h-5 w-5 text-primary" />
                  <span className="text-card-foreground">{feature}</span>
                </motion.li>
              ))}
            </ul>
          </div>
          <motion.button
            className={`mt-6 w-full py-2 px-4 rounded-lg transition-all font-medium hover:scale-105 active:scale-95 backdrop-blur-sm ${
              popular
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: index * 0.1 + 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start now
          </motion.button>
        </div>
      </Card>
    </motion.div>
  );
};

export default function Pricing() {
  const titleRef = useRef(null);
  const isTitleInView = useInView(titleRef, { once: true, threshold: 0.1 });

  const plans = [
    {
      title: 'Starter',
      price: '0',
      features: [
        'Up to 1000 authentications',
        'Basic support',
        'Dashboard access',
        'API Access'
      ]
    },
    {
      title: 'Pro',
      price: '29',
      popular: true,
      features: [
        'Unlimited authentications',
        'Priority support',
        'Advanced dashboard',
        'API Access',
        'Advanced statistics',
        'Customization'
      ]
    },
    {
      title: 'Enterprise',
      price: '99',
      features: [
        'Everything in Pro',
        '24/7 Dedicated support',
        'Guaranteed SLA',
        'On-premise deployment',
        'Custom training',
        'Custom integration'
      ]
    }
  ];

  return (
    <div className="relative py-20 overflow-hidden bg-gradient-to-b from-black/90 via-black to-black/95">
      <div className="relative container mx-auto px-4">
        <div className="text-center mb-12" ref={titleRef}>
          <motion.h2 
            className="text-4xl font-bold mb-4 text-foreground"
            initial={{ opacity: 0, y: -30 }}
            animate={isTitleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Plans & Pricing
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground"
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Choose the plan that fits your needs
          </motion.p>
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <PricingCard key={index} {...plan} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}