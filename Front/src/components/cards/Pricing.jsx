import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const PricingCard = ({ title, price, features, popular, index }) => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      mirror: false
    });
  }, []);

  return (
    <div 
      className="flex-1 relative group"
      data-aos="fade-up"
      data-aos-delay={index * 100}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
      <Card className={`relative p-6 h-full border bg-background/40 backdrop-blur-md ${
        popular 
          ? 'border-primary/50 relative hover:border-primary shadow-lg shadow-primary/20' 
          : 'border-border/30 hover:border-border/60 shadow-lg shadow-background/5'
      } transition-all duration-300 hover:-translate-y-1`}>
        {popular && (
          <div 
            className="absolute -top-3 left-1/2 transform -translate-x-1/2"
            data-aos="fade-down"
            data-aos-delay={index * 100 + 200}
          >
            <span className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm shadow-lg shadow-primary/20">
              Most popular
            </span>
          </div>
        )}
        <div className="flex flex-col h-full">
          <div className="text-center flex-1">
            <h3 
              className="text-2xl font-bold mb-2 text-card-foreground"
              data-aos="fade-up"
              data-aos-delay={index * 100 + 100}
            >
              {title}
            </h3>
            <div 
              className="mb-4"
              data-aos="fade-up"
              data-aos-delay={index * 100 + 200}
            >
              <span className="text-4xl font-bold text-card-foreground">{price}€</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-3">
              {features.map((feature, featureIndex) => (
                <li 
                  key={featureIndex} 
                  className="flex items-center space-x-2"
                  data-aos="fade-up"
                  data-aos-delay={index * 100 + featureIndex * 50 + 300}
                >
                  <Check className="h-5 w-5 text-primary" />
                  <span className="text-card-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <button
            className={`mt-6 w-full py-2 px-4 rounded-lg transition-all font-medium hover:scale-105 active:scale-95 backdrop-blur-sm ${
              popular
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
            }`}
            data-aos="fade-up"
            data-aos-delay={index * 100 + 400}
          >
            Start now
          </button>
        </div>
      </Card>
    </div>
  );
};

export default function Pricing() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      mirror: false
    });
  }, []);

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
        <div className="text-center mb-12">
          <h2 
            className="text-4xl font-bold mb-4 text-foreground"
            data-aos="fade-down"
            data-aos-delay="100"
          >
            Plans & Pricing
          </h2>
          <p 
            className="text-xl text-muted-foreground"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Choose the plan that fits your needs
          </p>
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