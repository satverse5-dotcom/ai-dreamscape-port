import type { Metadata } from "next";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import ParticlesBG from "@/components/ParticlesBG";
import AIChat from "@/components/AIChat";
import Providers from "./providers";

export const metadata: Metadata = {
    title: "Satyam Kumar Karn | AI Engineer & Full Stack Developer",
    description:
        "AI Engineer specializing in intelligent systems, computer vision, and full-stack AI applications. Portfolio of Satyam Kumar Karn.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    <TooltipProvider>
                        <Toaster />
                        <Sonner />
                        <ParticlesBG />
                        <Navbar />
                        {children}
                        <AIChat />
                    </TooltipProvider>
                </Providers>
            </body>
        </html>
    );
}
