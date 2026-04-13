"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mpesaWebhook = void 0;
const lua_cli_1 = require("lua-cli");
// The owner's Lua user ID — set after linking WhatsApp to the agent
const OWNER_USER_ID = '254759469851';
const BACKEND = 'https://untransmitted-rowena-unpreferably.ngrok-free.dev';
const SECRET = 'dev-secret';
exports.mpesaWebhook = new lua_cli_1.LuaWebhook({
    name: 'mpesa-callback',
    description: 'Receives M-Pesa Daraja payment callbacks and proactively reasons about them',
    execute: async (event) => {
        try {
            // 0. Fetch Settings for feature toggling
            const settingsRes = await fetch(`${BACKEND}/api/settings`, { headers: { 'x-api-secret': SECRET } });
            const settings = settingsRes.ok ? await settingsRes.json() : {};
            const { amount, receipt, phone, Body } = event.body;
            const TransAmount = amount || Body?.stkCallback?.CallbackMetadata?.Item?.find((i) => i.Name === 'Amount')?.Value;
            const TransID = receipt || Body?.stkCallback?.CallbackMetadata?.Item?.find((i) => i.Name === 'MpesaReceiptNumber')?.Value;
            const CustomerPhone = phone || Body?.stkCallback?.CallbackMetadata?.Item?.find((i) => i.Name === 'PhoneNumber')?.Value;
            if (!TransAmount || !TransID) {
                return { received: true, processed: false, reason: 'invalid payload' };
            }
            // SPECIAL DEMO HACK: If transaction amount is exactly 9999, trigger the PDF proposal send immediately.
            if (Number(TransAmount) === 9999) {
                const owner = await lua_cli_1.User.get(OWNER_USER_ID);
                if (owner) {
                    try {
                        const summaryRes = await fetch(`${BACKEND}/api/transactions/summary?days=90`, { headers: { 'x-api-secret': SECRET } });
                        const summary = await summaryRes.json();
                        const profileRes = await fetch(`${BACKEND}/api/credit/profile`, { headers: { 'x-api-secret': SECRET } });
                        const profile = await profileRes.json();
                        const score = profile?.score ?? 53;
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
                        const PDFDocument = require('pdfkit');
                        const doc = new PDFDocument({ margin: 50 });
                        const chunks = [];
                        doc.on('data', (chunk) => chunks.push(chunk));
                        const pdfBase64 = await new Promise((resolve) => {
                            doc.on('end', () => resolve(Buffer.concat(chunks).toString('base64')));
                            doc.fontSize(20).text('Business Performance Summary', { align: 'center' }).moveDown();
                            doc.fontSize(14).text('Zawadi General Store', { align: 'center' }).moveDown(2);
                            doc.fontSize(12).text(proposalText).end();
                        });
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
                        const pdfUrl = `${BACKEND}${docData.url}`;
                        await owner.send([{
                                type: 'text',
                                text: `📄 *Loan Readiness Package*\n\nYour digitally formatted Loan Readiness Package is ready. You can download or forward it to your loan officer using the secure link below:\n\n🔗 ${pdfUrl}`
                            }]);
                        return { success: true, message: `PDF sent successfully! URL: ${pdfUrl}` };
                    }
                    catch (e) {
                        return { success: false, message: `PDF Error: ${e.message}` };
                    }
                }
            }
            if (event.body?.simulated !== true) {
                try {
                    await fetch(`${BACKEND}/api/transactions/simulate`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'x-api-secret': SECRET },
                        body: JSON.stringify({
                            amount: TransAmount,
                            description: 'M-Pesa receipt',
                            phone: CustomerPhone || '254700000000',
                            receiptNumber: TransID,
                            timestamp: new Date().toISOString(),
                        }),
                    });
                }
                catch (e) {
                    console.error('mpesa webhook: failed to persist transaction', e);
                }
            }
            const [anomalyRes, profileRes] = await Promise.all([
                fetch(`${BACKEND}/api/transactions/anomaly`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'x-api-secret': SECRET },
                    body: JSON.stringify({ context: 'webhook', transactionAmount: TransAmount }),
                }),
                fetch(`${BACKEND}/api/credit/profile`, { headers: { 'x-api-secret': SECRET } }),
            ]);
            const anomaly = anomalyRes.ok ? await anomalyRes.json() : null;
            const profile = await profileRes.json();
            const owner = await lua_cli_1.User.get(OWNER_USER_ID);
            if (owner) {
                const systemPrompt = `You are Biashara, an AI business agent for Zawadi General Store. Speak warmly on WhatsApp. KES for currency.`;
                const userPrompt = `Confirm payment: KES ${TransAmount} (receipt ${TransID}). Today: KES ${anomaly?.revenue?.todayKES} vs ${anomaly?.context?.dayOfWeek} baseline. Credit: ${profile?.score}/100.`;
                const messageText = await lua_cli_1.AI.generate(systemPrompt, userPrompt);
                await owner.send([{ type: 'text', text: messageText }]);
            }
            const promoEnabled = settings.promo_messages_enabled === true;
            if (promoEnabled && CustomerPhone && CustomerPhone !== OWNER_USER_ID) {
                try {
                    const client = await lua_cli_1.User.get(CustomerPhone);
                    if (client) {
                        await client.send([{
                                type: 'text',
                                text: `Thank you for shopping at *Zawadi General Store*! 🛍️\n\nShow this message on your next visit for a *5% discount* on any purchase over KES 1,000.`
                            }]);
                    }
                }
                catch (e) {
                    console.error('Failed to send promo to client:', e);
                }
            }
            return {
                received: true,
                processed: true,
                amount: TransAmount,
                receipt: TransID,
                creditScore: profile?.score ?? null,
            };
        }
        catch (err) {
            console.error('M-Pesa webhook error:', err);
            return { received: true, processed: false, error: err?.message };
        }
    },
});
//# sourceMappingURL=mpesa.js.map