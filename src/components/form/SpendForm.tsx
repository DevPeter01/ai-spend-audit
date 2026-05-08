'use client';

import { useState, useEffect } from 'react';
import { AuditInput, ToolEntry, AITool, UseCaseType } from '@/types';

const TOOLS_CONFIG = [
  { id: 'cursor', label: 'Cursor', plans: ['Hobby', 'Pro', 'Business', 'Enterprise'] },
  { id: 'github-copilot', label: 'GitHub Copilot', plans: ['Individual', 'Business', 'Enterprise'] },
  { id: 'claude', label: 'Claude', plans: ['Free', 'Pro', 'Max', 'Team', 'Enterprise'] },
  { id: 'chatgpt', label: 'ChatGPT', plans: ['Free', 'Plus', 'Team', 'Enterprise'] },
  { id: 'anthropic-api', label: 'Anthropic API (direct)', plans: ['Pay as you go'] },
  { id: 'openai-api', label: 'OpenAI API (direct)', plans: ['Pay as you go'] },
  { id: 'gemini', label: 'Gemini', plans: ['Free', 'Pro', 'Ultra'] },
  { id: 'windsurf', label: 'Windsurf', plans: ['Free', 'Pro', 'Team'] },
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

export default function SpendForm({ onSubmit }: SpendFormProps) {
  const [teamSize, setTeamSize] = useState(1);
  const [useCase, setUseCase] = useState<UseCaseType>('mixed');
  const [enabledTools, setEnabledTools] = useState<Record<string, boolean>>({});
  const [toolEntries, setToolEntries] = useState<Record<string, ToolEntry>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTeamSize(parsed.teamSize || 1);
        setUseCase(parsed.useCase || 'mixed');
        setEnabledTools(parsed.enabledTools || {});
        setToolEntries(parsed.toolEntries || {});
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

  const handleSubmit = () => {
    const tools = Object.entries(toolEntries)
      .filter(([id]) => enabledTools[id])
      .map(([, entry]) => entry);
    if (tools.length === 0) return alert('Please add at least one AI tool.');
    onSubmit({ tools, teamSize, useCase });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">AI Spend Audit</h1>
        <p className="mt-2 text-gray-500">Find out where your team is overpaying for AI tools. Free, instant, no login required.</p>
      </div>

      {/* Team Info */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-800">Your Team</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Team size</label>
            <input
              type="number"
              min={1}
              value={teamSize}
              onChange={e => setTeamSize(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Primary use case</label>
            <select
              value={useCase}
              onChange={e => setUseCase(e.target.value as UseCaseType)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {USE_CASES.map(u => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tools */}
      <div className="space-y-3">
        <h2 className="font-semibold text-gray-800">Which AI tools do you pay for?</h2>
        {TOOLS_CONFIG.map(({ id, label, plans }) => (
          <div key={id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleTool(id, plans)}
              className={`w-full flex items-center justify-between px-5 py-4 text-left transition-colors ${enabledTools[id] ? 'bg-emerald-50 border-b border-emerald-100' : 'hover:bg-gray-50'}`}
            >
              <span className="font-medium text-gray-800">{label}</span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${enabledTools[id] ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                {enabledTools[id] ? 'Added ✓' : '+ Add'}
              </span>
            </button>

            {enabledTools[id] && toolEntries[id] && (
              <div className="px-5 py-4 grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Plan</label>
                  <select
                    value={toolEntries[id].plan}
                    onChange={e => updateEntry(id, 'plan', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {plans.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Monthly spend ($)</label>
                  <input
                    type="number"
                    min={0}
                    value={toolEntries[id].monthlySpend}
                    onChange={e => updateEntry(id, 'monthlySpend', Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Seats</label>
                  <input
                    type="number"
                    min={1}
                    value={toolEntries[id].seats}
                    onChange={e => updateEntry(id, 'seats', Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 rounded-2xl transition-colors text-lg"
      >
        Run My Free Audit →
      </button>
    </div>
  );
}