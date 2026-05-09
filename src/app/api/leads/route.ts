import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

interface LeadRequestBody {
  email: string;
  companyName?: string;
  role?: string;
  auditId: string;
  totalMonthlySavings: number;
  toolsAudited: string[];
  /** Honeypot — must be absent or empty */
  website?: string;
}

interface LeadSuccessResponse {
  success: true;
  isHighSavings: boolean;
}

interface LeadErrorResponse {
  error: string;
}

type LeadResponse = LeadSuccessResponse | LeadErrorResponse;

// ─── Rate limiting (in-memory, per process) ───────────────────────────────────

/** Map of normalised email → timestamp of last submission */
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 60 seconds

function isRateLimited(email: string): boolean {
  const last = rateLimitMap.get(email);
  if (last === undefined) return false;
  return Date.now() - last < RATE_LIMIT_WINDOW_MS;
}

function recordSubmission(email: string): void {
  rateLimitMap.set(email, Date.now());

  // Prune stale entries periodically to avoid unbounded growth
  if (rateLimitMap.size > 5_000) {
    const cutoff = Date.now() - RATE_LIMIT_WINDOW_MS;
    for (const [key, ts] of rateLimitMap) {
      if (ts < cutoff) rateLimitMap.delete(key);
    }
  }
}

// ─── Validation helpers ───────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(
  request: Request,
): Promise<NextResponse<LeadResponse>> {
  let body: LeadRequestBody;

  // 1. Parse body
  try {
    body = (await request.json()) as LeadRequestBody;
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  // 2. Honeypot check — bots fill hidden fields; humans never do
  if (body.website && body.website.trim().length > 0) {
    // Return 200 silently so bots don't retry
    console.info('[leads] honeypot triggered — silent discard');
    return NextResponse.json({ success: true, isHighSavings: false });
  }

  // 3. Basic field validation
  const email = (body.email ?? '').trim().toLowerCase();

  if (!email) {
    return NextResponse.json({ error: 'email is required.' }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: 'email must be a valid email address.' },
      { status: 400 },
    );
  }

  if (!body.auditId || typeof body.auditId !== 'string') {
    return NextResponse.json({ error: 'auditId is required.' }, { status: 400 });
  }

  const totalMonthlySavings =
    typeof body.totalMonthlySavings === 'number' ? body.totalMonthlySavings : 0;

  const toolsAudited = Array.isArray(body.toolsAudited) ? body.toolsAudited : [];

  // 4. Rate limiting
  if (isRateLimited(email)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment before trying again.' },
      { status: 429 },
    );
  }

  // 5. Derive computed fields
  const isHighSavings = totalMonthlySavings > 500;

  // 6. Persist to Supabase
  const { error: dbError } = await supabase.from('leads').insert({
    email,
    company_name: body.companyName ?? null,
    role: body.role ?? null,
    audit_id: body.auditId,
    total_monthly_savings: totalMonthlySavings,
    tools_audited: toolsAudited,
    is_high_savings: isHighSavings,
    created_at: new Date().toISOString(),
  });

  if (dbError) {
    // Handle duplicate email gracefully (unique constraint)
    if (dbError.code === '23505') {
      // Still record rate limit so spammers can't probe duplicates
      recordSubmission(email);
      return NextResponse.json({ success: true, isHighSavings });
    }

    console.error('[leads] Supabase insert error:', dbError);
    return NextResponse.json(
      { error: 'Failed to save lead. Please try again.' },
      { status: 500 },
    );
  }

  // 7. Record successful submission for rate limiting
  recordSubmission(email);

  console.info('[leads] captured:', { email, auditId: body.auditId, isHighSavings });

  return NextResponse.json({ success: true, isHighSavings });
}
