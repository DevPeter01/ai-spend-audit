import React from 'react';
import type { AITool } from '@/types';

// ─── Shared constants ─────────────────────────────────────────────────────────

export const TOOL_NAMES: Record<AITool, string> = {
  cursor: 'Cursor',
  'github-copilot': 'GitHub Copilot',
  claude: 'Claude (Anthropic)',
  chatgpt: 'ChatGPT',
  'anthropic-api': 'Anthropic API',
  'openai-api': 'OpenAI API',
  gemini: 'Google Gemini',
  windsurf: 'Windsurf',
};

// ─── Shared helpers ───────────────────────────────────────────────────────────

/** Format a number as a rounded, locale-aware dollar amount (no decimals). */
export function fmt(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

// ─── Shared sub-components ────────────────────────────────────────────────────

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
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

export function PlanBadge({ label, accent = false }: { label: string; accent?: boolean }) {
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
