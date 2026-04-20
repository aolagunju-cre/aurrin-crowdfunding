'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { verifySession } from '@/lib/stripe';

function ConfirmContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [amount, setAmount] = useState<number>(0);

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      return;
    }

    verifySession(sessionId)
      .then((session) => {
        setAmount(session.amount_total ?? 0);
        setStatus('success');
      })
      .catch(() => {
        setStatus('error');
      });
  }, [sessionId]);

  if (status === 'loading') {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">⚡</div>
        <h1 className="text-2xl font-montserrat font-bold mb-2">Confirming your pledge...</h1>
        <p className="text-default-500">Just a moment while we confirm your payment.</p>
      </div>
    );
  }

  if (status === 'error' || !sessionId) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">❌</div>
        <h1 className="text-2xl font-montserrat font-bold mb-2">Something went wrong.</h1>
        <p className="text-default-500 mb-6">We couldn't confirm your payment. Check your email for a receipt, or try again.</p>
        <Link
          href="/campaigns"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-navy font-semibold hover:bg-violet-100 transition-colors"
        >
          Browse Campaigns →
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
    <div className="text-center py-20 px-4">
      <div className="text-6xl mb-6">🎉</div>
      <h1 className="text-3xl md:text-4xl font-montserrat font-bold mb-4">
        You're in.
      </h1>
      <p className="text-xl text-default-400 mb-2">
        Your pledge of <span className="text-teal font-bold">{amountFormatted}</span> is confirmed.
      </p>
      <p className="text-default-500 mb-10">
        A receipt is on its way to your email. The founder is notified too.
      </p>

      {/* Share */}
      <div className="mb-10">
        <p className="text-sm text-default-500 mb-4">Spread the word</p>
        <div className="flex justify-center gap-4">
          <a
            href={`https://twitter.com/intent/tweet?text=I+just+backed+a+Calgary+founder+on+Aurrin+Crowdfunding.+Community-powered+funding+for+founders+%23DreamItPitchItBuildIt&url=https://www.aurrinventures.ca/campaigns`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-full border border-white/20 hover:border-white/40 transition-colors text-sm"
          >
            Share on X →
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=https://www.aurrinventures.ca/campaigns`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-full border border-white/20 hover:border-white/40 transition-colors text-sm"
          >
            Share on LinkedIn →
          </a>
        </div>
      </div>

      {/* CTA */}
      <Link
        href="/campaigns"
        className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-navy font-semibold text-lg hover:bg-violet-100 transition-colors"
      >
        Back Another Project →
      </Link>

      <p className="mt-8 text-sm text-default-600">
        Dream it. Pitch it. Build it. — Aurrin Ventures
      </p>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={
      <div className="text-center py-20">
        <div className="text-5xl mb-4">⚡</div>
        <p className="text-default-500">Loading...</p>
      </div>
    }>
      <ConfirmContent />
    </Suspense>
  );
}