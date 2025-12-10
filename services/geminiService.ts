import { GoogleGenAI, Type } from "@google/genai";
import { AppMode, ClimateAction, ClimateScenario, IndustryAnalysis, PolicySimulation } from "../types";

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
    // Clean base64 string if it contains metadata
    const cleanBase64 = imageBase64.split(',')[1] || imageBase64;

    const prompt = `
You are a climate impact storyteller. Create a personalized future narrative based on:

USER PROFILE:
- Age: ${age} years old (will be ${parseInt(age) + 26} in 2050)
- Location: ${location}
- Lifestyle: ${lifestyle}

PHOTO ANALYSIS: (analyze uploaded photo for skin tone, approximate health, environment)

Based on IPCC climate projections for their specific region, describe:

1. PHYSICAL CHANGES BY 2050:
   - Skin/health impacts from increased UV and heatwaves
   - Respiratory issues from air quality changes
   - Mental health stress from climate anxiety

2. DAILY LIFE DISRUPTIONS:
   - Extreme weather events frequency
   - Economic impacts (insurance costs, property value)
   - Food and water security concerns

3. 3 SPECIFIC ACTIONABLE SOLUTIONS:
   - One immediate action (this week)
   - One medium-term action (this year)
   - One advocacy action (community level)

Make it vivid, personal, slightly alarming but ultimately hopeful. Start with "In 2050, you will..."

Return the response in HTML format with bold headings (<h3>). Do not include markdown code blocks.
`;

    const response = await ai.models.generateContent({
      model: MODEL_COMPLEX,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64
            }
          },
          { text: prompt }
        ]
      }
    });

    return response.text || "<p>Unable to generate narrative.</p>";
  } catch (error) {
    console.error("Gemini Personal Future Error:", error);
    return "<h3>System Error</h3><p>We could not process your image at this time. Please try again.</p>";
  }
};

export const generateClimateScenario = async (
  mode: AppMode, 
  location: string
): Promise<ClimateScenario> => {
  try {
    const prompt = `
      Generate a realistic, slightly dystopian but actionable climate future scenario for the year 2040 
      for a user in ${location} operating in '${mode}' mode.
      
      Focus on specific environmental challenges (heat, water, air quality, storms).
      Keep the description under 60 words.
      Assign a risk level (Low, Moderate, High, Critical).
      Title should be evocative.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            riskLevel: { type: Type.STRING, enum: ['Low', 'Moderate', 'High', 'Critical'] },
            year: { type: Type.NUMBER }
          },
          required: ['title', 'description', 'riskLevel', 'year']
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    return {
      title: data.title || "Uncertain Future",
      description: data.description || "Data unavailable for this region.",
      riskLevel: data.riskLevel || "Moderate",
      year: data.year || 2040
    };

  } catch (error) {
    console.error("Gemini Scenario Error:", error);
    return {
      title: "System Offline",
      description: "Unable to predict climate patterns at this moment. Please check connection.",
      riskLevel: "Low",
      year: 2025
    };
  }
};

export const generateActions = async (
  mode: AppMode,
  scenarioContext: string
): Promise<ClimateAction[]> => {
  try {
    const prompt = `
      Based on the scenario: "${scenarioContext}", provide 4 specific, high-impact actions 
      for a '${mode}' entity.
      
      For 'citizen': lifestyle changes, retrofits, community advocacy.
      For 'industry': supply chain, energy efficiency, circular economy.
      For 'government': policy, infrastructure, emergency response.

      Return JSON.
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
              title: { type: Type.STRING },
              impact: { type: Type.NUMBER, description: "Impact score 0-100" },
              cost: { type: Type.STRING, description: "Low, Medium, High" }
            },
            required: ['title', 'impact', 'cost']
          }
        }
      }
    });

    const rawActions = JSON.parse(response.text || '[]');
    return rawActions.map((a: any, index: number) => ({
      id: `action-${Date.now()}-${index}`,
      title: a.title,
      impact: a.impact,
      cost: a.cost,
      completed: false
    }));

  } catch (error) {
    console.error("Gemini Action Error:", error);
    return [
      { id: '1', title: "Assess local flood risk", impact: 80, cost: "Low", completed: false },
      { id: '2', title: "Prepare emergency kit", impact: 90, cost: "Medium", completed: false }
    ];
  }
};

export const analyzeIndustryReport = async (text: string): Promise<IndustryAnalysis> => {
  try {
    const prompt = `
      You are an environmental compliance auditor. Analyze the following emissions report text.
      
      Extract or estimate:
      1. Overall Compliance Score (0-100)
      2. Total Emissions (e.g., "12,500 tCO2e")
      3. Year-over-Year Change (e.g., "-5%" or "+2.3%")
      4. Regulatory Status (Compliant, Warning, or Non-Compliant)
      5. 3 Key Findings (brief bullet points)
      6. 3 Recommended Actions (brief bullet points)
      
      REPORT TEXT:
      ${text}
      
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
            score: { type: Type.NUMBER },
            totalEmissions: { type: Type.STRING },
            yoyChange: { type: Type.STRING },
            status: { type: Type.STRING, enum: ['Compliant', 'Warning', 'Non-Compliant'] },
            findings: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['score', 'totalEmissions', 'yoyChange', 'status', 'findings', 'recommendations']
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Industry Analysis Error:", error);
    return {
      score: 0,
      totalEmissions: "Unknown",
      yoyChange: "0%",
      status: "Warning",
      findings: ["Analysis failed", "Please try again", "Check connection"],
      recommendations: ["Retry upload", "Contact support"]
    };
  }
};

export const simulatePolicy = async (policy: string, region: string): Promise<PolicySimulation> => {
  try {
    const prompt = `
      Simulate the impact of this climate policy: "${policy}" in ${region}.
      
      Estimate realistic figures for 2030:
      1. CO2 Reduction (e.g. "1.2M tons")
      2. Economic Impact (e.g. "+$4.5B GDP")
      3. Health Benefits (e.g. "5000 asthma cases prevented")
      4. Job Creation (e.g. "12,000 new jobs")
      5. Implementation Cost (e.g. "$800M")

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
            cost: { type: Type.STRING }
          },
          required: ['co2Reduction', 'economicImpact', 'healthBenefits', 'jobCreation', 'cost']
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Policy Error:", error);
    return {
      co2Reduction: "Unavailable",
      economicImpact: "Unavailable",
      healthBenefits: "Unavailable",
      jobCreation: "Unavailable",
      cost: "Unavailable"
    };
  }
};

export const generateExecutiveReport = async (region: string, policyContext: string): Promise<string> => {
  try {
    const prompt = `
      Generate a formal Executive Climate Strategy Report for the ${region} regional government.
      
      Context - recent policy focus: ${policyContext || 'General sustainability initiatives'}.
      
      Structure the response as HTML (use <h3>, <p>, <ul>, <li> tags) with the following sections:
      1. Executive Summary
      2. Current Regional Emission Status (Make up realistic data for 2024)
      3. Strategic Recommendations (3-4 bullet points)
      4. Projected Outlook (2030)
      
      Tone: Professional, authoritative, data-driven.
      Keep it concise (approx 200 words).
      Do not include markdown code blocks.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_COMPLEX,
      contents: prompt,
    });

    return response.text || "<p>Report generation failed.</p>";
  } catch (error) {
    console.error("Gemini Report Error:", error);
    return "<h3>Error</h3><p>Unable to generate executive report at this time.</p>";
  }
};