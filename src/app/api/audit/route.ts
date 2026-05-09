import { NextResponse } from 'next/server';
import type { AuditInput, AuditResult } from '@/types';
import { runAudit } from '@/lib/auditEngine';
import { supabase } from '@/lib/supabase';

// ─── Request / Response shapes ───────────────────────────────────────────────

interface AuditRequestBody {
  /** The tools + team info to audit. Must not contain email / company. */
  input: AuditInput;
  /** Optional AI-generated summary — persisted so shared pages can show it. */
  aiSummary?: string;
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(
  request: Request,
): Promise<NextResponse<AuditResult | { error: string }>> {
  // 1. Parse body
  let body: AuditRequestBody;
  try {
    body = (await request.json()) as AuditRequestBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  if (!body?.input?.tools || !Array.isArray(body.input.tools)) {
    return NextResponse.json(
      { error: 'Missing or invalid "input" field.' },
      { status: 400 },
    );
  }

  // 2. Run the audit engine (pure, no side-effects)
  let result: AuditResult;
  try {
    result = runAudit(body.input);
  } catch (err) {
    console.error('[audit] runAudit threw:', err);
    return NextResponse.json(
      { error: 'Audit engine failed to process input.' },
      { status: 422 },
    );
  }

  // 3. Persist to Supabase — strip any PII (email / company never touches the DB)
  try {
    const { error: dbError } = await supabase.from('audits').insert({
      id: result.id,
      // Store input without any user-identifying fields (AuditInput has none,
      // but if the caller passes extra keys we only pick the typed subset).
      input: {
        tools: result.input.tools,
        teamSize: result.input.teamSize,
        useCase: result.input.useCase,
      } satisfies AuditInput,
      recommendations: result.recommendations,
      total_monthly_savings: result.totalMonthlySavings,
      total_annual_savings: result.totalAnnualSavings,
      is_optimal: result.isOptimal,
      created_at: result.createdAt,
      ai_summary: body.aiSummary ?? null,
    });

    if (dbError) {
      // Log server-side; don't surface Supabase internals to the client.
      console.error('[audit] Supabase insert error:', dbError);
      // Still return the result — the client can use it even if persistence failed.
    }
  } catch (err) {
    console.error('[audit] Unexpected Supabase error:', err);
  }

  // 4. Return the full AuditResult
  return NextResponse.json(result, { status: 201 });
}
