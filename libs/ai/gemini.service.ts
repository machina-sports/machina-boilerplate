import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * GeminiService - Service for Google Gemini AI integration
 * Handles AI chat completions for the assistant
 * 
 * This service is responsible for answering questions about the Machina Boilerplate
 * by using the Gemini AI with comprehensive boilerplate context.
 */
class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  /**
   * Check if Gemini is configured
   */
  isConfigured(): boolean {
    return this.genAI !== null;
  }

  /**
   * Generate a chat completion with system instruction and conversation history
   * 
   * This method properly uses systemInstruction to provide context about the boilerplate,
   * and maintains conversation history for contextual responses.
   */
  async generateChatCompletion(params: {
    systemPrompt: string;
    userMessage: string;
    conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  }): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('Gemini API key is not configured. Please set GEMINI_API_KEY in your .env.local file.');
    }

    try {
      // Get model - using gemini-2.5-flash which is stable and available
      // Supports up to 1 million tokens and generateContent method
      // Note: Some API versions may not support systemInstruction parameter
      // So we'll include system prompt in conversation history for maximum compatibility
      const model = this.genAI!.getGenerativeModel({
        model: 'gemini-2.5-flash',
      });

      // Build conversation history in Gemini format
      // Gemini expects alternating user/model messages
      const history = params.conversationHistory || [];
      
      // Validate and ensure proper alternating format
      // Filter out any system messages and ensure proper alternation
      const validHistory = history.filter(
        (msg) => msg.role === 'user' || msg.role === 'assistant'
      );
      
      // Ensure history starts with user message (if not empty)
      // If it starts with assistant, we'll skip it to maintain proper alternation
      let historyToUse = validHistory;
      if (validHistory.length > 0 && validHistory[0].role === 'assistant') {
        // Skip first assistant message if history doesn't start with user
        historyToUse = validHistory.slice(1);
      }
      
      // Build history messages, prepending system prompt as initial context
      // This ensures the AI understands its role even if systemInstruction isn't supported
      const historyMessages: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
      
      // Add system prompt as initial context (only if no history exists or first message is from user)
      if (params.systemPrompt && (historyToUse.length === 0 || historyToUse[0].role === 'user')) {
        historyMessages.push(
          { role: 'user', parts: [{ text: params.systemPrompt }] },
          { role: 'model', parts: [{ text: 'Understood. I will assist as the Machina Boilerplate Expert.' }] }
        );
      }
      
      // Add conversation history
      historyMessages.push(...historyToUse.map((msg): { role: 'user' | 'model'; parts: Array<{ text: string }> } => ({
        role: (msg.role === 'user' ? 'user' : 'model') as 'user' | 'model',
        parts: [{ text: msg.content }],
      })));

      // Start chat with history and generation config
      const chat = model.startChat({
        history: historyMessages,
        generationConfig: {
          temperature: 0.7, // Balanced creativity and focus
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 2048, // Sufficient for detailed boilerplate explanations
        },
      });

      // Send user message and get response
      const result = await chat.sendMessage(params.userMessage);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      
      // Handle specific error types with clear error messages
      const errorMessage = error.message || '';
      
      // Check for model not found errors (404)
      if (errorMessage.includes('404') || errorMessage.includes('not found') || errorMessage.includes('is not found')) {
        console.error('⚠️ Model not found. Available models may vary by API version.');
        console.error('💡 Try checking available models at: https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_KEY');
        throw new Error('MODEL_NOT_FOUND');
      }
      // Check for rate limit/quota errors
      else if (errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('Quota exceeded')) {
        // Check if it's a model availability issue
        if (errorMessage.includes('free_tier') && errorMessage.includes('limit: 0')) {
          console.error('⚠️ Model may not be available in free tier. Consider using gemini-pro');
        }
        throw new Error('RATE_LIMIT_EXCEEDED');
      } else if (errorMessage.includes('401') || errorMessage.includes('authentication') || errorMessage.includes('API_KEY_INVALID')) {
        throw new Error('INVALID_API_KEY');
      } else if (errorMessage.includes('403') || errorMessage.includes('Forbidden')) {
        throw new Error('API_ACCESS_DENIED');
      } else {
        throw new Error(`AI_ERROR: ${errorMessage}`);
      }
    }
  }

  /**
   * Generate a simple completion without history
   * Useful for one-off questions that don't need conversation context
   */
  async generateCompletion(prompt: string, systemInstruction?: string): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('Gemini API key is not configured.');
    }

    try {
      const modelConfig: { model: string; systemInstruction?: string } = {
        model: 'gemini-2.5-flash', // Using stable model with 1M token support
      };
      
      if (systemInstruction) {
        modelConfig.systemInstruction = systemInstruction;
      }

      const model = this.genAI!.getGenerativeModel(modelConfig);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      throw new Error(`Failed to generate completion: ${error.message}`);
    }
  }
}

export const geminiService = new GeminiService();

