import { GoogleGenerativeAI } from '@google/generative-ai';
import { Document } from '../models/Document.js';
import { Workspace } from '../models/Workspace.js';

let genAI = null;

const getGenAIInstance = () => {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('[AI Service Warning] GEMINI_API_KEY is not configured in .env');
    }
    genAI = new GoogleGenerativeAI(apiKey || 'DUMMY_KEY');
  }
  return genAI;
};

export const generateAIResponse = async ({ workspaceId, userMessage, conversationHistory = [] }) => {
  try {
    // 1. Fetch Workspace settings & Knowledge Base Documents for RAG context
    const workspace = await Workspace.findById(workspaceId);
    const documents = await Document.find({ workspaceId, status: 'indexed' });

    const systemPrompt = workspace?.settings?.systemPrompt || 
      'You are a polite, helpful AI Customer Support agent. Use the provided Knowledge Base to answer visitor questions accurately.';

    // 2. Prepare RAG Context from KB
    let kbContext = '';
    if (documents.length > 0) {
      kbContext = documents.map((doc, idx) => `[Document ${idx + 1}: ${doc.title}]\n${doc.content}`).join('\n\n');
    } else {
      kbContext = 'No document uploaded yet in Knowledge Base.';
    }

    // 3. Construct Generative AI Prompt
    const prompt = `
System Role: ${systemPrompt}

--- KNOWLEDGE BASE CONTEXT ---
${kbContext}
----------------------------

--- RECENT CONVERSATION HISTORY ---
${conversationHistory.map((m) => `${m.senderType.toUpperCase()}: ${m.text}`).join('\n')}
-----------------------------------

VISITOR QUESTION: ${userMessage}

Instructions:
- Provide a clear, polite, and helpful answer strictly based on the Knowledge Base context when applicable.
- If the knowledge base does not contain enough information to answer the question, state politely that you will connect them to a human support agent.
`;

    // 4. Call Gemini Model API
    const ai = getGenAIInstance();
    const model = ai.getGenerativeModel({ model: workspace?.settings?.aiModel || 'gemini-1.5-flash' });
    
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return {
      text: responseText,
      needsHumanHandover: responseText.toLowerCase().includes('connect') && responseText.toLowerCase().includes('human'),
    };
  } catch (error) {
    console.error(`[AI Service Error] ${error.message}`);
    // Smart Fallback response if API fails
    return {
      text: "I'm sorry, I encountered a temporary issue reading our Knowledge Base. Let me connect you with one of our support team members right away!",
      needsHumanHandover: true,
    };
  }
};
