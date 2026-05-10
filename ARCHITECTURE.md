# Architecture — AI Spend Audit

## System Diagram

```mermaid
flowchart TD
    A[User Browser] -->|Fills SpendForm| B[page.tsx]
    B -->|POST input + aiSummary| C[/api/audit]
    B -->|POST auditResult| D[/api/summary]
    D -->|fetch| E[Anthropic API\nclaude-3-5-haiku]
    E -->|summary string| D
    D -->|fallback if fails| D
    C -->|insert row| F[(Supabase\naudits table)]
    C -->|returns AuditResult| B
    B -->|router.push| G[/audit/id page]
    G -->|select row| F
    G -->|renders| H[ReadOnlyAuditResults]
    B -->|renders| I[AuditResults]
    I -->|POST email+auditId| J[/api/leads]
    J -->|honeypot+ratelimit| J
    J -->|insert row| K[(Supabase\nleads table)]
```

## Data Flow

How a user's input becomes an audit result, step by step:

1. **User fills SpendForm** — selects tools, plans, seats, monthly spend, team size, use case. State persists to localStorage on every keystroke so no data is lost on refresh.

2. **Submit triggers handleSubmit in page.tsx.** Loading state shows immediately. Client-side `runAudit()` runs instantly for a preliminary result.

3. **POST /api/summary** — sends preliminary AuditResult to Anthropic API (`claude-3-5-haiku-20241022`). Gets back a ~100 word personalized insight. Falls back to templated summary if API fails or times out.

4. **POST /api/audit** — sends AuditInput + aiSummary to be persisted. Server runs `runAudit()` again for canonical result, saves full row to Supabase `audits` table including `ai_summary` column. Returns AuditResult with real UUID.

5. **Browser URL updates to /audit/{uuid}** via `router.push` without page reload. AuditResults component renders with full result including savings breakdown and AI summary.

6. **User optionally submits email.** POST /api/leads validates email format, checks honeypot field, enforces 60s rate limit per email, saves lead to Supabase with `isHighSavings` flag (`true` if savings > $500/mo).

7. **Shareable URL /audit/{id}** is a Next.js server component that reads directly from Supabase. Strips PII — shows only tools and savings. Has Open Graph meta tags for clean Twitter/LinkedIn previews.

## Stack Choices

**Next.js 15 App Router** — Chose over plain React because API routes, server components, and frontend live in one repo. Zero config deploy on Vercel. App Router gives per-page metadata for OG tags without extra libraries.

**TypeScript strict mode** — The audit engine does financial math. Type safety across `ToolEntry` → `AuditResult` → DB insert means a wrong field name is a compile error, not a runtime bug discovered after submission.

**Tailwind CSS** — Utility classes keep component files self-contained. No separate CSS files to maintain. Responsive by default.

**Supabase** — Instant Postgres with REST API. Free tier handles MVP traffic comfortably. Row-level security ready to enable before production. Migrations tracked in `supabase/migrations/` for reproducibility.

**Anthropic API (raw fetch, no SDK)** — Direct fetch gives full control over timeout and error handling. The fallback summary means users always see an insight even if the API is down. SDK was installed initially but removed as unused overhead.

**uuid v9** — Stable, widely used, `@types` aligned. Used client-side in `runAudit()` for instant ID generation before server confirmation.

## What Changes at 10,000 Audits/Day

1. **Rate limiting** — Replace in-memory Map in leads route with Redis (Upstash). Current solution resets on every cold start.

2. **Connection pooling** — Add Supabase pgBouncer to handle concurrent DB connections under load.

3. **Anthropic API queue** — Add a simple queue (BullMQ or Inngest) to batch summary requests and respect rate limits without dropping requests.

4. **Caching** — Cache audit results by input hash. Identical inputs return cached result without hitting DB or Anthropic.

5. **OG image generation** — Add Vercel OG (`@vercel/og`) for dynamic audit preview images. Currently OG tags exist but no image is generated.

6. **CDN** — Static assets already on Vercel edge. At scale, move Supabase to same region as Vercel deployment to cut DB latency.