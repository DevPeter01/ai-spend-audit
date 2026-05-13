# Metrics — AI Spend Audit

We track four categories of metrics to measure the health of the project as a lead generation asset for Credex.

## 1. North Star Metric: High-Value Audits
**Definition:** Number of unique audits completed identifying >$500/month in potential savings.
- **Why:** This is the primary indicator of "Product-Market Fit" for our specific lead profile. If we aren't finding significant savings, we aren't providing enough value to trigger a lead capture.

## 2. Conversion Funnel
- **Traffic to Start:** Unique visitors who interact with the first tool selector. (Target: 60%)
- **Start to Completion:** Users who finish the audit and reach the `/audit/{id}` results page. (Target: 70%)
- **Completion to Lead:** Users who submit their email on the results page. (Target: 15–20%)
- **Lead to SQL:** Captured emails where identified savings exceed $500/mo. (Target: 5%)

## 3. Viral & Distribution Metrics
- **Share Rate:** Percentage of users who click "Copy Link" or use social share buttons on the results page.
- **Referral Traffic:** Percentage of visits coming from `audit/{id}` shared URLs vs. the homepage.
- **K-Factor:** How many new users are brought in by each existing user sharing their results.

## 4. Product Quality Metrics
- **Average Tools per Audit:** Measures how comprehensive the user's input is. (Target: 3+ tools)
- **Time to Result:** Average time from landing to viewing results. (Target: <90 seconds)
- **API Reliability:** Success rate of the Anthropic summary generation vs. fallback template. (Target: >98%)

## 5. Business ROI (for Credex)
- **CPL (Cost Per Lead):** Total project cost / Total emails captured.
- **CPSQL (Cost Per Sales Qualified Lead):** Total project cost / Leads with >$500/mo savings.
- **Pipeline Value:** Total annual savings identified for all captured leads (represents the potential "optimization budget" Credex can capture).

## 5. Pivot Triggers
- **Low Completion Rate (<40%):** If users drop off before finishing the audit, we will simplify the form to 3 tools instead of 8.
- **Low Lead Capture (<5%):** If users don't leave emails, we will gate the full AI summary behind the email capture.
- **Low SQL Value:** If savings identified are consistently <$100, we will pivot to auditing GPU/Cloud spend instead of SaaS tools.

## Metric Tracking Implementation
- **Client-side:** Basic event tracking on form submission and lead capture.
- **Server-side:** All results and leads are persisted to Supabase, allowing for SQL-based reporting on savings cohorts and conversion rates.
