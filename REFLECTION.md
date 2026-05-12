# Reflection — AI Spend Audit

## 1. Technical Wins

### Deterministic Audit Logic
One of the most important decisions in this project was keeping the savings calculations deterministic instead of relying on AI-generated recommendations for pricing logic.

Initially, I considered letting the LLM generate optimization suggestions directly from the user's tool stack. However, after reviewing the assignment more carefully, I realized financial recommendations need predictable and explainable logic. A hallucinated pricing recommendation would reduce trust in the product immediately.

Because of that, I separated the architecture into:
- rule-based audit calculations
- AI-generated narrative summaries

The audit engine handles all pricing and savings calculations using structured pricing data, while the AI layer only generates human-readable summaries. This made the recommendations easier to debug and more reliable.

---

### Project Structure and Type Safety
Using Next.js with TypeScript helped keep the project organized as the number of files grew. Early in development, TypeScript caught several issues related to incorrect tool IDs and mismatched object structures.

Separating logic into:
- `auditEngine.ts`
- `pricingData.ts`
- reusable types
- API route folders

made the project easier to reason about and modify.

One particularly useful decision was centralizing pricing information into a dedicated file instead of scattering pricing logic throughout components. This simplified future updates and reduced repeated logic.

---

### Persistence and User Experience
I implemented localStorage persistence for the spend form because the audit process requires users to gather subscription and billing information manually. During testing, I realized users would likely switch tabs frequently while checking invoices or subscription dashboards.

Without persistence, losing entered data after refresh would create unnecessary friction and likely reduce completion rate.

Although simple technically, this ended up being one of the most important UX improvements in the project.

---

## 2. Challenges & Lessons Learned

### Project Structure and Import Issues
One of the most frustrating issues during development was related to project structure and import resolution.

At one point, I accidentally created folders outside the actual Next.js project root. Because of this, TypeScript imports like `@/types` failed even though the files technically existed on disk.

Initially, I assumed the issue was related to tsconfig path aliases or TypeScript configuration. After debugging for a while, I realized the real problem was incorrect filesystem structure rather than code logic.

Fixing the project structure resolved multiple cascading issues immediately.

This reinforced an important lesson:
many frontend build problems are actually environment or project organization problems rather than framework bugs.

---

### API Integration Decisions
Initially, I planned to use the official Anthropic SDK for AI summary generation. After experimenting with the setup, I realized direct fetch requests would be simpler and easier to debug for the current project scope.

Switching away from the SDK reduced dependency complexity and gave me more direct control over:
- request payloads
- error handling
- fallback behavior

This experience reinforced that adding more abstractions is not always the best engineering decision, especially in MVP-stage projects.

---

## 3. What I’d Improve With More Time

### Benchmark Comparison Mode
If I had more time, I would implement benchmark-based comparisons.

Instead of only showing raw savings, the product could compare user spending against similar teams and use cases. For example:
> "Teams of your size spend 28% less on AI coding tools."

This would make recommendations feel more contextual and persuasive.

---

### Better Shareable Reports
I would improve the shareable audit pages by adding dynamic Open Graph image generation.

Currently, shared links are functional, but generating branded preview cards with savings numbers would improve visibility when shared on LinkedIn or Twitter.

---

### Admin Analytics Dashboard
Another improvement would be an internal dashboard showing:
- most common AI tools
- average spend by team size
- highest savings opportunities
- conversion rates from audit submissions

This would make the project more useful as an actual lead-generation platform for Credex rather than only a standalone audit tool.

---

## 4. Final Thoughts

This project was more interesting than a normal frontend assignment because it required balancing:
- engineering
- product thinking
- UX decisions
- pricing logic
- and business reasoning

The technical implementation itself was manageable, but the more difficult part was designing a flow that felt realistic and useful rather than just generating random AI recommendations.

The assignment also reinforced how important debugging, architecture decisions, and documentation quality are in real-world development workflows.