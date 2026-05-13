'use client';

import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { AuditResult } from '@/types';
import { TOOL_NAMES, fmt, Section, PlanBadge } from '@/components/ui/shared';

interface AuditResultsProps {
  result: AuditResult;
  onReset: () => void;
}

export default function AuditResults({ result, onReset }: AuditResultsProps) {
  const [copied, setCopied] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Lead form state
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleDownloadReport = async () => {
    if (!reportRef.current) return;
    setDownloadingPdf(true);
    
    try {
      // 1. Capture the element
      const element = reportRef.current;
      
      // 2. Temporarily hide "no-print" elements for a cleaner PDF
      const noPrintElements = element.querySelectorAll('.no-print');
      noPrintElements.forEach(el => (el as HTMLElement).style.display = 'none');
      
      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });
      
      // Restore elements
      noPrintElements.forEach(el => (el as HTMLElement).style.display = '');

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`ai-spend-audit-${result.id.slice(0, 8)}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
      // Fallback to link sharing if PDF fails
      alert('PDF generation failed. Please use the Copy Link option to share.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleSubmitLead = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid work email.');
      return;
    }
    setError(null);
    setSubmitting(true);

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
          toolsAudited: result.recommendations.map(r => r.tool),
          website: honeypot // Honeypot
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save lead');
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error('Lead submission failed:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const showCredex = result.totalMonthlySavings > 500;
  const showOptimal = result.totalMonthlySavings < 100 || result.isOptimal;

  return (
    <div ref={reportRef} style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", color: '#111827' }}>
      {/* ── HERO ─────────────────────────────────────── */}
      <div
        className="animate-fade-in-up animate-pulse-glow"
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
        <div
          style={{
            position: 'absolute', top: -60, right: -60,
            width: 220, height: 220, borderRadius: '50%',
            background: 'rgba(16,185,129,0.08)',
          }}
        />
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(16,185,129,0.05)' }} />
        <p style={{ fontSize: 13, fontWeight: 600, color: '#10b981', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
          AI Spend Audit Complete
        </p>
        <p className="animate-count-up" style={{ fontSize: 'clamp(52px, 10vw, 72px)', fontWeight: 800, color: '#10b981', lineHeight: 1, marginBottom: 8 }}>
          Save ${fmt(result.totalMonthlySavings)}/mo
        </p>
        <p style={{ fontSize: 20, color: '#6b7280', fontWeight: 500, marginBottom: 32 }}>
          ${fmt(result.totalAnnualSavings)} saved annually
        </p>

        {showCredex && (
          <div style={{ background: 'linear-gradient(135deg, #065f46, #047857)', borderRadius: 16, padding: '20px 24px', color: '#fff', maxWidth: 480, margin: '0 auto', boxShadow: '0 8px 24px rgba(16,185,129,0.3)' }}>
            <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>
              🎯 You qualify for a Credex consultation — get these savings guaranteed
            </p>
            <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: '#fff', color: '#065f46', fontWeight: 700, fontSize: 14, padding: '10px 24px', borderRadius: 10, textDecoration: 'none' }}>
              Book Free Consultation →
            </a>
          </div>
        )}

        {showOptimal && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '14px 20px', maxWidth: 440, margin: '0 auto', color: '#166534', fontSize: 15, fontWeight: 500 }}>
            ✅ You&apos;re spending well. We&apos;ll notify you when optimizations apply.
          </div>
        )}
      </div>

      {/* ── SUMMARY STATS BAR ───────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Tools Analyzed', value: result.recommendations.length, icon: '🛠️' },
          { label: 'Monthly Savings', value: `$${fmt(result.totalMonthlySavings)}`, icon: '💰' },
          { label: 'Annual Savings', value: `$${fmt(result.totalAnnualSavings)}`, icon: '📈' },
        ].map((stat, i) => (
          <div key={stat.label} className={`card-premium animate-fade-in-up delay-${(i + 1) * 100}`} style={{ padding: '20px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{stat.icon}</div>
            <p className="animate-count-up" style={{ fontSize: 'clamp(22px,4vw,28px)', fontWeight: 800, color: '#10b981' }}>
              {stat.value}
            </p>
            <p style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500, marginTop: 4 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── PER-TOOL BREAKDOWN ──────────────────────── */}
      <Section title="Per-Tool Breakdown">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {result.recommendations.map((rec, i) => (
            <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${0.1 * i}s`, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'all 0.2s', }}>
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
                    <span style={{ display: 'inline-block', background: '#ecfdf5', color: '#065f46', fontWeight: 700, fontSize: 13, padding: '5px 12px', borderRadius: 20, border: '1px solid #a7f3d0' }}>
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
          <div style={{ background: 'linear-gradient(135deg, #f9fafb, #f0fdf4)', border: '1px solid #e5e7eb', borderRadius: 14, padding: '20px 22px', fontSize: 15, lineHeight: 1.7, color: '#374151' }}>
            {result.aiSummary}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[85, 65, 45].map((w, i) => (
              <div key={i} style={{ height: 14, width: `${w}%`, borderRadius: 8, background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
            ))}
          </div>
        )}
      </Section>

      {/* ── DOWNLOAD & SHARE ────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <button
          onClick={handleDownloadReport}
          disabled={downloadingPdf}
          className="btn-primary no-print"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            padding: '16px',
            fontSize: 15,
            opacity: downloadingPdf ? 0.7 : 1,
            borderRadius: 16,
          }}
        >
          <span style={{ fontSize: 20 }}>📄</span>
          {downloadingPdf ? 'Preparing…' : 'Download PDF'}
        </button>

        <button
          onClick={handleCopy}
          className="no-print"
          style={{
            background: copied ? '#ecfdf5' : '#fff',
            border: `1px solid ${copied ? '#a7f3d0' : '#e5e7eb'}`,
            color: copied ? '#065f46' : '#374151',
            borderRadius: 16,
            padding: '16px',
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            transition: 'all 0.15s',
          }}
        >
          <span style={{ fontSize: 20 }}>{copied ? '✓' : '🔗'}</span>
          {copied ? 'Link Copied!' : 'Copy Share Link'}
        </button>
      </div>

      {/* ── LEAD CAPTURE ────────────────────────────── */}
      <Section title="Unlock Guaranteed Savings" className="no-print">
        {submitted ? (
          <div className="animate-fade-in" style={{ textAlign: 'center', padding: '32px 0', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 16 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🚀</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#166534', marginBottom: 8 }}>Success!</h3>
            <p style={{ fontSize: 14, color: '#166534', maxWidth: 300, margin: '0 auto' }}>
              We&apos;ve stored your results. A Credex expert will review your audit and reach out if you qualify for deeper savings.
            </p>
          </div>
        ) : (
          <div className="card-premium" style={{ padding: '24px' }}>
            <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 20, lineHeight: 1.5 }}>
              Enter your work email to store this report and unlock a <b>guaranteed optimization roadmap</b> from Credex.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                type="email"
                placeholder="Work email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-premium"
                style={{ fontSize: 14 }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <input
                  type="text"
                  placeholder="Company name"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  className="input-premium"
                  style={{ fontSize: 13 }}
                />
                <input
                  type="text"
                  placeholder="Your role (e.g. EM)"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="input-premium"
                  style={{ fontSize: 13 }}
                />
              </div>
              {/* Honeypot */}
              <input type="text" style={{ display: 'none' }} value={honeypot} onChange={e => setHoneypot(e.target.value)} />
              
              <button
                onClick={handleSubmitLead}
                disabled={submitting}
                className="btn-primary"
                style={{ width: '100%', marginTop: 8, opacity: submitting ? 0.7 : 1 }}
              >
                {submitting ? 'Saving...' : 'Get Optimization Roadmap →'}
              </button>
              {error && <p style={{ fontSize: 12, color: '#ef4444', textAlign: 'center', marginTop: 4 }}>{error}</p>}
              <p style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center', marginTop: 8 }}>
                🔒 Your data is never shared. Unsubscribe anytime.
              </p>
            </div>
          </div>
        )}
      </Section>

      {/* ── FOOTER ──────────────────────────────────── */}
      <div className="no-print" style={{ textAlign: 'center', marginTop: 32, paddingBottom: 16 }}>
        <button
          onClick={onReset}
          style={{
            background: 'none', border: '1px solid #e5e7eb', borderRadius: 10,
            padding: '10px 22px', fontSize: 14, color: '#6b7280', cursor: 'pointer',
            fontWeight: 500, marginBottom: 16, transition: 'border-color 0.15s, color 0.15s',
          }}
          onMouseEnter={(e) => { (e.currentTarget).style.borderColor = '#10b981'; (e.currentTarget).style.color = '#10b981'; }}
          onMouseLeave={(e) => { (e.currentTarget).style.borderColor = '#e5e7eb'; (e.currentTarget).style.color = '#6b7280'; }}
        >
          ← Run Another Audit
        </button>
        <p style={{ fontSize: 12, color: '#d1d5db' }}>
          Powered by{' '}
          <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer" style={{ color: '#10b981', textDecoration: 'none', fontWeight: 600 }}>Credex</a>
          {' '}· credex.rocks
        </p>
      </div>
    </div>
  );
}
