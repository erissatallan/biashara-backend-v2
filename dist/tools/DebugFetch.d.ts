import { LuaTool } from 'lua-cli';
import { z } from 'zod';
export declare class DebugFetchTool implements LuaTool {
    name: string;
    description: string;
    inputSchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    execute(_input: Record<string, never>): Promise<{
        success: boolean;
        status: number;
        statusText: string;
        url: string;
        backend: string;
        responseBody: string;
        headers: {
            [k: string]: string;
        };
        error?: undefined;
        stack?: undefined;
    } | {
        success: boolean;
        error: any;
        stack: any;
        url: string;
        backend: string;
        status?: undefined;
        statusText?: undefined;
        responseBody?: undefined;
        headers?: undefined;
    }>;
}
//# sourceMappingURL=DebugFetch.d.ts.map