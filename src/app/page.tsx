import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Aurrin Crowdfunding — Start Your Campaign',
  description: 'Raise funding from your community. No gatekeepers. No government dependency.',
};

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-teal-400 mb-6">
            Community-Powered Funding
          </p>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            The future of<br />
            <span className="bg-gradient-to-r from-violet-600 to-teal-400 bg-clip-text text-transparent">
              funding
            </span>{' '}
            is here.
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed mb-10">
            Crowdfunding for founders who want to own their future. No VC gatekeeping. No government dependency. Just your community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/create"
              className="px-10 py-4 rounded-full bg-white text-slate-900 font-bold text-lg hover:bg-teal-400 transition-colors"
            >
              Start Your Campaign →
            </Link>
            <Link
              href="/campaigns"
              className="px-10 py-4 rounded-full border border-white/10 text-gray-300 font-semibold hover:border-white/30 transition-colors"
            >
              Browse Campaigns
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
