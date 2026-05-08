export type AITool =
  | 'cursor'
  | 'github-copilot'
  | 'claude'
  | 'chatgpt'
  | 'anthropic-api'
  | 'openai-api'
  | 'gemini'
  | 'windsurf';

export type UseCaseType = 'coding' | 'writing' | 'data' | 'research' | 'mixed';

export interface ToolEntry {
  tool: AITool;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditInput {
  tools: ToolEntry[];
  teamSize: number;
  useCase: UseCaseType;
}

export interface ToolRecommendation {
  tool: AITool;
  currentPlan: string;
  currentSpend: number;
  recommendedAction: string;
  recommendedPlan?: string;
  estimatedNewSpend: number;
  monthlySavings: number;
  annualSavings: number;
  reason: string;
}

export interface AuditResult {
  id: string;
  input: AuditInput;
  recommendations: ToolRecommendation[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  isOptimal: boolean;
  createdAt: string;
  aiSummary?: string;
}