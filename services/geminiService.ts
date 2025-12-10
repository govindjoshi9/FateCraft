import { GoogleGenAI, Type } from "@google/genai";
import { AppMode, ClimateAction, ClimateScenario, IndustryAnalysis, PolicySimulation, RoadmapItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_TEXT = 'gemini-2.5-flash';
const MODEL_COMPLEX = 'gemini-3-pro-preview';

// Simple in-memory cache to optimize performance
const requestCache = new Map<string, any>();

const getCached = (key: string) => requestCache.get(key);
const setCache = (key: string, value: any) => requestCache.set(key, value);

export const generatePersonalizedFuture = async (
  imageBase64: string,
  age: string,
  location: string,
  lifestyle: string
): Promise<string> => {
  const cacheKey = `future-${age}-${location}-${lifestyle}-${imageBase64.substring(0, 50)}`;
  if (getCached(cacheKey)) return getCached(cacheKey);

  try {
    // Dynamic MIME type extraction
    let mimeType = "image/jpeg";
    let cleanBase64 = imageBase64;

    const matches = imageBase64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      mimeType = matches[1];
      cleanBase64 = matches[2];
    } else if (imageBase64.includes(',')) {
      // Fallback for simple data URIs
      const parts = imageBase64.split(',');
      cleanBase64 = parts[1];
      const mimeMatch = parts[0].match(/:(.*?);/);
      if (mimeMatch) mimeType = mimeMatch[1];
    }

    // Relaxed prompt to avoid "Medical/Health" safety filters
    const prompt = `
You are a climate impact storyteller. Create a personalized future narrative based on:
USER PROFILE: Age: ${age}, Location: ${location}, Lifestyle: ${lifestyle}
PHOTO ANALYSIS: (Analyze the uploaded photo for general context, approximate age, and environment. Do not provide medical advice.)

Based on IPCC projections for their specific region, describe:
1. PHYSICAL CHANGES BY 2050 (impact of aging in a changing climate)
2. DAILY LIFE DISRUPTIONS (specific to location, e.g., heat, water, economy)
3. 3 SPECIFIC ACTIONABLE SOLUTIONS (lifestyle and community)

Make it vivid, personal, and scientifically grounded but ultimately hopeful. Start with "In 2050, you will..."
Return HTML with <h3> headings for the sections. Do not use Markdown code blocks.
`;

    // Using gemini-2.5-flash for robust multimodal processing
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { 
        parts: [
          { inlineData: { mimeType: mimeType, data: cleanBase64 } }, 
          { text: prompt }
        ] 
      }
    });

    const result = response.text || "<p>Unable to generate narrative. The AI might have flagged the content as unsafe or sensitive.</p>";
    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error("Gemini Personal Future Error:", error);
    return `
      <h3>System Error</h3>
      <p>We could not process your request.</p>
      <p class="text-xs text-slate-500 mt-2">Error: ${(error as Error).message || "Unknown API Error"}</p>
      <p class="text-sm mt-2">Please try a different photo or check your connection.</p>
    `;
  }
};

export const analyzeIndustryReport = async (text: string): Promise<IndustryAnalysis> => {
  const cacheKey = `industry-report-${text.substring(0, 100)}`;
  if (getCached(cacheKey)) return getCached(cacheKey);

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
    const result = JSON.parse(response.text || '{}');
    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error("Gemini Industry Error:", error);
    return {
      grade: 'C', score: 70, totalEmissions: "Unknown", scopes: { scope1: 500, scope2: 300, scope3: 200 },
      yoyChange: "0%", status: "Warning", findings: ["Analysis failed"], recommendations: ["Retry"]
    };
  }
};

export const generateSustainabilityRoadmap = async (industryContext: string): Promise<RoadmapItem[]> => {
  const cacheKey = `roadmap-${industryContext}`;
  if (getCached(cacheKey)) return getCached(cacheKey);

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
    const result = JSON.parse(response.text || '[]');
    setCache(cacheKey, result);
    return result;
  } catch (e) {
    return [];
  }
};

export const simulatePolicy = async (policy: string, region: string): Promise<PolicySimulation> => {
  const cacheKey = `policy-${region}-${policy}`;
  if (getCached(cacheKey)) return getCached(cacheKey);

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
    const result = JSON.parse(response.text || '{}');
    setCache(cacheKey, result);
    return result;
  } catch (error) {
    return {
      co2Reduction: "N/A", economicImpact: "N/A", healthBenefits: "N/A",
      jobCreation: "N/A", cost: "N/A", socialEquity: "N/A", timeline: "N/A"
    };
  }
};

export const calculateEnforcementAction = async (violation: string, entity: string): Promise<{ penalty: string, recommendation: string }> => {
  const cacheKey = `enforcement-${entity}-${violation}`;
  if (getCached(cacheKey)) return getCached(cacheKey);

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
    const result = JSON.parse(response.text || '{"penalty": "Under Review", "recommendation": "Investigate"}');
    setCache(cacheKey, result);
    return result;
  } catch (e) {
    return { penalty: "$50,000 fine", recommendation: "Immediate audit required" };
  }
};

export const generateExecutiveReport = async (region: string, policyContext: string): Promise<string> => {
  const cacheKey = `report-${region}-${policyContext}`;
  if (getCached(cacheKey)) return getCached(cacheKey);

  try {
    const prompt = `Generate Executive Climate Report for ${region}. Focus: ${policyContext}. Return HTML.`;
    const response = await ai.models.generateContent({ model: MODEL_COMPLEX, contents: prompt });
    const result = response.text || "<p>Failed.</p>";
    setCache(cacheKey, result);
    return result;
  } catch (e) { return "<p>Error.</p>"; }
};