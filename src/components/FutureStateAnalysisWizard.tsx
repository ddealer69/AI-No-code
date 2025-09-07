import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Target, CheckCircle2 } from 'lucide-react';
import { FutureStateAnalysis, FutureScoreBreakdown } from '../types/futureStateAnalysis';
import { CurrentStateAnalysis, ScoreBreakdown } from '../types/currentStateAnalysis';
import FutureScoreDashboard from './FutureScoreDashboard';
import FutureStep1Vision from './futureSteps/FutureStep1Vision';
import FutureStep2ProcessImprovement from './futureSteps/FutureStep2ProcessImprovement';
import FutureStep3Technology from './futureSteps/FutureStep3Technology';
import FutureStep4Workforce from './futureSteps/FutureStep4Workforce';
import FutureStep5BusinessImpact from './futureSteps/FutureStep5BusinessImpact';
import FutureStep6Productivity from './futureSteps/FutureStep6Productivity';
import FutureStep7Implementation from './futureSteps/FutureStep7Implementation';
import FutureStep8Investment from './futureSteps/FutureStep8Investment';
import AIROICalculator from './AIROICalculator';
import FutureStep9Risk from './futureSteps/FutureStep9Risk';
import FutureStep10Review from './futureSteps/FutureStep10Review';

interface FutureStateAnalysisProps {
  onComplete: (analysis: FutureStateAnalysis, scores: FutureScoreBreakdown) => void;
  currentAnalysis?: { analysis: CurrentStateAnalysis; scores: ScoreBreakdown };
  onNavigateToTab?: (tab: 'identification' | 'implementation' | 'financials') => void;
}

const FutureStateAnalysisWizard: React.FC<FutureStateAnalysisProps> = ({ onComplete, currentAnalysis, onNavigateToTab }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showROICalculator, setShowROICalculator] = useState(false);
  const [formData, setFormData] = useState<FutureStateAnalysis>({
    companyVision: {
      visionStatement: '',
      strategicGoals: '',
      timeframe: '',
      targetMarkets: '',
      competitiveAdvantage: '',
      digitalTransformationGoals: ''
    },
    processImprovement: {
      targetAutomationLevel: 1,
      expectedEfficiencyGains: 1,
      qualityTargets: '',
      throughputGoals: '',
      costReductionTargets: '',
      timelineForImplementation: ''
    },
    technologyRoadmap: {
      plannedTechUpgrades: 1,
      aiImplementationAreas: 1,
      dataIntegrationPlans: 1,
      cloudMigrationStrategy: 1,
      iotImplementation: 1,
      cybersecurityEnhancements: 1,
      digitalSkillsTraining: 1,
      systemIntegrationPlanning: 1
    },
    futureWorkforce: {
      skillDevelopmentPlans: 1,
      roleEvolutionStrategy: 1,
      changeManagementApproach: 1,
      trainingInvestment: 1
    },
    businessImpact: {
      revenueGrowthTargets: { absoluteValue: '', score: 1 },
      costSavingsTargets: { absoluteValue: '', score: 1 },
      productivityImprovements: { absoluteValue: '', score: 1 },
      customerExperienceGoals: { absoluteValue: '', score: 1 },
      timeToMarketImprovements: { absoluteValue: '', score: 1 },
      qualityImprovements: { absoluteValue: '', score: 1 },
      sustainabilityGoals: { absoluteValue: '', score: 1 },
      innovationMetrics: { absoluteValue: '', score: 1 },
      marketShareTargets: { absoluteValue: '', score: 1 },
      customerSatisfactionGoals: { absoluteValue: '', score: 1 },
      employeeEngagementTargets: { absoluteValue: '', score: 1 },
      complianceImprovements: { absoluteValue: '', score: 1 }
    },
    futureProductivity: {
      targetOutputIncrease: 0,
      targetTimeReduction: 0,
      automationROI: 0,
      costPerUnitTarget: 0,
      errorRateReduction: 0,
      expectedMonthlySavings: 0,
      implementationTimeline: '',
      successMetrics: '',
      riskMitigationPlans: '',
      futureSystemCapabilities: 1,
      scalabilityPlanning: 1
    },
    implementationStrategy: {
      phaseOneActivities: 1,
      phaseTwoActivities: 1,
      phaseThreeActivities: 1,
      pilotProgramApproach: 1,
      changeManagementStrategy: 1
    },
    investmentPlanning: {
      budgetAllocation: 1,
      roiExpectations: 1,
      fundingSources: 1,
      costBenefitAnalysis: 1
    },
    riskManagement: {
      technicalRisks: 1,
      organizationalRisks: 1,
      marketRisks: 1,
      mitigationStrategies: 1
    }
  });

  const [scores, setScores] = useState<FutureScoreBreakdown>({
    technologyRoadmap: 8,
    futureWorkforce: 4,
    businessImpact: 12,
    futureProductivity: 11,
    implementationStrategy: 5,
    investmentPlanning: 4,
    riskManagement: 4,
    total: 48,
    outcome: 'Basic planning stage'
  });

  const calculateScores = (): FutureScoreBreakdown => {
    const tech = Object.values(formData.technologyRoadmap).reduce((sum, val) => sum + val, 0);
    const workforce = Object.values(formData.futureWorkforce).reduce((sum, val) => sum + val, 0);
    const impact = Object.values(formData.businessImpact).reduce((sum, val) => sum + val.score, 0);
    const productivity = formData.futureProductivity.futureSystemCapabilities + 
                       formData.futureProductivity.scalabilityPlanning +
                       (formData.futureProductivity.automationROI > 200 ? 5 : formData.futureProductivity.automationROI > 100 ? 3 : 1) +
                       (formData.futureProductivity.targetOutputIncrease > 50 ? 5 : formData.futureProductivity.targetOutputIncrease > 20 ? 3 : 1) +
                       (formData.futureProductivity.expectedMonthlySavings > 10000 ? 5 : formData.futureProductivity.expectedMonthlySavings > 5000 ? 3 : 1);
    
    const implementation = Object.values(formData.implementationStrategy).reduce((sum, val) => sum + val, 0);
    const investment = Object.values(formData.investmentPlanning).reduce((sum, val) => sum + val, 0);
    const risk = Object.values(formData.riskManagement).reduce((sum, val) => sum + val, 0);
    
    const total = tech + workforce + impact + productivity + implementation + investment + risk;
    
    let outcome = 'Basic planning stage';
    if (total > 280) outcome = 'Comprehensive transformation strategy';
    else if (total > 220) outcome = 'Well-structured implementation plan';
    else if (total > 160) outcome = 'Solid strategic foundation';
    else if (total > 100) outcome = 'Developing implementation roadmap';

    return {
      technologyRoadmap: tech,
      futureWorkforce: workforce,
      businessImpact: impact,
      futureProductivity: productivity,
      implementationStrategy: implementation,
      investmentPlanning: investment,
      riskManagement: risk,
      total,
      outcome
    };
  };

  useEffect(() => {
    setScores(calculateScores());
  }, [formData]);

  const updateFormData = (section: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section as keyof FutureStateAnalysis], ...data }
    }));
  };

  const steps = [
    { id: 1, title: 'Vision & Strategy', component: FutureStep1Vision },
    { id: 2, title: 'Process Improvement', component: FutureStep2ProcessImprovement },
    { id: 3, title: 'Technology Roadmap', component: FutureStep3Technology },
    { id: 4, title: 'Future Workforce', component: FutureStep4Workforce },
    { id: 5, title: 'Business Impact', component: FutureStep5BusinessImpact },
    { id: 6, title: 'Future Productivity', component: FutureStep6Productivity },
    { id: 7, title: 'Implementation', component: FutureStep7Implementation },
    { id: 8, title: 'Investment Planning', component: FutureStep8Investment },
    { id: 9, title: 'Risk Management', component: FutureStep9Risk },
    { id: 10, title: 'Review & Submit', component: FutureStep10Review }
  ];

  const currentStepData = steps.find(step => step.id === currentStep);
  const StepComponent = currentStepData?.component;

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onComplete(formData, scores);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex justify-center">
            <div className="flex space-x-8 border-b border-gray-200">
              <button 
                onClick={() => onNavigateToTab?.('identification')}
                className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm"
              >
                Identification
              </button>
              <button className="py-2 px-1 border-b-2 border-purple-500 text-purple-600 font-medium text-sm cursor-default">
                Implementation
              </button>
              <button 
                onClick={() => onNavigateToTab?.('financials')}
                className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm"
              >
                Financials
              </button>
            </div>
          </nav>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-serif flex items-center justify-center">
            <Target className="w-8 h-8 mr-3 text-purple-600" />
            Future State Analysis
          </h1>
          <p className="text-lg text-gray-600 font-medium tracking-wide">Strategic planning for your AI-powered transformation journey</p>
          <div className="w-24 h-1 gold-accent mx-auto mt-4"></div>
        </div>

        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-700">
                  Step {currentStep} of {steps.length}: {currentStepData?.title}
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round((currentStep / steps.length) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Step Navigation */}
            <div className="flex space-x-2 mb-8 overflow-x-auto">
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentStep === step.id
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : currentStep > step.id
                      ? 'bg-green-100 text-green-800'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {currentStep > step.id && (
                    <CheckCircle2 className="w-4 h-4 mr-1 inline" />
                  )}
                  {step.title}
                </button>
              ))}
            </div>

            {/* Step Content */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border border-purple-100">
              {StepComponent && (
                currentStep === 8 ? (
                  <StepComponent
                    data={formData}
                    updateData={updateFormData}
                    scores={scores}
                    onOpenROICalculator={() => setShowROICalculator(true)}
                  />
                ) : (
                  <StepComponent
                    data={formData}
                    updateData={updateFormData}
                    scores={scores}
                  />
                )
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </button>
              
              {currentStep === steps.length ? (
                <button
                  onClick={handleComplete}
                  className="flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 font-semibold shadow-md"
                >
                  Complete Future Planning
                  <CheckCircle2 className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              )}
            </div>
          </div>

          {/* Score Dashboard */}
          <div className="w-80">
            <FutureScoreDashboard scores={scores} />
          </div>
        </div>
      </div>

      {/* ROI Calculator Modal */}
      {showROICalculator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">AI ROI Calculator</h2>
              <button
                onClick={() => setShowROICalculator(false)}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <AIROICalculator
                onClose={() => setShowROICalculator(false)}
                futureAnalysis={{ analysis: formData, scores }}
                currentAnalysis={currentAnalysis}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FutureStateAnalysisWizard;
