"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTransactionSummaryTool = void 0;
const zod_1 = require("zod");
const BACKEND = 'https://untransmitted-rowena-unpreferably.ngrok-free.dev';
const SECRET = 'dev-secret';
class GetTransactionSummaryTool {
    constructor() {
        this.name = 'get_transaction_summary';
        this.description = `Retrieve this business's M-Pesa transaction summary for a given
period. Returns daily revenue totals, weekly averages, trend direction,
and anomaly flags. Always call this before making any financial assessment.`;
        this.inputSchema = zod_1.z.object({
            days: zod_1.z
                .number()
                .min(1)
                .max(90)
                .default(30)
                .describe('Number of days to look back (1–90). Default 30.'),
        });
    }
    async execute(input) {
        try {
            const res = await fetch(`${BACKEND}/api/transactions/summary?days=${input.days}`, { headers: { 'x-api-secret': SECRET } });
            if (!res.ok)
                throw new Error(`Backend error: ${res.status}`);
            const data = await res.json();
            return data;
        }
        catch (err) {
            throw new Error(`Failed to fetch transaction summary: ${err.message}`);
        }
    }
}
exports.GetTransactionSummaryTool = GetTransactionSummaryTool;
//# sourceMappingURL=GetTransactionSummary.js.map