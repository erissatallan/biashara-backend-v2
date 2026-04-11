import { User, AI } from 'lua-cli';

const BACKEND = process.env.BACKEND_API_URL || 'http://localhost:4000';
const SECRET = process.env.BACKEND_API_SECRET || 'dev-secret';
const OWNER_USER_ID = process.env.OWNER_USER_ID || '254759469851';

async function testOwnerMessage() {
    console.log('🧪 Testing customer discount message (sending to owner for demo)...');
    console.log(`📱 Sending to: ${OWNER_USER_ID}`);

    try {
        // Fetch recent data to make the message contextual
        const weekRes = await fetch(`${BACKEND}/api/transactions/summary?days=7`, {
            headers: { 'x-api-secret': SECRET },
        });
        const weekSummary: any = weekRes.ok ? await weekRes.json() : null;
        const weeklyAverage = weekSummary?.avgDailyRevenue || 4500;

        // Generate a discount message using AI
        const systemPrompt =
            `You are a marketing assistant for Zawadi General Store in Westlands, Nairobi. ` +
            `You need to send a warm, compelling WhatsApp message to a customer ` +
            `offering a special discount to drive foot traffic. Keep it under 4 lines. ` +
            `Use a friendly, conversational Kenyan tone. Include the discount percentage and urgency. ` +
            `Sign off with "Zawadi General Store, Westlands" but don't include a phone number.`;

        const userPrompt =
            `Weekly average revenue: KES ${Math.round(weeklyAverage).toLocaleString()}\n\n` +
            `Generate a compelling discount offer message. Offer 15% off on all items today only. ` +
            `Make it feel exclusive and time-sensitive.`;

        console.log('🤖 Generating discount message with AI...');

        let discountMessage: string;
        try {
            discountMessage = await AI.generate(systemPrompt, userPrompt);
        } catch (e) {
            console.error('AI.generate failed, using fallback', e);
            discountMessage =
                `🎉 Special offer just for you!\n\n` +
                `Get 15% OFF on all items at Zawadi General Store today only! ` +
                `Visit us in Westlands before 8pm to claim your discount.\n\n` +
                `Zawadi General Store, Westlands`;
        }

        console.log('\n📝 Message to send:');
        console.log('─'.repeat(50));
        console.log(discountMessage);
        console.log('─'.repeat(50));

        // Get owner and send message
        console.log('\n📤 Sending to owner (as demo)...');
        const owner = await User.get(OWNER_USER_ID);

        if (!owner) {
            console.error(`❌ Owner ${OWNER_USER_ID} not found`);
            process.exit(1);
        }

        // Add a prefix so you know it's a test
        const testMessage =
            `🧪 *[TEST - Customer Campaign Message]*\n\n` +
            `This is how the discount message would look to customers:\n\n` +
            `─────────────────────\n` +
            discountMessage;

        await owner.send([{ type: 'text', text: testMessage }]);

        console.log('✅ Test message sent successfully to owner!');
        console.log('\nCheck your WhatsApp to see the customer discount message format.');

    } catch (err: any) {
        console.error('❌ Error:', err.message);
        console.error(err);
        process.exit(1);
    }
}

testOwnerMessage();
