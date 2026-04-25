'use client';

import { useEffect, useState } from 'react';

interface Update {
  id: string;
  title: string | null;
  content: string;
  author_name: string | null;
  created_at: string;
}

interface UpdateFeedProps {
  campaignId: string;
}

export function UpdateFeed({ campaignId }: UpdateFeedProps) {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetch(`/api/campaign-updates?campaign_id=${campaignId}`)
      .then((r) => r.json())
      .then((d) => setUpdates(d.updates ?? []))
      .catch(console.error);
  }, [campaignId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/campaign-updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaign_id: campaignId,
          title: title || null,
          content,
          author_name: author || null,
        }),
      });
      if (res.ok) {
        setDone(true);
        setTitle('');
        setContent('');
        setAuthor('');
        const fresh = await fetch(`/api/campaign-updates?campaign_id=${campaignId}`).then((r) => r.json());
        setUpdates(fresh.updates ?? []);
        setTimeout(() => {
          setDone(false);
          setShowForm(false);
        }, 2000);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Campaign Updates</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm text-violet-600 hover:text-violet-700 font-medium"
        >
          {showForm ? 'Cancel' : '+ Post update'}
        </button>
      </div>

      {showForm && !done && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
          <input
            type="text"
            placeholder="Update title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-600"
          />
          <textarea
            required
            rows={3}
            placeholder="Share a milestone, thank-you note, or progress update..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-600 resize-none"
          />
          <input
            type="text"
            placeholder="Your name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-600"
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Posting...' : 'Post Update'}
          </button>
        </form>
      )}

      {done && (
        <div className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium">
          ✅ Update posted!
        </div>
      )}

      {updates.length === 0 && !showForm ? (
        <p className="text-sm text-slate-400 italic">No updates yet.</p>
      ) : (
        <div className="space-y-4">
          {updates.map((u) => (
            <div key={u.id} className="bg-white rounded-2xl border border-gray-200 p-5">
              {u.title && <h3 className="font-bold text-slate-900 mb-1">{u.title}</h3>}
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{u.content}</p>
              <p className="text-xs text-slate-400 mt-3">
                {u.author_name || 'Founder'} ·{' '}
                {new Date(u.created_at).toLocaleDateString('en-CA', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
