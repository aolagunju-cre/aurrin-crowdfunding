import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Aurrin Crowdfunding — Start Your Campaign',
  description: 'Raise funding from your community. No gatekeepers. No government dependency.',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-navy flex flex-col">
      {/* Nav */}
      <nav className="border-b border-white/10 px-6 py-5">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="font-montserrat font-bold text-lg tracking-wide">AURRIN</span>
            <span className="text-default-500 text-sm">CROWDFUNDING</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/campaigns" className="text-default-500 hover:text-white transition-colors">
              Browse
            </Link>
            <Link
              href="/create"
              className="px-4 py-2 rounded-full bg-white text-navy text-sm font-semibold hover:bg-teal/90 transition-colors"
            >
              Start a Campaign
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-teal mb-6 font-montserrat">
            Community-Powered Funding
          </p>
          <h1 className="text-5xl md:text-6xl font-montserrat font-bold leading-tight mb-6">
            The future of<br />
            <span className="gradient-text">funding</span> is here.
          </h1>
          <p className="text-xl text-default-400 leading-relaxed mb-10">
            Crowdfunding for founders who want to own their future. No VC gatekeeping. No government dependency. Just your community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/create"
              className="px-10 py-4 rounded-full bg-white text-navy font-bold text-lg hover:bg-teal/90 transition-colors"
            >
              Start Your Campaign →
            </Link>
            <Link
              href="/campaigns"
              className="px-10 py-4 rounded-full border border-white/10 text-default-300 font-semibold hover:border-white/30 transition-colors"
            >
              Browse Campaigns
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-white/10">
        <div className="max-w-5xl mx-auto flex justify-between items-center text-sm text-default-600">
          <p>© {new Date().getFullYear()} Aurrin Ventures · Dream it. Pitch it. Build it.</p>
          <Link href="/privacy" className="hover:text-violet-400 transition-colors">Privacy</Link>
        </div>
      </footer>
    </div>
  );
}
