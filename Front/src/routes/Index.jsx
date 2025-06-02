import Hero from "@/components/Hero";
import Pricing from "@/components/cards/pricing";
import Features from "@/components/cards/Features";
import Navbar from "@/components/nav/navbar";
import Footer from "@/components/Footer";
import { BackgroundGrid, GradientOrbs } from "@/components/ui/background";

export default function Home() {
    return (
        <div className="relative min-h-screen bg-gradient-to-b from-black via-black to-black/95 overflow-hidden">
            <BackgroundGrid />
            <GradientOrbs />
            <div className="relative">
                <Navbar />
                <div id="home">
                    <Hero 
                        badge="AuthManager"
                        title1="Unleashing"
                        title2="the Ultimate"
                        title3="Authentication"
                    />
                </div>
                <div id="features">
                    <Features />
                </div>
                <div id="pricing">
                    <Pricing />
                </div>
                <Footer />
            </div>
        </div>
    );
}
