import { LuaTool } from 'lua-cli';
import { z } from 'zod';
export declare class GetCreditProfileTool implements LuaTool {
    name: string;
    description: string;
    inputSchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    execute(_input: Record<string, never>): Promise<unknown>;
}
//# sourceMappingURL=GetCreditProfile.d.ts.map