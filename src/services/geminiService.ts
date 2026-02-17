
import { GoogleGenAI } from "@google/genai";
import { Message, MessageType } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

const getApiKey = () => {
  try {
    return process.env.API_KEY;
  } catch (e) {
    console.warn("Environment variable access failed. Ensure API_KEY is set.");
    return undefined;
  }
};

const apiKey = getApiKey();
// Initialize GenAI client.
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export const sendMessageToGemini = async (
  history: Message[],
  userMessage: string
): Promise<string> => {
  if (!apiKey) {
    return "SYSTEM ERROR: API_KEY_MISSING. Please configure your environment variables.";
  }

  try {
    // Format history for Gemini
    // We only take the last 10 messages to keep context tight and relevant
    const recentHistory = history
      .filter(m => m.type !== MessageType.SYSTEM)
      .slice(-10)
      .map(m => ({
        role: m.type === MessageType.USER ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));

    // Call generateContent directly on the instance to preserve 'this' context
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 1500, // Increased to allow for detailed Audit Reports (Executive Summary, etc.)
        tools: [{ googleSearch: {} }] // Enable Google Search for industry lookups
      },
      contents: [
        ...recentHistory,
        { role: 'user', parts: [{ text: userMessage }] }
      ]
    });

    return response.text || "CONNECTION INTERRUPTED. RETRY.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "CRITICAL FAILURE: Neural link unstable. Please try again.";
  }
};
