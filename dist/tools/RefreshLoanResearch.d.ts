import { LuaTool } from 'lua-cli';
import { z } from 'zod';
export declare class RefreshLoanResearchTool implements LuaTool {
    name: string;
    description: string;
    inputSchema: z.ZodObject<{
        trigger: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        trigger: string;
    }, {
        trigger?: string | undefined;
    }>;
    execute(input: {
        trigger: string;
    }): Promise<unknown>;
}
//# sourceMappingURL=RefreshLoanResearch.d.ts.map