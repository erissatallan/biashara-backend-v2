"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCreditProfileTool = void 0;
const zod_1 = require("zod");
const BACKEND = 'https://untransmitted-rowena-unpreferably.ngrok-free.dev';
const SECRET = 'dev-secret';
class GetCreditProfileTool {
    constructor() {
        this.name = 'get_credit_profile';
        this.description = `Compute and return the business's current credit readiness profile.
This includes a readiness score (0–100), sub-scores for revenue consistency,
growth trajectory, customer retention, and transaction regularity, plus a
plain-language explanation of what is driving each score. Call this when the
owner asks about their financial standing, loan readiness, or credit profile.`;
        this.inputSchema = zod_1.z.object({});
    }
    async execute(_input) {
        try {
            const res = await fetch(`${BACKEND}/api/credit/profile`, {
                headers: { 'x-api-secret': SECRET },
            });
            if (!res.ok)
                throw new Error(`Backend error: ${res.status}`);
            const profile = await res.json();
            return profile;
        }
        catch (err) {
            throw new Error(`Failed to fetch credit profile: ${err.message}`);
        }
    }
}
exports.GetCreditProfileTool = GetCreditProfileTool;
//# sourceMappingURL=GetCreditProfile.js.map