import { TailwindIndicator } from "@/components/tw-indicator";
import { Toaster } from "@/components/ui/sonner";
import "@/lib/orpc.server";
import { GeistSans } from "geist/font/sans";
import { Fira_Mono, Geist_Mono, Inter, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { TanstackProvider } from "../providers/tanstack-provider";
import "./global.css";

const inter = Inter({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
	variable: "--font-inter",
});

const firaCode = Fira_Mono({
	subsets: ["latin"],
	weight: ["400", "500", "700"],
	variable: "--font-fira-code",
});

const jetbrains_mono = JetBrains_Mono({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
	variable: "--font-jetbrains-mono",
});

const geist_mono = Geist_Mono({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
	variable: "--font-geist-mono",
});

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<html
			lang="en"
			className={`${inter.className} ${geist_mono.variable} ${GeistSans.variable} ${jetbrains_mono.variable} ${firaCode.variable} antialiased`}
			suppressHydrationWarning>
			<body className="min-h-screen ">
				<TanstackProvider>
					{children}
					<Toaster />
					{process.env.NODE_ENV !== "production" && (
						<TailwindIndicator />
					)}
				</TanstackProvider>
			</body>
		</html>
	);
}
