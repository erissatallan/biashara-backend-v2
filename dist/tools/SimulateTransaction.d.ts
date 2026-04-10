import { LuaTool } from 'lua-cli';
import { z } from 'zod';
export declare class SimulateTransactionTool implements LuaTool {
    name: string;
    description: string;
    inputSchema: z.ZodObject<{
        amount: z.ZodNumber;
        description: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        amount: number;
        description: string;
    }, {
        amount: number;
        description?: string | undefined;
    }>;
    execute(input: {
        amount: number;
        description: string;
    }): Promise<unknown>;
}
//# sourceMappingURL=SimulateTransaction.d.ts.map