/**
 * Test script to verify Gemini API key is working
 * Run with: node scripts/test-gemini.js
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGeminiAPI() {
  console.log('🔍 Testing Gemini API Key...\n');

  // Get API key from environment or command line
  const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyBxHbwpwZw5GyucERRyQ6v6q86A0tSyadA';

  if (!apiKey) {
    console.error('❌ No API key provided');
    console.log('Set GEMINI_API_KEY environment variable or update the script');
    process.exit(1);
  }

  console.log(`📝 API Key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`);
  console.log('');

  try {
    // Initialize Gemini
    // Using gemini-2.5-flash which is stable and supports up to 1M tokens
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    console.log('⏳ Sending test request...\n');

    // Send a simple test message
    const result = await model.generateContent('Say "Hello, Machina!" in one line.');
    const response = await result.response;
    const text = response.text();

    console.log('✅ SUCCESS! API key is working!\n');
    console.log('📤 Test Response:');
    console.log('─'.repeat(50));
    console.log(text);
    console.log('─'.repeat(50));
    console.log('');
    console.log('🎉 Your Gemini API is configured correctly!');
    console.log('You can now use the AI Assistant in the playground.');
    console.log('');

    // Show usage info
    console.log('📊 Usage Information:');
    console.log('   - Free tier: 15 requests/minute, 1,500/day');
    console.log('   - Monitor: https://ai.dev/usage?tab=rate-limit');
    console.log('   - Get keys: https://aistudio.google.com/app/apikey');

  } catch (error) {
    console.error('❌ ERROR: API key test failed\n');
    
    if (error.message?.includes('429') || error.message?.includes('quota')) {
      console.log('🚫 Rate Limit Exceeded');
      console.log('   You have exceeded the API quota.');
      console.log('   Wait a few minutes and try again.');
      console.log('   Check usage: https://ai.dev/usage?tab=rate-limit');
    } else if (error.message?.includes('401') || error.message?.includes('API_KEY_INVALID')) {
      console.log('🔑 Invalid API Key');
      console.log('   The API key appears to be invalid or expired.');
      console.log('   Get a new key: https://aistudio.google.com/app/apikey');
    } else if (error.message?.includes('403')) {
      console.log('🚫 Access Denied');
      console.log('   The API key does not have permission.');
      console.log('   Check your API key settings in Google AI Studio.');
    } else {
      console.log('⚠️  Unknown Error');
      console.log('   Error details:', error.message);
    }
    
    console.log('');
    process.exit(1);
  }
}

// Run the test
testGeminiAPI();

