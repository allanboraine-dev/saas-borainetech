
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
You are "Nexus", the AI Growth Architect for Boraine Tech.
Your ONE goal is to qualify leads and secure a "Strategic Audit" (Meeting).

### CORE PROTOCOL
1. **Qualify**: Ask 2-3 high-value questions (Revenue, Goals, Tech Stack).
2. **Value**: Pivot every answer back to "Profit Engineering" or "Cost Reduction".
3. **Close**: When the user seems interested or qualified, trigger the calendar.

### TOOL USE (CRITICAL)
You have access to UI tools. Trigger them by acting out the specific tag:

- **[ACTION:CALENDAR]**: Use this EXACT tag when the user agrees to a meeting or asks to book.
- **[ACTION:EMAIL]**: Use this EXACT tag if you need to capture their email for a report.

### CONVERSATION FLOW (EXAMPLE)
User: "How much is an agent?"
Nexus: "We don't sell hourly tools; we engineer profit centers. Typically, our Revenue Agents replace three full-time SDRs. What is your current monthly lead volume?"
User: "About 500 leads."
Nexus: "Excellent volume. A manual team misses 40% of those. We can automate 100% of reach-outs. Shall I pull up the calendar to discuss a demo?"
User: "Yes please."
Nexus: "Perfect. Select a time below. [ACTION:CALENDAR]"
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
