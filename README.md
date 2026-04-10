# Biashara Agent — Setup Guide

## What this is
An agent-first AI business agent for Kenyan microenterprises, built on Lua.
It watches M-Pesa transactions, computes a credit readiness score, and
proactively surfaces insights on WhatsApp — without the owner having to ask.

## Architecture
```
WhatsApp Owner ←→ Lua Agent (your existing agent0)
                      ↓ tools call
                  Biashara Backend API (Node.js, SQLite)
                      ↓
                  90 days of simulated M-Pesa data
```

---

## STEP 1 — Set up the backend (run once)

```bash
cd biashara-agent/backend
npm install
node src/seed.js    # Seeds 90 days of realistic transaction data
node src/index.js   # Starts backend on port 4000
```

Verify: open http://localhost:4000/health — should show transaction count.

---

## STEP 2 — Expose backend to internet (for Lua to reach it)

Option A — Your Linux server (recommended):
```bash
# On your server: scp the backend folder up, then:
cd backend && npm install && node src/seed.js && node src/index.js
# Set up nginx reverse proxy to port 4000
# Your URL: https://biashara.yourdomain.com
```

Option B — ngrok for quick local testing:
```bash
ngrok http 4000
# Copy the https://xxxxx.ngrok.io URL
```

Set BACKEND_API_URL in your .env to whichever URL you use.

---

## STEP 3 — Set up the Lua agent (CLI)

```bash
cd biashara-agent
npm install -g lua-cli
lua auth configure          # Use your Lua account email
lua init                    # Choose "Connect to existing agent"
                            # Agent ID: baseAgent_agent_1775730399099_sycgb6y

cp .env.example .env
# Edit .env:
#   BACKEND_API_URL=https://your-backend-url
#   BACKEND_API_SECRET=choose-a-random-string
#   OWNER_USER_ID=  (get this from Step 4)
```

---

## STEP 4 — Get your WhatsApp user ID

After linking your WhatsApp to the agent (via Bob → link-me-to:), you need your Lua user ID.

In the Lua admin (admin.heylua.ai), go to Activity → find your WhatsApp conversation → copy the user ID.
Or message the agent "what is my user id?" and it will tell you.

Set OWNER_USER_ID in .env to this value.

---

## STEP 5 — Deploy

```bash
npm install
lua push && lua deploy
```

After deploy, `lua push webhook` will print your webhook URL:
```
https://webhook.heylua.ai/baseAgent_agent_1775730399099_sycgb6y/mpesa-callback
```

Set this as your Daraja sandbox callback URL (or use it for the simulate button).

---

## STEP 6 — Test the demo loop

1. Message the agent on WhatsApp: "show my credit profile"
2. Ask: "simulate a KES 850 sale of unga and sugar"
3. Ask: "generate a financial summary for KCB"
4. Watch the morning briefing fire at 7am

---

## Demo script (5-minute pitch)

### Minute 1 — The problem (30 seconds)
"65% of Kenyan SME loan applications are rejected — not because businesses 
aren't viable, but because their M-Pesa data is invisible to lenders. 
The money flows. The records don't exist."

### Minute 2 — The agent (60 seconds)
Show WhatsApp. Type: "habari, niambie kuhusu biashara yangu"
Agent responds with credit score and reasoning. Explain: "it woke up, 
pulled 90 days of data, reasoned about consistency and growth, and 
generated that — I didn't ask for a number, I said hello."

### Minute 3 — Agent-first moment (90 seconds)
"Now watch what happens when a payment comes in."
Type: "simulate KES 1,200 sale"
Agent: records it, runs anomaly analysis, updates credit score, responds.
"That's the sense-plan-act loop. The agent owned the outcome — 
I didn't tell it to check the score. It decided to."

### Minute 4 — The financial summary (60 seconds)
Type: "generate my loan summary for KCB"
Show the structured output. "This is what we're really building — 
invisible M-Pesa data, made legible. The owner can walk into KCB 
with this document the agent generated, automatically, from their 
daily transactions."

### Minute 5 — Agent-first design / stickiness (30 seconds)
"The morning briefing fires at 7am every day without the owner asking. 
The credit check runs every 6 hours. The agent notifies the owner when 
they cross a lending threshold — before they knew to look. 
That's stickiness. That's why they won't switch it off."

---

## Environment variables reference

| Variable | Description |
|---|---|
| BACKEND_API_URL | Your backend base URL (e.g. https://biashara.yourdomain.com) |
| BACKEND_API_SECRET | Shared secret between Lua tools and backend |
| OWNER_USER_ID | Lua user ID of the business owner's WhatsApp |
