export interface PlanInfo {
  name: string;
  pricePerUserPerMonth: number;
  minSeats?: number;
  maxSeats?: number;
  notes?: string;
}

export interface ToolPricing {
  toolId: string;
  displayName: string;
  plans: PlanInfo[];
  officialPricingUrl: string;
}

export const PRICING_DATA: Record<string, ToolPricing> = {
  cursor: {
    toolId: 'cursor',
    displayName: 'Cursor',
    officialPricingUrl: 'https://cursor.sh/pricing',
    plans: [
      { name: 'Hobby', pricePerUserPerMonth: 0, notes: 'Free tier' },
      { name: 'Pro', pricePerUserPerMonth: 20 },
      { name: 'Business', pricePerUserPerMonth: 40 },
      { name: 'Enterprise', pricePerUserPerMonth: 100, notes: 'Estimated, contact sales' },
    ],
  },
  'github-copilot': {
    toolId: 'github-copilot',
    displayName: 'GitHub Copilot',
    officialPricingUrl: 'https://github.com/features/copilot#pricing',
    plans: [
      { name: 'Individual', pricePerUserPerMonth: 10 },
      { name: 'Business', pricePerUserPerMonth: 19 },
      { name: 'Enterprise', pricePerUserPerMonth: 39 },
    ],
  },
  claude: {
    toolId: 'claude',
    displayName: 'Claude',
    officialPricingUrl: 'https://www.anthropic.com/pricing',
    plans: [
      { name: 'Free', pricePerUserPerMonth: 0 },
      { name: 'Pro', pricePerUserPerMonth: 20 },
      { name: 'Max', pricePerUserPerMonth: 100 },
      { name: 'Team', pricePerUserPerMonth: 30, minSeats: 5 },
      { name: 'Enterprise', pricePerUserPerMonth: 0, notes: 'Contact sales' },
    ],
  },
  chatgpt: {
    toolId: 'chatgpt',
    displayName: 'ChatGPT',
    officialPricingUrl: 'https://openai.com/chatgpt/pricing',
    plans: [
      { name: 'Free', pricePerUserPerMonth: 0 },
      { name: 'Plus', pricePerUserPerMonth: 20 },
      { name: 'Team', pricePerUserPerMonth: 30, minSeats: 2 },
      { name: 'Enterprise', pricePerUserPerMonth: 0, notes: 'Contact sales' },
    ],
  },
  'anthropic-api': {
    toolId: 'anthropic-api',
    displayName: 'Anthropic API',
    officialPricingUrl: 'https://www.anthropic.com/pricing#api',
    plans: [
      { name: 'Pay as you go', pricePerUserPerMonth: 0, notes: 'Usage based' },
    ],
  },
  'openai-api': {
    toolId: 'openai-api',
    displayName: 'OpenAI API',
    officialPricingUrl: 'https://openai.com/api/pricing',
    plans: [
      { name: 'Pay as you go', pricePerUserPerMonth: 0, notes: 'Usage based' },
    ],
  },
  gemini: {
    toolId: 'gemini',
    displayName: 'Gemini',
    officialPricingUrl: 'https://one.google.com/about/plans',
    plans: [
      { name: 'Free', pricePerUserPerMonth: 0 },
      { name: 'Pro', pricePerUserPerMonth: 20 },
      { name: 'Ultra', pricePerUserPerMonth: 30 },
    ],
  },
  windsurf: {
    toolId: 'windsurf',
    displayName: 'Windsurf',
    officialPricingUrl: 'https://windsurf.com/pricing',
    plans: [
      { name: 'Free', pricePerUserPerMonth: 0 },
      { name: 'Pro', pricePerUserPerMonth: 15 },
      { name: 'Team', pricePerUserPerMonth: 35 },
    ],
  },
};