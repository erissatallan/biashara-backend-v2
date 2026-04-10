import { LuaTool } from 'lua-cli';
import { z } from 'zod';

const BACKEND = 'https://untransmitted-rowena-unpreferably.ngrok-free.dev';
const SECRET = 'dev-secret';

export class GetCreditProfileTool implements LuaTool {
    name = 'get_credit_profile';
    description = `Compute and return the business's current credit readiness profile.
This includes a readiness score (0–100), sub-scores for revenue consistency,
growth trajectory, customer retention, and transaction regularity, plus a
plain-language explanation of what is driving each score. Call this when the
owner asks about their financial standing, loan readiness, or credit profile.`;

    inputSchema = z.object({});

    async execute(_input: Record<string, never>) {
        try {
            const res = await fetch(`${BACKEND}/api/credit/profile`, {
                headers: { 'x-api-secret': SECRET },
            });
            if (!res.ok) throw new Error(`Backend error: ${res.status}`);
            const profile = await res.json();
            return profile;
        } catch (err: any) {
            throw new Error(`Failed to fetch credit profile: ${err.message}`);
        }
    }
}
