import { GoogleGenAI, Type } from "@google/genai";
import { AppMode, ClimateAction, ClimateScenario, IndustryAnalysis, PolicySimulation, RoadmapItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_TEXT = 'gemini-2.5-flash';
const MODEL_COMPLEX = 'gemini-3-pro-preview';

export const generatePersonalizedFuture = async (
  imageBase64: string,
  age: string,
  location: string,
  lifestyle: string
): Promise<string> => {
  try {
    const cleanBase64 = imageBase64.split(',')[1] || imageBase64;
    const prompt = `
You are a climate impact storyteller. Create a personalized future narrative based on:
USER PROFILE: Age: ${age}, Location: ${location}, Lifestyle: ${lifestyle}
PHOTO ANALYSIS: (analyze uploaded photo for context)
Based on IPCC projections, describe:
1. PHYSICAL CHANGES BY 2050
2. DAILY LIFE DISRUPTIONS
3. 3 SPECIFIC ACTIONABLE SOLUTIONS
Make it vivid, personal, slightly alarming but hopeful. Start with "In 2050, you will..."
Return HTML with <h3> headings.
`;
    const response = await ai.models.generateContent({
      model: MODEL_COMPLEX,
      contents: { parts: [{ inlineData: { mimeType: "image/jpeg", data: cleanBase64 } }, { text: prompt }] }
    });
    return response.text || "<p>Unable to generate narrative.</p>";
  } catch (error) {
    console.error("Gemini Personal Future Error:", error);
    return "<h3>System Error</h3><p>We could not process your image at this time. Please try again.</p>";
  }
};

export const analyzeIndustryReport = async (text: string): Promise<IndustryAnalysis> => {
  try {
    const prompt = `
      Analyze this emissions report. Extract/Estimate:
      1. Grade (A-F)
      2. Score (0-100)
      3. Total Emissions (string)
      4. Scope 1, 2, 3 split (numbers representing tons)
      5. YoY Change (string)
      6. Status (Compliant/Warning/Non-Compliant)
      7. 3 Findings
      8. 3 Recommendations
      
      REPORT: ${text.substring(0, 5000)}
      
      Return strict JSON.
    `;
    const response = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            grade: { type: Type.STRING, enum: ['A', 'B', 'C', 'D', 'F'] },
            score: { type: Type.NUMBER },
            totalEmissions: { type: Type.STRING },
            scopes: { 
              type: Type.OBJECT, 
              properties: { scope1: { type: Type.NUMBER }, scope2: { type: Type.NUMBER }, scope3: { type: Type.NUMBER } },
              required: ['scope1', 'scope2', 'scope3']
            },
            yoyChange: { type: Type.STRING },
            status: { type: Type.STRING, enum: ['Compliant', 'Warning', 'Non-Compliant'] },
            findings: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['grade', 'score', 'totalEmissions', 'scopes', 'yoyChange', 'status', 'findings', 'recommendations']
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Industry Error:", error);
    return {
      grade: 'C', score: 70, totalEmissions: "Unknown", scopes: { scope1: 500, scope2: 300, scope3: 200 },
      yoyChange: "0%", status: "Warning", findings: ["Analysis failed"], recommendations: ["Retry"]
    };
  }
};

export const generateSustainabilityRoadmap = async (industryContext: string): Promise<RoadmapItem[]> => {
  try {
    const prompt = `
      Create a 5-year sustainability roadmap for a ${industryContext} company.
      Provide 5 key milestones (one per year).
      Return JSON array.
    `;
    const response = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              year: { type: Type.NUMBER },
              quarter: { type: Type.STRING },
              action: { type: Type.STRING },
              investment: { type: Type.STRING },
              roi: { type: Type.STRING },
              impact: { type: Type.STRING }
            },
            required: ['year', 'action', 'investment', 'roi', 'impact']
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (e) {
    return [];
  }
};

export const simulatePolicy = async (policy: string, region: string): Promise<PolicySimulation> => {
  try {
    const prompt = `
      Simulate impact of policy: "${policy}" in ${region}.
      Estimate 2030 figures: CO2 Reduction, Economic Impact, Health Benefits, Job Creation, Cost, Social Equity Impact, Timeline.
      Return strict JSON.
    `;
    const response = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            co2Reduction: { type: Type.STRING },
            economicImpact: { type: Type.STRING },
            healthBenefits: { type: Type.STRING },
            jobCreation: { type: Type.STRING },
            cost: { type: Type.STRING },
            socialEquity: { type: Type.STRING },
            timeline: { type: Type.STRING }
          },
          required: ['co2Reduction', 'economicImpact', 'healthBenefits', 'jobCreation', 'cost', 'socialEquity', 'timeline']
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    return {
      co2Reduction: "N/A", economicImpact: "N/A", healthBenefits: "N/A",
      jobCreation: "N/A", cost: "N/A", socialEquity: "N/A", timeline: "N/A"
    };
  }
};

export const calculateEnforcementAction = async (violation: string, entity: string): Promise<{ penalty: string, recommendation: string }> => {
  try {
    const prompt = `
      Calculate mock enforcement for: "${violation}" by "${entity}".
      Return JSON with penalty (string) and recommendation (string).
    `;
    const response = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
           type: Type.OBJECT,
           properties: { penalty: { type: Type.STRING }, recommendation: { type: Type.STRING } },
           required: ['penalty', 'recommendation']
        }
      }
    });
    return JSON.parse(response.text || '{"penalty": "Under Review", "recommendation": "Investigate"}');
  } catch (e) {
    return { penalty: "$50,000 fine", recommendation: "Immediate audit required" };
  }
};

export const generateExecutiveReport = async (region: string, policyContext: string): Promise<string> => {
  // Existing function retained for compatibility
  try {
    const prompt = `Generate Executive Climate Report for ${region}. Focus: ${policyContext}. Return HTML.`;
    const response = await ai.models.generateContent({ model: MODEL_COMPLEX, contents: prompt });
    return response.text || "<p>Failed.</p>";
  } catch (e) { return "<p>Error.</p>"; }
};