import { AuditResult } from '@/types';

interface AuditResultsProps {
  result: AuditResult;
  onReset: () => void;
}

export default function AuditResults({ result, onReset }: AuditResultsProps) {
  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Audit Results</h2>
      <p className="text-emerald-600 text-4xl font-bold">
        Save ${result.totalMonthlySavings.toFixed(0)}/mo
      </p>
      <p className="text-gray-500">${result.totalAnnualSavings.toFixed(0)} annually</p>
      
      <div className="mt-6 space-y-4">
        {result.recommendations.map((r, i) => (
          <div key={i} className="border border-gray-100 rounded-xl p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-gray-800">{r.tool}</p>
                <p className="text-sm text-gray-500">{r.recommendedAction}</p>
                <p className="text-xs text-gray-400 mt-1">{r.reason}</p>
              </div>
              <div className="text-right">
                <p className="text-emerald-600 font-bold">${r.monthlySavings}/mo saved</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button
        onClick={onReset}
        className="mt-6 text-sm text-gray-400 hover:text-gray-600"
      >
        ← Start over
      </button>
    </div>
  );
}
