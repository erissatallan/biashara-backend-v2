import { LuaTool } from 'lua-cli';
import { z } from 'zod';
export declare class GetTransactionSummaryTool implements LuaTool {
    name: string;
    description: string;
    inputSchema: z.ZodObject<{
        days: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        days: number;
    }, {
        days?: number | undefined;
    }>;
    execute(input: {
        days: number;
    }): Promise<unknown>;
}
//# sourceMappingURL=GetTransactionSummary.d.ts.map