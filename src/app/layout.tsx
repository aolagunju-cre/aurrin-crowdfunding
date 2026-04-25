import type { Metadata } from 'next';
import Link from 'next/link';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Aurrin Ventures',
  description: 'Community-powered funding for founders.',
};

function Nav() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-xl mx-auto px-4 flex items-center justify-between h-14">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Aurrin Ventures" className="h-7 w-auto" />
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/campaigns"
            className="text-slate-600 hover:text-violet-600 transition-colors text-sm px-2 py-1 font-medium"
          >
            Browse
          </Link>
          <Link
            href="/events/april-2026"
            className="text-slate-600 hover:text-violet-600 transition-colors text-sm px-2 py-1 font-medium"
          >
            Events
          </Link>
          <Link
            href="/database"
            className="text-slate-600 hover:text-violet-600 transition-colors text-sm px-2 py-1 font-medium"
          >
            Database
          </Link>
        </nav>
        <Link
          href="/create"
          className="px-4 py-1.5 rounded-full bg-violet-600 text-white text-xs sm:text-sm font-semibold hover:bg-violet-700 transition-colors"
        >
          Start a Campaign
        </Link>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="px-6 py-8 mt-16 border-t border-gray-100">
      <div className="max-w-xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm text-slate-500">© {new Date().getFullYear()} Aurrin Ventures</p>
        <p className="text-sm text-slate-400">Dream it. Pitch it. Build it.</p>
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
      <body className="bg-[#F7F8FA] text-slate-900 font-sans antialiased min-h-screen">
        <Nav />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
