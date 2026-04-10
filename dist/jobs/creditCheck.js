"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.creditCheckJob = void 0;
const lua_cli_1 = require("lua-cli");
const pdfkit_1 = __importDefault(require("pdfkit"));
const OWNER_USER_ID = process.env.OWNER_USER_ID || '';
const BACKEND = process.env.BACKEND_API_URL || 'http://localhost:4000';
const SECRET = process.env.BACKEND_API_SECRET || 'dev-secret';
// Milestones the agent cares about (lender-readiness thresholds)
const MILESTONES = [45, 60, 75];
const generatePdfBase64 = (text) => {
    return new Promise((resolve) => {
        const doc = new pdfkit_1.default({ margin: 50 });
        const chunks = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks).toString('base64')));
        doc.fontSize(20).font('Helvetica-Bold').text('Business Performance Summary', { align: 'center' });
        doc.moveDown();
        doc.fontSize(14).font('Helvetica-Bold').text('Zawadi General Store', { align: 'center' });
        doc.moveDown(2);
        // Very basic markdown parsing for bolding
        const lines = text.split('\n');
        for (const line of lines) {
            if (line.trim().startsWith('*') && line.trim().endsWith('*') && !line.includes(' ')) {
                doc.fontSize(12).font('Helvetica-Bold').text(line.replace(/\*/g, ''));
            }
            else if (line.includes('*')) {
                // simple replace for inline bold is hard in pdfkit, we just strip them for now
                doc.fontSize(12).font('Helvetica').text(line.replace(/\*/g, ''));
            }
            else {
                doc.fontSize(12).font('Helvetica').text(line);
            }
            doc.moveDown(0.5);
        }
        doc.end();
    });
};
/**
 * Credit threshold check — runs every N hours (configurable via CREDIT_CHECK_INTERVAL_HOURS).
 *
 * The goal is silent monitoring: 99% of the time this job runs and says
 * nothing. When the credit readiness score crosses a milestone (45, 60,
 * 75) for the first time, the agent proactively messages the owner with
 * an exciting, contextual note. We track the previously-seen milestone
 * in job metadata so we only celebrate each threshold once.
 */
exports.creditCheckJob = new lua_cli_1.LuaJob({
    name: 'credit-threshold-check',
    description: 'Checks every 6 hours for credit score milestone crossings and notifies the owner when one is reached',
    schedule: {
        type: 'cron',
        expression: '0 */6 * * *',
        timezone: 'Africa/Nairobi',
    },
    metadata: { userId: OWNER_USER_ID, lastMilestone: 0 },
    execute: async (job) => {
        const userId = job.metadata?.userId || OWNER_USER_ID;
        if (!userId)
            return { sent: false, reason: 'no userId' };
        try {
            // Fetch settings
            const settingsRes = await fetch(`${BACKEND}/api/settings`, { headers: { 'x-api-secret': SECRET } });
            const settings = settingsRes.ok ? await settingsRes.json() : {};
            if (settings.auto_trigger_loans === false) {
                return { sent: false, reason: 'auto_trigger_loans disabled in settings' };
            }
            const res = await fetch(`${BACKEND}/api/credit/profile`, {
                headers: { 'x-api-secret': SECRET },
            });
            if (!res.ok) {
                return { sent: false, reason: `backend error ${res.status}` };
            }
            const profile = await res.json();
            const score = profile?.score ?? 0;
            // Find the highest milestone we've now crossed
            const crossed = MILESTONES.filter(m => score >= m);
            const currentMilestone = crossed.length ? crossed[crossed.length - 1] : 0;
            const previousMilestone = job.metadata?.lastMilestone ?? 0;
            if (currentMilestone <= previousMilestone) {
                // No new milestone — stay silent. This is the default path.
                return { sent: false, reason: 'no milestone crossed', score };
            }
            // We just crossed a milestone — compose a celebration message
            let systemPrompt = `You are Biashara, an AI business agent for the owner of Zawadi General Store. ` +
                `The owner's credit readiness score just crossed a meaningful threshold. ` +
                `Send a brief, warm, exciting WhatsApp message in Biashara's voice — direct but not cheesy. ` +
                `Use KES. Keep it under 4 lines. Never say they "qualify" for a loan — frame it as readiness. `;
            if (currentMilestone >= 45) {
                systemPrompt += `End by mentioning that you have proactively drafted a business performance summary for them below to use in upcoming M-Shwari Business or SACCO applications.`;
            }
            const userPrompt = `Score: ${score}/100 (${profile?.label ?? ''}).\n` +
                `Milestone just crossed: ${currentMilestone}.\n` +
                `Sub-scores: ${JSON.stringify(profile?.subScores ?? {})}.\n` +
                `Lender context: ${profile?.reasoning?.lender ?? ''}\n\n` +
                `Write the message.`;
            let text;
            try {
                text = await lua_cli_1.AI.generate(systemPrompt, userPrompt);
            }
            catch (e) {
                console.error('credit-check: AI.generate failed, falling back', e);
                text =
                    `📈 Good news — your credit readiness score just crossed ${currentMilestone}/100 ` +
                        `(currently ${score}). ${profile?.reasoning?.lender ?? ''}`;
            }
            const owner = await lua_cli_1.User.get(userId);
            if (!owner)
                return { sent: false, reason: 'owner not found' };
            await owner.send([{ type: 'text', text }]);
            // If milestone >= 45, draft and send the loan proposal
            if (currentMilestone >= 45) {
                try {
                    const summaryRes = await fetch(`${BACKEND}/api/transactions/summary?days=90`, {
                        headers: { 'x-api-secret': SECRET },
                    });
                    const summary = summaryRes.ok ? await summaryRes.json() : {};
                    const proposalSystemPrompt = `You are an expert senior loan officer and business analyst. ` +
                        `Draft a comprehensive, multi-page professional "Loan Readiness Package" for Zawadi General Store. ` +
                        `Structure the document into these distinct sections: ` +
                        `1. EXECUTIVE SUMMARY: Overview of business stability. ` +
                        `2. REVENUE ANALYSIS: Detail 90-day volume, growth trends, and peak performance periods. ` +
                        `3. CUSTOMER LOYALTY & RETENTION: Using customer return rates and regularity. ` +
                        `4. OPERATIONAL RISK PROFILE: Assessing consistency of transactions. ` +
                        `5. CREDIT READINESS ASSESSMENT: A formal statement on why their score of ${Math.round(score)}/100 makes them a prime candidate for micro-financing. ` +
                        `6. STRATEGIC RECOMMENDATIONS: Next steps for the owner to secure funding. ` +
                        `Use professional, persuasive language. Use KES. Use WhatsApp-friendly bolding (*text*) for emphasis. ` +
                        `Do NOT hallucinate numbers. Be highly compelling but factual. No markdown, just text.`;
                    const proposalUserPrompt = `90-day transaction summary: \n${JSON.stringify(summary, null, 2)}\n\n` +
                        `Credit profile summary: \n${JSON.stringify({ score, label: profile?.label, subScores: profile?.subScores, reasoning: profile?.reasoning }, null, 2)}\n\n` +
                        `Generate the full Loan Readiness Package now.`;
                    const proposalText = await lua_cli_1.AI.generate(proposalSystemPrompt, proposalUserPrompt);
                    const pdfBase64 = await generatePdfBase64(proposalText);
                    // Upload base64 PDF to the backend to get a public URL
                    const docRes = await fetch(`${BACKEND}/api/documents`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'x-api-secret': SECRET },
                        body: JSON.stringify({
                            base64: pdfBase64,
                            filename: `Loan_Package_${Date.now()}.pdf`,
                            title: `Formal Loan Readiness Package (${Math.round(score)})`,
                            score: score
                        })
                    });
                    const docData = await docRes.json();
                    // Construct full public URL using backend base URL
                    const pdfUrl = `${BACKEND}${docData.url}`;
                    // Send the URL in a direct text message which WhatsApp supports fully and prevents dropouts
                    await owner.send([{
                            type: 'text',
                            text: `📄 *Business Performance Summary*\n\nYour digitally formatted PDF document is ready. You can download or forward it to your loan officer using the secure link below:\n\n🔗 ${pdfUrl}`
                        }]);
                }
                catch (err) {
                    console.error('credit-check: failed to generate/send loan proposal', err);
                }
            }
            // Remember this milestone so we don't celebrate it again
            try {
                await job.updateMetadata({
                    ...(job.metadata ?? {}),
                    lastMilestone: currentMilestone,
                    lastScore: score,
                    lastCheckedAt: new Date().toISOString(),
                });
            }
            catch (e) {
                console.error('credit-check: updateMetadata failed', e);
            }
            return { sent: true, score, milestone: currentMilestone, draftedProposal: currentMilestone >= 45 };
        }
        catch (err) {
            console.error('credit-check error:', err);
            return { sent: false, error: err?.message };
        }
    },
});
//# sourceMappingURL=creditCheck.js.map