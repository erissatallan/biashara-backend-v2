"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loanResearchRefreshJob = void 0;
const lua_cli_1 = require("lua-cli");
const BACKEND = process.env.BACKEND_API_URL || 'http://localhost:4000';
const SECRET = process.env.BACKEND_API_SECRET || '';
function getNairobiNow() {
    const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Africa/Nairobi',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        weekday: 'long',
        hour12: false,
    });
    const parts = formatter.formatToParts(new Date());
    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    return {
        weekday: values.weekday,
        hour: Number(values.hour),
        dateKey: `${values.year}-${values.month}-${values.day}`,
    };
}
exports.loanResearchRefreshJob = new lua_cli_1.LuaJob({
    name: 'loan-research-refresh',
    description: 'Refreshes the proposal guidance and local MSME lending context once per configured week',
    schedule: {
        type: 'cron',
        expression: '5 * * * *',
        timezone: 'Africa/Nairobi',
    },
    metadata: {
        lastRunDateKey: '',
    },
    execute: async (job) => {
        try {
            const settingsRes = await fetch(`${BACKEND}/api/settings`, {
                headers: { 'x-api-secret': SECRET },
            });
            const settings = settingsRes.ok ? await settingsRes.json() : {};
            if (settings.loan_research_enabled === false) {
                return { refreshed: false, reason: 'loan_research_enabled disabled' };
            }
            const now = getNairobiNow();
            const targetDay = String(settings.loan_research_day || 'Monday');
            const targetHour = Number(settings.loan_research_hour ?? 8);
            const lastRunDateKey = String(job.metadata?.lastRunDateKey || '');
            if (now.weekday !== targetDay || now.hour !== targetHour) {
                return {
                    refreshed: false,
                    reason: 'outside configured schedule window',
                    now,
                    targetDay,
                    targetHour,
                };
            }
            if (lastRunDateKey === now.dateKey) {
                return { refreshed: false, reason: 'already ran for this configured date', dateKey: now.dateKey };
            }
            const refreshRes = await fetch(`${BACKEND}/api/research/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-secret': SECRET,
                },
                body: JSON.stringify({ trigger: 'lua-weekly-job' }),
            });
            if (!refreshRes.ok) {
                return { refreshed: false, reason: `backend error ${refreshRes.status}` };
            }
            const payload = await refreshRes.json();
            try {
                await job.updateMetadata({
                    ...(job.metadata ?? {}),
                    lastRunDateKey: now.dateKey,
                    lastRunAt: new Date().toISOString(),
                });
            }
            catch (error) {
                console.error('loan-research-refresh: updateMetadata failed', error);
            }
            return {
                refreshed: true,
                dateKey: now.dateKey,
                snapshotTitle: payload?.snapshot?.title,
            };
        }
        catch (error) {
            console.error('loan-research-refresh error', error);
            return { refreshed: false, error: error?.message };
        }
    },
});
//# sourceMappingURL=loanResearchRefresh.js.map