# AI Spend Audit

**Stop overpaying for AI tools.** Identify redundant seats, over-provisioned plans, and hidden API savings in less than 60 seconds.

Built as a lead generation asset for [Credex](https://credex.com).

## 🌐 Live Demo

**[ai-spend-audit-kappa-sand.vercel.app](https://ai-spend-audit-kappa-sand.vercel.app)**

> No login required. Takes under 2 minutes.

## 🚀 Features

- **Deterministic Savings Engine:** 50+ logic rules across 8 major AI tools (Cursor, Claude, ChatGPT, GitHub Copilot, Gemini, Windsurf, Anthropic API, OpenAI API).
- **AI-Powered Insights:** Personalized qualitative summaries generated via Claude 3.5 Haiku.
- **Shareable Results:** Anonymized result URLs for sharing with team members and finance ops.
- **Lead Capture:** Integrated email capture with rate limiting and honeypot protection.
- **Privacy-First:** No accounts required. Data persists locally via `localStorage` during the audit process.

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **LLM:** Anthropic API (Claude 3.5 Haiku)
- **Deployment:** Vercel

## 📦 Getting Started

### 1. Clone and Install
```bash
git clone https://github.com/DevPeter01/ai-spend-audit.git
cd ai-spend-audit
npm install
```

### 2. Environment Variables
Create a `.env.local` file with the following:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ANTHROPIC_API_KEY=your_anthropic_key
```

### 3. Database Setup
Run the migrations in `supabase/migrations/` in order on your Supabase instance.

### 4. Run Development
```bash
npm run dev
```

## 📖 Documentation

- [Architecture](./ARCHITECTURE.md) — System diagram and data flow.
- [Pricing Data](./PRICING_DATA.md) — Official tool pricing sources.
- [Prompts](./PROMPTS.md) — LLM system prompts and design logic.
- [Go-To-Market](./GTM.md) — Strategy for first 100 users.
- [Economics](./ECONOMICS.md) — Unit economics and ROI analysis.
- [User Interviews](./USER_INTERVIEWS.md) — Validation and feedback synthesis.
- [Metrics](./METRICS.md) — North Star and funnel definitions.
- [Reflection](./REFLECTION.md) — Technical wins and lessons learned.

## 🖼️ Screenshots

### 1. Spend Input Form
![Spend Form](./public/screenshots/form.png)
*Team size, use case, and multi-tool selector with plan-specific logic.*

### 2. Audit Results Dashboard
![Results Dashboard](./public/screenshots/results.png)
*Emerald green theme highlighting monthly and annual savings with AI-generated insights.*

## 🧠 Key Decisions

1. **Deterministic vs. Probabilistic Math:** Chose hardcoded pricing rules over LLM-generated math to ensure 100% accuracy and user trust.
2. **Next.js 15 App Router:** Used for built-in SEO (OG tags) and unified API/Frontend routes in a single Vercel deployment.
3. **Supabase for Persistence:** Chose for instant REST APIs and easy scaling from MVP to production with PostgreSQL.
4. **Raw Fetch for Anthropic API:** Removed the official SDK to reduce bundle weight and gain precise control over timeout/fallback behavior.
5. **PII-Free Audit Routing:** Stored email/company in a separate `leads` table to ensure public audit URLs remain anonymized and secure.

## 📄 License
MIT

---

**Keywords:** Github, Express, Node.js, Tailwind CSS, CSS, HTML, Javascript, React.js, Web Development, Next.js 15, Supabase, AI Audit, Fintech, SaaS.
