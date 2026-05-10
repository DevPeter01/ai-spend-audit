# PROMPTS.md — LLM Prompt Documentation

## 1. AI Summary Prompt

### System Prompt
```
You are a concise financial advisor for tech startups. Write in second person, plain English, no jargon. Be warm and specific. Maximum 100 words.
```

### User Prompt (with savings found)
```
A {teamSize}-person team primarily uses AI for {useCase}. Their total AI spend is ${totalCurrentSpend}/month across {toolCount} tools. We found ${totalMonthlySavings}/month in savings (${totalAnnualSavings}/year). Top opportunity: {tool} — {reason} Monthly saving: ${monthlySavings}. Write an 80-100 word personalized summary. End with one concrete sentence about what they could reinvest the savings into.
```

### User Prompt (no savings found)
```
A {teamSize}-person team primarily uses AI for {useCase}. Their total AI spend is ${totalCurrentSpend}/month across {toolCount} tools. We found no significant savings opportunities — their spend appears optimal. Write an 80-100 word personalized summary. Be encouraging and suggest they keep monitoring as their team grows.
```

### Model Configuration
- Model: `claude-3-5-haiku-20241022`
- Max tokens: `200`
- API: Direct fetch to `https://api.anthropic.com/v1/messages` (no SDK)
- Anthropic version header: `2023-06-01`

### Fallback Summary (when API fails or key is missing)
```
Your {teamSize}-person team is spending ${totalCurrentSpend}/month on AI tools. We identified ${totalMonthlySavings}/month (${totalAnnualSavings}/year) in potential savings. Your biggest opportunity is {tool} — {reason} That's ${annualSavings} back in your budget annually.
```

The fallback is a deterministic template — no LLM involved. Users always see an insight, even if the API is down.

---

## 2. Why I Wrote It This Way

- **Second person** ("your team") makes it feel personal, not like a generic report
- **80-100 word limit** forces specificity — longer outputs became generic advice
- **Ending with reinvestment framing** makes savings feel real and motivating, not abstract
- **"Plain English, no jargon"** instruction prevents outputs like "leverage synergistic AI tooling"
- **Two prompt variants** — one for savings found, one for optimized spend — so the model never fabricates savings that don't exist
- **System prompt is short** — keeps the model focused on tone and format, while all dynamic data lives in the user prompt where it's reliably consumed

---

## 3. What I Tried That Didn't Work

- **Asked for bullet points** — output felt cold and report-like, lost the warmth
- **No word limit** — model wrote 300 word essays that buried the key insight
- **Used third person** — felt like reading about someone else's company
- **Put all context in system prompt** — model ignored dynamic values and gave generic advice
- **Requested markdown formatting** — unnecessary for a single paragraph; added visual noise in the UI
- **Higher max_tokens (500+)** — model padded output with filler; 200 tokens is enough for 100 words

---

## 4. What AI Is NOT Used For

The audit math (savings calculations, plan comparisons, seat-based recommendations) uses hardcoded deterministic rules — not AI. This is intentional:

- **A finance person must be able to verify every number** — if the math is wrong, users lose trust instantly
- **AI-generated pricing numbers hallucinate** — LLMs confidently produce incorrect dollar amounts
- **Consistent, testable logic builds user trust** — same inputs always produce same outputs
- **The audit engine has unit tests; an AI prompt cannot be unit tested** — `runAudit()` is pure function, fully deterministic

AI is used **only** for the qualitative summary — the human-readable narrative that contextualizes the numbers. Every dollar figure in the audit comes from `auditEngine.ts`, never from the LLM.