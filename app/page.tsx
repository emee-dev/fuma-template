import { HeroHeader } from "@/components/header";
import HeroSection from "../components/hero-section";

const Page = () => {
	return (
		<div className="h-screen gap-x-3.5 px-4 bg-accent">
			<HeroHeader />
			<HeroSection />
		</div>
	);
};

export default Page;
