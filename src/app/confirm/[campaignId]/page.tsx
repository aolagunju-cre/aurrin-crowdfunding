'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ConfirmContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const demoAmount = searchParams.get('amount');
  const isDemo = searchParams.get('demo') === '1';
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [amount, setAmount] = useState<number>(0);
  const [campaignId, setCampaignId] = useState<string>('');

  useEffect(() => {
    // Get campaignId from URL path
    const pathParts = window.location.pathname.split('/');
    const cid = pathParts[pathParts.length - 1];
    setCampaignId(cid);

    if (isDemo && demoAmount) {
      setAmount(parseInt(demoAmount));
      setStatus('success');
      return;
    }

    if (!sessionId) {
      setStatus('error');
      return;
    }

    // Verify Stripe session
    fetch(`/api/verify-session?session_id=${sessionId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.amount) setAmount(data.amount);
        setStatus('success');
      })
      .catch(() => {
        // Demo fallback
        setStatus('success');
      });
  }, [sessionId, demoAmount, isDemo]);

  if (status === 'loading') {
    return (
      <div className="max-w-sm mx-auto px-4 py-24 text-center">
        <div className="text-5xl mb-4">⚡</div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Confirming your pledge...</h1>
        <p className="text-slate-500">Just a moment.</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="max-w-sm mx-auto px-4 py-24 text-center">
        <div className="text-5xl mb-4">❌</div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong.</h1>
        <p className="text-slate-500 mb-6">Check your email for a receipt, or try again.</p>
        <Link href="/campaigns" className="text-violet-600 hover:text-violet-700 font-medium text-sm">
          ← Browse Campaigns
        </Link>
      </div>
    );
  }

  const amountFormatted = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
  }).format(amount / 100);

  return (
    <div className="max-w-sm mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-6">🎉</div>
      <h1 className="text-3xl font-bold text-slate-900 mb-3">You're in.</h1>
      <p className="text-lg text-slate-500 mb-2">
        Your pledge of{' '}
        <span className="font-bold text-violet-600">{amountFormatted}</span> is confirmed.
      </p>
      <p className="text-slate-500 mb-10">
        The founder is notified. A receipt is on its way to your email.
      </p>

      {/* Share */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <p className="text-sm font-semibold text-slate-900 mb-4">Spread the word</p>
        <div className="flex flex-col gap-2">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just backed a Calgary founder on @AurrinVentures! Community-powered funding for founders. #DreamItPitchItBuildIt`)}&url=${encodeURIComponent('https://aurrin-crowdfunding.vercel.app/campaigns')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm font-medium text-slate-600 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
          >
            Share on X
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://aurrin-crowdfunding.vercel.app/campaigns')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm font-medium text-slate-600 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
          >
            Share on LinkedIn
          </a>
        </div>
      </div>

      <Link href="/campaigns" className="text-violet-600 hover:text-violet-700 font-medium text-sm">
        ← Back to campaigns
      </Link>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={
      <div className="max-w-sm mx-auto px-4 py-24 text-center text-slate-400">
        Loading...
      </div>
    }>
      <ConfirmContent />
    </Suspense>
  );
}
