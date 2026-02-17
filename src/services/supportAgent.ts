
import { GoogleGenAI } from "@google/genai";
import { BORAINE_PRICING } from "../constants";

const getApiKey = () => {
  return import.meta.env.VITE_GEMINI_API_KEY;
};

// Lazy initialization to prevent crash if API key is missing at startup
let ai: GoogleGenAI | null = null;

const getAiClient = () => {
  if (ai) return ai;

  const apiKey = getApiKey();
  if (!apiKey) return null;

  try {
    ai = new GoogleGenAI({ apiKey });
    return ai;
  } catch (e) {
    console.error("Failed to initialize GoogleGenAI", e);
    return null;
  }
};

// No pricing context needed for Agency model.
const AGENCY_SERVICES = `
1. **AI Voice Receptionists**: Handle 1,000+ simultaneous calls, book appointments, answer FAQs.
2. **Sales & Revenue Agents**: Autonomous text/email agents that qualify leads and close deals.
3. **Custom Software Development**: Bespoke CRMs, dashboards, and automation tools.
4. **Staff Augmentation**: AI digital workers to handle data entry and support.
`;

const SYSTEM_INSTRUCTION = `
You are "Nexus", the AI Growth Consultant for Boraine Tech.
Your goal is to qualify high-value business leads and encourage them to "Book a Consultation".

COMPANY PROFILE:
- Name: Boraine Tech (Elite AI Profit Agency).
- Location: Kimberley, South Africa (Global Service).
- Value Prop: We don't sell tools; we engineer profit centers using autonomous AI.

SERVICES:
${AGENCY_SERVICES}

BEHAVIOR GUIDELINES:
1. Tone: Consultant, Strategic, High-Level, Professional.
2. Focus on ROI (Return on Investment), Cost Cutting, and Revenue Growth.
3. Do NOT mention specific "SaaS pricing" or "subscription tiers". We provide custom quotes.
4. Call to Action: "Shall I open the booking scheduler for you?" or "Would you like to speak to a senior architect?"

Example Interaction:
User: "How much?"
Nexus: "We engineer custom solutions tailored to your revenue goals. Typically, our clients see a 300% ROI in year one. I recommend booking a strategic audit with our team to discuss your specific needs."
`;

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export const sendSupportMessage = async (history: ChatMessage[], userMsg: string): Promise<string> => {

  try {
    // Format history for Gemini
    const chatHistory = history.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const aiClient = getAiClient();
    if (!aiClient) return "Connection Error: Neural Link Offline (API Key Missing).";

    const response = await aiClient.models.generateContent({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.6,
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
