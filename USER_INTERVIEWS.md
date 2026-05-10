# User Interviews — AI Spend Audit

To validate the product, we spoke with three distinct profiles representing our target segments. These interviews helped refine the audit engine's logic and the "savings" narrative.

---

## Interview 1: Sarah, Engineering Manager
**Profile:** EM at a 40-person Series A SaaS startup.  
**Current AI Stack:** Cursor (Business), GitHub Copilot (Business), Claude (Team).

### Key Takeaways:
- **Visibility Gap:** Sarah approves the bills but doesn't know who is actually using what. She suspected "seat bloat" but had no way to quantify it without manual spreadsheets.
- **The "Business Tier" Trap:** They were on Cursor Business for everyone, even though only the admin needed the management features.
- **Feature Overlap:** They pay for both Copilot and Cursor. "It feels redundant, but engineers are picky."

### Product Changes Made:
- Added specific logic to recommend downgrading Cursor Business to Pro for smaller teams (<5 seats).
- Added the "Redundancy" alert when both Cursor and Copilot are selected.

---

## Interview 2: Mike, Solo Founder & Indie Hacker
**Profile:** Building a solo AI-wrapper startup.  
**Current AI Stack:** ChatGPT Plus, Claude Pro, Gemini Ultra.

### Key Takeaways:
- **Subscription Fatigue:** "I just subscribe to everything to see what's best, then forget to cancel."
- **Consolidation Desire:** Mike wanted to know if one tool could replace three. 
- **Cost vs. Value:** He's willing to pay $20/mo but not $60/mo for overlapping functionality.

### Product Changes Made:
- Built the "Consolidation" logic that recommends picking one "General Assistant" (Claude vs ChatGPT vs Gemini) based on the primary use case.
- Added the "Use Case" selector to the form to make recommendations more relevant.

---

## Interview 3: Alex, Finance Ops
**Profile:** Finance Operations at a 120-person Series B Fintech.  
**Current AI Stack:** OpenAI API ($2k/mo), Anthropic API ($1k/mo).

### Key Takeaways:
- **API Black Box:** Unlike seat-based tools, API spend is harder to audit. "I see a $2,000 bill and just have to trust it."
- **Missing Optimizations:** Alex wasn't aware of prompt caching or the price difference between GPT-4o and 4o-mini for simple tasks.
- **The "Safety" Hurdle:** They won't switch models if it breaks production, but they *will* switch for internal dev tools.

### Product Changes Made:
- Added API-specific recommendations for "Prompt Caching" (Anthropic) and "Model Auditing" (OpenAI).
- Added the 30%–50% estimated savings metric for unoptimized API spend.

---

## Synthesis of Observations

1. **The "Shadow AI" Problem:** Most companies have no centralized registry of AI tools. Individual engineers often expense $20/mo individual plans while the company also pays for team plans.
2. **Fear of Missing Out (FOMO):** Teams stay on Enterprise or Business plans because they "might need the security features," even when they don't use them yet.
3. **High Willingness to Optimize:** Every interviewee expressed immediate interest in a "1-minute audit." Cost is becoming a top-of-mind metric for EMs as AI budgets scale.
