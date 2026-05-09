import { NextResponse } from 'next/server';
import type { AuditResult } from '@/types';

// ─── Request / Response shapes ───────────────────────────────────────────────

interface SummaryRequestBody {
  auditResult: AuditResult;
}

interface SummaryResponse {
  summary: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Derives the single most impactful recommendation from the audit result.
 * Falls back to the first recommendation if none have monthlySavings > 0.
 */
function getTopRecommendation(auditResult: AuditResult) {
  const sorted = [...auditResult.recommendations].sort(
    (a, b) => b.monthlySavings - a.monthlySavings,
  );
  return sorted[0] ?? null;
}

/**
 * Computes the total current monthly spend from individual tool entries
 * (monthlySpend × seats for each tool).
 */
function computeTotalCurrentSpend(auditResult: AuditResult): number {
  return auditResult.input.tools.reduce(
    (sum, t) => sum + t.monthlySpend * t.seats,
    0,
  );
}

/**
 * Builds a deterministic, template-based summary when the Anthropic call
 * is unavailable or fails for any reason.
 */
function buildFallbackSummary(auditResult: AuditResult): string {
  const { teamSize } = auditResult.input;
  const { totalMonthlySavings, totalAnnualSavings } = auditResult;
  const totalCurrentSpend = computeTotalCurrentSpend(auditResult);
  const top = getTopRecommendation(auditResult);

  if (!top) {
    return (
      `Your ${teamSize}-person team is spending $${totalCurrentSpend.toFixed(2)}/month on AI tools ` +
      `and appears to be well optimised — no significant savings were identified at this time.`
    );
  }

  return (
    `Your ${teamSize}-person team is spending $${totalCurrentSpend.toFixed(2)}/month on AI tools. ` +
    `We identified $${totalMonthlySavings.toFixed(2)}/month ` +
    `($${totalAnnualSavings.toFixed(2)}/year) in potential savings. ` +
    `Your biggest opportunity is ${top.tool} — ` +
    `${top.reason} ` +
    `That's $${top.annualSavings.toFixed(2)} back in your budget annually.`
  );
}

/**
 * Calls the Anthropic Messages API directly via fetch (no SDK required).
 * Throws on any non-2xx response or network error so the caller can fall back.
 */
async function fetchAnthropicSummary(
  auditResult: AuditResult,
  apiKey: string,
): Promise<string> {
  const { teamSize, useCase } = auditResult.input;
  const { totalMonthlySavings, totalAnnualSavings } = auditResult;
  const totalCurrentSpend = computeTotalCurrentSpend(auditResult);
  const top = getTopRecommendation(auditResult);

  let userPrompt: string;

  if (!top) {
    userPrompt =
      `Write a 80-100 word personalized audit summary for a ${teamSize}-person team ` +
      `whose primary use case is ${useCase}. They currently spend $${totalCurrentSpend.toFixed(2)}/month ` +
      `on AI tools. We found no significant savings opportunities — their spend appears optimal. ` +
      `Be encouraging and suggest they keep monitoring as their team grows.`;
  } else {
    userPrompt =
      `Write a 80-100 word personalized audit summary for a ${teamSize}-person team ` +
      `whose primary use case is ${useCase}. ` +
      `They currently spend $${totalCurrentSpend.toFixed(2)}/month on AI tools. ` +
      `We found $${totalMonthlySavings.toFixed(2)}/month in potential savings. ` +
      `Top recommendation: ${top.recommendedAction} for ${top.tool} saving $${top.monthlySavings.toFixed(2)}/month. ` +
      `Be specific, warm, and actionable. End with one sentence about what they could do with the ` +
      `$${totalAnnualSavings.toFixed(2)} in annual savings.`;
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 200,
      system:
        'You are a concise financial advisor for tech startups. Write in second person, plain English, no jargon.',
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'unknown error');
    throw new Error(`Anthropic API error ${response.status}: ${errorText}`);
  }

  const data = (await response.json()) as {
    content?: Array<{ type: string; text?: string }>;
  };

  const text = data.content?.find((block) => block.type === 'text')?.text;

  if (!text) {
    throw new Error('Anthropic response contained no text content');
  }

  return text.trim();
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(
  request: Request,
): Promise<NextResponse<SummaryResponse>> {
  let auditResult: AuditResult;

  // 1. Parse and validate the request body
  try {
    const body: SummaryRequestBody = await request.json();

    if (!body?.auditResult) {
      return NextResponse.json({
        summary: 'Unable to generate summary: missing audit data.',
      });
    }

    auditResult = body.auditResult;
  } catch {
    return NextResponse.json({
      summary: 'Unable to generate summary: invalid request body.',
    });
  }

  // 2. Attempt the Anthropic call — only if a key is configured
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (apiKey && apiKey.trim().length > 0) {
    try {
      const summary = await fetchAnthropicSummary(auditResult, apiKey.trim());
      return NextResponse.json({ summary });
    } catch (err) {
      // Log server-side only — never surface API errors to the client
      console.error('[summary] Anthropic API call failed, using fallback:', err);
    }
  } else {
    console.warn(
      '[summary] ANTHROPIC_API_KEY is not set — returning fallback summary.',
    );
  }

  // 3. Always return a summary — never an error response
  return NextResponse.json({ summary: buildFallbackSummary(auditResult) });
}
