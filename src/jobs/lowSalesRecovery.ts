import { LuaJob, User, AI } from 'lua-cli';

const OWNER_USER_ID = process.env.OWNER_USER_ID || '';
const BACKEND = process.env.BACKEND_API_URL || 'http://localhost:4000';
const SECRET = process.env.BACKEND_API_SECRET || 'dev-secret';

const CUSTOMER_PHONE_NUMBERS = [
    '254770054884',
    '254741470643',
    '254700416929',
];

const REVENUE_DROP_THRESHOLD = 20;

// Monitors revenue and sends WhatsApp discount campaigns when sales drop 20%+ below average.
// Runs every 4 hours during business hours, max 2 campaigns per day.
export const lowSalesRecoveryJob = new LuaJob({
    name: 'low-sales-recovery',
    description: 'Automatically sends discount offers to customers via WhatsApp when revenue drops significantly below average',
    schedule: {
        type: 'cron',
        expression: '0 8,12,16,20 * * *',
        timezone: 'Africa/Nairobi',
    },
    metadata: {
        userId: OWNER_USER_ID,
        lastCampaignSent: null,
        campaignsSentToday: 0,
    },

    execute: async (job) => {
        const userId = job.metadata?.userId || OWNER_USER_ID;
        if (!userId) return { sent: false, reason: 'no userId' };

        const today = new Date().toISOString().split('T')[0];
        const lastCampaignDate = job.metadata?.lastCampaignSent?.split('T')[0];
        const campaignsToday = today === lastCampaignDate ? (job.metadata?.campaignsSentToday || 0) : 0;

        if (campaignsToday >= 2) {
            return { sent: false, reason: 'daily campaign limit reached (2/day max)' };
        }

        try {
            const [todayRes, weekRes] = await Promise.all([
                fetch(`${BACKEND}/api/transactions/summary?days=1`, {
                    headers: { 'x-api-secret': SECRET },
                }),
                fetch(`${BACKEND}/api/transactions/summary?days=7`, {
                    headers: { 'x-api-secret': SECRET },
                }),
            ]);

            const todaySummary: any = todayRes.ok ? await todayRes.json() : null;
            const weekSummary: any = weekRes.ok ? await weekRes.json() : null;

            if (!todaySummary || !weekSummary) {
                return { sent: false, reason: 'failed to fetch transaction data' };
            }

            const todayRevenue = todaySummary.totalRevenue || 0;
            const weeklyAverage = weekSummary.avgDailyRevenue || 0;
            const dropPercentage = weeklyAverage > 0
                ? ((weeklyAverage - todayRevenue) / weeklyAverage) * 100
                : 0;

            if (dropPercentage < REVENUE_DROP_THRESHOLD) {
                return {
                    sent: false,
                    reason: 'revenue within acceptable range',
                    todayRevenue,
                    weeklyAverage,
                    dropPercentage: Math.round(dropPercentage)
                };
            }

            console.log(`Low sales detected: ${Math.round(dropPercentage)}% below average. Triggering campaign...`);
            const systemPrompt =
                `You are a marketing assistant for Zawadi General Store in Westlands, Nairobi. ` +
                `Sales are down today, so you need to send a warm, compelling WhatsApp message to customers ` +
                `offering a special discount to drive foot traffic. Keep it under 4 lines. ` +
                `Use a friendly, conversational Kenyan tone. Include the discount percentage and urgency. ` +
                `Sign off with "Zawadi General Store, Westlands" but don't include a phone number.`;

            const userPrompt =
                `Today's revenue: KES ${Math.round(todayRevenue).toLocaleString()}\n` +
                `Weekly average: KES ${Math.round(weeklyAverage).toLocaleString()}\n` +
                `Revenue is down ${Math.round(dropPercentage)}% today.\n\n` +
                `Generate a compelling discount offer message. Offer 10-15% off on all items today only. ` +
                `Make it feel exclusive and time-sensitive.`;

            let discountMessage: string;
            try {
                discountMessage = await AI.generate(systemPrompt, userPrompt);
            } catch (e) {
                console.error('low-sales-recovery: AI.generate failed, using fallback', e);
                discountMessage =
                    `🎉 Special offer just for you!\n\n` +
                    `Get 15% OFF on all items at Zawadi General Store today only! ` +
                    `Visit us in Westlands before 8pm to claim your discount.\n\n` +
                    `Zawadi General Store, Westlands`;
            }

            let successCount = 0;
            let failCount = 0;

            for (const phoneNumber of CUSTOMER_PHONE_NUMBERS) {
                try {
                    const customer = await User.get(phoneNumber);
                    if (customer) {
                        await customer.send([{ type: 'text', text: discountMessage }]);
                        successCount++;
                        await new Promise(resolve => setTimeout(resolve, 500));
                    } else {
                        console.warn(`Customer ${phoneNumber} not found`);
                        failCount++;
                    }
                } catch (err) {
                    console.error(`Failed to send to ${phoneNumber}:`, err);
                    failCount++;
                }
            }

            const owner = await User.get(userId);
            if (owner) {
                const ownerMessage =
                    `📢 *Low Sales Alert*\n\n` +
                    `Revenue is ${Math.round(dropPercentage)}% below average (KES ${Math.round(todayRevenue).toLocaleString()} vs avg KES ${Math.round(weeklyAverage).toLocaleString()}).\n\n` +
                    `✅ Sent discount campaign to ${successCount} customer${successCount !== 1 ? 's' : ''} on WhatsApp to boost sales.` +
                    (failCount > 0 ? `\n⚠️ ${failCount} failed.` : '');

                await owner.send([{ type: 'text', text: ownerMessage }]);
            }

            await job.updateMetadata({
                ...(job.metadata ?? {}),
                lastCampaignSent: new Date().toISOString(),
                campaignsSentToday: campaignsToday + 1,
                lastDropPercentage: Math.round(dropPercentage),
                lastCustomersSent: successCount,
            });

            return {
                sent: true,
                customersReached: successCount,
                failed: failCount,
                dropPercentage: Math.round(dropPercentage),
                todayRevenue: Math.round(todayRevenue),
                weeklyAverage: Math.round(weeklyAverage),
            };

        } catch (err: any) {
            console.error('low-sales-recovery error:', err);
            return { sent: false, error: err?.message };
        }
    },
});
