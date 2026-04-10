import { LuaTool } from 'lua-cli';
import { z } from 'zod';

const BACKEND = 'https://untransmitted-rowena-unpreferably.ngrok-free.dev';
const SECRET = 'dev-secret';

export class GenerateFinancialSummaryTool implements LuaTool {
    name = 'generate_financial_summary';
    description = `Generate a structured financial summary document that the business
owner can present to a lender (KCB, Equity, M-Shwari, or a SACCO). The summary
covers the last 90 days of M-Pesa transactions, key metrics, trends, and a
plain-language business narrative. This is the agent's most powerful output —
it turns invisible M-Pesa data into a bankable document. Call this when the
owner asks for a loan summary, financial statement, or bank document.`;

    inputSchema = z.object({
        lender: z
            .enum(['KCB', 'Equity', 'MShwari', 'SACCO', 'Generic'])
            .default('Generic')
            .describe('Target lender — slightly adjusts emphasis in the summary.'),
    });

    async execute(input: { lender: string }) {
        try {
            const res = await fetch(
                `${BACKEND}/api/credit/summary?lender=${input.lender}`,
                { headers: { 'x-api-secret': SECRET } }
            );
            if (!res.ok) throw new Error(`Backend error: ${res.status}`);
            const summary = await res.json();
            return summary;
        } catch (err: any) {
            throw new Error(`Failed to generate financial summary: ${err.message}`);
        }
    }
}
