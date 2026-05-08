import { AuditInput, AuditResult, ToolRecommendation, ToolEntry, UseCaseType } from '@/types';
import { PRICING_DATA } from '@/lib/pricingData';
import { v4 as uuidv4 } from 'uuid';

function analyzeToolSpend(entry: ToolEntry, teamSize: number, useCase: UseCaseType): ToolRecommendation {
  const pricing = PRICING_DATA[entry.tool];
  const currentSpend = entry.monthlySpend;
  let recommendedAction = 'Keep current plan';
  let recommendedPlan = entry.plan;
  let estimatedNewSpend = currentSpend;
  let reason = 'Your current plan appears well-matched to your usage.';

  // --- CURSOR ---
  if (entry.tool === 'cursor') {
    if (entry.plan === 'Business' && entry.seats <= 3) {
      recommendedPlan = 'Pro';
      estimatedNewSpend = 20 * entry.seats;
      recommendedAction = 'Downgrade to Pro';
      reason = `Business plan is designed for larger teams with admin controls. With only ${entry.seats} seats, Pro gives the same AI features at half the cost.`;
    } else if (entry.plan === 'Pro' && useCase !== 'coding') {
      recommendedPlan = 'Hobby';
      estimatedNewSpend = 0;
      recommendedAction = 'Consider Hobby tier';
      reason = `Your primary use case is ${useCase}, not coding. Cursor's free Hobby tier may be sufficient for occasional use.`;
    } else if (entry.plan === 'Enterprise' && entry.seats < 20) {
      recommendedPlan = 'Business';
      estimatedNewSpend = 40 * entry.seats;
      recommendedAction = 'Downgrade to Business';
      reason = `Enterprise pricing is justified at 20+ seats with SSO and compliance needs. At ${entry.seats} seats, Business plan covers your requirements.`;
    }
  }

  // --- GITHUB COPILOT ---
  if (entry.tool === 'github-copilot') {
    if (entry.plan === 'Enterprise' && entry.seats < 10) {
      recommendedPlan = 'Business';
      estimatedNewSpend = 19 * entry.seats;
      recommendedAction = 'Downgrade to Business';
      reason = `Copilot Enterprise adds fine-tuning on private repos and Bing search — only worth it at scale. Business plan covers all core coding features for small teams.`;
    }
    if (entry.plan === 'Business' && useCase === 'writing') {
      recommendedAction = 'Consider switching to Claude Pro';
      estimatedNewSpend = 20 * entry.seats;
      reason = `GitHub Copilot is optimized for coding. For writing workflows, Claude Pro at the same price delivers significantly better results.`;
    }
  }

  // --- CLAUDE ---
  if (entry.tool === 'claude') {
    if (entry.plan === 'Team' && entry.seats < 5) {
      recommendedPlan = 'Pro';
      estimatedNewSpend = 20 * entry.seats;
      recommendedAction = 'Switch to individual Pro plans';
      reason = `Claude Team requires a minimum of 5 seats. With ${entry.seats} users, individual Pro plans are cheaper and functionally equivalent.`;
    }
    if (entry.plan === 'Max' && entry.seats > 3) {
      recommendedPlan = 'Team';
      estimatedNewSpend = 30 * entry.seats;
      recommendedAction = 'Switch to Team plan';
      reason = `Max plan is $100/user for heavy individual use. For ${entry.seats} users, Claude Team at $30/user gives shared workspace features at 70% less per seat.`;
    }
  }

  // --- CHATGPT ---
  if (entry.tool === 'chatgpt') {
    if (entry.plan === 'Team' && entry.seats === 1) {
      recommendedPlan = 'Plus';
      estimatedNewSpend = 20;
      recommendedAction = 'Downgrade to Plus';
      reason = `ChatGPT Team is designed for collaborative workspaces. Solo users get identical model access on Plus at $10/month less.`;
    }
    if (entry.plan === 'Plus' && useCase === 'coding' && entry.seats >= 2) {
      recommendedAction = 'Consider switching to Cursor Pro';
      estimatedNewSpend = 20 * entry.seats;
      reason = `For coding-focused teams, Cursor Pro provides a purpose-built IDE experience with GPT-4 class models at the same price as ChatGPT Plus.`;
    }
  }

  // --- API DIRECT (usage-based) ---
  if (entry.tool === 'anthropic-api' || entry.tool === 'openai-api') {
    if (currentSpend > 500) {
      recommendedAction = 'Audit API usage patterns';
      estimatedNewSpend = currentSpend * 0.6;
      reason = `High API spend often indicates unoptimized prompts, missing caching, or using frontier models where smaller models suffice. A usage audit typically cuts spend 30–50%.`;
    } else if (currentSpend > 200) {
      recommendedAction = 'Enable prompt caching';
      estimatedNewSpend = currentSpend * 0.75;
      reason = `Anthropic prompt caching can reduce costs by up to 90% on repeated context. At your spend level, enabling caching could save $${Math.round(currentSpend * 0.25)}/month.`;
    }
  }

  // --- GEMINI ---
  if (entry.tool === 'gemini') {
    if (entry.plan === 'Ultra' && useCase === 'coding') {
      recommendedAction = 'Switch to Cursor Pro instead';
      estimatedNewSpend = 20 * entry.seats;
      reason = `Gemini Ultra is a general assistant. For coding, Cursor Pro offers purpose-built IDE integration with comparable models at potentially lower cost.`;
    }
  }

  // --- WINDSURF ---
  if (entry.tool === 'windsurf') {
    if (entry.plan === 'Team' && entry.seats === 1) {
      recommendedPlan = 'Pro';
      estimatedNewSpend = 15;
      recommendedAction = 'Downgrade to Pro';
      reason = `Windsurf Team plan is $35/user for teams. Solo users can get the same individual features on the Pro plan for just $15/month.`;
    }
  }

  const monthlySavings = Math.max(0, currentSpend - estimatedNewSpend);

  return {
    tool: entry.tool,
    currentPlan: entry.plan,
    currentSpend,
    recommendedAction,
    recommendedPlan,
    estimatedNewSpend,
    monthlySavings,
    annualSavings: monthlySavings * 12,
    reason,
  };
}

export function runAudit(input: AuditInput): AuditResult {
  const recommendations = input.tools.map(entry =>
    analyzeToolSpend(entry, input.teamSize, input.useCase)
  );

  const totalMonthlySavings = recommendations.reduce((sum, r) => sum + r.monthlySavings, 0);

  return {
    id: uuidv4(),
    input,
    recommendations,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    isOptimal: totalMonthlySavings < 10,
    createdAt: new Date().toISOString(),
  };
}