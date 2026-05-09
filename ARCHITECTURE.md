Write ARCHITECTURE.md for the AI Spend Audit project.

Required sections:

## System Diagram
Write a Mermaid diagram showing:
- User Browser → SpendForm → page.tsx
- page.tsx → POST /api/summary → Anthropic API
- page.tsx → POST /api/audit → Supabase (audits table)
- AuditResults → POST /api/leads → Supabase (leads table)
- /audit/[id] → Supabase read → ReadOnlyAuditResults

Use proper Mermaid flowchart syntax that renders on GitHub.

## Data Flow
Step by step: how a user's input becomes an audit result.
1. User fills SpendForm (8 tools, plans, seats, spend)
2. Form persists to localStorage on every change
3. On submit: client-side runAudit() for instant preview
4. POST /api/summary: Anthropic API generates 100-word summary
5. POST /api/audit: saves input + result + summary to Supabase
6. Browser URL updates to /audit/{uuid}
7. AuditResults renders with savings, per-tool cards, AI summary
8. Email capture POSTs to /api/leads → saved with isHighSavings flag
9. Share URL: /audit/{id} is publicly accessible as server page

## Stack Choices
- Next.js 15 App Router: unified frontend + API, great DX, Vercel deploy
- TypeScript: type safety across audit engine prevents math errors
- Tailwind CSS: fast styling, consistent design tokens
- Supabase: instant Postgres + REST API, free tier sufficient for MVP
- Anthropic API (direct fetch): no SDK overhead, easy fallback control
- Vercel: zero-config deploy, edge network, env var management

## What Changes at 10k Audits/Day
- Add Redis for rate limiting (replace in-memory Map)
- Add audit result caching (same input → same output)
- Move to Supabase connection pooling (pgBouncer)
- Add a queue for Anthropic API calls (avoid rate limits)
- Add og:image generation via Vercel OG

Write ~600 words total, professional engineering tone.