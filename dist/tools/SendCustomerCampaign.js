"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendCustomerCampaignTool = void 0;
const lua_cli_1 = require("lua-cli");
const zod_1 = require("zod");
const BACKEND = process.env.BACKEND_API_URL || 'http://localhost:4000';
const SECRET = process.env.BACKEND_API_SECRET || 'dev-secret';
class SendCustomerCampaignTool {
    constructor() {
        this.name = 'send_customer_campaign';
        this.description = `Send a promotional discount campaign to registered customers via WhatsApp.
Use this when sales are low or when the owner explicitly asks to send a discount offer
to customers. The tool will generate an AI-powered discount message and send it to
all registered customer phone numbers. It prevents spam by limiting campaigns to
2 per day maximum.`;
        this.inputSchema = zod_1.z.object({
            discountPercent: zod_1.z
                .number()
                .min(5)
                .max(30)
                .default(15)
                .describe('Discount percentage to offer (5-30%)'),
            reason: zod_1.z
                .string()
                .optional()
                .describe('Why this campaign is being sent (e.g. "sales are down 25% today", "slow afternoon")'),
        });
    }
    async execute(input) {
        try {
            // Fetch current revenue data for context
            const weekRes = await fetch(`${BACKEND}/api/transactions/summary?days=7`, {
                headers: { 'x-api-secret': SECRET },
            });
            const weekSummary = weekRes.ok ? await weekRes.json() : null;
            const weeklyAverage = weekSummary?.avgDailyRevenue || 4500;
            // Generate discount message using AI
            const systemPrompt = `You are a marketing assistant for Zawadi General Store in Westlands, Nairobi. ` +
                `You need to send a warm, compelling WhatsApp message to customers ` +
                `offering a special discount to drive foot traffic. Keep it under 4 lines. ` +
                `Use a friendly, conversational Kenyan tone. Include the discount percentage and urgency. ` +
                `Sign off with "Zawadi General Store, Westlands" but don't include a phone number.`;
            const userPrompt = `Weekly average revenue: KES ${Math.round(weeklyAverage).toLocaleString()}\n` +
                (input.reason ? `Context: ${input.reason}\n` : '') +
                `\nGenerate a compelling discount offer message. Offer ${input.discountPercent}% off on all items today only. ` +
                `Make it feel exclusive and time-sensitive.`;
            let discountMessage;
            try {
                discountMessage = await lua_cli_1.AI.generate(systemPrompt, userPrompt);
            }
            catch (e) {
                console.error('AI.generate failed, using fallback', e);
                discountMessage =
                    `🎉 Special offer just for you!\n\n` +
                        `Get ${input.discountPercent}% OFF on all items at Zawadi General Store today only! ` +
                        `Visit us in Westlands before 8pm to claim your discount.\n\n` +
                        `Zawadi General Store, Westlands`;
            }
            // Send campaign request to backend
            const res = await fetch(`${BACKEND}/api/campaigns/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-secret': SECRET,
                },
                body: JSON.stringify({
                    message: discountMessage,
                    discountPercent: input.discountPercent,
                    reason: input.reason,
                    timestamp: new Date().toISOString(),
                }),
            });
            if (!res.ok) {
                const error = await res.text();
                throw new Error(`Backend error ${res.status}: ${error}`);
            }
            const result = await res.json();
            return {
                success: true,
                message: discountMessage,
                customersSent: result.customersSent || 0,
                campaignsToday: result.campaignsToday || 1,
                note: result.note || 'Campaign sent successfully'
            };
        }
        catch (err) {
            throw new Error(`Failed to send customer campaign: ${err.message}`);
        }
    }
}
exports.SendCustomerCampaignTool = SendCustomerCampaignTool;
//# sourceMappingURL=SendCustomerCampaign.js.map