import { LuaTool } from 'lua-cli';
import { z } from 'zod';
export declare class DebugEnvTool implements LuaTool {
    name: string;
    description: string;
    inputSchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    execute(_input: Record<string, never>): Promise<{
        BACKEND_API_URL: string;
        BACKEND_API_SECRET: string;
        OWNER_USER_ID: string;
        raw_url_check: string | undefined;
    }>;
}
//# sourceMappingURL=DebugEnv.d.ts.map