# USER_INTERVIEWS.md

## Interview 1
**Name:** Dinesh G
**Role:** Founder
**Company stage:** Early-stage startup
**Date:** 2026-05-12
**Method:** WhatsApp conversation
**Duration:** ~15 minutes

### AI Tools They Use
Cursor, Antigravity (primary IDE), Claude via
Antigravity, Gemini via Antigravity. Uses multiple
AI tools simultaneously through one platform rather
than paying for each separately.

### Direct Quotes
- "I compare time efficiency and switch — if one
  tool does in 1 hour what another does in 3 days,
  where will I go? I'll choose the 1 hour one."

- "The tool can't say I'm overpaying because I know
  which tool to use for what — one AI tool spends
  tokens for particular things and another costs
  tokens for particular things."

- "Antigravity charges per hour but I don't always
  know how much I've used in that time — I just
  pay for it."

### Most Surprising Thing They Said
He pushed back on the core premise of the tool.
He argued that a spend audit is less useful for
power users who actively monitor tool efficiency
— his switching decisions are based on time saved,
not cost per month. This challenged my assumption
that all users want to minimize spend. Some users
optimize for output per hour, not cost per month.

### What It Changed About Your Design
Added use-case context to the audit results —
instead of only showing "switch to save money,"
recommendations now include capability reasoning
("for coding workflows, this tool gives equivalent
output at lower cost"). This makes the tool
relevant even for efficiency-focused users, not
just cost-cutters.

---

## Interview 2
**Name:** Praveen S
**Role:** Engineering Manager
**Company stage:** Mid-size SaaS company
**Date:** 2026-05-13
**Method:** Google Meet conversation
**Duration:** ~20 minutes

### AI Tools They Use
GitHub Copilot, Cursor, ChatGPT Team, Claude,
Perplexity. Team also experiments with Gemini
for documentation and research tasks.

### Direct Quotes
- "I don't care if one tool is $20 more expensive
  if it saves developer time across the whole team."

- "Half the time we forget which subscriptions are
  still active because different teams buy tools
  separately."

- "Most people in the team stay on the default plan
  unless finance pushes back."

### Most Surprising Thing They Said
He was less concerned about individual developer
usage and more focused on visibility across teams.
The bigger problem was fragmented subscriptions —
different developers independently purchasing tools
without centralized tracking. The issue was not
whether tools were useful, but whether the company
had visibility into overlapping spend.

### What It Changed About Your Design
Added the idea of "team-wide duplicate detection."
Instead of only comparing tool pricing, the product
now flags overlapping subscriptions and shows where
multiple tools provide similar functionality. This
shifted the product from a personal cost tracker
to a lightweight AI spend management platform
for teams.

---

## Interview 3
**Name:** Aarthi K
**Role:** Freelance Full Stack Developer
**Company stage:** Independent freelancer
**Date:** 2026-05-13
**Method:** Discord call
**Duration:** ~12 minutes

### AI Tools They Use
Cursor, ChatGPT Plus, Claude, Gemini Free, v0 by
Vercel for UI generation, and occasional use of
Perplexity for research.

### Direct Quotes
- "I switch tools depending on the client work —
  frontend work, debugging, and content tasks all
  need different strengths."

- "I honestly don't track my AI spending carefully
  because every tool feels necessary at some point."

- "Free plans are useful until rate limits slow
  down actual work."

### Most Surprising Thing They Said
She treated AI subscriptions like operational
expenses rather than optional tools. Instead of
asking "Which tool is cheapest?", her mindset was
"Which combination of tools reduces client delivery
time?" Cost mattered only when two tools produced
similar quality output.

### What It Changed About Your Design
Added workflow-based recommendations instead of
single-tool replacement suggestions. Rather than
telling users to completely switch tools, the
product now recommends optimized tool stacks for
specific workflows like frontend development,
research, debugging, or content generation.

---

## Synthesis

### Common Themes

**1. Cost is secondary to output quality and speed**
All three users — a founder, an engineering manager,
and a freelancer — evaluated AI tools primarily on
time saved and output quality, not monthly price.
Cost only became relevant when two tools produced
comparable results.

**2. Nobody tracks AI spend carefully**
Dinesh didn't know his exact Antigravity hourly
cost. Praveen's team had forgotten active
subscriptions. Aarthi didn't track spend because
"every tool feels necessary." This confirms the
core product hypothesis — users genuinely don't
know if they're overpaying.

**3. Team visibility is a larger problem than
individual overspend**
Praveen's interview revealed a problem bigger than
plan optimization: fragmented purchasing across
teams with no central visibility. Individual
developers buy tools independently, leading to
duplicate subscriptions nobody tracks.

### Biggest Surprise Across All Interviews
Interview 1 directly challenged the product's core
premise. Dinesh argued that a power user already
knows which tool to use — the audit adds less value
for him. This revealed that the real target user is
not the developer who uses the tools daily, but
the engineering manager or founder who approves
budgets without visibility into actual usage.
Praveen's interview confirmed this completely.

### How Interviews Changed the Product

**Before interviews:** The tool was framed as a
personal cost checker — "find out if YOU are
overpaying."

**After interviews:** The framing shifted toward
team-level visibility — "find out if YOUR TEAM
has overlapping or mismatched subscriptions."

Specific changes made or planned based on
these conversations:
- Audit results now include capability reasoning
  alongside cost reasoning, not just price comparison
- Added "team size mismatch" logic — flagging when
  a team plan is purchased for too few or too many
  users
- Planned: duplicate tool detection across similar
  use cases (e.g. Cursor + Copilot both active for
  the same coding workflow)
- Planned: benchmark mode showing spend per
  developer compared to similar team sizes —
  directly addressing Praveen's visibility problem