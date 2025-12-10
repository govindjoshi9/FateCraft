export enum AppMode {
  CITIZEN = 'citizen',
  INDUSTRY = 'industry',
  GOVERNMENT = 'government'
}

export interface ClimateAction {
  id: string;
  title: string;
  impact: number; // 0-100
  cost: string;
  completed: boolean;
}

export interface ClimateScenario {
  title: string;
  description: string;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  imageUrl?: string;
  year: number;
}

export interface IndustryAnalysis {
  score: number;
  totalEmissions: string;
  yoyChange: string;
  status: 'Compliant' | 'Warning' | 'Non-Compliant';
  findings: string[];
  recommendations: string[];
}

export interface PolicySimulation {
  co2Reduction: string;
  economicImpact: string;
  healthBenefits: string;
  jobCreation: string;
  cost: string;
}

export interface Facility {
  id: string;
  name: string;
  emissions: number;
  target: number;
  status: 'Compliant' | 'Warning' | 'Non-Compliant';
  score: number;
}