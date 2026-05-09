Write PROMPTS.md for the AI Spend Audit project.

This file documents the LLM prompts used in the tool.

Structure:

## 1. AI Summary Prompt
Write the full system prompt and user prompt used in 
src/app/api/summary/route.ts.
Explain why it was written this way.
Explain what was tried that didn't work 
(e.g. longer prompts produced verbose output, 
asking for bullet points reduced warmth).

## 2. Prompt Design Decisions
- Why second person ("your team") vs third person
- Why ~100 words (enough for insight, short enough to read)
- Why end with "what they could do with saved budget" 
  (makes savings feel real and actionable)

## 3. What the AI is NOT used for
The audit math (savings calculations, plan recommendations) 
uses hardcoded rules — NOT AI. Explain why this is correct:
- Defensible to a finance person
- Consistent and testable
- No hallucinated pricing numbers

Write this as a thoughtful engineering document, ~400 words.