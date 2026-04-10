The Idea That Threads Both Needles
The sweet spot — Africa-relevant, genuinely agent-first, mobile-first, and visually demonstrable — points strongly toward SME business operations.
Here's the specific framing I'd recommend:
An AI Business Agent for Kenyan/African SMEs — think of it as an always-on "business manager" for the kind of informal/semi-formal businesses (chamas, dukas, jua kali workshops, freelancers, small clinics) that dominate the Kenyan economy but are completely underserved by enterprise software.
What makes it agent-first rather than just automation: the agent proactively monitors the business and takes action. It doesn't wait for the owner to ask "how are my sales?" — it notices at 2pm that the day's revenue is 40% below Tuesday's average, determines there's been no M-Pesa inflow from the usual lunchtime rush, and sends a WhatsApp message with a suggested flash sale discount to send to loyal customers. The owner gets a decision ready to execute, not a dashboard to interpret.
Safaricom just introduced what it's calling Fintech 2.0 — described as the most significant M-Pesa update in a decade — including autonomous alerts, customer segmentation, and data-driven credit scoring. Techish This is the infrastructure moment for this kind of product. The Daraja 3.0 API platform has already connected over 100,000 developers with 60,000+ integrations using M-Pesa's cloud-native architecture. Tech In Africa The rails are there.
For the Natively angle: the mobile app wrapping an agent dashboard is genuinely compelling because SMEs in Kenya are entirely mobile-first. Their "office" is their phone. A web app with M-Pesa webhook integrations, wrapped into a branded native app with push notifications firing when the agent takes action, is exactly the kind of demo that wins a community vote — it's real, it's beautiful, and it's obviously useful to people judges know personally.
For the Lua hackathon angle: Lua's platform handles multi-channel deployment (WhatsApp, SMS, web, mobile) from one place, and their East Africa partner is specifically trying to build a pipeline of real deployments in Nairobi. Lua explicitly positions against chatbots — their blog's main argument is that most companies think they have an AI strategy but actually just have a chatbot. heylua Walking in with an agent that owns a business outcome rather than answering questions plays directly into their thesis.

The Honest Caveats
The main friction: the projects on Natively's showcase are predominantly Web3, crypto, portfolio sites and games — which tells you something about the current community composition (global, crypto-adjacent, developer-ish). An African SME agent is a real-world utility play, not a flashy visual demo. It might win the Lua hackathon more convincingly than it wins the Natively community vote. You may need to think about which venue you optimize the presentation for while keeping the underlying product the same.
The other thing worth naming: building something truly agent-first in a hackathon time frame is hard. The risk is building an impressive-looking automation and calling it an agent. If you're going into the Lua hackathon, I'd focus relentlessly on one agent behavior that's genuinely autonomous and decision-making — not five features. One good agentic loop beats a sprawling demo that's just a chatbot with extra steps.
My honest recommendation: build the SME agent, make the web version polished enough to submit to Natively, and lead with the M-Pesa + WhatsApp integration at the Lua hackathon as the proof that this is a real business for a real market that Lua's East Africa partner can actually sell. That's the convergence point.Then let's think through, plan the development of, and build the SME agent that'll get us the Lua prize. We have to keep checking that we're not just building a fancy automation and that it actually owns a business outcome.I can provide credentials for Meta developer, Daraja Sandbox, etc. for plugging in what we need for this solution.Perform the deep research. Let's go.Apr 8Let me research deeply before we write a single line of code.Searched the webSearched the webGood. I now have everything I need. Let me synthesize all of this and give you the full strategic + technical blueprint.Now I have everything I need. Let me build the full strategic + technical plan.
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation-duration: 0.25s;
    animation-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
  }
VvisualizeVvisualize show_widgetGood. Now here's the full research synthesis and development plan.

What the research tells us about Lua's judges
Lorcan's core test for whether something is an agent vs. a workflow builder is this: "Workflow builders follow rules. Agents follow goals." heylua He goes further: a chatbot responds; an agent acts. An agent "observes the state of the world, forms a plan for achieving its goal given that state, executes actions, and then observes again to see whether those actions had the intended effect." heylua
Crucially, one of the defining capabilities is that an agent can "initiate actions without being asked" — it monitors a trigger and acts automatically. heylua That's the line you need to be clearly on the right side of.
The CTO, Stefan Kruger, wrote that the most underrated use case is event-driven workflow automation: when inventory drops below a threshold, the agent alerts the purchasing team; every morning, the agent compiles yesterday's sales data and sends a briefing — "these aren't chatbots, they're autonomous workflows that happen to be powered by AI." heylua
And critically, Lorcan was previously COO at 4G Capital (lending to Kenyan microenterprises) and co-founder of Money254. He has lived this problem. The East Africa partner, Marko Reis, is in Nairobi trying to find real deployable solutions. You are building something they can sell in the room the next morning.
The real SME pain (what the research actually shows)
65% of MSME loan applications to formal Kenyan banks were rejected last year — not because businesses weren't viable, but because they lacked transaction history and traditional collateral. Capitalfm The business data exists — it flows through M-Pesa every day — but it's invisible, uncaptured, and unstructured.
Kenyan consumers live on WhatsApp, and an AI agent connected to WhatsApp Business API can handle product inquiries and customer interactions 24/7 at near-zero cost. Daf-Devs The owner's "office" is their phone. The interface must be WhatsApp.
M-Pesa's Daraja 3.0 API platform has connected over 100,000 developers and 60,000+ integrations — and Safaricom's Fintech 2.0 now includes autonomous alerts and customer segmentation. Tech In Africa The infrastructure exists right now, today, to do this properly.
The product: Biashara Agent
One sentence: An AI agent that owns the outcome of keeping your business revenue stable, by watching every M-Pesa transaction and deciding what to do about it — without you having to ask.
The agent-first test applied ruthlessly:
QuestionAnswerCan it take action, not just generate text?Yes — sends WhatsApp, logs transactions, triggers promotionsDoes it initiate, or only respond?Initiates — wakes up on M-Pesa callback and cron, not on owner messageDoes it remember yesterday?Yes — persistent memory of baselines, customers, what workedWhat happens when things go wrong?Reasons about the anomaly, tries an action, reports outcome, escalates if uncertain
Technical architecture (buildable in a hackathon)
Stack: Node.js backend (hosted on Railway/Render), PostgreSQL (Supabase), Daraja sandbox, WhatsApp Cloud API via Meta developer account.
Three agentic loops:
Loop 1 — Revenue sentinel (event-driven)
M-Pesa STK callback fires → agent reads transaction → updates daily running total → compares to rolling 7-day baseline for this time slot → if deviation > 20%, reasons about cause (slow day? specific product down? time of week?) → decides: send owner alert with options (do nothing / send promo / check inventory) → owner replies on WhatsApp → agent executes chosen action → logs outcome.
Loop 2 — Daily business briefing (scheduled)
Cron fires at 7am → agent pulls yesterday's M-Pesa transactions from database → calculates: revenue vs baseline, top products, customers who haven't returned in 14+ days, inventory approaching reorder threshold → drafts a WhatsApp morning briefing for the owner → includes 1-3 recommended actions with simple reply options (Y/N or numbered choices) → owner replies → agent executes.
Loop 3 — Customer intelligence (event-driven)
Every payment captured → agent identifies phone number → builds/updates customer profile (frequency, average spend, products bought, last visit) → flags customers who are "due" based on their pattern but haven't appeared → proactively messages them via WhatsApp with a personal nudge from the owner.
What makes each loop genuinely agentic:

The agent decides whether the deviation is significant based on context (Tuesday is always slower; school-holiday spike is normal)
The agent has a goal — "maintain revenue within baseline" — not a fixed script
The agent remembers its own actions and their outcomes, feeding that back into future decisions
The owner is the oversight layer, not the execution layer

Development sequence (what to build first)
Start with Loop 1 only. One agentic loop done properly beats three loops that are fancy automations. The demo that wins is: judge sends a simulated M-Pesa callback → agent detects the anomaly → sends a WhatsApp message to the "owner" with a recommended action → owner replies → agent executes. That 60-second demo is the hackathon win.
Credential inputs you'll need:

Daraja sandbox: Consumer Key, Consumer Secret, Shortcode, Passkey, Callback URL
Meta developer: WhatsApp Phone Number ID, Business Account ID, System User Access Token, Webhook Verify Token

When you're ready to share those credentials (please use environment variables, not raw strings), we build the server. The full file structure is:
biashara-agent/
├── src/
│   ├── webhooks/
│   │   ├── mpesa.js        ← receives Daraja callbacks
│   │   └── whatsapp.js     ← receives owner/customer replies
│   ├── agent/
│   │   ├── core.js         ← the sense-plan-act loop
│   │   ├── memory.js       ← read/write business state
│   │   └── tools.js        ← sendWhatsApp, logTransaction, etc.
│   ├── scheduler/
│   │   └── briefing.js     ← 7am cron
│   └── index.js            ← Express server
├── db/
│   └── schema.sql          ← businesses, transactions, customers, actions
└── .env.example
The agent core in core.js is the piece that has to be unambiguously agentic — it calls Claude API with the full business context and the event, asks it to reason about what's happening, and returns a structured action decision. That's the brain. Everything else is pipes.
Ready to start building whenever you share the credentials. I'd suggest starting with the Daraja sandbox first since the M-Pesa callback is the heart of the whole thing.I love the idea. But you've let's play devil's advocate also and let's hear the criticisms.Apr 8Here are the honest criticisms — steelmanned properly.

1. The core agentic claim is fragile
The most dangerous criticism is that what we've described is a sophisticated automation with a Claude call in the middle. The sense-plan-act loop only qualifies as genuinely agentic if the Claude reasoning step actually changes the outcome based on context — not if it's essentially a template picker.
If the logic is: "revenue down 20% → send promo," that's a trigger-action pair. A Zapier workflow. The test is: does the agent's decision change meaningfully when the same revenue dip happens on a Monday after a public holiday vs. a Wednesday in the middle of term time? If yes, and if that contextual reasoning is legible in the output, it's agentic. If the agent produces the same WhatsApp message either way, Lorcan will see through it immediately — and he will know to look, because his own blog post defines exactly this distinction.
What this means for us: the prompt engineering on core.js has to be exceptionally careful. The agent must be shown business history — not just today's numbers — and its output must visibly reflect that reasoning. "I'm recommending a promo because Tuesday 2-5pm is consistently your weakest slot and this isn't unusual" is agentic. "Revenue is down, send a promo?" is not.

2. The memory architecture is under-specified and hard to do well
Persistent memory is one of Lorcan's four tests for a real agent vs. a chatbot. But memory is the hardest part of the system to build correctly in a hackathon time frame.
For memory to be meaningful, the agent needs enough historical data to establish baselines. A business that joined yesterday has no baseline. The 7-day rolling average means nothing on day 3. And if the baselines are wrong or thin, the agent will produce poor decisions — and worse, confidently poor decisions sent to the owner via WhatsApp.
There's also a subtler problem: if you seed the demo database with synthetic data, judges will (rightly) ask whether it works on a real business's real transaction history. The answer is: probably yes, but you can't prove it in the demo, and that gap is a vulnerability.
What this means for us: seed the demo database with realistic synthetic data for a believable business (say, a stationary/supplies duka in Westlands, 8 weeks of M-Pesa history, realistic daily and weekly patterns). Make the baselines legible in the UI — show the owner their revenue curve so they can see what the agent is comparing against. That makes the memory claim concrete rather than abstract.

3. The M-Pesa integration is the most impressive part but the hardest to live-demo
Daraja sandbox simulations are notoriously finicky. The STK push works in sandbox — but the callback requires a publicly accessible HTTPS URL. In a hackathon, that means you're relying on a Railway/Render deploy or an ngrok tunnel not dropping during the demo. If the M-Pesa callback doesn't fire cleanly in front of judges, the entire first agentic loop — the most important one — collapses into you explaining what would happen.
This is not a small risk. It's the most common way technically sound hackathon projects fail their demo.
What this means for us: build a "simulate transaction" button in the dashboard from day one — a button that fires the exact same internal function that the Daraja callback would call, bypassing the live webhook entirely. The real integration is still there and still works, but the demo path doesn't depend on it. Show the real integration as a "this is live on my phone" moment if you can, and fall back to the simulate button if not.

4. WhatsApp as the primary owner interface is a design liability
WhatsApp Business API from Meta has a 24-hour session window problem. If the owner doesn't initiate or respond within 24 hours of the last exchange, you have to use a template message to re-engage them — and template messages require Meta pre-approval, which takes days and has content restrictions. In a hackathon, you almost certainly won't have approved templates.
More fundamentally: an owner who gets WhatsApp messages from their business agent at 7am every day will, within two weeks, start treating them like spam. The system needs to be smart enough not to cry wolf. But in a hackathon demo, you're showing it fire every time there's a deviation — which actually demonstrates the opposite of good agent judgment.
What this means for us: build a simple web dashboard alongside WhatsApp. The dashboard is the monitoring and configuration layer — the owner sees everything there. WhatsApp is reserved for genuinely important events only, not routine briefings. This also makes the demo cleaner: you show the dashboard to judges, and WhatsApp fires once for the big moment (the anomaly alert), not constantly.

5. The market fit narrative has a gap
Lorcan built 4G Capital, which lends to Kenyan microenterprises. He understands this market deeply, which cuts both ways — he'll immediately ask the question we haven't fully answered: why would a duka owner trust an AI agent with their business decisions?
The owner of a small informal business in Nairobi has been burned before: by mobile lenders with predatory rates, by "smart" apps that required internet they didn't reliably have, by SaaS tools that worked until they didn't and left their data stranded. The trust gap is real and the onboarding barrier — "set up your WhatsApp Business API, register your Daraja callback" — is enormous for the actual target user.
This is not a reason not to build it. But presenting it as a solution that a duka owner can self-install is dishonest. The honest version of the pitch is: this is sold through someone — an accountant, a SACCO, a Safaricom business partner — who sets it up for their clients and manages the technical layer. The owner interacts only with WhatsApp and the dashboard. That's a more defensible and actually more interesting business model, and it connects directly to Lua's partner-territory model with Marko Reis.

The honest summary
The idea is genuinely agent-first and the pain is real. The risks are: (a) the agentic reasoning being shallow enough that a sharp judge dismisses it as a chatbot with extra steps, (b) the demo depending on a live webhook that can fail at the worst moment, (c) the memory claims being unverifiable in a short demo, and (d) the go-to-market story understating how hard real user acquisition is.
None of these are fatal. But (a) is the one that wins or loses the Lua prize specifically, because that's the exact distinction Lorcan has publicly written about wanting to see crossed. Every development decision should be measured against it.We must address these gaping holes. Keep  in memory/ mind the fixes you've mentioned for each. We'll implement them during development.a) On the first item of criticism, can you think of ways to assign greater agency or a separate problem entirely that would not be dismissed for a chatbot with extra steps?b) We'll implement the "simulate transaction" buttonc) I could get us an actual microenterprise's data or we could simulate our ownI have remote linux servers that can host the application. No need for railway/ render. I also have domains that we can subdomain and proxy through Cloudflare for public HTTPS accessibility.Apr 8Let's tackle (a) properly — this is the most important design question.
The fundamental problem with Loop 1
Revenue monitoring + "should I send a promo?" is the issue. Even if the reasoning is contextually rich, the decision space is too narrow. There are only a few things an agent can do about low revenue — send a promo, check inventory, or tell the owner. A judge can reasonably argue the contextual reasoning is just a lookup table with extra steps.
The agency problem isn't in the reasoning quality. It's in the action space being too small and the outcome being too predictable.
What makes something unambiguously agentic
Lorcan's sharpest example from his own blog: the agent receives a goal — "ensure every inbound lead gets a qualified briefing to the right AE within 30 minutes." It figures out the steps. If LinkedIn data is sparse, it tries another enrichment source. If the AE is on leave, it routes to their backup. If the lead is in an unfamiliar segment, it flags it for human review. heylua
The key is: the path to the goal is genuinely unknowable in advance, and the agent navigates it by trying things. Not a wide decision tree. Actual multi-step navigation under uncertainty.
Three directions to consider

Option A — Reframe the outcome the agent owns (stronger version of the same idea)
Instead of "monitor revenue and alert," the agent owns: "this business should never run out of its top 5 products."
That outcome requires the agent to:

Watch M-Pesa sales to track which products are moving fast
Estimate days-remaining based on velocity (not static thresholds)
Identify who the supplier is from past messages or owner-provided context
Draft and send a WhatsApp reorder request to the supplier with the right quantities
Follow up if no confirmation arrives within 24 hours
Notify the owner only when the supplier confirms or something goes wrong

This is multi-step, multi-party, crosses two communication channels, and has a real-world dependency (supplier response) the agent has to track and react to. The owner never had to think about stock. The agent owned it.
The reason this is stronger: the path cannot be scripted in advance because the supplier might not reply, might confirm partial quantities, or might be unavailable. The agent has to handle each of those branches differently without a human directing it.

Option B — A different problem entirely: credit-readiness agent
This one is genuinely novel and directly in Lorcan's lived experience from 4G Capital.
The outcome the agent owns: "keep this business's M-Pesa transaction record loan-application-ready at all times."
The core insight from the research: 65% of MSME loan applications were rejected not because businesses weren't viable but because they lacked transaction history and acceptable credit history. Capitalfm The data exists in M-Pesa — it's just invisible and uncaptured.
What the agent does autonomously:

Ingests every M-Pesa transaction continuously
Builds a structured financial profile: revenue trends, seasonality, growth trajectory, customer retention rate, peak hours, consistency score
Monitors the profile against what Kenyan lenders (KCB, Equity, M-Shwari) actually look for in their credit models
When the profile crosses a threshold, the agent proactively tells the owner: "Based on your last 90 days, you now qualify for a KES 80,000 loan from KCB. Here's what your application statement looks like."
Generates a formatted financial summary the owner can actually submit
If a pattern emerges that hurts creditworthiness (irregular deposits, long gaps), the agent flags it and suggests a correction

This is deeply agentic because: the agent is watching for an opportunity the owner doesn't know to look for, doing multi-step analysis to evaluate it, and producing a concrete real-world artifact (the loan summary) the owner can use. The owner never asked. The agent just told them they're eligible.
For Lorcan specifically, this lands differently than revenue monitoring — he built a company to solve exactly this problem through lending. He will understand immediately why this is harder and more valuable than a dashboard.

Option C — Multi-agent architecture (highest ambition, most demonstrably agentic)
Instead of one agent doing everything, you deploy two agents with a defined relationship:
Agent 1 — The Observer: watches M-Pesa callbacks, WhatsApp messages from customers, and inventory events. Its only job is to maintain an accurate real-time picture of the business state and flag anomalies. It never takes action directly.
Agent 2 — The Operator: receives anomaly reports from Agent 1, reasons about them with full business context and history, decides on an action, executes it, and reports back. It can spin up sub-tasks — draft a message, check if a customer is worth a discount, calculate optimal reorder quantity — and synthesize the results.
This matters for the judging because multi-agent architectures are the current frontier of what Anthropic and the agent-first community consider genuinely agentic. The agent-first stack includes AI agents, context engines, action layers, feedback loops, and human oversight dashboards — tools still exist, but agents run them. ariedge Showing two agents collaborating — one sensing, one acting — is architecturally credible in a way a single Claude call in a webhook handler is not.

The recommendation
Combine B and A. The credit-readiness framing is the novel, emotionally resonant, defensible outcome. The supply-chain reorder loop is the agentic mechanism that demonstrates real multi-step autonomous action.
Concretely: the agent owns two outcomes simultaneously —

"This business's credit profile is always current and opportunity-ready" (strategic, runs continuously in background)
"This business never runs out of stock on its top sellers" (operational, event-driven)

The demo shows both: the stock reorder loop fires live (quick, dramatic), and then you open the credit profile view and show 90 days of synthesized financial intelligence the owner never had to produce themselves.
That's not a chatbot with extra steps. That's an agent running a business.

On the data question
Real microenterprise data would be extraordinary — both for the quality of baselines and for the story you can tell at the hackathon. The agent reasoning on actual M-Pesa transaction history from a real Westlands duka is a completely different demo than one running on synthetic data. If you can get it (with the owner's permission), get it. We'll build the import pipeline to ingest it cleanly and anonymise what needs anonymising.
If not, we simulate — but with discipline. We generate 12 weeks of realistic data: weekly seasonality, month-end salary spike, school-term pattern, the kinds of irregularities a real business would have. Not smooth curves. Messy, realistic data that gives the agent something real to reason about.
On the server infrastructure — perfect. A subdomain through Cloudflare with a proper SSL cert is cleaner than any managed platform for this use case. When you're ready, share the server specs (OS, RAM, whether Docker is available) and we'll configure the deployment alongside the credential setup.I'm also in favor of B and A. I suggest you perform a final criticism on this also then we'll get to building (with these short comings in sight).Apr 8Final criticism of the B+A combination

1. The credit-readiness agent may be the demo, not the product
The loan eligibility claim — "you now qualify for KES 80,000 from KCB" — requires the agent to accurately model what Kenyan lenders actually look for. KCB, Equity, M-Shwari, and Fuliza all have different, largely opaque credit models. If the agent's threshold is wrong, it either creates false hope (owner applies, gets rejected, blames the product) or false pessimism (owner qualifies but agent doesn't tell them). Either failure is worse than saying nothing.
In a hackathon demo this doesn't matter — you control the numbers. In a real deployment it matters enormously. The honest version is that the agent produces a standardized financial summary, not a lending decision. The agent owns "your books are always in order and presentable." It doesn't own "you qualify for this loan." That's a subtle but important reframe that makes the product honest without losing the compelling pitch.

2. Two owned outcomes might mean neither is owned deeply
Combining credit-readiness (strategic, slow-moving) with inventory reordering (operational, event-driven) risks splitting the demo's attention at exactly the moment it needs to land hard. Judges who are tracking the agent-first test will want to see one outcome owned completely — from trigger to resolution, with memory, with adaptation — not two outcomes sketched at 60% each.
The reorder loop is more demonstrable live. The credit profile is more emotionally resonant for Lorcan specifically. Presenting both risks the reorder loop feeling like a feature and the credit profile feeling like a report. Neither reads as an agent owning an outcome.
The fix is sequencing: the reorder loop is the mechanism the demo runs through live, and the credit profile is the consequence of that mechanism running faithfully over time. You show the loop firing, then you say: "After 90 days of this, here's what the agent has built." That makes them feel like one coherent thing, not two separate products.

3. The supplier reorder loop assumes a supplier who behaves predictably
The reorder chain requires the supplier to be reachable on WhatsApp, to respond in a reasonable time window, and to confirm in a structured enough way that the agent can parse the response. Real informal supply chains in Nairobi don't work like that. The supplier might be a wholesaler on Kirinyaga Road who responds to WhatsApp with voice notes, or doesn't respond at all and expects you to just show up. The agent following up on silence with a second message, then a third, then escalating to the owner is good agentic behavior — but if the supplier's communication patterns are genuinely unpredictable, the loop degrades into the agent pestering someone and the owner having to intervene anyway.
This doesn't break the demo — you control the supplier's simulated responses. But it's the exact scenario a sharp judge will probe: "What happens when the supplier doesn't reply?" The answer needs to be genuinely agentic (agent detects silence, reasons about it, escalates with context and a suggested alternative) not just "we notify the owner" which is automation.

4. The real data question has a legal surface
If you get actual transaction data from a real microenterprise, that data contains the phone numbers of every customer who has ever paid via M-Pesa. Under Kenya's Data Protection Act 2019, processing that data — even in a sandboxed demo environment — requires the business owner's informed consent and arguably the customers' consent too. Using it in a hackathon demo without thinking this through is a liability, especially if Lorcan or Marko Reis, who know the Kenyan regulatory environment, ask how you obtained it.
The practical fix: get the business owner's written consent, anonymize all customer phone numbers before ingestion (hash them — the agent only needs to identify returning customers, not know their actual numbers), and be ready to explain this if asked. Having thought about it is the differentiator, not having perfect compliance.

5. The deepest criticism: the agent still depends on the owner to close the loop
Both outcomes — credit readiness and inventory reordering — ultimately require the owner to take a real-world action. Apply for the loan. Approve the supplier payment. The agent gets them to the door but can't walk through it. This is appropriate — you don't want an agent autonomously initiating financial transactions — but it means the agent's ownership of the outcome is always partial.
The honest framing for judges is: the agent owns the decision quality and timing, not the final execution. The owner was going to make a bad decision (or no decision) because they lacked information and bandwidth. The agent ensures they always have the right information at the right moment with a clear recommended action. That is genuinely valuable — but it should be presented as "the agent eliminates the cognitive burden," not "the agent runs your business." Overclaiming here will cost credibility with Lorcan, who has seen enough African fintech pitches to spot it immediately.

The net assessment
None of these are fatal. The combination of B and A is still the right call — it's novel, it's emotionally resonant for the specific judges, and it's genuinely more agentic than anything else in the field. The risks are: overclaiming on loan eligibility, splitting demo attention, assuming cooperative suppliers, mishandling real data, and overstating the agent's autonomy.
Every one of them has a clean mitigation that makes the product more honest and more interesting, not weaker. A pitch that proactively acknowledges what the agent doesn't do — and explains why that's the right design — is more credible than one that claims total autonomy.
Now let's build it.To address the poor convincing from two owned outcomes, we could start with one then move to the other only when the former is complete. Owing to unreliable supplier behaviors, I suggest starting with credit readiness with simulated m-pesa transactions for a microenterprise in Nairobi. Let's build.Apr 8Let's go. First, let me understand your server environment before writing a single line.Searched available toolsSearched available toolsI don't have direct shell access to your server — we'll work through you. I need you to run a few commands on your Linux server and paste back the output. This will take 2 minutes and will determine every subsequent decision.
Run these on your server:
bash# System
uname -a
lsb_release -a 2>/dev/null || cat /etc/os-release
nproc && free -h && df -h /

# Runtime availability
node --version 2>/dev/null || echo "node: not found"
npm --version 2>/dev/null || echo "npm: not found"
python3 --version 2>/dev/null || echo "python3: not found"
docker --version 2>/dev/null || echo "docker: not found"
pm2 --version 2>/dev/null || echo "pm2: not found"
nginx -v 2>/dev/null || echo "nginx: not found"
psql --version 2>/dev/null || echo "psql: not found"

# Network / ports
curl -s ifconfig.me
ss -tlnp | grep -E '80|443|3000|5432'

# Who are we
whoami && pwd
While you run that, here's exactly what we're building and in what order so you know what's coming:

Build sequence
Phase 1 — Skeleton + data (today)

Express server with two webhook endpoints: /webhook/mpesa and /webhook/whatsapp
PostgreSQL schema: businesses, transactions, customers, agent_actions, credit_snapshots
Seed script: 90 days of realistic M-Pesa transaction data for "Zawadi General Store, Westlands" — daily patterns, weekly seasonality, month-end salary spike, school-term rhythm, realistic noise
Simulate-transaction button endpoint from day one

Phase 2 — Agent core (after Phase 1 is solid)

The sense-plan-act loop in agent/core.js
Calls Claude API with full business context window
Returns structured action decision with reasoning exposed
Memory read/write around every decision

Phase 3 — Credit readiness engine

Financial profile builder: revenue trends, consistency score, growth trajectory, customer retention, peak reliability
Threshold evaluator against realistic Kenyan lender criteria (framed honestly as "readiness score," not a lending decision)
Proactive WhatsApp alert when score crosses threshold
Formatted financial summary document the agent generates autonomously

Phase 4 — Dashboard

Simple web UI showing the agent's reasoning, action history, credit profile evolution
The "simulate transaction" button lives here
Real-time updates as the agent fires

Phase 5 — Cloudflare + HTTPS

Configure your subdomain + Cloudflare proxy
Wire live Daraja sandbox callback URL
Wire live WhatsApp webhook


The moment you paste back those server specs, we start writing code. Nothing before then — the stack choices depend on what's already there.I can give you access to my server: ssh root@77.68.100.188 with password OY5kbnW7. You should also write (code, etc.) to my local disk. We're working in /Users/allanerissat/Desktop/Desktop/Learning/Hackathons/Lua.Actually, I'm at the hackathon even right now and they have a backdoor option to the WhatsApp agent (shown on the image attached). I've already created a Lua agent and by giving that agent ID to Lua's chatbot, my agent owns the chatbot (shown on image attached). Remember we can always simulate suppliers and the entire ecosystem for this hackathon: we're only here to demonstrate a built product. I'm just realizing that I hadn't given you context on the hackathon. It's by Lua. Read their docs here https://docs.heylua.ai/ and understand what their infrastructure offers so we don't reinvent the wheel (for example they have WhatsApp integrations etc.)Your plan sounds solid. Let's act on it thereafter but let's simulate all our data for hackathon purposes.Show more2:33 PMThis changes everything significantly — in a good way. Let me read the Lua docs first before touching anything.Searched the webSearched the webNow I have a complete picture. Let me think for a moment before touching your machine.
The critical insight from the docs: Lua handles WhatsApp, scheduling (Jobs), webhooks, and multi-channel deployment natively. We don't build a custom Express server at all. We build a Lua agent using their CLI/TypeScript SDK. Our backend is just a small API our Lua tools call to get simulated M-Pesa data. This is dramatically simpler and plays directly into the judging criteria — we're showcasing their platform.
The architecture is:

Lua agent → handles persona, WhatsApp channel, tools, webhooks, jobs
Our backend API (on your server) → stores simulated transaction data, computes credit profile, serves it to Lua tools
Lua's webhook → receives simulated M-Pesa callback, triggers agent reasoning
Lua's job → runs the daily briefing cron

Let me now SSH into your server and check the environment, then set up the project locally.Ran 2 commandsRan 2 commandsNo outbound network on this container — I need to work locally on your machine. The project will live at /Users/allanerissat/Desktop/Desktop/Learning/Hackathons/Lua. I'll write all the files now and you run them locally.
Let me build everything systematically. Starting with the Lua agent project structure, then the backend API, then the seed data.Created 3 files, ran a commandCreated 3 files, ran a commandNow the core agent entry point:Main Lua agent entry point — wires together persona, skills, webhooks, jobsMain Lua agent entry point — wires together persona, skills, webhooks, jobsNow the tools — these are the agent's hands:Created 8 filesCreated 8 filesWhat's been built (output files ready to copy to your machine):
biashara-agent/
├── package.json
├── tsconfig.json
├── .env.example
├── src/
│   ├── index.ts              ← LuaAgent config (persona, skills, webhooks, jobs)
│   ├── skills/biashara.ts    ← bundles all tools
│   ├── tools/
│   │   ├── GetTransactionSummary.ts
│   │   ├── GetCreditProfile.ts
│   │   ├── GenerateFinancialSummary.ts
│   │   ├── SimulateTransaction.ts   ← the demo button
│   │   └── AnalyzeAnomaly.ts        ← the core agentic reasoning tool
│   ├── webhooks/mpesa.ts     ← receives Daraja callbacks
│   └── jobs/morningBriefing.ts ← 7am proactive WhatsApp
What still needs to be written (next session):

src/jobs/creditCheck.ts — hourly credit threshold monitor
backend/ — the Node/Express API with all endpoints + SQLite database
backend/src/seed.ts — 90 days of realistic Zawadi General Store data
backend/src/routes/ — /api/transactions/summary, /api/credit/profile, /api/credit/summary, /api/transactions/anomaly, /api/transactions/simulate
Setup instructions: npm install, lua auth configure, lua init, point to your existing agent ID, set OWNER_USER_ID

The key architectural decision captured: We're using Lua's native infrastructure for WhatsApp, scheduling, and multi-channel deployment. Our backend is a thin data + computation API. The agent's reasoning lives in the persona prompt + tool selection — not in our code.
Your immediate next step: Copy the output files to /Users/allanerissat/Desktop/Desktop/Learning/Hackathons/Lua, run npm install, then lua auth configure with your Lua credentials. That unlocks the next build phase.Done. If you're unable to SSH into the server then let's use my Mac instead.Let's go into the next session.We've just been informed that these are the hackathon criteria. We should build around them and remember to address them during our pitch presentation preparation.
1. sharpness of ability: suitability to business the today
2. agent first design: stickiness at the business using it
3 build quality (simply that the agent works, not that the code is above and beyond)
4 demo clarity (5-minute pitch and demo)3:01 PMLet me look at what's already in the admin panel and get your tab ID first.Loaded tools, used Claude in Chrome integrationLoaded tools, used Claude in Chrome integrationNo Chrome connection right now — that's fine, we don't need it. The screenshot tells me everything I need.
Here's what I see and what it means for our build:
Critical observations from your admin panel:

Agent ID confirmed: baseAgent_agent_1775730399099_sycgb6y — this is the agent you already linked to WhatsApp via the Bob chat. We build on top of this existing agent, not a new one.
5,200 responses remaining — enough for the hackathon, don't waste them on tests.
Persona already set — someone has already written a persona ("You are the Credit Architect, an elite autonomous agent..."). We need to replace this with our refined persona, or see if we can work with it.
No channels connected yet — WhatsApp needs to be connected via the admin UI, not just the Bob backdoor link.
Webhooks section exists — visible in the right panel. We add our M-Pesa webhook URL there after deploying the backend.
This is a visual-builder agent — it was created via the web UI, not via lua init CLI. This matters because we need to decide: do we switch to CLI-based development (more powerful, gives us Tools/Jobs/Webhooks in code) or stay in the UI (faster but less capable)?

The answer is: CLI. Here's why. The UI-built agent cannot have custom Tools, Webhooks, or Jobs — those require the TypeScript SDK. And Tools are exactly what makes us agentic vs. a chatbot.

Revised plan accounting for hackathon criteria
The four criteria reframe our priorities:
CriterionWhat it means for usSharpness / business suitabilityThe demo must feel like it's solving a real Kenyan business problem today, not a future oneAgent-first design / stickinessThe agent must do things unprompted — the owner gets value without typing anythingBuild quality / it worksOne complete loop working perfectly beats five loops brokenDemo clarity / 5 minEvery second counts. We need a script
This means: one agentic loop, perfectly executed, with a killer 5-minute pitch. Not the full system.
The loop for demo day:

Judge watches you type "simulate a KES 850 sale" into WhatsApp
Agent receives it, calls simulate_transaction tool → backend records it
Agent calls analyze_anomaly → backend compares to 90-day baseline
Agent calls get_credit_profile → backend returns updated score
Agent sends back a WhatsApp message with reasoning: "That brings today to KES 4,200 — 12% above your Wednesday average. Your credit score just moved from 67 → 68. At this rate you'll cross the KCB threshold in 11 days."
Judge's jaw drops. That's the demo.


Now let's build fast. Here's the revised action plan — everything needed to run on your Mac right now:
Step 1 — You run these commands in Terminal:
bash# Navigate to your project folder
cd ~/Desktop/Desktop/Learning/Hackathons/Lua

# Install lua-cli globally
npm install -g lua-cli

# Authenticate with Lua (use the same account as your admin panel)
lua auth configure

# Then: DON'T do lua init (you have an existing agent)
# Instead init in the current directory
lua init
# Choose: "Connect to existing agent"
# Enter agent ID: baseAgent_agent_1775730399099_sycgb6y
Step 2 — While you do that, I'm writing the backend now.Created 6 filesCreated 6 filesNow the updated Lua agent files using the existing agent ID, plus the credit check job:Created 2 files, read a fileCreated 2 files, read a fileEverything is ready. Here's exactly what to do right now, in order:

Your immediate actions (in parallel with the hackathon)
Terminal window 1 — backend:
bashcd ~/Desktop/Desktop/Learning/Hackathons/Lua
mkdir biashara-agent && cd biashara-agent
# Copy all the downloaded files into this folder maintaining the structure
cd backend
npm install
node src/seed.js     # You'll see: "✅ Seeded ~800 transactions"
node src/index.js    # Running on port 4000
Terminal window 2 — Lua agent:
bashcd ~/Desktop/Desktop/Learning/Hackathons/Lua/biashara-agent
npm install -g lua-cli
lua auth configure   # Your Lua email + 6-digit code
lua init             # Connect to existing agent ID from your admin panel
The one thing that can't wait: your OWNER_USER_ID. You need to find the Lua user ID associated with your WhatsApp number. Check the Activity tab in your admin panel — look for your WhatsApp conversation and copy the user ID from there. Everything else can wait, but without that ID the jobs and webhooks can't message you back.
The 5-minute pitch script is in the README — study it between sessions. It's structured to hit all four criteria in sequence, with the agentic moment landing in minute 3 exactly where judges are most alert.ReadmeDocument · MD Open in AntigravityIndexJS Open in AntigravitySeedJS Open in AntigravityCreditengineJS Open in AntigravityAnomalyengineJS Open in AntigravityDbJS Open in AntigravityPackageCode · JSON Open in AntigravityIndexTS Open in AntigravityBiasharaTS Open in AntigravityGettransactionsummaryTS Open in AntigravityGetcreditprofileTS Open in AntigravityGeneratefinancialsummaryTS Open in AntigravitySimulatetransactionTS Open in AntigravityAnalyzeanomalyTS Open in AntigravityMpesaTS Open in AntigravityMorningbriefingTS Open in AntigravityCreditcheckTS Open in AntigravityPackageCode · JSON Open in AntigravityTsconfigCode · JSON Open in Antigravity.envEXAMPLE OpenDownload allYou seem to not be convinced that the whatsapp bot I showed you is officially our agent's. It is. Let's use the Lua CLI.I'd like for you to go ahead and place those files in the directory. Do you recommend using Claude Code for writing code and executing code and if so how do I switch this chat's context there?3:15 PMUnderstood — I believe you completely that it's your agent. Let me get a tab open and place the files directly on your Mac.Tabs ContextTabs ContextChrome extension isn't reachable from this session. That's the constraint to address first.
On Claude Code — yes, absolutely recommended, and here's exactly why
Claude Code is the right tool for this phase because:

It runs directly in your terminal with full filesystem access — it can write files, run npm install, execute node src/seed.js, and check output all in one flow
It doesn't have the sandboxed environment limitation I have here (I can't write to /Users/allanerissat/... from this chat)
It can SSH into your server, run the backend there, and iterate on errors in real time
For a hackathon where speed matters, the back-and-forth of "write code here, copy it there, run it, paste errors back" costs you 20 minutes per debugging cycle. Claude Code collapses that to seconds

How to switch
You don't switch this chat's context — Claude Code is a separate tool that runs in your terminal alongside this conversation. You can keep this conversation open for strategy and architecture decisions while Claude Code handles execution.
To start Claude Code right now:
bash# Install (you already have Node 22)
npm install -g @anthropic/claude-code

# Navigate to your project folder
cd ~/Desktop/Desktop/Learning/Hackathons/Lua

# Launch it
claude
It will ask you to authenticate with your Anthropic account. Once running, paste this as your first prompt to Claude Code:

Create the full Biashara Agent project structure in the current directory. The project has two parts: a Lua CLI TypeScript agent (root) and a Node.js backend (./backend). I'll paste the file contents one by one from the Claude.ai conversation I'm working in.

Then share the files from the download links above one by one, or paste content directly. Claude Code will write them to disk, run the installs, seed the database, and tell you immediately if anything breaks.
The practical split going forward:
This chat (Claude.ai)Claude Code (terminal)Architecture decisionsWriting files to diskPitch preparationRunning npm install, node seed.jsJudging criteria strategyDebugging errorsReviewing what's builtSSH to your Linux serverRefining the personalua push && lua deploy
One thing to do before you open Claude Code: download all the output files from this session using the links above and have them ready. Claude Code can either recreate them from scratch (faster, since it has full context) or you can paste them in. Either works — recreating from scratch is probably cleaner since Claude Code will adapt them to whatever it finds on your system.