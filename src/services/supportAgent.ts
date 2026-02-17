
import { GoogleGenAI } from "@google/genai";
import { BORAINE_PRICING } from "../constants";

const getApiKey = () => {
  try {
    return process.env.API_KEY;
  } catch (e) {
    return undefined;
  }
};

const apiKey = getApiKey();
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

// Construct the Knowledge Base from existing constants
const PRICING_CONTEXT = BORAINE_PRICING.map(t => 
  `- ${t.name}: Setup ${t.setupFee}, Monthly ${t.retainer}. Features: ${t.features.join(', ')}.`
).join('\n');

const SYSTEM_INSTRUCTION = `
You are "Nexus", the AI Customer Success Agent for Boraine Tech.
Your goal is to assist visitors, answer questions about our services, and encourage them to "Initialize" a project.

COMPANY PROFILE:
- Name: Boraine Tech (The AI Profit Agency).
- Location: Kimberley, South Africa (serving globally).
- Founder: Allan Boraine (Chief Technical Architect).
- Mission: We engineer profit using autonomous AI agents, voice receptionists, and dynamic pricing.

PRICING TIERS:
${PRICING_CONTEXT}

BEHAVIOR GUIDELINES:
1. Tone: Professional, futuristic, helpful, and concise. 
2. Do not hallucinate features. Stick to the provided pricing and services.
3. If asked about technical implementation, reassure them we handle the code/hosting.
4. If a user seems interested in buying, guide them to the "Investment" section or tell them to click "Access Portal" to try the tools.
5. Keep responses under 50 words unless a detailed explanation is requested.

Example Interaction:
User: "How much is the voice bot?"
Nexus: "Our AI Voice Receptionist is part of 'The Growth' tier. It includes a R65,000 setup fee and R9,500 monthly retainer. It handles 1,000 concurrent calls and syncs with your CRM. Shall I guide you to the investment section?"
`;

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export const sendSupportMessage = async (history: ChatMessage[], userMsg: string): Promise<string> => {
  if (!apiKey) return "Connection Error: Neural Link Offline (API Key Missing).";

  try {
    // Format history for Gemini
    const chatHistory = history.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.6, // Slightly lower for more consistent factual answers
        maxOutputTokens: 300,
      },
      contents: [
        ...chatHistory,
        { role: 'user', parts: [{ text: userMsg }] }
      ]
    });

    return response.text || "I am currently recalibrating. Please ask again.";
  } catch (error) {
    console.error("Support Agent Error:", error);
    return "Network interference detected. Please try again shortly.";
  }
};
