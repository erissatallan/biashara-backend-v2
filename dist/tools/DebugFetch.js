"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugFetchTool = void 0;
const zod_1 = require("zod");
const BACKEND = 'https://lua.chequemate.space';
const SECRET = 'dev-secret';
class DebugFetchTool {
    constructor() {
        this.name = 'debug_fetch';
        this.description = 'Debug tool to test backend connectivity and see exact errors';
        this.inputSchema = zod_1.z.object({});
    }
    async execute(_input) {
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
        }
        catch (err) {
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
exports.DebugFetchTool = DebugFetchTool;
//# sourceMappingURL=DebugFetch.js.map