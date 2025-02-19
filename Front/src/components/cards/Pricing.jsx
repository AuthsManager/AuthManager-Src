import React from 'react';
import { Card } from '../ui/card';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const PricingCard = ({ title, price, features, popular }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="flex-1"
    >
      <Card className={`p-6 h-full border bg-card ${popular ? 'border-primary relative' : 'border-border'}`}>
        {popular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                Most popular
            </span>
          </div>
        )}
        <div className="flex flex-col h-full">
          <div className="text-center flex-1">
            <h3 className="text-2xl font-bold mb-2 text-card-foreground">{title}</h3>
            <div className="mb-4">
              <span className="text-4xl font-bold text-card-foreground">{price}€</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="text-card-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <button
            className={`mt-6 w-full py-2 px-4 rounded-lg transition-all font-medium ${
              popular
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
            }`}
          >
            Start now
          </button>
        </div>
      </Card>
    </motion.div>
  );
};

export default function Pricing() {
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
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 text-foreground">Plans & Pricing</h2>
        <p className="text-xl text-muted-foreground">
          Choose the plan that fits your needs
        </p>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>
      </div>
    </div>
  );
};