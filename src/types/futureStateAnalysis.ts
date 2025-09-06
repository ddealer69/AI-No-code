// Future State Analysis Type Definitions
export interface CompanyVision {
  visionStatement: string;
  strategicGoals: string;
  timeframe: string;
  targetMarkets: string;
  competitiveAdvantage: string;
  digitalTransformationGoals: string;
}

export interface ProcessImprovement {
  targetAutomationLevel: number;
  expectedEfficiencyGains: number;
  qualityTargets: string;
  throughputGoals: string;
  costReductionTargets: string;
  timelineForImplementation: string;
}

export interface TechnologyRoadmap {
  plannedTechUpgrades: number;
  aiImplementationAreas: number;
  dataIntegrationPlans: number;
  cloudMigrationStrategy: number;
  iotImplementation: number;
  cybersecurityEnhancements: number;
  digitalSkillsTraining: number;
  systemIntegrationPlanning: number;
}

export interface FutureWorkforce {
  skillDevelopmentPlans: number;
  roleEvolutionStrategy: number;
  changeManagementApproach: number;
  trainingInvestment: number;
}

export interface BusinessImpact {
  revenueGrowthTargets: { absoluteValue: string; score: number };
  costSavingsTargets: { absoluteValue: string; score: number };
  productivityImprovements: { absoluteValue: string; score: number };
  customerExperienceGoals: { absoluteValue: string; score: number };
  timeToMarketImprovements: { absoluteValue: string; score: number };
  qualityImprovements: { absoluteValue: string; score: number };
  sustainabilityGoals: { absoluteValue: string; score: number };
  innovationMetrics: { absoluteValue: string; score: number };
  marketShareTargets: { absoluteValue: string; score: number };
  customerSatisfactionGoals: { absoluteValue: string; score: number };
  employeeEngagementTargets: { absoluteValue: string; score: number };
  complianceImprovements: { absoluteValue: string; score: number };
}

export interface FutureProductivity {
  targetOutputIncrease: number;
  targetTimeReduction: number;
  automationROI: number;
  costPerUnitTarget: number;
  errorRateReduction: number;
  expectedMonthlySavings: number;
  implementationTimeline: string;
  successMetrics: string;
  riskMitigationPlans: string;
  futureSystemCapabilities: number;
  scalabilityPlanning: number;
}

export interface ImplementationStrategy {
  phaseOneActivities: number;
  phaseTwoActivities: number;
  phaseThreeActivities: number;
  pilotProgramApproach: number;
  changeManagementStrategy: number;
}

export interface InvestmentPlanning {
  budgetAllocation: number;
  roiExpectations: number;
  fundingSources: number;
  costBenefitAnalysis: number;
}

export interface RiskManagement {
  technicalRisks: number;
  organizationalRisks: number;
  marketRisks: number;
  mitigationStrategies: number;
}

export interface FutureStateAnalysis {
  companyVision: CompanyVision;
  processImprovement: ProcessImprovement;
  technologyRoadmap: TechnologyRoadmap;
  futureWorkforce: FutureWorkforce;
  businessImpact: BusinessImpact;
  futureProductivity: FutureProductivity;
  implementationStrategy: ImplementationStrategy;
  investmentPlanning: InvestmentPlanning;
  riskManagement: RiskManagement;
}

export interface FutureScoreBreakdown {
  technologyRoadmap: number;
  futureWorkforce: number;
  businessImpact: number;
  futureProductivity: number;
  implementationStrategy: number;
  investmentPlanning: number;
  riskManagement: number;
  total: number;
  outcome: string;
}

export const FUTURE_SCORING_OPTIONS = {
  MATURITY_LEVEL: [
    { score: 1, description: 'Basic/Initial planning' },
    { score: 2, description: 'Developing strategy' },
    { score: 3, description: 'Structured approach' },
    { score: 4, description: 'Advanced planning' },
    { score: 5, description: 'Comprehensive strategy' }
  ],
  IMPLEMENTATION_READINESS: [
    { score: 1, description: 'Not ready' },
    { score: 2, description: 'Early planning' },
    { score: 3, description: 'Preparation phase' },
    { score: 4, description: 'Ready to implement' },
    { score: 5, description: 'Immediate implementation' }
  ],
  INVESTMENT_COMMITMENT: [
    { score: 1, description: 'No budget allocated' },
    { score: 2, description: 'Limited budget' },
    { score: 3, description: 'Moderate investment' },
    { score: 4, description: 'Significant investment' },
    { score: 5, description: 'Major investment commitment' }
  ],
  IMPACT_POTENTIAL: [
    { score: 1, description: 'Minimal impact expected' },
    { score: 2, description: 'Low impact' },
    { score: 3, description: 'Moderate impact' },
    { score: 4, description: 'High impact' },
    { score: 5, description: 'Transformational impact' }
  ],
  GENERAL_5_POINT: [
    { score: 1, description: 'Very Low' },
    { score: 2, description: 'Low' },
    { score: 3, description: 'Medium' },
    { score: 4, description: 'High' },
    { score: 5, description: 'Very High' }
  ]
};
