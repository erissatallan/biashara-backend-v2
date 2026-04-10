"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyzeAnomalyTool = void 0;
const zod_1 = require("zod");
const BACKEND = 'https://untransmitted-rowena-unpreferably.ngrok-free.dev';
const SECRET = 'dev-secret';
class AnalyzeAnomalyTool {
    constructor() {
        this.name = 'analyze_anomaly';
        this.description = `Analyze whether today's revenue or a specific transaction event
represents an anomaly relative to the business's historical baseline for that
day and time. Returns: anomaly flag, severity, likely cause (day of week effect,
school-term pattern, month-end spike, etc.), and the agent's recommended action.
This is the core tool for the agent's proactive reasoning — call it when a
webhook fires or when assessing current business health.`;
        this.inputSchema = zod_1.z.object({
            context: zod_1.z
                .enum(['webhook', 'scheduled', 'owner_query'])
                .describe('What triggered this analysis'),
            transactionAmount: zod_1.z
                .number()
                .optional()
                .describe('Amount of the triggering transaction if webhook-triggered'),
        });
    }
    async execute(input) {
        try {
            const res = await fetch(`${BACKEND}/api/transactions/anomaly`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-secret': SECRET,
                },
                body: JSON.stringify(input),
            });
            if (!res.ok)
                throw new Error(`Backend error: ${res.status}`);
            const analysis = await res.json();
            return analysis;
        }
        catch (err) {
            throw new Error(`Failed to analyze anomaly: ${err.message}`);
        }
    }
}
exports.AnalyzeAnomalyTool = AnalyzeAnomalyTool;
//# sourceMappingURL=AnalyzeAnomaly.js.map