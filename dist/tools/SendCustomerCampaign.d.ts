import { LuaTool } from 'lua-cli';
import { z } from 'zod';
export declare class SendCustomerCampaignTool implements LuaTool {
    name: string;
    description: string;
    inputSchema: z.ZodObject<{
        discountPercent: z.ZodDefault<z.ZodNumber>;
        reason: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        discountPercent: number;
        reason?: string | undefined;
    }, {
        discountPercent?: number | undefined;
        reason?: string | undefined;
    }>;
    execute(input: {
        discountPercent: number;
        reason?: string;
    }): Promise<{
        success: boolean;
        message: string;
        customersSent: number;
        campaignsToday: number;
        note: string;
    }>;
}
//# sourceMappingURL=SendCustomerCampaign.d.ts.map