"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lua_cli_1 = require("lua-cli");
const BACKEND = process.env.BACKEND_API_URL || 'http://localhost:4000';
const SECRET = process.env.BACKEND_API_SECRET || 'dev-secret';
// Test with just the first customer number
const TEST_CUSTOMER = '254770054884';
async function testCustomerMessage() {
    console.log('🧪 Testing customer discount message...');
    console.log(`📱 Sending to: ${TEST_CUSTOMER}`);
    try {
        // Fetch recent data to make the message contextual
        const weekRes = await fetch(`${BACKEND}/api/transactions/summary?days=7`, {
            headers: { 'x-api-secret': SECRET },
        });
        const weekSummary = weekRes.ok ? await weekRes.json() : null;
        const weeklyAverage = weekSummary?.avgDailyRevenue || 4500;
        // Generate a discount message using AI
        const systemPrompt = `You are a marketing assistant for Zawadi General Store in Westlands, Nairobi. ` +
            `You need to send a warm, compelling WhatsApp message to a customer ` +
            `offering a special discount to drive foot traffic. Keep it under 4 lines. ` +
            `Use a friendly, conversational Kenyan tone. Include the discount percentage and urgency. ` +
            `Sign off with "Zawadi General Store, Westlands" but don't include a phone number.`;
        const userPrompt = `Weekly average revenue: KES ${Math.round(weeklyAverage).toLocaleString()}\n\n` +
            `Generate a compelling discount offer message. Offer 15% off on all items today only. ` +
            `Make it feel exclusive and time-sensitive.`;
        console.log('🤖 Generating discount message with AI...');
        let discountMessage;
        try {
            discountMessage = await lua_cli_1.AI.generate(systemPrompt, userPrompt);
        }
        catch (e) {
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
        // Get customer and send message
        console.log('\n📤 Looking up customer in Lua system...');
        const customer = await lua_cli_1.User.get(TEST_CUSTOMER);
        console.log('Customer object:', customer);
        console.log('Customer ID:', customer?.id);
        console.log('Customer phone:', customer?.phone);
        if (!customer) {
            console.error(`❌ Customer ${TEST_CUSTOMER} not found in Lua system`);
            console.error('The customer needs to send a message to your agent first to be registered.');
            process.exit(1);
        }
        console.log('✅ Customer found! Attempting to send...');
        await customer.send([{ type: 'text', text: discountMessage }]);
        console.log('✅ Message sent successfully!');
        console.log(`\nCheck WhatsApp for ${TEST_CUSTOMER} to verify delivery.`);
    }
    catch (err) {
        console.error('❌ Error:', err.message);
        console.error(err);
        process.exit(1);
    }
}
testCustomerMessage();
//# sourceMappingURL=test-customer-message.js.map