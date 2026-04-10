import { LuaWebhook, User, AI } from 'lua-cli';
import PDFDocument from 'pdfkit';

const OWNER_USER_ID = process.env.OWNER_USER_ID || '';
const BACKEND = process.env.BACKEND_API_URL || 'http://localhost:4000';
const SECRET = process.env.BACKEND_API_SECRET || '';

const generatePdfBase64 = (text: string): Promise<string> => {
    return new Promise((resolve) => {
        const doc = new PDFDocument({ margin: 50 });
        const chunks: Buffer[] = [];
        doc.on('data', (chunk: Buffer) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks).toString('base64')));
        
        doc.fontSize(20).font('Helvetica-Bold').text('Business Performance Summary', { align: 'center' });
        doc.moveDown();
        doc.fontSize(14).font('Helvetica-Bold').text('Zawadi General Store', { align: 'center' });
        doc.moveDown(2);
        
        const lines = text.split('\n');
        for (const line of lines) {
            if (line.trim().startsWith('*') && line.trim().endsWith('*') && !line.includes(' ')) {
                doc.fontSize(12).font('Helvetica-Bold').text(line.replace(/\*/g, ''));
            } else if (line.includes('*')) {
                doc.fontSize(12).font('Helvetica').text(line.replace(/\*/g, ''));
            } else {
                doc.fontSize(12).font('Helvetica').text(line);
            }
            doc.moveDown(0.5);
        }
        doc.end();
    });
};

export const pushPdfWebhook = new LuaWebhook({
    name: 'force-pdf',
    description: 'Forces the generation and delivery of a PDF',

    execute: async (event) => {
        try {
            const profileRes = await fetch(`${BACKEND}/api/credit/profile`, { headers: { 'x-api-secret': SECRET } });
            const profile: any = await profileRes.json();
            const score: number = profile?.score ?? 53;

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
            
            const proposalText = await AI.generate(proposalSystemPrompt, proposalUserPrompt);
            const pdfBase64 = await generatePdfBase64(proposalText);
            
            const owner = await User.get(OWNER_USER_ID);
            if (!owner) return { success: false, error: 'owner not found' };

            // Send base64 file via generic object block supported by Lua Unified.to bridge for WhatsApp
            await owner.send([{ 
                type: 'file', 
                data: pdfBase64,
                mediaType: 'application/pdf',
                filename: 'Business_Performance_Summary.pdf'
            } as any]);

            return { success: true, message: 'PDF generated and sent' };
        } catch (err: any) {
            console.error('PDF webhook error:', err);
            return { success: false, error: err?.message };
        }
    },
});
