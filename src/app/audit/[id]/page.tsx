import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { AuditResult, AITool } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuditRow {
  id: string;
  input: AuditResult['input'];
  recommendations: AuditResult['recommendations'];
  total_monthly_savings: number;
  total_annual_savings: number;
  is_optimal: boolean;
  created_at: string;
  ai_summary: string | null;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

// ─── Data fetching ────────────────────────────────────────────────────────────

async function getAudit(id: string): Promise<AuditResult | null> {
  const { data, error } = await supabase
    .from('audits')
    .select(
      'id, input, recommendations, total_monthly_savings, total_annual_savings, is_optimal, created_at, ai_summary',
    )
    .eq('id', id)
    .single<AuditRow>();

  if (error || !data) return null;

  return {
    id: data.id,
    input: data.input,
    recommendations: data.recommendations,
    totalMonthlySavings: data.total_monthly_savings,
    totalAnnualSavings: data.total_annual_savings,
    isOptimal: data.is_optimal,
    createdAt: data.created_at,
    aiSummary: data.ai_summary ?? undefined,
  };
}

// ─── Open Graph metadata ──────────────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const audit = await getAudit(id);

  if (!audit) {
    return {
      title: 'Audit Not Found — AI Spend Audit',
      description: 'This audit link has expired or does not exist.',
    };
  }

  const savings = audit.totalMonthlySavings;
  const title =
    savings > 0
      ? `I found $${fmt(savings)}/mo in AI spend savings`
      : 'My AI spend is fully optimized';

  return {
    title,
    description:
      'Free AI Spend Audit by Credex — see where your team is overpaying for AI tools.',
    openGraph: {
      title,
      description:
        'Free AI Spend Audit by Credex — see where your team is overpaying for AI tools.',
      type: 'website',
      // og:image — dynamic URL added in a future iteration
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description:
        'Free AI Spend Audit by Credex — see where your team is overpaying for AI tools.',
    },
  };
}

// Force dynamic rendering so each page reflects the latest DB state
export const dynamic = 'force-dynamic';

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function SharedAuditPage({ params }: PageProps) {
  const { id } = await params;
  const audit = await getAudit(id);

  if (!audit) {
    notFound();
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f9fafb 100%)',
        padding: '40px 16px 64px',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        color: '#111827',
      }}
    >
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        {/* ── Banner ──────────────────────────────────── */}
        <div
          style={{
            background: 'linear-gradient(135deg, #065f46, #047857)',
            borderRadius: 16,
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            marginBottom: 28,
            boxShadow: '0 4px 20px rgba(16,185,129,0.25)',
          }}
        >
          <div>
            <p
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#a7f3d0',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: 4,
              }}
            >
              Shared Audit Result
            </p>
            <p style={{ fontSize: 15, color: '#fff', fontWeight: 500 }}>
              Run your own free audit to see your savings
            </p>
          </div>
          <Link
            href="/"
            style={{
              background: '#fff',
              color: '#065f46',
              fontWeight: 700,
              fontSize: 14,
              padding: '10px 20px',
              borderRadius: 10,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              transition: 'opacity 0.15s',
            }}
          >
            Run your own free audit →
          </Link>
        </div>

        {/* ── Read-only audit result ───────────────────── */}
        <ReadOnlyAuditResults audit={audit} />

        {/* ── Bottom CTA ─────────────────────────────── */}
        <div
          style={{
            textAlign: 'center',
            marginTop: 32,
            padding: '28px 24px',
            background: '#fff',
            borderRadius: 20,
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
          }}
        >
          <p style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
            Is your team overpaying for AI tools?
          </p>
          <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 20 }}>
            It takes under 2 minutes to find out. No sign-up required.
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#fff',
              fontWeight: 700,
              fontSize: 15,
              padding: '14px 32px',
              borderRadius: 12,
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(16,185,129,0.35)',
            }}
          >
            Run your own free audit →
          </Link>
          <p style={{ fontSize: 12, color: '#d1d5db', marginTop: 16 }}>
            Powered by{' '}
            <a
              href="https://credex.rocks"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#10b981', textDecoration: 'none', fontWeight: 600 }}
            >
              Credex
            </a>{' '}
            · credex.rocks
          </p>
        </div>
      </div>
    </main>
  );
}

// ─── 404 page ─────────────────────────────────────────────────────────────────

// Next.js renders this automatically when notFound() is called.
// We customise it via a not-found.tsx sibling file (see below).

// ─── Read-only results view ───────────────────────────────────────────────────

const TOOL_NAMES: Record<AITool, string> = {
  cursor: 'Cursor',
  'github-copilot': 'GitHub Copilot',
  claude: 'Claude (Anthropic)',
  chatgpt: 'ChatGPT',
  'anthropic-api': 'Anthropic API',
  'openai-api': 'OpenAI API',
  gemini: 'Google Gemini',
  windsurf: 'Windsurf',
};

function fmt(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function ReadOnlyAuditResults({ audit }: { audit: AuditResult }) {
  return (
    <div>
      {/* ── Hero ──────────────────────────────────────── */}
      <div
        style={{
          background: '#fff',
          border: '1px solid #d1fae5',
          borderRadius: 24,
          padding: '48px 32px 40px',
          textAlign: 'center',
          marginBottom: 16,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
        }}
      >
        <div
          style={{
            position: 'absolute', top: -60, right: -60,
            width: 220, height: 220,
            borderRadius: '50%',
            background: 'rgba(16,185,129,0.08)',
          }}
        />
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#10b981',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 12,
          }}
        >
          AI Spend Audit Complete
        </p>
        <p
          style={{
            fontSize: 'clamp(52px, 10vw, 72px)',
            fontWeight: 800,
            color: '#10b981',
            lineHeight: 1,
            marginBottom: 8,
          }}
        >
          Save ${fmt(audit.totalMonthlySavings)}/mo
        </p>
        <p style={{ fontSize: 20, color: '#6b7280', fontWeight: 500 }}>
          ${fmt(audit.totalAnnualSavings)} saved annually
        </p>
      </div>

      {/* ── Stats ─────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
          marginBottom: 16,
        }}
      >
        {[
          { label: 'Tools Analyzed', value: audit.recommendations.length },
          { label: 'Monthly Savings', value: `$${fmt(audit.totalMonthlySavings)}` },
          { label: 'Annual Savings', value: `$${fmt(audit.totalAnnualSavings)}` },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 16,
              padding: '20px 16px',
              textAlign: 'center',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            }}
          >
            <p style={{ fontSize: 'clamp(22px,4vw,28px)', fontWeight: 800, color: '#10b981' }}>
              {stat.value}
            </p>
            <p style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500, marginTop: 4 }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Per-tool breakdown ─────────────────────────── */}
      <Section title="Per-Tool Breakdown">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {audit.recommendations.map((rec, i) => (
            <div
              key={i}
              style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: 16,
                padding: '20px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: 10,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: 16, color: '#111827', marginBottom: 6 }}>
                    {TOOL_NAMES[rec.tool]}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      flexWrap: 'wrap',
                      marginBottom: 8,
                    }}
                  >
                    <PlanBadge label={rec.currentPlan} />
                    <span style={{ color: '#9ca3af', fontSize: 14 }}>→</span>
                    <PlanBadge label={rec.recommendedPlan ?? rec.recommendedAction} accent />
                  </div>
                  <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#6b7280', flexWrap: 'wrap' }}>
                    <span>
                      Current: <b style={{ color: '#374151' }}>${fmt(rec.currentSpend)}/mo</b>
                    </span>
                    {rec.monthlySavings > 0 && (
                      <span>
                        New: <b style={{ color: '#374151' }}>${fmt(rec.estimatedNewSpend)}/mo</b>
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 8, lineHeight: 1.5 }}>
                    {rec.reason}
                  </p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  {rec.monthlySavings > 0 ? (
                    <span
                      style={{
                        display: 'inline-block',
                        background: '#ecfdf5',
                        color: '#065f46',
                        fontWeight: 700,
                        fontSize: 13,
                        padding: '5px 12px',
                        borderRadius: 20,
                        border: '1px solid #a7f3d0',
                      }}
                    >
                      −${fmt(rec.monthlySavings)}/mo
                    </span>
                  ) : (
                    <span style={{ fontSize: 13, color: '#10b981', fontWeight: 600 }}>
                      ✓ Optimized
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── AI Summary ────────────────────────────────── */}
      {audit.aiSummary && (
        <div
          style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 20,
            padding: '24px',
            marginBottom: 16,
            boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
          }}
        >
          <h2
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: '#111827',
              marginBottom: 18,
              paddingBottom: 14,
              borderBottom: '1px solid #f3f4f6',
            }}
          >
            Your Personalized Insight
          </h2>
          <div
            style={{
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: 14,
              padding: '20px 22px',
              fontSize: 15,
              lineHeight: 1.7,
              color: '#374151',
            }}
          >
            {audit.aiSummary}
          </div>
        </div>
      )}

      {/* ── Audit date ────────────────────────────────── */}
      <p
        style={{
          textAlign: 'center',
          fontSize: 12,
          color: '#d1d5db',
          marginTop: 8,
          marginBottom: 4,
        }}
      >
        Audit generated {new Date(audit.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 20,
        padding: '24px',
        marginBottom: 16,
        boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
      }}
    >
      <h2
        style={{
          fontSize: 17,
          fontWeight: 700,
          color: '#111827',
          marginBottom: 18,
          paddingBottom: 14,
          borderBottom: '1px solid #f3f4f6',
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

function PlanBadge({ label, accent = false }: { label: string; accent?: boolean }) {
  return (
    <span
      style={{
        display: 'inline-block',
        background: accent ? '#ecfdf5' : '#f9fafb',
        color: accent ? '#065f46' : '#374151',
        border: `1px solid ${accent ? '#a7f3d0' : '#e5e7eb'}`,
        borderRadius: 8,
        padding: '3px 10px',
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {label}
    </span>
  );
}
