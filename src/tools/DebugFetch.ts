import { LuaTool } from 'lua-cli';
import { z } from 'zod';

const BACKEND = 'https://lua.chequemate.space';
const SECRET = 'dev-secret';

export class DebugFetchTool implements LuaTool {
    name = 'debug_fetch';
    description = 'Debug tool to test backend connectivity and see exact errors';

    inputSchema = z.object({});

    async execute(_input: Record<string, never>) {
        const url = `${BACKEND}/api/transactions/simulate`;
        const payload = {
            amount: 100,
            description: 'Debug test',
            phone: '254700000000',
            receiptNumber: `DEBUG${Date.now()}`,
            timestamp: new Date().toISOString(),
            simulated: true,
        };

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-secret': SECRET,
                },
                body: JSON.stringify(payload),
            });

            const responseText = await res.text();

            return {
                success: res.ok,
                status: res.status,
                statusText: res.statusText,
                url: url,
                backend: BACKEND,
                responseBody: responseText,
                headers: Object.fromEntries(res.headers.entries()),
            };
        } catch (err: any) {
            return {
                success: false,
                error: err.message,
                stack: err.stack,
                url: url,
                backend: BACKEND,
            };
        }
    }
}
