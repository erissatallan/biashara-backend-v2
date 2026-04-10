import { LuaTool } from 'lua-cli';
import { z } from 'zod';

const BACKEND = 'https://untransmitted-rowena-unpreferably.ngrok-free.dev';
const SECRET = 'dev-secret';

export class GetTransactionSummaryTool implements LuaTool {
    name = 'get_transaction_summary';
    description = `Retrieve this business's M-Pesa transaction summary for a given
period. Returns daily revenue totals, weekly averages, trend direction,
and anomaly flags. Always call this before making any financial assessment.`;

    inputSchema = z.object({
        days: z
            .number()
            .min(1)
            .max(90)
            .default(30)
            .describe('Number of days to look back (1–90). Default 30.'),
    });

    async execute(input: { days: number }) {
        try {
            const res = await fetch(
                `${BACKEND}/api/transactions/summary?days=${input.days}`,
                { headers: { 'x-api-secret': SECRET } }
            );
            if (!res.ok) throw new Error(`Backend error: ${res.status}`);
            const data = await res.json();
            return data;
        } catch (err: any) {
            throw new Error(`Failed to fetch transaction summary: ${err.message}`);
        }
    }
}
