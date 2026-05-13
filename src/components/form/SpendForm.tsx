'use client';

import { useState, useEffect } from 'react';
import { AuditInput, ToolEntry, AITool, UseCaseType } from '@/types';
import { PRICING_DATA } from '@/lib/pricingData';

const TOOLS_CONFIG = [
  { id: 'cursor', label: 'Cursor', icon: '⚡', plans: ['Hobby', 'Pro', 'Business', 'Enterprise'] },
  { id: 'github-copilot', label: 'GitHub Copilot', icon: '🤖', plans: ['Individual', 'Business', 'Enterprise'] },
  { id: 'claude', label: 'Claude', icon: '🧠', plans: ['Free', 'Pro', 'Max', 'Team', 'Enterprise'] },
  { id: 'chatgpt', label: 'ChatGPT', icon: '💬', plans: ['Free', 'Plus', 'Team', 'Enterprise'] },
  { id: 'anthropic-api', label: 'Anthropic API (direct)', icon: '🔌', plans: ['Pay as you go'] },
  { id: 'openai-api', label: 'OpenAI API (direct)', icon: '🔗', plans: ['Pay as you go'] },
  { id: 'gemini', label: 'Gemini', icon: '✨', plans: ['Free', 'Pro', 'Ultra'] },
  { id: 'windsurf', label: 'Windsurf', icon: '🏄', plans: ['Free', 'Pro', 'Team'] },
];

const USE_CASES: { value: UseCaseType; label: string }[] = [
  { value: 'coding', label: '💻 Coding' },
  { value: 'writing', label: '✍️ Writing' },
  { value: 'data', label: '📊 Data Analysis' },
  { value: 'research', label: '🔬 Research' },
  { value: 'mixed', label: '🔀 Mixed' },
];

const STORAGE_KEY = 'ai-audit-form-state';

interface SpendFormProps {
  onSubmit: (input: AuditInput) => void;
}

function getDefaultSpend(toolId: string, plan: string): number {
  const pricing = PRICING_DATA[toolId as AITool];
  const planInfo = pricing?.plans.find(p => p.name === plan);
  return planInfo?.pricePerUserPerMonth ?? 0;
}

export default function SpendForm({ onSubmit }: SpendFormProps) {
  const [teamSize, setTeamSize] = useState(1);
  const [useCase, setUseCase] = useState<UseCaseType>('mixed');
  const [enabledTools, setEnabledTools] = useState<Record<string, boolean>>({});
  const [toolEntries, setToolEntries] = useState<Record<string, ToolEntry>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [formError, setFormError] = useState<string>('');
  const [hasRestoredData, setHasRestoredData] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const hadData = Object.keys(parsed.enabledTools || {}).some(k => parsed.enabledTools[k]);
        /* eslint-disable react-hooks/set-state-in-effect */
        setTeamSize(parsed.teamSize || 1);
        setUseCase(parsed.useCase || 'mixed');
        setEnabledTools(parsed.enabledTools || {});
        setToolEntries(parsed.toolEntries || {});
        setHasRestoredData(hadData);
        /* eslint-enable react-hooks/set-state-in-effect */
      } catch (e) {
        console.error('Failed to parse saved state', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ teamSize, useCase, enabledTools, toolEntries }));
    }
  }, [teamSize, useCase, enabledTools, toolEntries, isLoaded]);

  const toggleTool = (toolId: string, plans: string[]) => {
    setFormError('');
    setEnabledTools(prev => {
      const isEnabled = !prev[toolId];
      if (isEnabled && !toolEntries[toolId]) {
        setToolEntries(t => ({
          ...t,
          [toolId]: { tool: toolId as AITool, plan: plans[0], monthlySpend: 0, seats: 1 },
        }));
      }
      return { ...prev, [toolId]: isEnabled };
    });
  };

  const updateEntry = (toolId: string, field: keyof ToolEntry, value: string | number) => {
    setToolEntries(prev => {
      if (!prev[toolId]) return prev;
      return { ...prev, [toolId]: { ...prev[toolId], [field]: value } };
    });
  };

  const handleClearForm = () => {
    setTeamSize(1);
    setUseCase('mixed');
    setEnabledTools({});
    setToolEntries({});
    setFormError('');
    setHasRestoredData(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleSubmit = () => {
    const tools = Object.entries(toolEntries)
      .filter(([id]) => enabledTools[id])
      .map(([, entry]) => entry);
    if (tools.length === 0) {
      setFormError('Please add at least one AI tool.');
      return;
    }
    setFormError('');
    onSubmit({ tools, teamSize, useCase });
  };

  const enabledCount = Object.values(enabledTools).filter(Boolean).length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      {/* ── Hero Header ───────────────────────────────────── */}
      <div
        className="animate-fade-in-up"
        style={{
          textAlign: 'center',
          padding: '48px 24px 40px',
          marginBottom: 32,
          position: 'relative',
        }}
      >
        {/* Decorative background elements */}
        <div
          style={{
            position: 'absolute',
            top: -20,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          className="animate-float"
          style={{
            fontSize: 48,
            marginBottom: 16,
            display: 'inline-block',
          }}
        >
          💰
        </div>
        <h1
          style={{
            fontSize: 'clamp(28px, 5vw, 40px)',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #065f46, #10b981)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 12,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
          }}
        >
          AI Spend Audit
        </h1>
        <p
          style={{
            fontSize: 17,
            color: '#6b7280',
            fontWeight: 400,
            maxWidth: 460,
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          Find out where your team is overpaying for AI tools.{' '}
          <span style={{ color: '#10b981', fontWeight: 600 }}>Free, instant, no login required.</span>
        </p>
      </div>

      {/* ── Restored Data Banner ──────────────────────────── */}
      {hasRestoredData && (
        <div
          className="animate-fade-in"
          style={{
            background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
            border: '1px solid #fde68a',
            borderRadius: 14,
            padding: '14px 20px',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>📋</span>
            <span style={{ fontSize: 14, color: '#92400e', fontWeight: 500 }}>
              We restored your previous audit data
            </span>
          </div>
          <button
            onClick={handleClearForm}
            style={{
              background: 'rgba(146, 64, 14, 0.1)',
              border: '1px solid rgba(146, 64, 14, 0.2)',
              color: '#92400e',
              fontSize: 13,
              fontWeight: 600,
              padding: '6px 14px',
              borderRadius: 8,
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            Start Fresh
          </button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* ── Team Info Card ─────────────────────────────── */}
        <div
          className="card-premium animate-fade-in-up delay-100"
          style={{ padding: '28px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
              }}
            >
              👥
            </div>
            <h2 style={{ fontWeight: 700, fontSize: 18, color: '#111827', letterSpacing: '-0.01em' }}>
              Your Team
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: 6,
                  letterSpacing: '0.01em',
                }}
              >
                Team size
              </label>
              <input
                type="number"
                min={1}
                value={teamSize}
                placeholder="e.g. 5"
                onChange={e => setTeamSize(Number(e.target.value))}
                className="input-premium"
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: 6,
                  letterSpacing: '0.01em',
                }}
              >
                Primary use case
              </label>
              <select
                value={useCase}
                onChange={e => setUseCase(e.target.value as UseCaseType)}
                className="input-premium"
                style={{ cursor: 'pointer' }}
              >
                {USE_CASES.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── Tools Section ──────────────────────────────── */}
        <div className="animate-fade-in-up delay-200">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                }}
              >
                🛠️
              </div>
              <h2 style={{ fontWeight: 700, fontSize: 18, color: '#111827', letterSpacing: '-0.01em' }}>
                Which AI tools do you pay for?
              </h2>
            </div>
            {enabledCount > 0 && (
              <span
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 700,
                  padding: '4px 12px',
                  borderRadius: 20,
                }}
              >
                {enabledCount} selected
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {TOOLS_CONFIG.map(({ id, label, icon, plans }, index) => (
              <div
                key={id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${0.05 * index}s` }}
              >
                <div
                  style={{
                    background: enabledTools[id]
                      ? 'linear-gradient(135deg, rgba(236,253,245,0.9), rgba(209,250,229,0.6))'
                      : 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(12px)',
                    border: enabledTools[id]
                      ? '1.5px solid #a7f3d0'
                      : '1px solid rgba(229,231,235,0.6)',
                    borderRadius: 16,
                    overflow: 'hidden',
                    boxShadow: enabledTools[id]
                      ? '0 4px 20px rgba(16,185,129,0.12)'
                      : '0 2px 8px rgba(0,0,0,0.03)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <button
                    onClick={() => toggleTool(id, plans)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 20px',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                      borderBottom: enabledTools[id] ? '1px solid rgba(167,243,208,0.5)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 22 }}>{icon}</span>
                      <span style={{ fontWeight: 600, fontSize: 15, color: '#111827' }}>{label}</span>
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        padding: '5px 14px',
                        borderRadius: 20,
                        fontWeight: 600,
                        transition: 'all 0.2s',
                        background: enabledTools[id]
                          ? 'linear-gradient(135deg, #10b981, #059669)'
                          : '#f3f4f6',
                        color: enabledTools[id] ? '#fff' : '#6b7280',
                        boxShadow: enabledTools[id] ? '0 2px 8px rgba(16,185,129,0.3)' : 'none',
                      }}
                    >
                      {enabledTools[id] ? 'Added ✓' : '+ Add'}
                    </span>
                  </button>

                  {enabledTools[id] && toolEntries[id] && (
                    <div
                      className="animate-slide-down"
                      style={{ padding: '16px 20px 20px' }}
                    >
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                        <div>
                          <label
                            style={{
                              display: 'block',
                              fontSize: 12,
                              fontWeight: 600,
                              color: '#065f46',
                              marginBottom: 5,
                              letterSpacing: '0.02em',
                            }}
                          >
                            Plan
                          </label>
                          <select
                            value={toolEntries[id].plan}
                            onChange={e => updateEntry(id, 'plan', e.target.value)}
                            className="input-premium"
                            style={{ padding: '8px 12px', fontSize: 13, cursor: 'pointer' }}
                          >
                            {plans.map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                        </div>
                        <div>
                          <label
                            style={{
                              display: 'block',
                              fontSize: 12,
                              fontWeight: 600,
                              color: '#065f46',
                              marginBottom: 5,
                              letterSpacing: '0.02em',
                            }}
                          >
                            Monthly spend ($)
                          </label>
                          <input
                            type="number"
                            min={0}
                            value={toolEntries[id].monthlySpend || ''}
                            placeholder={`e.g. $${getDefaultSpend(id, toolEntries[id]?.plan)}`}
                            onChange={e => updateEntry(id, 'monthlySpend', Number(e.target.value))}
                            className="input-premium"
                            style={{ padding: '8px 12px', fontSize: 13 }}
                          />
                        </div>
                        <div>
                          <label
                            style={{
                              display: 'block',
                              fontSize: 12,
                              fontWeight: 600,
                              color: '#065f46',
                              marginBottom: 5,
                              letterSpacing: '0.02em',
                            }}
                          >
                            Seats
                          </label>
                          <input
                            type="number"
                            min={1}
                            value={toolEntries[id].seats}
                            placeholder="e.g. 5"
                            onChange={e => updateEntry(id, 'seats', Number(e.target.value))}
                            className="input-premium"
                            style={{ padding: '8px 12px', fontSize: 13 }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Error Message ───────────────────────────────── */}
        {formError && (
          <div
            className="animate-fade-in"
            style={{
              background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
              border: '1px solid #fecaca',
              color: '#991b1b',
              fontSize: 14,
              fontWeight: 500,
              borderRadius: 14,
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span>⚠️</span> {formError}
          </div>
        )}

        {/* ── Submit Button ──────────────────────────────── */}
        <div className="animate-fade-in-up delay-300">
          <button
            onClick={handleSubmit}
            className="btn-primary"
            style={{ width: '100%', fontSize: 17, padding: '18px 32px' }}
          >
            Run My Free Audit →
          </button>
          <p
            style={{
              textAlign: 'center',
              fontSize: 12,
              color: '#9ca3af',
              marginTop: 12,
              fontWeight: 400,
            }}
          >
            🔒 No data stored. Results are instant and private.
          </p>
        </div>
      </div>
    </div>
  );
}