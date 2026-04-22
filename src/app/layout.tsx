import type { Metadata } from "next";
import { HeroUIProvider } from "@heroui/react";
import { Providers } from "next-themes";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Aurrin Crowdfunding",
  description: "Community-powered funding for founders.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@400;500;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0D1B2E] text-[#F1F3F2] font-sans antialiased min-h-screen">
        <Providers>
          <HeroUIProvider>
            {children}
          </HeroUIProvider>
        </Providers>
      </body>
    </html>
  );
}
