'use client';

import { useState } from 'react';
import { AuditResult, AITool } from '@/types';

interface AuditResultsProps {
  result: AuditResult;
  onReset: () => void;
}

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

export default function AuditResults({ result, onReset }: AuditResultsProps) {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [leadStatus, setLeadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/audit/${result.id}`
      : `/audit/${result.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleLeadSubmit = async () => {
    if (!email.trim()) return;
    setLeadStatus('loading');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          companyName: company,
          role,
          auditId: result.id,
          totalMonthlySavings: result.totalMonthlySavings,
          toolsAudited: result.recommendations.map((r) => r.tool),
        }),
      });
      if (!res.ok) throw new Error('Failed');
      setLeadStatus('success');
    } catch {
      setLeadStatus('error');
    }
  };

  const showCredex = result.totalMonthlySavings > 500;
  const showOptimal = result.totalMonthlySavings < 100 || result.isOptimal;

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", color: '#111827' }}>
      {/* ── HERO ─────────────────────────────────────── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f9fafb 100%)',
          borderRadius: 24,
          padding: '48px 32px 40px',
          textAlign: 'center',
          border: '1px solid #d1fae5',
          marginBottom: 24,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative ring */}
        <div
          style={{
            position: 'absolute', top: -60, right: -60,
            width: 220, height: 220,
            borderRadius: '50%',
            background: 'rgba(16,185,129,0.08)',
          }}
        />
        <p style={{ fontSize: 13, fontWeight: 600, color: '#10b981', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
          AI Spend Audit Complete
        </p>
        <p style={{ fontSize: 'clamp(52px, 10vw, 72px)', fontWeight: 800, color: '#10b981', lineHeight: 1, marginBottom: 8 }}>
          Save ${fmt(result.totalMonthlySavings)}/mo
        </p>
        <p style={{ fontSize: 20, color: '#6b7280', fontWeight: 500, marginBottom: 32 }}>
          ${fmt(result.totalAnnualSavings)} saved annually
        </p>

        {showCredex && (
          <div
            style={{
              background: 'linear-gradient(135deg, #065f46, #047857)',
              borderRadius: 16,
              padding: '20px 24px',
              color: '#fff',
              maxWidth: 480,
              margin: '0 auto',
              boxShadow: '0 8px 24px rgba(16,185,129,0.3)',
            }}
          >
            <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>
              🎯 You qualify for a Credex consultation — get these savings guaranteed
            </p>
            <a
              href="https://credex.rocks"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                background: '#fff',
                color: '#065f46',
                fontWeight: 700,
                fontSize: 14,
                padding: '10px 24px',
                borderRadius: 10,
                textDecoration: 'none',
                transition: 'opacity 0.15s',
              }}
            >
              Book Free Consultation →
            </a>
          </div>
        )}

        {showOptimal && (
          <div
            style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: 12,
              padding: '14px 20px',
              maxWidth: 440,
              margin: '0 auto',
              color: '#166534',
              fontSize: 15,
              fontWeight: 500,
            }}
          >
            ✅ You&apos;re spending well. We&apos;ll notify you when optimizations apply.
          </div>
        )}
      </div>

      {/* ── SUMMARY STATS BAR ───────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
          marginBottom: 24,
        }}
      >
        {[
          { label: 'Tools Analyzed', value: result.recommendations.length },
          { label: 'Monthly Savings', value: `$${fmt(result.totalMonthlySavings)}` },
          { label: 'Annual Savings', value: `$${fmt(result.totalAnnualSavings)}` },
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

      {/* ── PER-TOOL BREAKDOWN ──────────────────────── */}
      <Section title="Per-Tool Breakdown">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {result.recommendations.map((rec, i) => (
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: 16, color: '#111827', marginBottom: 6 }}>
                    {TOOL_NAMES[rec.tool]}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                    <PlanBadge label={rec.currentPlan} />
                    <span style={{ color: '#9ca3af', fontSize: 14 }}>→</span>
                    <PlanBadge label={rec.recommendedPlan ?? rec.recommendedAction} accent />
                  </div>
                  <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#6b7280', flexWrap: 'wrap' }}>
                    <span>Current: <b style={{ color: '#374151' }}>${fmt(rec.currentSpend)}/mo</b></span>
                    {rec.monthlySavings > 0 && (
                      <span>New: <b style={{ color: '#374151' }}>${fmt(rec.estimatedNewSpend)}/mo</b></span>
                    )}
                  </div>
                  <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 8, lineHeight: 1.5 }}>{rec.reason}</p>
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
                    <span style={{ fontSize: 13, color: '#10b981', fontWeight: 600 }}>✓ Optimized</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── AI SUMMARY ──────────────────────────────── */}
      <Section title="Your Personalized Insight">
        {result.aiSummary ? (
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
            {result.aiSummary}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[85, 65, 45].map((w, i) => (
              <div
                key={i}
                style={{
                  height: 14,
                  width: `${w}%`,
                  borderRadius: 8,
                  background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                }}
              />
            ))}
            <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
          </div>
        )}
      </Section>

      {/* ── LEAD CAPTURE ────────────────────────────── */}
      <Section title="Get Your Full Report by Email">
        {leadStatus === 'success' ? (
          <div
            style={{
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: 14,
              padding: '20px 24px',
              textAlign: 'center',
              color: '#065f46',
              fontWeight: 600,
              fontSize: 16,
            }}
          >
            ✅ Report sent! Check your inbox.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              type="email"
              placeholder="your@email.com *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <input
                type="text"
                placeholder="Company (optional)"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Role (optional)"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={inputStyle}
              />
            </div>
            {leadStatus === 'error' && (
              <p style={{ color: '#dc2626', fontSize: 13 }}>Something went wrong. Please try again.</p>
            )}
            <button
              onClick={handleLeadSubmit}
              disabled={leadStatus === 'loading' || !email.trim()}
              style={{
                background: leadStatus === 'loading' || !email.trim() ? '#d1fae5' : 'linear-gradient(135deg, #10b981, #059669)',
                color: leadStatus === 'loading' || !email.trim() ? '#6b7280' : '#fff',
                border: 'none',
                borderRadius: 12,
                padding: '14px 24px',
                fontSize: 15,
                fontWeight: 700,
                cursor: leadStatus === 'loading' || !email.trim() ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: email.trim() ? '0 4px 14px rgba(16,185,129,0.35)' : 'none',
              }}
            >
              {leadStatus === 'loading' ? 'Sending…' : 'Send My Report →'}
            </button>
            <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center' }}>
              For high-savings audits, a Credex advisor will reach out.
            </p>
          </div>
        )}
      </Section>

      {/* ── SHARE ───────────────────────────────────── */}
      <Section title="Share Your Audit">
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div
            style={{
              flex: 1,
              minWidth: 0,
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: 10,
              padding: '11px 16px',
              fontSize: 13,
              color: '#374151',
              fontFamily: 'monospace',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {shareUrl}
          </div>
          <button
            onClick={handleCopy}
            style={{
              background: copied ? '#ecfdf5' : '#fff',
              border: `1px solid ${copied ? '#a7f3d0' : '#e5e7eb'}`,
              color: copied ? '#065f46' : '#374151',
              borderRadius: 10,
              padding: '11px 18px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s',
            }}
          >
            {copied ? '✓ Copied!' : 'Copy Link'}
          </button>
        </div>
      </Section>

      {/* ── FOOTER ──────────────────────────────────── */}
      <div style={{ textAlign: 'center', marginTop: 32, paddingBottom: 16 }}>
        <button
          onClick={onReset}
          style={{
            background: 'none',
            border: '1px solid #e5e7eb',
            borderRadius: 10,
            padding: '10px 22px',
            fontSize: 14,
            color: '#6b7280',
            cursor: 'pointer',
            fontWeight: 500,
            marginBottom: 16,
            transition: 'border-color 0.15s, color 0.15s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#10b981';
            (e.currentTarget as HTMLButtonElement).style.color = '#10b981';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#e5e7eb';
            (e.currentTarget as HTMLButtonElement).style.color = '#6b7280';
          }}
        >
          ← Run Another Audit
        </button>
        <p style={{ fontSize: 12, color: '#d1d5db' }}>
          Powered by{' '}
          <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer" style={{ color: '#10b981', textDecoration: 'none', fontWeight: 600 }}>
            Credex
          </a>
          {' '}· credex.rocks
        </p>
      </div>
    </div>
  );
}

/* ── Sub-components ──────────────────────────────── */

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

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  fontSize: 14,
  border: '1px solid #e5e7eb',
  borderRadius: 10,
  outline: 'none',
  background: '#fff',
  color: '#111827',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
};
