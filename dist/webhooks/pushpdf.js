"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushPdfWebhook = void 0;
const lua_cli_1 = require("lua-cli");
const pdfkit_1 = __importDefault(require("pdfkit"));
const OWNER_USER_ID = process.env.OWNER_USER_ID || '';
const BACKEND = process.env.BACKEND_API_URL || 'http://localhost:4000';
const SECRET = process.env.BACKEND_API_SECRET || '';
const generatePdfBase64 = (text) => {
    return new Promise((resolve) => {
        const doc = new pdfkit_1.default({ margin: 50 });
        const chunks = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks).toString('base64')));
        doc.fontSize(20).font('Helvetica-Bold').text('Business Performance Summary', { align: 'center' });
        doc.moveDown();
        doc.fontSize(14).font('Helvetica-Bold').text('Zawadi General Store', { align: 'center' });
        doc.moveDown(2);
        const lines = text.split('\n');
        for (const line of lines) {
            if (line.trim().startsWith('*') && line.trim().endsWith('*') && !line.includes(' ')) {
                doc.fontSize(12).font('Helvetica-Bold').text(line.replace(/\*/g, ''));
            }
            else if (line.includes('*')) {
                doc.fontSize(12).font('Helvetica').text(line.replace(/\*/g, ''));
            }
            else {
                doc.fontSize(12).font('Helvetica').text(line);
            }
            doc.moveDown(0.5);
        }
        doc.end();
    });
};
exports.pushPdfWebhook = new lua_cli_1.LuaWebhook({
    name: 'force-pdf',
    description: 'Forces the generation and delivery of a PDF',
    execute: async (event) => {
        try {
            const profileRes = await fetch(`${BACKEND}/api/credit/profile`, { headers: { 'x-api-secret': SECRET } });
            const profile = await profileRes.json();
            const score = profile?.score ?? 53;
            const summaryRes = await fetch(`${BACKEND}/api/transactions/summary?days=90`, { headers: { 'x-api-secret': SECRET } });
            const summary = await summaryRes.json();
            const proposalSystemPrompt = `You are an expert financial analyst. ` +
                `Draft a formal, professional "Business Performance Summary" for Zawadi General Store based on the data provided. ` +
                `The owner will use this text on WhatsApp to forward to loan officers or microfinance institutions. ` +
                `Use clear, elegant formatting, WhatsApp-friendly bolding (*text*), and highlight strong metrics (revenue trends, customer retention, regularity). ` +
                `Do NOT hallucinate numbers. Use KES. Be highly compelling but factual. Do not output markdown, just WhatsApp text formatting.`;
            const proposalUserPrompt = `90-day transaction summary: \n${JSON.stringify(summary, null, 2)}\n\n` +
                `Credit profile summary: \n${JSON.stringify({ score, label: profile?.label, subScores: profile?.subScores, reasoning: profile?.reasoning }, null, 2)}\n\n` +
                `Generate the proposal text now.`;
            const proposalText = await lua_cli_1.AI.generate(proposalSystemPrompt, proposalUserPrompt);
            const pdfBase64 = await generatePdfBase64(proposalText);
            const owner = await lua_cli_1.User.get(OWNER_USER_ID);
            if (!owner)
                return { success: false, error: 'owner not found' };
            // Send base64 file via generic object block supported by Lua Unified.to bridge for WhatsApp
            await owner.send([{
                    type: 'file',
                    data: pdfBase64,
                    mediaType: 'application/pdf',
                    filename: 'Business_Performance_Summary.pdf'
                }]);
            return { success: true, message: 'PDF generated and sent' };
        }
        catch (err) {
            console.error('PDF webhook error:', err);
            return { success: false, error: err?.message };
        }
    },
});
//# sourceMappingURL=pushpdf.js.map