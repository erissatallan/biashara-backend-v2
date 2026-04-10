import { LuaTool } from 'lua-cli';
import { z } from 'zod';

const BACKEND = 'https://untransmitted-rowena-unpreferably.ngrok-free.dev';
const SECRET = 'dev-secret';

export class AnalyzeAnomalyTool implements LuaTool {
    name = 'analyze_anomaly';
    description = `Analyze whether today's revenue or a specific transaction event
represents an anomaly relative to the business's historical baseline for that
day and time. Returns: anomaly flag, severity, likely cause (day of week effect,
school-term pattern, month-end spike, etc.), and the agent's recommended action.
This is the core tool for the agent's proactive reasoning — call it when a
webhook fires or when assessing current business health.`;

    inputSchema = z.object({
        context: z
            .enum(['webhook', 'scheduled', 'owner_query'])
            .describe('What triggered this analysis'),
        transactionAmount: z
            .number()
            .optional()
            .describe('Amount of the triggering transaction if webhook-triggered'),
    });

    async execute(input: { context: string; transactionAmount?: number }) {
        try {
            const res = await fetch(`${BACKEND}/api/transactions/anomaly`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-secret': SECRET,
                },
                body: JSON.stringify(input),
            });
            if (!res.ok) throw new Error(`Backend error: ${res.status}`);
            const analysis = await res.json();
            return analysis;
        } catch (err: any) {
            throw new Error(`Failed to analyze anomaly: ${err.message}`);
        }
    }
}
