export interface User {
  id: string;
  email: string;
  name: string;
}

export interface FilterData {
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