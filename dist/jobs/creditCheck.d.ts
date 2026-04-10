import { LuaJob } from 'lua-cli';
/**
 * Credit threshold check — runs every N hours (configurable via CREDIT_CHECK_INTERVAL_HOURS).
 *
 * The goal is silent monitoring: 99% of the time this job runs and says
 * nothing. When the credit readiness score crosses a milestone (45, 60,
 * 75) for the first time, the agent proactively messages the owner with
 * an exciting, contextual note. We track the previously-seen milestone
 * in job metadata so we only celebrate each threshold once.
 */
export declare const creditCheckJob: LuaJob;
//# sourceMappingURL=creditCheck.d.ts.map