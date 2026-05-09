'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import SpendForm from '@/components/form/SpendForm';
import AuditResults from '@/components/results/AuditResults';
import { runAudit } from '@/lib/auditEngine';
import type { AuditInput, AuditResult } from '@/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Step 1 — POST to /api/summary with a preliminary (client-side) AuditResult.
 * Returns the summary string, or an empty string on failure.
 * Never throws.
 */
async function fetchSummary(preliminaryResult: AuditResult): Promise<string> {
  try {
    const res = await fetch('/api/summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ auditResult: preliminaryResult }),
    });
    if (!res.ok) return '';
    const { summary } = (await res.json()) as { summary: string };
    return summary ?? '';
  } catch {
    return '';
  }
}

/**
 * Step 2 — POST to /api/audit with the AuditInput + pre-fetched summary.
 * Runs the engine server-side, persists to Supabase (with ai_summary), and
 * returns the full AuditResult.
 * Throws on non-2xx so the caller can fall back to the client-side engine.
 */
async function saveAudit(
  input: AuditInput,
  aiSummary: string,
): Promise<AuditResult> {
  const res = await fetch('/api/audit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input, aiSummary: aiSummary || undefined }),
  });
  if (!res.ok) throw new Error(`/api/audit returned ${res.status}`);
  return res.json() as Promise<AuditResult>;
}


// ─── Loading spinner ──────────────────────────────────────────────────────────

function LoadingState() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
    >
      <div style={{ textAlign: 'center' }}>
        {/* Spinner */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            border: '3px solid #d1fae5',
            borderTopColor: '#10b981',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 20px',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

        <p
          style={{
            fontSize: 16,
            color: '#6b7280',
            fontWeight: 500,
            letterSpacing: '-0.01em',
          }}
        >
          Analyzing your AI spend…
        </p>
      </div>
    </main>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const router = useRouter();
  const [result, setResult] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (input: AuditInput) => {
      setLoading(true);

      try {
        // Step 1: Run audit client-side (no network, instant) to build the
        // data shape needed for the summary prompt.
        const preliminary = runAudit(input);

        // Step 2: Fetch AI summary using the preliminary result.
        // Never throws — returns '' on any failure.
        const aiSummary = await fetchSummary(preliminary);

        // Step 3: Save audit server-side (persists to Supabase with summary).
        // Falls back to the client-side result if the API is unavailable.
        let auditResult: AuditResult;
        try {
          auditResult = await saveAudit(input, aiSummary);
          // Attach the summary to the returned object (API doesn't echo it back
          // in the response body, but we have it from Step 2).
          auditResult = { ...auditResult, aiSummary: aiSummary || undefined };
        } catch (apiErr) {
          console.warn('[Home] /api/audit failed, using client-side result:', apiErr);
          // Fallback: use the preliminary result with summary already attached.
          auditResult = { ...preliminary, aiSummary: aiSummary || undefined };
        }

        // Step 4: Render results and push shareable URL.
        setResult(auditResult);
        router.push(`/audit/${auditResult.id}`, { scroll: false });
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  const handleReset = useCallback(() => {
    setResult(null);
    router.push('/', { scroll: false });
  }, [router]);

  // ── Render states ──────────────────────────────────────────────────────────

  if (loading) {
    return <LoadingState />;
  }

  if (result) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <AuditResults result={result} onReset={handleReset} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <SpendForm onSubmit={handleSubmit} />
    </main>
  );
}