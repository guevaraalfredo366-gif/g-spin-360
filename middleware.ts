import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Best-effort in-process rate limiter.
// Resets per Edge worker instance — not globally distributed.
// Replace Map with Upstash Redis for distributed rate limiting in high-traffic scenarios.
const RATE_LIMIT = 60;      // requests per window
const WINDOW_MS  = 60_000;  // 1 minute

type RateEntry = { count: number; resetAt: number };
const _store = new Map<string, RateEntry>();

function isRateLimited(key: string): boolean {
  const now   = Date.now();
  const entry = _store.get(key);

  if (!entry || now > entry.resetAt) {
    _store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count++;

  // Prevent unbounded memory growth in long-lived worker instances
  if (_store.size > 10_000) _store.clear();

  return entry.count > RATE_LIMIT;
}

const ALLOWED_ORIGINS = new Set([
  'https://g-spin-360.netlify.app',
  'http://localhost:3000',
  'http://localhost:3001',
]);

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only apply to API routes
  if (!pathname.startsWith('/api/')) return NextResponse.next();

  const origin    = req.headers.get('origin') ?? '';
  const isWebhook = pathname.startsWith('/api/webhooks/');

  // OPTIONS preflight — respond before rate-limiting to keep latency low
  if (req.method === 'OPTIONS') {
    if (!ALLOWED_ORIGINS.has(origin)) {
      return new NextResponse(null, { status: 403 });
    }
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin':  origin,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age':       '86400',
      },
    });
  }

  // Rate limit by client IP + endpoint path
  const ip  = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const key = `${ip}:${pathname}`;
  if (isRateLimited(key)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait before retrying.' },
      { status: 429, headers: { 'Retry-After': '60' } }
    );
  }

  // CORS enforcement for browser requests.
  // Webhooks are server-to-server (no Origin header) — skip enforcement.
  if (!isWebhook && origin && !ALLOWED_ORIGINS.has(origin)) {
    return NextResponse.json(
      { error: 'CORS: origin not permitted.' },
      { status: 403 }
    );
  }

  // Attach CORS headers to the proxied response
  const res = NextResponse.next();
  if (ALLOWED_ORIGINS.has(origin)) {
    res.headers.set('Access-Control-Allow-Origin', origin);
    res.headers.set('Vary', 'Origin');
  }
  return res;
}

export const config = {
  matcher: ['/api/:path*'],
};
