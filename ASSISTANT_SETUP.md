# AI Assistant Setup Guide

This guide explains how to configure and use the AI-powered Assistant in the Machina Frontend Boilerplate.

## Features

The Assistant provides:
- 🤖 **AI-Powered Responses** using Google Gemini
- 📚 **Deep Knowledge** of the boilerplate architecture
- 💬 **Conversation History** for contextual responses
- 🎯 **Specialized Workflows** for different types of help
- 🌐 **Portuguese Interface** with English code examples

## Quick Setup

### 1. Get a Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Configure Environment Variables

Create or update your `.env.local` file:

```env
# Required: Gemini API Key for AI Assistant
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Other configurations
NEXT_PUBLIC_BRAND=default
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

### 3. Install Dependencies

```bash
npm install
```

This will install `@google/generative-ai` and other required packages.

### 4. Run the Development Server

```bash
npm run dev
```

### 5. Access the Playground

Open [http://localhost:3000/playground](http://localhost:3000/playground) in your browser.

## Available Workflows

### 1. Assistant Chat
General-purpose assistant for boilerplate questions, architecture guidance, and best practices.

**Best for:**
- Understanding the boilerplate structure
- Learning about patterns and conventions
- General questions about Next.js, Redux, or Tailwind
- Architectural decisions

### 2. Code Helper
Focused on providing specific code examples and implementation guidance.

**Best for:**
- Getting code snippets
- Understanding how to implement features
- Learning component patterns
- API integration examples

### 3. Deployment Guide
Specialized in deployment, CI/CD, and infrastructure configuration.

**Best for:**
- Setting up GitHub Actions
- Configuring Kubernetes
- Docker optimization
- Environment variables
- Deployment troubleshooting

## How It Works

### Architecture

```
User Message
    ↓
Frontend (React + Redux)
    ↓
API Route (/api/assistant/chat)
    ↓
Gemini Service (libs/ai/gemini.service.ts)
    ↓
Google Gemini AI
    ↓
AI Response
    ↓
Frontend Display
```

### Context System

The assistant uses a comprehensive context system:

1. **Boilerplate Context** (`libs/ai/boilerplate-context.ts`)
   - Complete architecture documentation
   - Coding standards and best practices
   - Common tasks and examples
   - Project structure

2. **Workflow Context**
   - Specialized instructions per workflow
   - Tailored response styles
   - Focused expertise areas

3. **Conversation History**
   - Last 10 messages maintained
   - Provides contextual awareness
   - Enables follow-up questions

### Example Questions

**Assistant Chat:**
- "How do I add a new feature to the boilerplate?"
- "What's the difference between providers and components?"
- "Explain the Redux architecture used here"

**Code Helper:**
- "Show me how to create a new API route"
- "Give me an example of a Redux async thunk"
- "How do I make an authenticated API request?"

**Deployment Guide:**
- "How do I deploy to Kubernetes?"
- "What environment variables do I need for production?"
- "How do I set up GitHub Actions?"

## Fallback Mode

If `GEMINI_API_KEY` is not configured, the assistant will:
- Display a configuration message
- Provide basic fallback responses
- Guide you to set up the API key

## Customization

### Adjusting AI Behavior

Edit `libs/ai/gemini.service.ts` to modify:
- **Model**: Currently using `gemini-1.5-flash` (free tier compatible). You can change to other models like `gemini-1.5-pro` for more advanced capabilities
- **Temperature**: Adjust creativity (0.0 - 1.0)
- **Max Tokens**: Change response length

**Note:** The boilerplate uses `gemini-2.5-flash` which is stable and supports up to 1 million tokens. Alternative models like `gemini-2.5-pro`, `gemini-pro`, or `gemini-1.5-flash` may also work depending on your API version and availability.

```typescript
generationConfig: {
  temperature: 0.7,      // Lower = more focused, Higher = more creative
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 2048, // Maximum response length
}
```

### Adding New Workflows

1. Add to `app/api/assistant/workflows/route.ts`:

```typescript
{
  id: 'my-workflow',
  name: 'My Workflow',
  description: 'Custom workflow description',
  parameters: [...]
}
```

2. Add context in `libs/ai/boilerplate-context.ts`:

```typescript
export const WORKFLOW_CONTEXTS = {
  // ... existing workflows
  'my-workflow': `
    You are in "My Workflow" mode. Specialized instructions here...
  `,
};
```

### Updating Boilerplate Context

When you add new features or change architecture, update `libs/ai/boilerplate-context.ts` to keep the AI informed.

## Troubleshooting

### "Gemini API key is not configured"
- Ensure `GEMINI_API_KEY` is set in `.env.local`
- Restart the development server after adding the key
- Verify the API key is valid at [Google AI Studio](https://aistudio.google.com/app/apikey)

### API Rate Limits
- Free tier: 60 requests per minute
- If exceeded, responses will be delayed
- Consider upgrading your Gemini API plan

### Slow Responses
- Gemini typically responds in 1-3 seconds
- Check your internet connection
- Reduce conversation history if needed

### Empty or Error Responses
- Check the console for detailed error messages
- Verify API key permissions
- Ensure the model name is correct

## Best Practices

1. **Be Specific**: Clear questions get better answers
2. **Use Workflows**: Select the appropriate workflow for your question
3. **Provide Context**: Use parameters when relevant
4. **Follow Up**: Ask clarifying questions in the same conversation
5. **Code Review**: Always review AI-generated code before using it

## Security Notes

- ✅ API keys are stored server-side only
- ✅ Never committed to git (via .gitignore)
- ✅ Not exposed to the client
- ✅ All AI requests go through BFF (Backend for Frontend)

## Cost Considerations & Rate Limits

### Gemini Free Tier Limits

The free tier of Gemini API has the following limits:

- **Requests per minute (RPM)**: 15
- **Requests per day (RPD)**: 1,500
- **Tokens per minute (TPM)**: 1 million
- **Model**: Gemini 2.5 Flash (stable, supports up to 1M tokens)

### What Happens When Limits Are Exceeded?

When you hit the rate limit, you'll see a friendly error message with:
- ⚠️ Clear explanation of the issue
- 🔗 Links to check your usage
- 📝 Basic fallback response to your question
- ⏰ Suggestion to wait and retry

### Monitor Your Usage

- **Usage Dashboard**: https://ai.dev/usage?tab=rate-limit
- **API Keys**: https://aistudio.google.com/app/apikey

### Tips to Avoid Rate Limits

1. **Wait Between Requests**: Allow 4-5 seconds between messages
2. **Use Shorter Prompts**: Keep questions concise when possible
3. **Upgrade if Needed**: Consider paid plans for production use
4. **Cache Responses**: Avoid asking the same question repeatedly

### Fallback Mode

Even when rate limited, the assistant will:
- ✅ Provide helpful fallback responses
- ✅ Show code examples for common patterns
- ✅ Guide you to documentation
- ✅ Explain how to resolve the issue

No complete service interruption!

## Contributing

When adding new boilerplate features:

1. Update `BOILERPLATE_CONTEXT` in `libs/ai/boilerplate-context.ts`
2. Add examples for common use cases
3. Update this documentation
4. Test the assistant's responses

## Support

For issues or questions:
- Check the console for error messages
- Review this documentation
- Contact: mateus.pinheiro@machina.gg

---

**Enjoy using your AI-powered Boilerplate Assistant!** 🚀

