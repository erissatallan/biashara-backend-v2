import { LuaJob } from 'lua-cli';
/**
 * Low Sales Recovery Job — runs every 4 hours during business hours.
 *
 * This job monitors real-time revenue performance and automatically sends
 * discount offers to customers via WhatsApp when sales drop significantly
 * below historical averages. It's proactive revenue protection.
 *
 * The job:
 * 1. Fetches recent transaction data and compares to baselines
 * 2. If revenue is significantly down, generates a compelling discount offer
 * 3. Sends personalized WhatsApp messages to the customer list
 * 4. Notifies the owner that a recovery campaign was triggered
 * 5. Tracks when campaigns were sent to avoid spamming
 */
export declare const lowSalesRecoveryJob: LuaJob;
//# sourceMappingURL=lowSalesRecovery.d.ts.map