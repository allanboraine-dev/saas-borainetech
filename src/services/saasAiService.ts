
import { GoogleGenAI } from "@google/genai";

const getApiKey = () => {
  try {
    return process.env.API_KEY;
  } catch (e) {
    return undefined;
  }
};

// Lazy Init
let ai: GoogleGenAI | null = null;

const getAiClient = () => {
  if (ai) return ai;
  const key = getApiKey();
  if (!key) return null;
  return new GoogleGenAI({ apiKey: key });
};

// Helper to strip base64 header
const cleanBase64 = (dataUrl: string) => {
  return dataUrl.split(',')[1];
};

export const generateSaaSContent = async (toolId: string, inputs: any): Promise<string> => {

  try {
    let systemInstruction = "";
    let prompt = "";
    // Default to the robust flash model which handles text and images well
    let model = "gemini-3-flash-preview";
    let parts: any[] = [];

    // Configure the persona and prompt based on the tool
    switch (toolId) {
      case 'tender':
        systemInstruction = "You are an expert South African Government Tender Compliance Officer. Output strictly in Markdown.";
        prompt = `Generate a Compliance Strategy for a tender. 
        Company: ${inputs.title}
        Sector: ${inputs.details}
        
        Include: 
        1. Executive Summary tailored to the sector.
        2. B-BBEE Strategy/Advantage.
        3. Risk Matrix for SBD 4 (Declaration of Interest).
        4. Pricing Strategy (Value for Money).`;
        break;

      case 'social':
        systemInstruction = "You are a Viral Social Media Strategist. Use emojis, hashtags, and punchy hooks.";
        prompt = `Generate a Viral Content Plan.
        Niche: ${inputs.title}
        Platform: ${inputs.details}
        
        Output:
        1. 3 x Viral Hooks (First 3 seconds).
        2. 5-Day Content Calendar.
        3. Hashtag Strategy (High & Low volume).`;
        break;

      case 'legal':
        systemInstruction = "You are a South African High Court Para-legal AI. Cite relevant SA Case Law or Acts where possible. Output in formal legal Markdown.";
        prompt = `Analyze the following legal matter.
        Reference: ${inputs.title}
        Facts: ${inputs.details}
        
        Output:
        1. Case Summary.
        2. Relevant Acts/Precedents (e.g., Constitution, CPA, LRA).
        3. Draft Clause/Legal Opinion.
        4. Success Probability Assessment.`;
        break;

      case 'trade':
        systemInstruction = "You are a construction estimation expert. Generate a professional Invoice/Quote in Markdown.";
        prompt = `Generate a Quote.
        Job Title: ${inputs.title}
        Description: ${inputs.details}
        
        Output:
        1. Itemized Material List (Assume standard SA pricing in ZAR).
        2. Labor Calculation (Hours x Rate).
        3. Total Estimated Cost (Excl & Incl VAT).`;
        break;

      case 'medical':
        systemInstruction = "You are a Medical Scribe. Output professional SOAP notes and ICD-10 codes.";
        prompt = `Transcribe Clinical Notes.
        Condition: ${inputs.title}
        Symptoms: ${inputs.details}
        
        Output:
        1. SOAP Note (Subjective, Objective, Assessment, Plan).
        2. Recommended ICD-10 Codes.
        3. Suggested Treatment Plan (Generic names).`;
        break;

      case 'construct':
        systemInstruction = "You are a Quantity Surveyor. Output a Bill of Quantities (BOQ).";
        prompt = `Generate BOQ.
        Project: ${inputs.title}
        Scope: ${inputs.details}
        
        Output:
        1. Material Breakdown (Cement, Bricks, Sand, Timber).
        2. Phase Timeline (Gantt style text).
        3. SANS 10400 Compliance Checklist.`;
        break;

      case 'estate':
        systemInstruction = "You are a Luxury Real Estate Copywriter. Use emotive language.";
        prompt = `Write a Property Listing.
        Address/Area: ${inputs.title}
        Features: ${inputs.details}
        
        Output:
        1. Headline (Catchy).
        2. Description (Emotive, selling the lifestyle).
        3. Investment Potential (Rental yield estimation).`;
        break;

      case 'landscape':
        systemInstruction = "You are a Landscape Architect specializing in South African indigenous flora (fynbos, succulents).";
        prompt = `Analyze this site image and request.
        Site Name: ${inputs.title}
        Conditions: ${inputs.details}
        
        Output:
        1. Analysis of terrain/sunlight based on image context (if visible) or description.
        2. Design Concept 1: Water-wise/Xeriscaping.
        3. Design Concept 2: Indigenous Lush.
        4. Plant List (Scientific & Common names).`;

        // Handle Image
        if (inputs.image) {
          // Detect mime type from base64 string
          const mimeMatch = inputs.image.match(/^data:(.*);base64,/);
          const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';

          parts.push({
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64(inputs.image)
            }
          });
        }
        break;

      default:
        prompt = `Analyze: ${inputs.title} - ${inputs.details}`;
    }

    parts.push({ text: prompt });

    const aiClient = getAiClient();
    if (!aiClient) return "SYSTEM ERROR: API Configuration Missing. Please check your environment variables.";

    const response = await aiClient.models.generateContent({
      model: model,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 2000, // Increased for fuller responses
      },
      contents: [
        {
          role: 'user',
          parts: parts
        }
      ]
    });

    return response.text || "Analysis complete. Review data.";

  } catch (error) {
    console.error("SaaS AI Error:", error);
    return "Error generating content. Please check inputs and try again.";
  }
};
