import type { Metadata } from 'next';
import Link from 'next/link';
import { ThemeProvider } from 'next-themes';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Aurrin Crowdfunding',
  description: 'Community-powered funding for founders.',
};

function Nav() {
  return (
    <nav className="border-b border-gray-200 bg-[#F7F7F7] px-3 py-2.5 sticky top-0 z-50">
      <div className="max-w-xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.jpg" alt="Aurrin" className="h-7 w-auto rounded" />
          <span className="font-bold text-xs tracking-widest text-slate-900 hidden sm:block">CROWDFUNDING</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/campaigns"
            className="text-slate-500 hover:text-slate-900 transition-colors text-sm px-1 py-1"
          >
            Browse
          </Link>
          <Link
            href="/create"
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-900 text-white text-xs sm:text-sm font-semibold hover:bg-slate-700 transition-colors whitespace-nowrap"
          >
            Start a Campaign
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="px-6 py-8 mt-16 border-t border-gray-200 bg-[#F7F7F7]">
      <div className="max-w-xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <img src="/logo.jpg" alt="Aurrin" className="h-5 w-auto rounded" />
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} Aurrin Ventures</p>
        </div>
        <p className="text-sm text-gray-500">Dream it. Pitch it. Build it.</p>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@400;500;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#F7F7F7] text-slate-900 font-sans antialiased min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="light">
          <Nav />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
