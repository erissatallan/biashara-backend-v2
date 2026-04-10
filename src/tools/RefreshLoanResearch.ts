import { LuaTool } from 'lua-cli';
import { z } from 'zod';

const BACKEND = 'https://untransmitted-rowena-unpreferably.ngrok-free.dev';
const SECRET = 'dev-secret';

export class RefreshLoanResearchTool implements LuaTool {
    name = 'refresh_loan_research';
    description = `Refresh the agent's knowledge of current Kenyan MSME loan products, requirements,
and eligibility criteria. This pulls fresh data from government portals, bank websites,
and SACCO platforms to ensure loan guidance is up-to-date. Use this when the owner
asks about loan options, lenders, or if you suspect the guidance is stale. Returns
a summary of what lenders and products are currently available.`;

    inputSchema = z.object({
        trigger: z
            .string()
            .optional()
            .default('agent-manual')
            .describe('Who triggered this refresh (for logging)'),
    });

    async execute(input: { trigger: string }) {
        try {
            const res = await fetch(`${BACKEND}/api/research/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-secret': SECRET,
                },
                body: JSON.stringify({ trigger: input.trigger }),
            });

            if (!res.ok) throw new Error(`Backend error: ${res.status}`);
            const data = await res.json();
            return data;
        } catch (err: any) {
            throw new Error(`Failed to refresh loan research: ${err.message}`);
        }
    }
}
