export interface User {
  id: string;
  email: string;
  name: string;
}

export interface FilterData {
  sector: string;
  domain: string;
  process: string;
  stage: string;
}

export interface UseCase {
  id: string;
  businessProcess: string;
  functionalAreas: string[];
  jobRole: string;
  primaryMetric: string;
  secondaryMetric: string;
  aiUseCase: string;
  impact: string;
  expectedROI: string;
}

export interface AIUseCase {
  id: string;
  useCase: string;
  aiSystemType: string;
  tools: string[];
  customDev: boolean;
  implementationNotes: string;
  expectedROI?: string;
  
  // Supabase column names
  Use_Case?: string;
  'AI System Type'?: string;
  'Recommended Tools/Platforms'?: string;
  'Custom Development (Yes/No)'?: string;
  'Notes on Implementation'?: string;
  'Expected ROI'?: string;
}

export interface RealUseCase {
  id: string;
  businessProcess: string;
  function: string;
  outcome: string;
  company: string;
  project1: string;
  project2: string;
}

export interface StrategyResponse {
  matchedUseCases: { [key: string]: UseCase };
  aiUseCases: { [key: string]: AIUseCase };
  realUseCases: { [key: string]: RealUseCase };
}