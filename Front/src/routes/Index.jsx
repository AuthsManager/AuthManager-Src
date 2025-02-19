import Hero from "@/components/Hero";
import Pricing from "@/components/cards/pricing";
import Navbar from "@/components/nav/navbar";
// import dashboard from "/dashboard.png";

export default function Home() {
    return (
        <>
            <Navbar />
            <Hero 
                badge="AuthManager"
                title1="Unleashing"
                title2="the Ultimate"
                title3="Authentication"
            />
            <Pricing />
        </>
    );
}
