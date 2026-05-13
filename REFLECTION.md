# REFLECTION.md

## Question 1 — Hardest Bug and How I Debugged It

The hardest bug I hit was a race condition in the 
SpendForm component's localStorage persistence.

When the page loaded, the form would briefly show 
saved data and then immediately clear it back to 
empty. My first hypothesis was that the localStorage 
key was wrong or the data was being stored under a 
different key. I added console.log to check the key 
name — it was correct.

My second hypothesis was that JSON.parse was failing 
on corrupted data. I logged the raw localStorage 
value — the data was valid JSON and intact.

The real issue took me about 40 minutes to find. 
I had two useEffect hooks in the same component. 
One loaded data from localStorage on mount. The 
other saved data to localStorage whenever any state 
changed. The problem was that the SAVE effect was 
firing before the LOAD effect finished — it was 
seeing the empty initial state and writing that 
back to localStorage, overwriting the saved data.

The fix was adding an isLoaded boolean state. 
The save effect now checks if(!isLoaded) return 
before writing anything. The load effect sets 
isLoaded to true after successfully reading. This 
ensures the save effect never fires before the 
load effect completes.

What I learned: when two useEffect hooks touch 
the same external resource, you need explicit 
coordination between them. React does not 
guarantee useEffect execution order across 
renders the way you might assume.

---

## Question 2 — A Decision I Reversed Mid-Week

I initially installed the @anthropic-ai/sdk package 
to integrate the Anthropic API for the personalized 
summary feature. This seemed like the obvious choice 
— use the official SDK.

After writing the integration, I realized the SDK 
was adding complexity without any real benefit. The 
SDK abstracts the HTTP call, but I needed precise 
control over timeout behavior and fallback logic. 
With the SDK, the error handling was less transparent 
— I couldn't easily intercept failures and route 
them to my template fallback.

I reversed the decision on Day 2 and rewrote the 
summary route using a direct fetch() call to the 
Anthropic API endpoint. This gave me full control 
over the try/catch flow, made the fallback behavior 
explicit and easy to test, removed 200KB of 
unnecessary bundle weight, and made the code 
readable to any developer without SDK knowledge.

The lesson was: don't add a dependency just because 
it exists. If raw fetch handles the job clearly and 
gives you more control, use it. Abstractions have 
a cost — they hide behavior you sometimes need to 
see.

---

## Question 3 — What I Would Build in Week 2

**First: Dynamic OG Image Generation**
The shareable /audit/[id] URL currently has Open 
Graph meta tags but no image. When shared on 
Twitter or LinkedIn, no preview card appears. I 
would add Vercel's @vercel/og library to generate 
a dynamic image showing the savings number in 
large text on a branded card. This single change 
would dramatically increase click-through rate 
on shared links — it's the difference between 
a plain URL and a compelling visual card.

**Second: Embeddable Widget**
A script tag that any blogger or AI tool review 
site could drop into their page. When embedded, 
it shows a mini audit form. This turns every AI 
tool comparison blog into a distribution channel. 
The blogger embeds it once, their readers use it 
continuously, and Credex receives leads from 
audiences we would never reach through direct 
marketing.

**Third: Benchmark Mode**
Add team-size-based comparisons: "Your team spends 
$X per developer per month. Teams your size 
average $Y." This context transforms the product 
from a savings calculator into a competitive 
intelligence tool. A user who thinks their spending 
is normal suddenly sees they are 40% above average 
for their team size. That urgency converts passive 
visitors into active Credex customers.

---

## Question 4 — How I Used AI Tools

I used Claude throughout the week as my primary 
development assistant via the Antigravity IDE.

**What I used AI for:**
- Generating initial component boilerplate and 
  TypeScript type definitions
- Scaffolding the audit engine logic from rules 
  I described in plain English
- Writing first drafts of markdown documentation
- Debugging TypeScript compilation errors
- Suggesting fixes during code review passes

**What I did NOT trust AI with:**
- Architectural decisions — I personally decided 
  Next.js over plain React, Supabase over Firebase, 
  raw fetch over the Anthropic SDK
- Pricing data verification — I checked every 
  number against official vendor pricing pages
- The audit logic reasoning — I verified each 
  savings calculation manually with real numbers
- User interviews — these were real conversations 
  with real people
- Final review before every commit — I read every 
  generated file before staging it

**One specific time AI was wrong and I caught it:**
When I asked Claude to set up the Anthropic API 
integration, it generated code using 
@anthropic-ai/sdk and also installed uuid@14 
paired with @types/uuid@10 — mismatched major 
versions that caused TypeScript warnings. I caught 
both issues during a systematic code audit. I 
removed the SDK entirely and downgraded both 
uuid packages to aligned v9 versions. The AI 
generated working-looking code that had real 
problems underneath — catching that required 
actually reading and understanding the output, 
not just accepting it.

---

## Question 5 — Self Ratings

**Discipline: 6/10**
I started strong on Days 1-2 with consistent 
commits and clear progress. Mid-week I had some 
sessions that were less focused. The git history 
reflects this honestly — some days have more 
meaningful commits than others.

**Code Quality: 8/10**
TypeScript strict mode throughout with zero any 
types. Clean abstractions across auditEngine, 
pricingData, and shared UI components. Eight 
passing Vitest tests. Lost two points for leaving 
a console.log in production code that I caught 
during the final audit.

**Design Sense: 7/10**
The results page is clean, visually clear, and 
screenshot-worthy with the emerald green savings 
hero. The form works well functionally. I would 
give myself higher if I had added the OG image 
generation and spent more time on mobile 
responsiveness.

**Problem Solving: 8/10**
Found and fixed five real bugs through systematic 
code auditing rather than guessing — the 
localStorage race condition, wrong lead field 
name, missing database migration, incorrect spend 
calculation in the AI summary, and uuid version 
mismatch. Each required forming a hypothesis and 
testing it rather than changing random things.

**Entrepreneurial Thinking: 7/10**
The isHighSavings flag connecting the free tool 
to Credex's sales motion was my own insight. 
GTM and ECONOMICS documents show genuine business 
reasoning with real numbers. Lost points for not 
completing user interviews earlier in the week — 
I underestimated how much scheduling real 
conversations takes.