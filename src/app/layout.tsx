import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Aurrin Crowdfunding",
  description: "Community-powered funding for founders. No government. No gatekeepers. Just people building.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      <body className="bg-navy text-white font-sans antialiased">
        {/* Navbar */}
        <nav className="border-b border-white/10 px-6 py-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <a href="/campaigns" className="flex items-center gap-2">
              <span className="font-montserrat font-bold text-lg tracking-wide">AURRIN</span>
              <span className="text-default-500 text-sm font-light">CROWDFUNDING</span>
            </a>
            <div className="flex items-center gap-4">
              <a href="/campaigns" className="text-sm hover:text-violet-400 transition-colors">Browse</a>
              <a
                href="/start"
                className="px-4 py-2 rounded-full bg-white text-navy text-sm font-semibold hover:bg-violet-100 transition-colors"
              >
                Start a Campaign
              </a>
            </div>
          </div>
        </nav>

        {/* Main */}
        <main className="min-h-screen">{children}</main>

        {/* Footer */}
        <footer className="px-6 py-8 mt-16 border-t border-white/10">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-default-500">
              © {new Date().getFullYear()} Aurrin Ventures · Dream it. Pitch it. Build it.
            </p>
            <div className="flex gap-6 text-sm text-default-500">
              <a href="/privacy" className="hover:text-violet-400 transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-violet-400 transition-colors">Terms</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}