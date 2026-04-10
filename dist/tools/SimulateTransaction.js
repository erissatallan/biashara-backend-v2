"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimulateTransactionTool = void 0;
const zod_1 = require("zod");
const BACKEND = 'https://untransmitted-rowena-unpreferably.ngrok-free.dev';
const SECRET = 'dev-secret';
class SimulateTransactionTool {
    constructor() {
        this.name = 'simulate_transaction';
        this.description = `Simulate an incoming M-Pesa payment as if it arrived via Daraja
callback. Use this for demo purposes to show the agent reacting to a new
transaction in real time. The agent will process the transaction, update the
business state, and reason about whether any action is needed. The owner can
specify the amount and a short description of what was sold.`;
        this.inputSchema = zod_1.z.object({
            amount: zod_1.z
                .number()
                .min(10)
                .max(100000)
                .describe('Transaction amount in KES (e.g. 450)'),
            description: zod_1.z
                .string()
                .optional()
                .default('Sale')
                .describe('What was sold (e.g. "2kg sugar, cooking oil")'),
        });
    }
    async execute(input) {
        try {
            const payload = {
                amount: input.amount,
                description: input.description,
                phone: '254700000000',
                receiptNumber: `SIM${Date.now()}`,
                timestamp: new Date().toISOString(),
                simulated: true,
            };
            const res = await fetch(`${BACKEND}/api/transactions/simulate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-secret': SECRET,
                },
                body: JSON.stringify(payload),
            });
            if (!res.ok)
                throw new Error(`Backend error: ${res.status}`);
            const result = await res.json();
            // 🔥 Trigger the webhook so the agent proactively messages the owner!
            try {
                await fetch('https://webhook.heylua.ai/baseAgent_agent_1775730399099_sycgb2h6y/mpesa-callback', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            }
            catch (e) {
                console.error('Failed to trigger webhook', e);
            }
            return result;
        }
        catch (err) {
            throw new Error(`Failed to simulate transaction: ${err.message}`);
        }
    }
}
exports.SimulateTransactionTool = SimulateTransactionTool;
//# sourceMappingURL=SimulateTransaction.js.map