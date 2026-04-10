"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugEnvTool = void 0;
const lua_cli_1 = require("lua-cli");
const zod_1 = require("zod");
class DebugEnvTool {
    constructor() {
        this.name = 'debug_env';
        this.description = 'Debug tool to check environment variables';
        this.inputSchema = zod_1.z.object({});
    }
    async execute(_input) {
        return {
            BACKEND_API_URL: (0, lua_cli_1.env)('BACKEND_API_URL') || 'NOT_SET',
            BACKEND_API_SECRET: (0, lua_cli_1.env)('BACKEND_API_SECRET') ? 'SET' : 'NOT_SET',
            OWNER_USER_ID: (0, lua_cli_1.env)('OWNER_USER_ID') ? 'SET' : 'NOT_SET',
            raw_url_check: (0, lua_cli_1.env)('BACKEND_API_URL'),
        };
    }
}
exports.DebugEnvTool = DebugEnvTool;
//# sourceMappingURL=DebugEnv.js.map