# Reflection — AI Spend Audit

## 1. Technical Wins

### Deterministic Engine vs. LLM Math
The most critical decision was keeping the savings calculations 100% deterministic in `auditEngine.ts`. Early in the project, I considered letting an LLM analyze the spend, but I quickly realized that financial tools live or die on trust. A hallucinated pricing tier would destroy the product's credibility. By using AI only for the qualitative narrative, we get the best of both worlds: rigorous math and human-readable insights.

### UX & Persistence
Implementing `localStorage` persistence on every keystroke was a small addition that significantly improved the user experience. Since the audit requires digging up old invoices or checking seat counts, users frequently leave the tab and come back. Losing that progress would be a major drop-off point.

### Clean Data Architecture
Moving all pricing data into a single, typed source of truth (`pricingData.ts`) made it trivial to update pricing as the project progressed. The TypeScript strict mode caught several edge cases where I was passing the wrong tool ID or plan name early on.

---

## 2. Challenges & Lessons Learned

### The "Shareable Result" Privacy Trade-off
Designing the `/audit/{id}` page required careful thought about PII (Personally Identifiable Information). We want users to share their results, but we don't want them accidentally sharing their email or exact team structure with the public. I resolved this by creating two different view states: `AuditResults` (full data for the creator) and `ReadOnlyAuditResults` (anonymized data for public sharing).

### Anthropic API Error Handling
Initially, I relied on the SDK, but switching to a raw `fetch` call gave me much better control over timeouts and fallback states. Implementing the `buildFallbackSummary` function ensures that even if the API is down or the key is invalid, the user still sees a value-add summary. This "fail-gracefully" architecture is essential for a production-grade tool.

---

## 3. What I’d Change with More Time

1. **Multi-Currency Support:** Currently, everything is in USD. Many European startups pay in EUR or GBP, and currency conversion adds friction to the audit.
2. **CSV/Invoice Import:** Instead of manual entry, I’d build a simple parser for CSV exports from tools like Ramp or Brex to automate the tool list generation.
3. **Historical Benchmarking:** I’d love to show users how their spend compares to the average for a team of their size (e.g., "You're spending 40% more on IDEs than the average 10-person startup").
4. **Interactive Recommendation Simulator:** Letting users toggle recommendations on/off and seeing the annual savings bar move in real-time would increase engagement on the results page.

---

## 4. Final Thoughts
Building this project was an exercise in "Product Engineering." The code itself is straightforward, but the design of the logic, the framing of the GTM strategy, and the focus on lead quality for Credex are what make it a viable business asset rather than just a technical demo.
