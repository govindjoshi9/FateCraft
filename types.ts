export enum AppMode {
  CITIZEN = 'citizen',
  INDUSTRY = 'industry',
  GOVERNMENT = 'government'
}

export enum UserRole {
  CITIZEN = 'citizen',
  INDUSTRY = 'industry',
  GOVERNMENT = 'government'
}

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  location: string;
  credits: number;
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
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  score: number;
  totalEmissions: string;
  scopes: { scope1: number; scope2: number; scope3: number };
  yoyChange: string;
  status: 'Compliant' | 'Warning' | 'Non-Compliant';
  findings: string[];
  recommendations: string[];
}

export interface RoadmapItem {
  year: number;
  quarter: string;
  action: string;
  investment: string;
  roi: string;
  impact: string;
}

export interface PolicySimulation {
  co2Reduction: string;
  economicImpact: string;
  healthBenefits: string;
  jobCreation: string;
  cost: string;
  socialEquity: string;
  timeline: string;
}

export interface Facility {
  id: string;
  name: string;
  emissions: number;
  target: number;
  status: 'Compliant' | 'Warning' | 'Non-Compliant';
  score: number;
  sector: string;
  location: { x: number; y: number }; // Percentage coordinates for map
}

export interface GovAlert {
  id: string;
  type: 'Critical' | 'Warning' | 'Info';
  message: string;
  timestamp: string;
  location?: string;
}

export interface EnforcementCase {
  id: string;
  facilityName: string;
  violation: string;
  penalty: string;
  status: 'Open' | 'Under Review' | 'Resolved';
  date: string;
}