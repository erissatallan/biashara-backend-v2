import { LuaTool } from 'lua-cli';
import { z } from 'zod';
export declare class GenerateFinancialSummaryTool implements LuaTool {
    name: string;
    description: string;
    inputSchema: z.ZodObject<{
        lender: z.ZodDefault<z.ZodEnum<["KCB", "Equity", "MShwari", "SACCO", "Generic"]>>;
    }, "strip", z.ZodTypeAny, {
        lender: "KCB" | "Equity" | "MShwari" | "SACCO" | "Generic";
    }, {
        lender?: "KCB" | "Equity" | "MShwari" | "SACCO" | "Generic" | undefined;
    }>;
    execute(input: {
        lender: string;
    }): Promise<unknown>;
}
//# sourceMappingURL=GenerateFinancialSummary.d.ts.map