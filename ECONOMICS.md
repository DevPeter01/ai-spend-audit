# Economics — AI Spend Audit

## 1. Project Objective
This tool is a "side project marketing" asset designed to generate high-intent leads for **Credex**. Credex sells discounted AI infrastructure credits (AWS, GCP, Azure, OpenAI, Anthropic). 

The goal is to provide value upfront (the audit) to identify companies with high AI spend, then convert them into Credex customers for their primary infrastructure needs.

## 2. Unit Economics (Per Audit)

### Costs (Variable)
- **Hosting:** $0.00 (Vercel Free Tier handles current traffic).
- **Database:** $0.00 (Supabase Free Tier handles up to 500MB, plenty for 10k+ leads).
- **AI Summary API:** ~$0.00016 per audit.
  - Model: Claude 3.5 Haiku ($0.80 / 1M tokens input).
  - Average Input: ~150 tokens.
  - Average Output: ~50 tokens.
  - Total: 200 tokens = $0.00016.
- **Total Variable Cost:** Approximately **$0.0002 per audit**.

### Lead Acquisition (Estimated)
- **Target CAC (Cost to Acquire a Customer):** $0.00 (Organic distribution via HN, Reddit, X).
- **Email Capture Rate:** ~15–20% (Based on internal benchmarks for high-value calculators).
- **SQL (Sales Qualified Lead) Rate:** ~5% of all users (Users with >$500/mo in savings identified).

## 3. The "Credex" Value Proposition
A company identified by this tool as having $500+/mo in "waste" on high-level AI tools (Cursor, ChatGPT) is likely spending **$5k–$20k/mo** on low-level infrastructure (API usage, GPU instances).

- **Average Credex Customer LTV:** $12,000/year (10% margin on $10k/mo spend).
- **Lead Value:** If 100 leads result in 1 Credex sale, each lead is worth **$120** in expected LTV.

## 4. Development ROI
- **Initial Build Time:** ~15 hours.
- **Maintenance:** ~1 hour/month (pricing data updates).
- **Total Cost of Build (at $150/hr):** $2,250.

**Breakeven Point:** The project pays for its entire development cost with its **first single converted customer** from the lead pool.

## 5. Scaling Scenarios

| Metric | MVP (100 Audits) | Scale (1,000 Audits) | Viral (10,000 Audits) |
| :--- | :--- | :--- | :--- |
| **Total Variable Cost** | $0.02 | $0.20 | $2.00 |
| **Leads Captured (20%)** | 20 | 200 | 2,000 |
| **SQLs identified (5%)** | 5 | 50 | 500 |
| **Estimated Conversions (1%)** | 0.2 | 2 | 20 |
| **Projected Revenue (LTV)** | $2,400 | $24,000 | $240,000 |

## 6. Conclusion
The economics of this tool are extremely favorable because the **variable cost is near zero**, and the **intent signal is extremely high**. A user who completes a 6-step spend audit and provides their email is signaling they are actively looking to optimize their AI budget — making them the perfect prospect for Credex infrastructure credits.
