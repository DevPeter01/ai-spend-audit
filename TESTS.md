# Testing Strategy — AI Spend Audit

Since this tool involves financial math and lead generation, reliability is paramount. We use a combination of automated unit tests and manual QA checklists.

## 1. Automated Unit Tests (Vitest)

We focus testing on the core business logic in `src/lib/auditEngine.ts`. 

### Key Test Cases:
- **Math Verification:** Ensuring `currentSpend - estimatedNewSpend` correctly equals `monthlySavings`.
- **Seat-based Logic:** Verifying that tools with minimum seat requirements (e.g., Claude Team, ChatGPT Team) trigger the correct "individual plan" recommendations for small teams.
- **Downgrade Triggers:** Verifying that Cursor Business → Pro recommendations only fire for teams under the threshold.
- **Zero Savings Case:** Ensuring `isOptimal` is true when no savings are found.
- **Edge Cases:** Handling teams with 0 seats, extremely high monthly spend, or empty tool lists.

Run tests with:
```bash
npm test
```

## 2. API Route Testing

### /api/summary (Anthropic Integration)
- **Fallback Verification:** Manually disabled the API key to ensure the `buildFallbackSummary` template is returned without crashing.
- **Input Sanitization:** Verified that missing or malformed `auditResult` bodies return a clean error response.

### /api/leads (Lead Capture)
- **Rate Limiting:** Verified that submitting the same email twice within 60 seconds triggers a 429 error.
- **Honeypot Verification:** Verified that bots filling the hidden `website` field are blocked without being saved to the database.
- **Email Validation:** Checked that malformed emails (missing @, invalid domains) are rejected server-side.

## 3. Manual QA Checklist (Pre-Deployment)

- [ ] **Data Persistence:** Enter data, refresh page, verify data is still there (localStorage).
- [ ] **Responsive Design:** Verify the form and results page look professional on iPhone 15, iPad, and Desktop (1440p).
- [ ] **Anonymization:** Open a shareable `/audit/{id}` link in an Incognito tab and verify that the lead capture form is visible but no PII is leaked.
- [ ] **Copy & Typography:** Check for "widows" in headlines and ensure all dollar amounts are formatted consistently (e.g., $420.00).
- [ ] **Lighthouse Scores:** Run audit to ensure 90+ across Performance, Accessibility, Best Practices, and SEO.

## 4. Known Limitations
- API direct spend optimization is based on percentage estimates (30–50%), not exact usage logs, as we do not have access to the user's actual API keys.
- Currency is hardcoded to USD.
