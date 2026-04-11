# Biashara Agent

An AI-powered business intelligence agent for Kenyan microenterprises, built on the Lua platform. The agent monitors M-Pesa transactions, computes credit readiness scores, and proactively delivers financial insights via WhatsApp.

## Overview

Biashara Agent transforms M-Pesa transaction data into actionable credit readiness insights for small business owners. The agent runs autonomously, sending morning briefings, monitoring credit thresholds, and automatically generating loan proposals when businesses reach lender-readiness milestones.

**Live Demo:** [https://biashara.chequemate.space/public/dashboard.html](https://biashara.chequemate.space/public/dashboard.html)

## Features

### 🤖 Autonomous Agent Capabilities

- **Morning Briefings** — Daily WhatsApp summaries at 7 AM EAT with revenue analysis and credit updates
- **Credit Threshold Monitoring** — Automatic alerts when score crosses 45, 60, or 75 points
- **Loan Research** — Weekly scans of KCB, Equity, M-Shwari, and SACCO lending policies
- **Low Sales Recovery** — Sends discount campaigns to customers when revenue drops 20%+ below average

### 📊 Dashboard Features

- Real-time credit readiness score visualization
- 90-day revenue analytics with trend charts
- Comprehensive loan proposal generator (3-page PDF with charts)
- Customer campaign management (WhatsApp discount offers)
- Automated job monitoring and configuration

### 📄 Loan Proposal Generation

The agent generates professional, lender-ready proposals including:
- Executive summary with 90-day performance analysis
- Bank-facing metrics (revenue, growth, consistency, regularity)
- 30-day revenue trend visualization
- Credit score breakdown charts
- Lender-readiness checklist with progress bars
- Strategic recommendations for improvement

### 💬 WhatsApp Integration

Business owners interact naturally via WhatsApp:
- "Show my credit profile" → Instant score with reasoning
- "Simulate a KES 850 sale" → Transaction recorded, score updated
- "Generate a loan summary for KCB" → Professional PDF proposal
- Automatic notifications for threshold crossings and opportunities

## Architecture

```
WhatsApp (Owner) ←→ Lua AI Agent
                        ↓
                    Biashara Skill
                        ↓
                Backend API (Node.js + SQLite)
                        ↓
            M-Pesa Transaction History (90 days)
```

**Tech Stack:**
- **Agent Framework:** Lua AI Platform
- **Backend:** Node.js + Express + SQLite
- **Frontend:** Tailwind CSS + Chart.js
- **Deployment:** Ubuntu server + Apache + Cloudflare

## Quick Start

### Prerequisites

- Node.js 24+ (with NVM recommended)
- SQLite 3
- Lua CLI (`npm install -g lua-cli`)
- Lua account (sign up at https://www.heylua.ai)

### 1. Clone and Install

```bash
git clone <repository-url>
cd biashara-agent-3
npm install
```

### 2. Set Up Backend

```bash
cd backend
npm install
node src/seed.js    # Seeds 90 days of realistic transaction data
node src/index.js   # Starts on port 4000
```

Verify: http://localhost:4000/health

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
BACKEND_API_URL=https://your-backend-url
BACKEND_API_SECRET=your-secret-key
OWNER_USER_ID=your-whatsapp-user-id
```

### 4. Deploy Agent

```bash
npm run build
lua push
lua deploy
```

Deploy each component:
```bash
lua deploy skill
lua deploy webhook
lua deploy job
```

### 5. Link WhatsApp

1. Go to Lua dashboard
2. Link your WhatsApp number to the agent
3. Get your user ID from admin.heylua.ai → Activity
4. Update `OWNER_USER_ID` in `.env`

## Production Deployment

The project is deployed at:
- **Backend API:** https://biashara.chequemate.space
- **Dashboard:** https://biashara.chequemate.space/public/dashboard.html
- **Agent ID:** baseAgent_agent_1775818206174_333z8yqh1

### Server Setup (Ubuntu + Apache)

```bash
# Install dependencies
sudo apt update && sudo apt install nodejs npm sqlite3

# Set up project
cd /root/biashara-backend
npm install
node src/seed.js

# Create systemd service
sudo nano /etc/systemd/system/biashara-backend.service
```

Service file:
```ini
[Unit]
Description=Biashara Backend API
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/biashara-backend
ExecStart=/root/.nvm/versions/node/v24.12.0/bin/node src/index.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable biashara-backend
sudo systemctl start biashara-backend
```

### Apache Configuration

```apache
<VirtualHost 77.68.100.188:80>
    ServerName biashara.chequemate.space

    ProxyPreserveHost On
    ProxyPass / http://localhost:4000/
    ProxyPassReverse / http://localhost:4000/
</VirtualHost>
```

## Agent Components

### Skills

**biashara-core** — Main skill exposing tools:
- `get_transaction_summary` — 7, 30, or 90-day revenue analysis
- `get_credit_profile` — Real-time credit score calculation
- `generate_financial_summary` — Lender-specific loan proposals
- `simulate_transaction` — Demo mode for testing
- `analyze_anomaly` — Revenue anomaly detection
- `refresh_loan_research` — Update lending policy database
- `send_customer_campaign` — Trigger WhatsApp discount offers

### Webhooks

**mpesa-callback** — Receives M-Pesa Daraja callbacks:
- Records incoming transactions
- Runs anomaly analysis
- Updates credit score
- Notifies owner if significant change detected

### Jobs (Cron-Scheduled)

**morning-briefing** — Daily at 7 AM EAT
- Sends WhatsApp summary of yesterday vs 7-day average
- Includes current credit score and what changed
- Actionable recommendation for the day

**credit-threshold-check** — Every 6 hours
- Monitors score against milestones (45, 60, 75)
- Celebrates threshold crossings
- Auto-generates loan proposal at 45+ score

**loan-research-refresh** — Weekly on Monday at 6 AM
- Scans KCB, Equity, M-Shwari, SACCO websites
- Updates lending criteria in database
- Refreshes proposal guidance

**low-sales-recovery** — Every 4 hours (8am, 12pm, 4pm, 8pm)
- Detects revenue drops 20%+ below average
- Generates AI-powered discount messages
- Sends WhatsApp campaigns to customer list (max 2/day)

## Credit Scoring Algorithm

The agent computes a 0-100 score from four sub-scores (each 0-25):

- **Consistency (25 points)** — Revenue stability across weeks
- **Growth (25 points)** — Recent 30-day performance vs baseline
- **Retention (25 points)** — Repeat customer signal (placeholder)
- **Regularity (25 points)** — Trading frequency and zero-gap weeks

**Lender-Readiness Thresholds:**
- **45+** — SACCO microfinance eligible
- **60+** — Bank micro-loan ready
- **75+** — Competitive for SME facilities

## API Endpoints

### Public Endpoints (with token)

```bash
GET  /api/credit/profile?token=demo-2026
GET  /api/transactions/summary?days=90&token=demo-2026
GET  /api/proposals?token=demo-2026
GET  /api/campaigns?token=demo-2026
```

### Authenticated Endpoints (require x-api-secret header)

```bash
POST /api/transactions/simulate
POST /api/campaigns/send
POST /api/documents
POST /api/research/refresh
GET  /api/settings
POST /api/settings
```

## Database Schema

**transactions** — M-Pesa transaction records
**credit_snapshots** — Historical credit scores
**proposals** — Generated loan packages
**campaigns** — Customer discount campaigns
**settings** — Agent configuration
**research_updates** — Lender policy snapshots

## Development

### Running Locally

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Agent (after deploying)
lua logs
```

### Testing

```bash
# Test transaction simulation
curl -X POST http://localhost:4000/api/transactions/simulate \
  -H "x-api-secret: dev-secret" \
  -H "Content-Type: application/json" \
  -d '{"amount": 1200, "description": "Test sale"}'

# Test credit profile
curl http://localhost:4000/api/credit/profile?token=demo-2026
```

## Contributing

This is a demonstration project built for exploring AI agent capabilities in microfinance. Contributions welcome for:
- Enhanced scoring algorithms
- Additional lender integrations
- Customer retention analytics
- Multi-business support

## License

MIT

## Acknowledgments

Built with [Lua AI Platform](https://www.heylua.ai) for autonomous agent orchestration.
