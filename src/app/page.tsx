import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Aurrin Crowdfunding — Start Your Campaign',
  description: 'Raise funding from your community. No gatekeepers. No government dependency.',
};

export default function Home() {
  return (
    <div className="flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-teal-600 mb-6 font-montserrat">
            Community-Powered Funding
          </p>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 text-slate-900">
            The future of<br />
            <span className="bg-gradient-to-r from-violet-600 to-teal-500 bg-clip-text text-transparent">
              funding
            </span>{' '}
            is here.
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed mb-10">
            Crowdfunding for founders who want to own their future. No VC gatekeeping. No government dependency. Just your community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/create"
              className="px-10 py-4 rounded-full bg-slate-900 text-white font-bold text-lg hover:bg-slate-700 transition-colors"
            >
              Start Your Campaign →
            </Link>
            <Link
              href="/campaigns"
              className="px-10 py-4 rounded-full border border-gray-300 text-slate-700 font-semibold hover:border-slate-900 hover:text-slate-900 transition-colors"
            >
              Browse Campaigns
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
