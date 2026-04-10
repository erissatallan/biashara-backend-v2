import { LuaJob } from 'lua-cli';
/**
 * Morning briefing — fires at 07:00 Africa/Nairobi every day.
 *
 * This is one of the agent's proactive touchpoints. The job pulls the
 * latest transaction summary and credit profile directly from the backend,
 * then uses AI.generate() (isolated, off the chat pipeline) to compose a
 * short message in Biashara's voice. The owner sees a finished briefing,
 * not a meta-prompt.
 */
export declare const morningBriefingJob: LuaJob;
//# sourceMappingURL=morningBriefing.d.ts.map