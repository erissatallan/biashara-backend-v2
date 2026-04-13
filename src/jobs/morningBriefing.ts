import { LuaJob, User, AI } from 'lua-cli';

const OWNER_USER_ID = '254759469851';
const BACKEND = 'https://untransmitted-rowena-unpreferably.ngrok-free.dev';
const SECRET = 'dev-secret';

// Daily morning briefing at 7 AM Nairobi time with transaction summary and credit score.
export const morningBriefingJob = new LuaJob({
    name: 'morning-briefing',
    description: 'Sends the owner a proactive morning briefing every day at 7am Nairobi time',
    schedule: {
        type: 'cron',
        expression: '0 7 * * *',
        timezone: 'Africa/Nairobi',
    },
    metadata: { userId: OWNER_USER_ID },

    execute: async (job) => {
        const userId = job.metadata?.userId || OWNER_USER_ID;
        if (!userId) {
            console.error('morning-briefing: no userId in metadata or env');
            return { sent: false, reason: 'no userId' };
        }

        try {
            const [summaryRes, profileRes] = await Promise.all([
                fetch(`${BACKEND}/api/transactions/summary?days=7`, {
                    headers: { 'x-api-secret': SECRET },
                }),
                fetch(`${BACKEND}/api/credit/profile`, {
                    headers: { 'x-api-secret': SECRET },
                }),
            ]);

            const summary: any = summaryRes.ok ? await summaryRes.json() : null;
            const profile: any = profileRes.ok ? await profileRes.json() : null;

            const systemPrompt =
                `You are Biashara, an AI business agent for the owner of Zawadi General Store in Westlands, Nairobi. ` +
                `It is 7am in Nairobi. Write a short morning briefing on WhatsApp. ` +
                `Warm, direct, like a trusted advisor. Use KES. Start with "Habari za asubuhi ☀️". ` +
                `Keep it under 6 short lines.`;

            const userPrompt =
                `7-day transaction summary (JSON):\n${JSON.stringify(summary, null, 2)}\n\n` +
                `Credit readiness profile (JSON):\n${JSON.stringify(profile, null, 2)}\n\n` +
                `Write the briefing. Structure:\n` +
                `1) Yesterday vs the 7-day average (one line with the number).\n` +
                `2) Credit readiness score and what changed this week (one line).\n` +
                `3) One specific thing to watch or do today (one line).\n` +
                `No bullet points — just clean lines.`;

            let text: string;
            try {
                text = await AI.generate(systemPrompt, userPrompt);
            } catch (e) {
                console.error('morning-briefing: AI.generate failed, falling back', e);
                const yesterday = summary?.recentDays?.slice(-1)?.[0]?.revenue ?? 0;
                const avg = summary?.avgDailyRevenue ?? 0;
                text =
                    `Habari za asubuhi ☀️\n` +
                    `Yesterday: KES ${yesterday.toLocaleString()} (7-day avg KES ${avg.toLocaleString()}).\n` +
                    `Credit readiness: ${profile?.score ?? '?'}/100 — ${profile?.label ?? ''}.\n` +
                    `Have a good day at the shop.`;
            }

            const owner = await User.get(userId);
            if (!owner) {
                console.error('morning-briefing: owner lookup returned null');
                return { sent: false, reason: 'owner not found' };
            }

            await owner.send([{ type: 'text', text }]);
            return { sent: true, creditScore: profile?.score ?? null };
        } catch (err: any) {
            console.error('morning-briefing error:', err);
            return { sent: false, error: err?.message };
        }
    },
});
