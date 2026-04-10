import { LuaTool } from 'lua-cli';
import { z } from 'zod';
export declare class AnalyzeAnomalyTool implements LuaTool {
    name: string;
    description: string;
    inputSchema: z.ZodObject<{
        context: z.ZodEnum<["webhook", "scheduled", "owner_query"]>;
        transactionAmount: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        context: "webhook" | "scheduled" | "owner_query";
        transactionAmount?: number | undefined;
    }, {
        context: "webhook" | "scheduled" | "owner_query";
        transactionAmount?: number | undefined;
    }>;
    execute(input: {
        context: string;
        transactionAmount?: number;
    }): Promise<unknown>;
}
//# sourceMappingURL=AnalyzeAnomaly.d.ts.map