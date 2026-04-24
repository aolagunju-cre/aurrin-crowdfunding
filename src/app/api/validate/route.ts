import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }
  const { url } = body;
  if (!url || typeof url !== 'string') return NextResponse.json({ error: 'url required' }, { status: 400 });

  let title = '';
  let description = '';
  let hasPricing = false;
  let hasTeam = false;
  let hasContact = false;
  let hasBlog = false;
  let hasJobs = false;
  let hasNewsletter = false;
  let hasWaitingList = false;
  let hasAiContent = false;
  let domain = '';

  try {
    const parsedUrl = new URL(url);
    domain = parsedUrl.hostname.replace('www.', '');
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Aurrin-Validation/1.0' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();

    const pageText = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').toLowerCase();

    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) title = titleMatch[1].trim();

    const descMatch =
      html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
    if (descMatch) description = descMatch[1].trim();

    hasPricing = /price|pricing|\$|usd|cad|eur|per month|per year|subscription|fee|cost/i.test(pageText);
    hasTeam = /team|about us|founder|co-founder|leadership|our people/i.test(pageText);
    hasContact = /contact|get in touch|reach us|email|phone|book a call/i.test(pageText);
    hasBlog = /blog|news|updates|posts|articles|insights/i.test(pageText);
    hasJobs = /jobs|careers|we're hiring|open positions|join us/i.test(pageText);
    hasNewsletter = /newsletter|sign up|subscribe|email me|get updates/i.test(pageText);
    hasWaitingList = /waitlist|join the list|early access|coming soon|request access/i.test(pageText);

    const aiPatterns = [
      /revolutionize/i, /game-?changer/i, /disrupt/i, /transform.*world/i,
      /leverage.*synerg/i, /best-?in-?class/i, /cutting-?edge/i,
      /next-?gen/i, /seamless/i, /robust/i, /scalable/i,
      /empower/i, /unlock.*potential/i, /drive.*results/i,
    ];
    hasAiContent = aiPatterns.filter(p => p.test(pageText)).length >= 3;

  } catch {
    return NextResponse.json({
      error: 'Could not fetch that URL. Make sure it starts with https://',
      domain,
    }, { status: 422 });
  }

  const signals = [
    { id: 'pricing', label: 'Has pricing on site', value: hasPricing },
    { id: 'team', label: 'Has team / about page', value: hasTeam },
    { id: 'contact', label: 'Has contact info', value: hasContact },
    { id: 'blog', label: 'Has blog or content', value: hasBlog },
    { id: 'jobs', label: 'Actively hiring', value: hasJobs },
    { id: 'newsletter', label: 'Has email signup', value: hasNewsletter },
    { id: 'waitlist', label: 'Waiting list / early access', value: hasWaitingList },
    { id: 'ai_content', label: 'Copy sounds human', value: !hasAiContent },
  ];

  const score = signals.filter(s => s.value).length;
  const pct = Math.round((score / signals.length) * 100);

  let tier: string;
  if (pct >= 75) tier = 'Looks fundable — strong signals across the board';
  else if (pct >= 50) tier = 'Promising — a few gaps to close before pitching investors';
  else if (pct >= 25) tier = 'Early stage — focus on the basics first';
  else tier = 'Needs work — build traction before approaching investors';

  return NextResponse.json({
    domain,
    title,
    description,
    score,
    maxScore: signals.length,
    pct,
    tier,
    signals,
    missingSignals: signals.filter(s => !s.value).map(s => s.label),
    strongSignals: signals.filter(s => s.value).map(s => s.label),
    url,
  });
}
