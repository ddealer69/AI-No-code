// Current State Analysis Types
export interface CompanyInfo {
  companyName: string;
  location: string;
  primaryProducts: string;
  companySize: 'Small' | 'Medium' | 'Large' | '';
  productionType: string;
  processName: string;
  subProcessName: string;
  processDescription: string;
  numberOfShifts: number;
  numberOfEmployees: number;
  supervisorRatio: string;
}

export interface RawMaterialProcess {
  unitsInBatch: number;
  batchSize: string;
  unitSpecifics: string;
}

export interface ProductionStage {
  equipmentName: string;
  automationLevel: number;
  dataCollected: number;
}

export interface ProductionProcess {
  stage1: ProductionStage;
  stage2: ProductionStage;
}

export interface TechnologySystems {
  productionDataTracking: number;
  machinesNetworked: number;
  qualityInspections: number;
  maintenanceType: number;
  inventoryManagement: number;
  existingAutomation: number;
  digitalRecords: number;
  overallDigitalMaturity: number;
}

export interface WorkforceSkills {
  operatorDigitalUse: number;
  techTrainingAvailability: number;
  opennessToNewTech: number;
}

export interface PainPoint {
  absoluteValue: string;
  score: number;
}

export interface PainPoints {
  defectRates: PainPoint;
  inconsistentQuality: PainPoint;
  materialWaste: PainPoint;
  schedulingDelays: PainPoint;
  inventoryIssues: PainPoint;
  laborShortages: PainPoint;
  safetyIncidents: PainPoint;
  energyCosts: PainPoint;
  lackVisibility: PainPoint;
  manualDataEntry: PainPoint;
  interdeptCommunication: PainPoint;
  vendorCommunication: PainPoint;
  cybersecurityRisks: PainPoint;
  customerComplaints: PainPoint;
}

export interface ProductivityMetrics {
  outputsGenerated: number;
  avgTimePerStep: number;
  avgTimePerProcess: number;
  laborCostPerStep: number;
  otherDirectCosts: number;
  totalCostPerStep: number;
  totalCostPerProcess: number;
  processFrequency: number;
  totalMonthlyCost: number;
  errorRate: number;
  keyBottlenecks: string;
  currentSystem: number;
  qualitativeImpact: number;
}

export interface AutomationPotential {
  repetitiveTasks: number;
  dataIntensiveProcesses: number;
  ruleBasedDecisions: number;
  personalizedInteractions: number;
  qualityControl: number;
}

export interface DataReadiness {
  dataAvailability: number;
  dataQuality: number;
  dataInfrastructure: number;
  dataGovernance: number;
}

export interface StrategicAlignment {
  aiInBusinessStrategy: number;
  leadershipBuyIn: number;
  aiUnderstanding: number;
  willingnessToChange: number;
}

export interface CurrentStateAnalysis {
  companyInfo: CompanyInfo;
  rawMaterialProcess: RawMaterialProcess;
  productionProcess: ProductionProcess;
  technologySystems: TechnologySystems;
  workforceSkills: WorkforceSkills;
  painPoints: PainPoints;
  productivityMetrics: ProductivityMetrics;
  automationPotential: AutomationPotential;
  dataReadiness: DataReadiness;
  strategicAlignment: StrategicAlignment;
}

export interface ScoreBreakdown {
  technologySystems: number;
  workforceSkills: number;
  painPoints: number;
  productivityMetrics: number;
  automationPotential: number;
  dataReadiness: number;
  strategicAlignment: number;
  total: number;
  outcome: string;
}

export const SCORING_OPTIONS = {
  AUTOMATION_LEVEL: [
    { score: 1, description: 'Fully manual process' },
    { score: 2, description: 'Some basic tools or equipment' },
    { score: 3, description: 'Semi-automated with human oversight' },
    { score: 4, description: 'Mostly automated with minimal intervention' },
    { score: 5, description: 'Fully automated process' }
  ],
  DATA_COLLECTION: [
    { score: 1, description: 'No data collection' },
    { score: 2, description: 'Manual logs/records' },
    { score: 3, description: 'Some digital records' },
    { score: 4, description: 'Mostly digital with some automation' },
    { score: 5, description: 'Fully automated real-time data collection' }
  ],
  GENERAL_5_POINT: [
    { score: 1, description: 'Very Low' },
    { score: 2, description: 'Low' },
    { score: 3, description: 'Medium' },
    { score: 4, description: 'High' },
    { score: 5, description: 'Very High' }
  ],
  PAIN_POINT_SEVERITY: [
    { score: 1, description: 'Not a problem' },
    { score: 2, description: 'Minor issue' },
    { score: 3, description: 'Moderate problem' },
    { score: 4, description: 'Significant issue' },
    { score: 5, description: 'Critical problem' }
  ],
  DATA_AVAILABILITY: [
    { score: 1, description: 'Very limited data collection' },
    { score: 2, description: 'Basic data collection' },
    { score: 3, description: 'Good data collection' },
    { score: 4, description: 'Extensive data collection' },
    { score: 5, description: 'Comprehensive real-time data' }
  ],
  DATA_QUALITY: [
    { score: 1, description: 'Poor quality, many errors' },
    { score: 2, description: 'Fair quality, some inconsistencies' },
    { score: 3, description: 'Good quality, minor issues' },
    { score: 4, description: 'High quality, well-maintained' },
    { score: 5, description: 'Excellent quality, validated data' }
  ],
  DATA_INFRASTRUCTURE: [
    { score: 1, description: 'Basic or no infrastructure' },
    { score: 2, description: 'Limited infrastructure' },
    { score: 3, description: 'Adequate infrastructure' },
    { score: 4, description: 'Good infrastructure with scalability' },
    { score: 5, description: 'Advanced cloud-based infrastructure' }
  ],
  DATA_GOVERNANCE: [
    { score: 1, description: 'No formal governance' },
    { score: 2, description: 'Basic policies in place' },
    { score: 3, description: 'Standard governance practices' },
    { score: 4, description: 'Well-defined governance framework' },
    { score: 5, description: 'Comprehensive governance with automation' }
  ],
  automation: [
    { value: 1, label: 'Fully manual process' },
    { value: 2, label: 'Some basic tools or equipment' },
    { value: 3, label: 'Semi-automated with human oversight' },
    { value: 4, label: 'Mostly automated with minimal intervention' },
    { value: 5, label: 'Fully automated process' }
  ],
  frequency: [
    { value: 1, label: 'Once a month or less' },
    { value: 2, label: '2-3 times per month' },
    { value: 3, label: 'Weekly' },
    { value: 4, label: 'Daily' },
    { value: 5, label: 'Multiple times per day' }
  ],
  dataTracking: [
    { value: 1, label: 'No data collection' },
    { value: 2, label: 'Manual logs/records' },
    { value: 3, label: 'Some digital records' },
    { value: 4, label: 'Mostly digital with some automation' },
    { value: 5, label: 'Fully automated real-time data collection' }
  ],
  currentSystem: [
    { value: 1, label: 'Paper-based or no system' },
    { value: 2, label: 'Basic digital tools (Excel, simple software)' },
    { value: 3, label: 'Integrated software system with some automation' },
    { value: 4, label: 'Advanced system with good integration' },
    { value: 5, label: 'State-of-the-art system with AI/ML capabilities' }
  ],
  scale1to5: [
    { value: 1, label: 'Very Low' },
    { value: 2, label: 'Low' },
    { value: 3, label: 'Medium' },
    { value: 4, label: 'High' },
    { value: 5, label: 'Very High' }
  ],
  painPointSeverity: [
    { value: 1, label: 'Not a problem' },
    { value: 2, label: 'Minor issue' },
    { value: 3, label: 'Moderate problem' },
    { value: 4, label: 'Significant issue' },
    { value: 5, label: 'Critical problem' }
  ]
};
