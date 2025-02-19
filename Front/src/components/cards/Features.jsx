import React from 'react';
import { Card } from '../ui/card';
import { 
  Shield, 
  LineChart, 
  Settings, 
  Lock, 
  RefreshCw, 
  Database
} from 'lucide-react';

const FeatureCard = ({ title, description, icon: Icon, index }) => (
  <div
    data-aos="fade-up"
    data-aos-delay={index * 100}
    className="relative group"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
    <Card className="relative border border-border/50 bg-background/40 backdrop-blur-md p-6 h-full hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="p-3 rounded-full bg-primary/10 text-primary">
          <Icon size={24} />
        </div>
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </Card>
  </div>
);

export default function Features() {
  const features = [
    {
      title: "Secure Authentication",
      description: "Enterprise-grade security with multiple authentication methods and encryption protocols.",
      icon: Shield
    },
    {
      title: "Advanced Analytics",
      description: "Real-time monitoring and detailed analytics of your authentication flows.",
      icon: LineChart
    },
    {
      title: "Customizable",
      description: "Fully customizable authentication process to match your brand and requirements.",
      icon: Settings
    },
    {
      title: "Access Control",
      description: "Fine-grained access control and user permission management.",
      icon: Lock
    },
    {
      title: "Auto Scaling",
      description: "Automatically scales to handle millions of authentication requests.",
      icon: RefreshCw
    },
    {
      title: "Data Management",
      description: "Efficient user data management with advanced filtering and search capabilities.",
      icon: Database
    }
  ];

  return (
    <div className="relative py-20">
      <div className="relative container mx-auto px-4">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            Powerful Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage authentication and user access in one place
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
