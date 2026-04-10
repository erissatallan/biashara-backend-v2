import { LuaTool, env } from 'lua-cli';
import { z } from 'zod';

export class DebugEnvTool implements LuaTool {
    name = 'debug_env';
    description = 'Debug tool to check environment variables';

    inputSchema = z.object({});

    async execute(_input: Record<string, never>) {
        return {
            BACKEND_API_URL: env('BACKEND_API_URL') || 'NOT_SET',
            BACKEND_API_SECRET: env('BACKEND_API_SECRET') ? 'SET' : 'NOT_SET',
            OWNER_USER_ID: env('OWNER_USER_ID') ? 'SET' : 'NOT_SET',
            raw_url_check: env('BACKEND_API_URL'),
        };
    }
}
