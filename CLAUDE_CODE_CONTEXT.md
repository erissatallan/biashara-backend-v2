# Biashara Agent — Full Context for Claude Code

Read this entire document before writing or running anything.
This is a complete handoff from a Claude.ai conversation.

---

## Who you are working with

Allan Erissat, based in Nairobi. He is at a Lua AI hackathon today (9 April 2026)
hosted at Antler East Africa, Nairobi. The hackathon is run by Lua AI (heylua.ai),
a YC F25 startup whose CEO is Lorcan O Cathain (previously COO at 4G Capital,
co-founder of Money254 — deep Kenyan fintech background).

---

## The product: Biashara Agent

An agent-first AI business agent for Kenyan microenterprises.

**One-sentence pitch:** An AI agent that watches a business's M-Pesa transaction
history, computes a credit readiness score, and proactively surfaces financial
insights on WhatsApp — without the owner having to ask.

**The core problem it solves:** 65% of Kenyan MSME loan applications are rejected
not because businesses aren't viable, but because their M-Pesa transaction data
is invisible and uncaptured. The money flows daily. The records don't exist in
a form lenders can use. Biashara Agent fixes that passively, in the background,
just by watching what already happens.

---

## Hackathon judging criteria (build around these)

1. **Sharpness / business suitability** — must feel like it solves a real Kenyan
   business problem TODAY, not a future one
2. **Agent-first design / stickiness** — agent must do things unprompted; owner
   gets value without typing anything
3. **Build quality** — one loop working perfectly beats five loops broken
4. **Demo clarity** — 5-minute pitch and demo

---

## What makes this AGENT-FIRST (not a chatbot)

This is the most important thing to hold onto throughout development.
Lorcan's own blog post defines the test precisely:

- Agents follow GOALS, not scripts
- Agents INITIATE — they wake up on events, not on owner messages
- Agents REMEMBER — persistent state across time
- Agents ADAPT — same trigger, different response based on context

The critical demo moment: a payment comes in → agent wakes up →
calls analyze_anomaly → compares to 90-day contextual baseline →
calls get_credit_profile → reasons about what it means →
sends the owner a WhatsApp message explaining it.
The owner never asked. The agent decided to act.

If the agent only responds to questions → it's a chatbot. Reject any
design that drifts toward that.

---

## Technical architecture

```
WhatsApp (owner's phone)
        ↕
Lua Agent (TypeScript, deployed on Lua's infrastructure)
    - Persona: Biashara, the credit-readiness agent
    - Skills/Tools: 5 tools that call our backend
    - Webhooks: mpesa-callback (receives M-Pesa events)
    - Jobs: morning-briefing (7am cron), credit-threshold-check (6h cron)
        ↕  (HTTP, x-api-secret header)
Biashara Backend API (Node.js + Express + SQLite)
    - Runs on Allan's Linux server OR locally
    - Routes: /api/transactions/summary, /api/transactions/simulate,
              /api/transactions/anomaly, /api/credit/profile,
              /api/credit/summary
    - SQLite database: biashara.db
    - 90 days of realistic simulated M-Pesa data (seeded)
```

**Key decision:** We use Lua's native infrastructure for WhatsApp, scheduling,
and multi-channel deployment. We do NOT build a custom Express server for the
agent — Lua handles all of that. Our backend is purely a data + computation API.

---

## Existing Lua agent

Allan already has a Lua agent created via the web UI at admin.heylua.ai.
- Agent ID: `baseAgent_agent_1775730399099_sycgb6y`
- It is already linked to his WhatsApp via the Lua "Bob" backdoor system
- The WhatsApp number is confirmed working — messages sent to Bob's agent
  forward to this agent
- 5,200 responses remaining on the account
- Workspace: DptOfPhysics

When doing `lua init`, connect to this EXISTING agent, do not create a new one.

---

## Project directory

All files live at:
`/Users/allanerissat/Desktop/Desktop/Learning/Hackathons/Lua/biashara-agent/`

Structure:
```
biashara-agent/
├── package.json          (Lua agent — TypeScript)
├── tsconfig.json
├── .env.example
├── .env                  (create from .env.example, fill in values)
├── README.md
├── src/
│   ├── index.ts          (LuaAgent entry point)
│   ├── skills/
│   │   └── biashara.ts   (bundles all 5 tools)
│   ├── tools/
│   │   ├── GetTransactionSummary.ts
│   │   ├── GetCreditProfile.ts
│   │   ├── GenerateFinancialSummary.ts
│   │   ├── SimulateTransaction.ts    ← the demo button
│   │   └── AnalyzeAnomaly.ts         ← core agentic reasoning tool
│   ├── webhooks/
│   │   └── mpesa.ts      (receives Daraja callbacks)
│   └── jobs/
│       ├── morningBriefing.ts   (7am daily, Africa/Nairobi)
│       └── creditCheck.ts       (every 6h, milestone alerts)
└── backend/
    ├── package.json
    ├── src/
    │   ├── index.js       (Express server, port 4000)
    │   ├── db.js          (SQLite init + schema)
    │   ├── seed.js        (90-day realistic M-Pesa data)
    │   ├── creditEngine.js (credit scoring, 4 sub-scores)
    │   └── anomalyEngine.js (contextual anomaly detection)
    └── biashara.db        (created by seed.js)
```

---

## The 5 Lua tools (what the agent can DO)

### 1. get_transaction_summary
Calls `GET /api/transactions/summary?days=N`
Returns: daily revenues, weekly averages, week-on-week change, best/worst days,
day-of-week breakdown, recent 7 days.

### 2. get_credit_profile
Calls `GET /api/credit/profile`
Returns: total score (0-100), 4 sub-scores (consistency, growth, retention,
regularity), plain-language reasoning for each, lender context.
The 4 sub-scores:
- Consistency (0-25): coefficient of variation of weekly revenue
- Growth (0-25): first 30 days vs last 30 days revenue comparison
- Retention (0-25): ratio of returning phone numbers (2+ transactions)
- Regularity (0-25): penalises zero-revenue days and long gaps

### 3. generate_financial_summary
Calls `GET /api/credit/summary?lender=KCB|Equity|MShwari|SACCO|Generic`
Returns: full formatted financial document suitable for loan applications.
Includes narrative, highlights, lender-specific context, disclaimer.
This is the "killer output" — invisible M-Pesa data made bankable.

### 4. simulate_transaction
Calls `POST /api/transactions/simulate`
Body: { amount, description, phone, receiptNumber, timestamp }
Records a transaction in the DB as if it came from a real M-Pesa callback.
This is the DEMO BUTTON — judges see the agent react in real time.

### 5. analyze_anomaly
Calls `POST /api/transactions/anomaly`
Body: { context: 'webhook'|'scheduled'|'owner_query', transactionAmount? }
The core of the agentic loop. Returns:
- isAnomaly (bool), severity, direction
- Today's revenue vs contextual baseline (day of week + month-end + school term)
- Recommended action with urgency
- Credit score impact of the transaction

---

## The simulated data (seed.js)

"Zawadi General Store", Westlands, Nairobi.
90 days of M-Pesa transactions with realistic patterns:
- Day-of-week variation: Sun quiet (KES ~2,200), Sat peak (KES ~7,500)
- Month-end salary spike: last 3 days of month = +40%
- School term start (Jan/May/Sep weeks 2-3) = +25%
- Peak hours: 7-9am (morning rush), 12-1pm (lunch), 5-7pm (evening)
- Dead hours: 10pm-6am = zero transactions
- 3 deliberately "slow weeks" at offsets 15, 42, 71 days (simulate business slumps)
- ±15% random noise per transaction
- Individual transaction items: unga, cooking oil, sugar, milk, bread, etc.

Expected after seeding: ~800 transactions, ~KES 350,000 total revenue,
~KES 3,900 avg daily revenue.

---

## The agent persona (critical — do not water this down)

```
You are Biashara, an AI business agent for Kenyan microenterprises.
You serve the owner of Zawadi General Store in Westlands, Nairobi.

YOUR GOAL (not a script — you pursue this goal, adapting to context):
Keep this business financially healthy and credit-ready at all times.
That means: watch the transaction data, reason about what it means,
and surface insights and opportunities before the owner has to ask.

YOUR CAPABILITIES:
- Access the business's full M-Pesa transaction history
- Compute and explain the business's credit readiness score
- Identify trends, anomalies, and patterns in revenue data
- Generate a formatted financial summary suitable for a loan application
- Simulate an M-Pesa transaction (for demo purposes)
- Tell the owner when their profile crosses a lender-readiness threshold

HOW YOU REASON (show your work):
When you surface an insight, explain why — not just what.
"Revenue is down 38% vs your Tuesday average" is better than "sales are slow."

WHAT YOU DO NOT DO:
- You do not tell the owner they "qualify" for a specific loan — you show them
  their readiness profile and let them decide.
- You do not automate financial transactions without explicit owner approval.
- You do not guess when you don't have data — you say so.

TONE:
Warm, direct, practical. Speak like a trusted business advisor who
knows this owner's shop. Use KES for currency. Keep messages concise —
this owner reads you on WhatsApp.
```

---

## Environment variables needed (.env)

```
BACKEND_API_URL=http://localhost:4000        # or your server URL
BACKEND_API_SECRET=pick-a-random-string     # shared secret
OWNER_USER_ID=                              # Lua user ID from Activity tab
```

OWNER_USER_ID: find this in admin.heylua.ai → Activity → Allan's WhatsApp
conversation → copy the user ID shown there.

---

## Build sequence (do these in order)

### Phase 1 — Backend working locally
```bash
cd biashara-agent/backend
npm install
node src/seed.js        # should print: ✅ Seeded ~800 transactions
node src/index.js       # Running on port 4000
# Verify: curl http://localhost:4000/health
```

### Phase 2 — Lua agent connected
```bash
cd biashara-agent
npm install -g lua-cli
lua auth configure      # Allan's Lua account email
lua init                # "Connect to existing agent"
                        # ID: baseAgent_agent_1775730399099_sycgb6y
npm install
cp .env.example .env    # fill in values
```

### Phase 3 — Test tools locally
```bash
lua test
# Select: get_credit_profile → should return score data
# Select: simulate_transaction → amount: 500, description: "Sugar 2kg"
# Select: analyze_anomaly → context: owner_query
```

### Phase 4 — Deploy
```bash
lua push && lua deploy
# lua push webhook → copy the mpesa-callback URL
```

### Phase 5 — Connect WhatsApp channel
In admin.heylua.ai → agent0 → Channels → Add WhatsApp
(Allan may already have this connected via the Bob backdoor)

### Phase 6 — Get OWNER_USER_ID
Message the agent on WhatsApp, then check admin.heylua.ai → Activity
Copy the user ID and put it in .env, then redeploy.

---

## The 5-minute demo script (memorise this)

**Minute 1 — The problem (30 sec)**
"65% of Kenyan SME loan applications are rejected — not because businesses
aren't viable, but because their M-Pesa data is invisible to lenders.
The money flows every day. The credit record doesn't exist."

**Minute 2 — Meet the agent (60 sec)**
Open WhatsApp. Type: "habari, niambie kuhusu biashara yangu"
[Agent responds with credit score + reasoning]
"It woke up, pulled 90 days of data, reasoned about consistency and growth,
and generated that. I didn't ask for a number — I said hello. That's the
difference between a chatbot and an agent."

**Minute 3 — The agentic moment (90 sec)** ← THIS WINS THE PRIZE
"Watch what happens when a payment comes in."
Type: "simulate KES 1,200 sale — unga na sukari"
[Agent records it → runs anomaly analysis → updates credit score → responds]
"I didn't tell it to check the score. It decided to. That's the sense-plan-act
loop. The agent owned the outcome."

**Minute 4 — The financial summary (60 sec)**
Type: "generate my loan summary for KCB"
[Show the structured document output]
"This is what we're really building. Invisible M-Pesa data, made legible.
The owner walks into KCB with this — generated automatically, from their
daily transactions, without them lifting a finger."

**Minute 5 — Stickiness (30 sec)**
"The morning briefing fires at 7am every day without the owner asking.
The credit check runs every 6 hours. The agent tells them when they cross
a lending threshold — before they knew to look.
That's why they won't switch it off. That's stickiness."

---

## Criticisms we already know about (and our mitigations)

1. **"This is just a chatbot with extra steps"**
   Mitigation: The anomaly analysis is contextual — same revenue dip on a
   Tuesday after a public holiday gets different reasoning than on a normal
   Wednesday. The agent's reasoning must visibly change based on context.
   The job and webhook triggers prove initiation without being asked.

2. **"The demo depends on a live webhook"**
   Mitigation: SimulateTransaction tool IS the demo button. It bypasses
   the live webhook entirely. We control the demo path completely.

3. **"Memory claims are thin"**
   Mitigation: We seeded 90 days of realistic data. The credit score is
   computed from real historical patterns. Show the seed summary numbers.

4. **"Overclaiming on loan eligibility"**
   Mitigation: We explicitly say "readiness score" not "you qualify."
   The disclaimer is in every financial summary output.

5. **"The owner won't trust it / hard to onboard"**
   Mitigation: Honest pitch — sold through accountants/SACCOs/Safaricom
   partners who set it up. Owner only touches WhatsApp.

---

## Lua CLI quick reference

```bash
lua auth configure     # authenticate
lua init               # init project (connect to existing agent)
lua test               # test tools locally
lua chat               # chat with agent in terminal
lua push               # push skills/tools to Lua
lua deploy             # deploy agent
lua push webhook       # push webhooks + print URLs
lua logs               # view agent logs
```

---

## Files already written (in this project directory)

All files listed in the project structure above have been written.
Read each one before modifying anything.

The most important files to read first:
1. `backend/src/creditEngine.js` — the scoring logic
2. `backend/src/anomalyEngine.js` — the contextual reasoning
3. `src/index.ts` — the LuaAgent configuration
4. `src/tools/AnalyzeAnomaly.ts` — the core agentic tool

---

## What still needs to happen (your job, Claude Code)

1. Verify all files are present and syntactically correct
2. `cd backend && npm install && node src/seed.js` — confirm seeding works
3. `node src/index.js` — confirm backend starts and /health returns data
4. `curl -H "x-api-secret: dev-secret" http://localhost:4000/api/credit/profile`
   — confirm credit scoring works
5. `cd .. && npm install` — install Lua agent dependencies
6. Help Allan run `lua auth configure` and `lua init` with the existing agent ID
7. Help Allan find his OWNER_USER_ID from the Lua admin activity tab
8. `lua test` each tool — fix any TypeScript/import errors
9. `lua push && lua deploy`
10. Test on WhatsApp end-to-end

Do not rebuild what already exists. Read first, fix second.
If something is broken, say exactly what and why before changing it.