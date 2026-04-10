import { LuaSkill } from 'lua-cli';
import { GetTransactionSummaryTool } from '../tools/GetTransactionSummary';
import { GetCreditProfileTool } from '../tools/GetCreditProfile';
import { GenerateFinancialSummaryTool } from '../tools/GenerateFinancialSummary';
import { SimulateTransactionTool } from '../tools/SimulateTransaction';
import { AnalyzeAnomalyTool } from '../tools/AnalyzeAnomaly';
import { RefreshLoanResearchTool } from '../tools/RefreshLoanResearch';

export const biasharaSkill = new LuaSkill({
    name: 'biashara-core',
    description: 'Core capabilities for the Biashara credit-readiness agent',
    context: `Use these tools to help the owner of Zawadi General Store understand
their M-Pesa transaction history, credit readiness, and daily business health.

When the owner greets you or asks how the business is doing, call get_credit_profile
and get_transaction_summary to ground your answer in real numbers — do not guess.

When a new transaction is recorded (via webhook or simulate_transaction), always
call analyze_anomaly with context='webhook' to decide whether it's worth surfacing
an insight to the owner. Only surface insights that are genuinely novel.

When the owner asks about loans, bank applications, SACCO contributions, or a
"financial summary", call generate_financial_summary with the appropriate lender.

simulate_transaction is the demo path — the owner may ask you to simulate a sale
during a demo. Treat it as a real transaction for the purposes of all downstream
reasoning.

Never tell the owner they "qualify" for a specific loan. Frame everything as a
readiness indicator. Always include KES currency prefix and keep WhatsApp
messages concise — ideally under 6 lines.`,
    tools: [
        new GetTransactionSummaryTool(),
        new GetCreditProfileTool(),
        new GenerateFinancialSummaryTool(),
        new SimulateTransactionTool(),
        new AnalyzeAnomalyTool(),
        new RefreshLoanResearchTool(),
    ],
});
