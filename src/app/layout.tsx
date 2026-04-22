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
    <nav className="border-b border-white/10 px-6 py-4">
      <div className="max-w-xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.jpg" alt="Aurrin" className="h-9 w-auto rounded" />
          <span className="font-bold text-sm tracking-widest">CROWDFUNDING</span>
        </Link>
        <div className="flex items-center gap-5 text-sm">
          <Link href="/campaigns" className="text-gray-400 hover:text-white transition-colors">
            Browse
          </Link>
          <Link
            href="/create"
            className="px-4 py-2 rounded-full bg-white text-slate-900 text-sm font-semibold hover:bg-teal-400 transition-colors"
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
    <footer className="px-6 py-8 mt-16 border-t border-white/10">
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
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <Nav />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
