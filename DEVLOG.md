# DEVLOG — AI Spend Audit

## Day 1 — 2026-05-07

**Hours worked:** 2

**What I did:**
Initialized the Next.js 15 project with TypeScript, Tailwind CSS, and App Router.
Set up the GitHub repository with proper structure and made the first commit.
Researched pricing pages for Cursor, Claude, ChatGPT, and GitHub Copilot to understand
the data I need to build the audit engine.

**What I learned:**
The assignment is less about code and more about shipping a real product. Read through
the full brief carefully — the entrepreneurial files (GTM, ECONOMICS, USER_INTERVIEWS)
carry 25 points, the highest single category. Most candidates will underinvest here.

**Blockers / what I'm stuck on:**
Need to decide on folder structure before building the form. Also need to reach out to
3 real users for interviews — will DM some founders tomorrow.

**Plan for tomorrow:**
- Set up folder structure (components, lib, types)
- Build the spend input form with all 8 tools
- Start collecting pricing data into PRICING_DATA.md

## Day 2 — 2026-05-08

**Hours worked:** 4

**What I did:**
Built core pricing data for all 8 tools with official source URLs.
Built the audit engine with defensible per-tool reasoning and correct savings math.
Built the spend input form with localStorage persistence.
Ran a full code review pass — fixed TypeScript path aliases in tsconfig,
race condition in localStorage useEffect, missing Windsurf and Gemini logic,
and moved results logic into its own component.

**What I learned:**
The tsconfig @/* alias must point to ./src/* not ./* when using a src/ directory.
localStorage useEffect needs an isLoaded guard or it overwrites saved state on mount.
Audit engine logic needs to account for seat count × price, not just plan name.

**Blockers / what I'm stuck on:**
Need to build the proper results page UI — currently just raw data showing.
Need to reach out to 3 real people for user interviews today.

**Plan for tomorrow:**
- Build the full visual Results page (the "money page")
- Add Anthropic API integration for AI summary
- Start Supabase setup for lead capture

## Day 3 — 2026-05-09

**Hours worked:** 6

**What I did:**
Ran a full project audit using a structured review prompt.
Found and fixed 3 critical bugs: wrong field name in lead 
submission, missing totalMonthlySavings and toolsAudited from 
lead POST body, and aiSummary not persisting to Supabase or 
showing on shared pages. Created missing leads table SQL migration 
and ai_summary column migration. Fixed uuid version mismatch, 
removed unused @anthropic-ai/sdk, replaced browser alert() with 
inline error UI. Extracted shared UI components to eliminate 
duplication. Wrote PRICING_DATA.md, PROMPTS.md, ARCHITECTURE.md.

**What I learned:**
Systematic auditing before moving forward saved hours of 
debugging later. The leads table was never being written to — 
would have been embarrassing to discover after submission.
Running migrations in order matters in Supabase.

**Blockers / what I'm stuck on:**
Still need to deploy to Vercel and set env variables there.
Need to write GTM, ECONOMICS, USER_INTERVIEWS, LANDING_COPY, 
METRICS, REFLECTION, TESTS, and README.
Need to reach out to real users for interviews TODAY.

**Plan for tomorrow:**
- Deploy to Vercel (30 mins)
- Run Lighthouse, fix any score issues
- Write GTM.md and ECONOMICS.md (highest scoring docs)
- Contact 3 people for user interviews