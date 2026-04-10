"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshLoanResearchTool = void 0;
const zod_1 = require("zod");
const BACKEND = 'https://untransmitted-rowena-unpreferably.ngrok-free.dev';
const SECRET = 'dev-secret';
class RefreshLoanResearchTool {
    constructor() {
        this.name = 'refresh_loan_research';
        this.description = `Refresh the agent's knowledge of current Kenyan MSME loan products, requirements,
and eligibility criteria. This pulls fresh data from government portals, bank websites,
and SACCO platforms to ensure loan guidance is up-to-date. Use this when the owner
asks about loan options, lenders, or if you suspect the guidance is stale. Returns
a summary of what lenders and products are currently available.`;
        this.inputSchema = zod_1.z.object({
            trigger: zod_1.z
                .string()
                .optional()
                .default('agent-manual')
                .describe('Who triggered this refresh (for logging)'),
        });
    }
    async execute(input) {
        try {
            const res = await fetch(`${BACKEND}/api/research/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-secret': SECRET,
                },
                body: JSON.stringify({ trigger: input.trigger }),
            });
            if (!res.ok)
                throw new Error(`Backend error: ${res.status}`);
            const data = await res.json();
            return data;
        }
        catch (err) {
            throw new Error(`Failed to refresh loan research: ${err.message}`);
        }
    }
}
exports.RefreshLoanResearchTool = RefreshLoanResearchTool;
//# sourceMappingURL=RefreshLoanResearch.js.map