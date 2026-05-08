'use client';

import { useState } from 'react';
import SpendForm from '@/components/form/SpendForm';
import { AuditInput, AuditResult } from '@/types';
import { runAudit } from '@/lib/auditEngine';

import AuditResults from '@/components/results/AuditResults';

export default function Home() {
  const [result, setResult] = useState<AuditResult | null>(null);

  const handleSubmit = (input: AuditInput) => {
    const auditResult = runAudit(input);
    setResult(auditResult);
  };

  if (result) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <AuditResults result={result} onReset={() => setResult(null)} />
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