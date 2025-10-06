import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Target, CheckCircle2, Download } from 'lucide-react';
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
import FutureStep9Risk from './futureSteps/FutureStep9Risk';
import FutureStep10Review from './futureSteps/FutureStep10Review';

interface FutureStateAnalysisProps {
  onComplete: (analysis: FutureStateAnalysis, scores: FutureScoreBreakdown) => void;
  currentAnalysis?: { analysis: CurrentStateAnalysis; scores: ScoreBreakdown };
  onNavigateToTab?: (tab: 'identification' | 'implementation' | 'financials') => void;
}

const FutureStateAnalysisWizard: React.FC<FutureStateAnalysisProps> = ({ onComplete, currentAnalysis, onNavigateToTab }) => {
  const [currentStep, setCurrentStep] = useState(1);
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

  // Generate a comprehensive plain-text report of the future state analysis
  const generateFutureStateReportText = (): string => {
    const ts = new Date().toISOString();
    const section = (title: string) => `\n==================== ${title.toUpperCase()} ====================\n`;
    const line = (label: string, value: any) => `${label}: ${value === undefined || value === null || value === '' ? '—' : value}`;

    const simpleObjectLines = (obj: Record<string, any>) => Object.entries(obj).map(([k, v]) => line(k, v));

    const { companyVision, processImprovement, technologyRoadmap, futureWorkforce, businessImpact, futureProductivity, implementationStrategy, investmentPlanning, riskManagement } = formData;

    const businessImpactLines = Object.entries(businessImpact).map(([k, v]: any) => `${k}: target=${v.absoluteValue || '—'} | score=${v.score}`);

    const report: string[] = [];
    report.push('FUTURE STATE ANALYSIS REPORT');
    report.push(`Generated: ${ts}`);

    if (currentAnalysis) {
      report.push(section('Current State Context (Summary)'));
      const ca = currentAnalysis.analysis.companyInfo;
      if (ca) {
        report.push(line('Company Name', ca.companyName));
        report.push(line('Location', ca.location));
        report.push(line('Primary Products', ca.primaryProducts));
        report.push(line('Process Name', ca.processName));
      }
      report.push(line('Current Total Score', currentAnalysis.scores.total));
      report.push(line('Current Outcome', currentAnalysis.scores.outcome));
    }

    report.push(section('Company Vision & Strategy'));
    report.push(...simpleObjectLines(companyVision));

    report.push(section('Process Improvement Targets'));
    report.push(...simpleObjectLines(processImprovement));

    report.push(section('Technology Roadmap'));
    report.push(...simpleObjectLines(technologyRoadmap));

    report.push(section('Future Workforce & Change'));
    report.push(...simpleObjectLines(futureWorkforce));

    report.push(section('Business Impact Targets'));
    report.push(...businessImpactLines);

    report.push(section('Future Productivity & Performance'));
    report.push(...simpleObjectLines(futureProductivity));

    report.push(section('Implementation Strategy'));
    report.push(...simpleObjectLines(implementationStrategy));

    report.push(section('Investment Planning'));
    report.push(...simpleObjectLines(investmentPlanning));

    report.push(section('Risk Management'));
    report.push(...simpleObjectLines(riskManagement));

    report.push(section('Score Breakdown'));
    report.push(line('Technology Roadmap', scores.technologyRoadmap));
    report.push(line('Future Workforce', scores.futureWorkforce));
    report.push(line('Business Impact', scores.businessImpact));
    report.push(line('Future Productivity', scores.futureProductivity));
    report.push(line('Implementation Strategy', scores.implementationStrategy));
    report.push(line('Investment Planning', scores.investmentPlanning));
    report.push(line('Risk Management', scores.riskManagement));
    report.push(line('TOTAL SCORE', scores.total));
    report.push(line('OUTCOME', scores.outcome));

    return report.join('\n');
  };

  const downloadFutureStateReport = () => {
    try {
      const text = generateFutureStateReportText();
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const company = currentAnalysis?.analysis.companyInfo.companyName?.trim().replace(/[^a-z0-9]+/gi, '_') || 'company';
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const a = document.createElement('a');
      a.href = url;
      a.download = `FutureState_${company}_${timestamp}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to download future state report', e);
      alert('Failed to generate report. Please try again.');
    }
  };

  // Attempt to load strategy report text (from dashboard) if saved in localStorage previously
  const loadStrategyReportIfAvailable = (): string | null => {
    try {
      const raw = localStorage.getItem('ai_full_strategy_report');
      return raw || null;
    } catch {
      return null;
    }
  };

  // Try to reconstruct a minimal current state report from localStorage if available
  const loadCurrentStateIfAvailable = (): { analysis?: any; scores?: any } => {
    try {
      const analysisRaw = localStorage.getItem('current_state_analysis');
      const scoresRaw = localStorage.getItem('current_state_scores');
      return {
        analysis: analysisRaw ? JSON.parse(analysisRaw) : undefined,
        scores: scoresRaw ? JSON.parse(scoresRaw) : undefined
      };
    } catch {
      return {};
    }
  };

  // Generate cumulative report: FULL Current State + FULL Future State + (if available) Strategy Full Report
  const generateCumulativeReport = (): string => {
    const lines: string[] = [];
    const timestamp = new Date().toISOString();
    lines.push('ENTERPRISE AI TRANSFORMATION – CONSOLIDATED REPORT');
    lines.push(`Generated: ${timestamp}`);
    lines.push('='.repeat(100));

    // Current State Section
    const currentSaved = loadCurrentStateIfAvailable();
    if (currentAnalysis || currentSaved.analysis) {
      lines.push('\n\n>>> SECTION 1: CURRENT STATE ANALYSIS (FULL)');
      lines.push('-'.repeat(80));
      const c = currentAnalysis?.analysis || currentSaved.analysis || {};
      const cs = currentAnalysis?.scores || currentSaved.scores || {};
      const safe = (v: any) => (v === undefined || v === null || v === '' ? '—' : v);
      const pushObj = (title: string, obj: any) => {
        lines.push(`\n-- ${title} --`);
        Object.entries(obj || {}).forEach(([k, v]) => {
          if (v && typeof v === 'object' && 'score' in (v as any) && 'absoluteValue' in (v as any)) {
            const pv: any = v;
            lines.push(`${k}: value=${safe(pv.absoluteValue)} | score=${safe(pv.score)}`);
          } else if (v && typeof v === 'object') {
            // nested simple object
            lines.push(`${k}:`);
            Object.entries(v as any).forEach(([sk, sv]) => lines.push(`  ${sk}: ${safe(sv)}`));
          } else {
            lines.push(`${k}: ${safe(v)}`);
          }
        });
      };
      pushObj('Company Information', c.companyInfo || {});
      if (c.roiCalculation) {
        const { calculatedMetrics, ...roiInputs } = c.roiCalculation;
        pushObj('ROI Calculation Inputs', roiInputs);
        pushObj('ROI Calculation Metrics', calculatedMetrics || {});
      }
      pushObj('Raw Material Process', c.rawMaterialProcess || {});
      if (c.productionProcess) {
        pushObj('Production Process - Stage 1', c.productionProcess.stage1 || {});
        pushObj('Production Process - Stage 2', c.productionProcess.stage2 || {});
      }
      pushObj('Technology Systems', c.technologySystems || {});
      pushObj('Workforce Skills', c.workforceSkills || {});
      pushObj('Pain Points', c.painPoints || {});
      pushObj('Productivity Metrics', c.productivityMetrics || {});
      pushObj('Automation Potential', c.automationPotential || {});
      pushObj('Data Readiness', c.dataReadiness || {});
      pushObj('Strategic Alignment', c.strategicAlignment || {});
      if (cs && Object.keys(cs).length) {
        lines.push('\n-- Score Breakdown --');
        Object.entries(cs).forEach(([k, v]) => lines.push(`${k}: ${safe(v)}`));
      }
    } else {
      lines.push('\nNo Current State data available.');
    }

    // Future State Section
    lines.push('\n\n>>> SECTION 2: FUTURE STATE ANALYSIS (FULL)');
    lines.push('-'.repeat(80));
    const safeF = (v: any) => (v === undefined || v === null || v === '' ? '—' : v);
    const pushF = (title: string, obj: any) => {
      lines.push(`\n-- ${title} --`);
      Object.entries(obj || {}).forEach(([k, v]) => {
        if (v && typeof v === 'object' && 'score' in (v as any) && 'absoluteValue' in (v as any)) {
          const pv: any = v;
          lines.push(`${k}: target=${safeF(pv.absoluteValue)} | score=${safeF(pv.score)}`);
        } else if (v && typeof v === 'object') {
          lines.push(`${k}:`);
          Object.entries(v as any).forEach(([sk, sv]) => lines.push(`  ${sk}: ${safeF(sv)}`));
        } else {
          lines.push(`${k}: ${safeF(v)}`);
        }
      });
    };
    pushF('Company Vision & Strategy', formData.companyVision);
    pushF('Process Improvement', formData.processImprovement);
    pushF('Technology Roadmap', formData.technologyRoadmap);
    pushF('Future Workforce', formData.futureWorkforce);
    pushF('Business Impact Targets', formData.businessImpact);
    pushF('Future Productivity & Performance', formData.futureProductivity);
    pushF('Implementation Strategy', formData.implementationStrategy);
    pushF('Investment Planning', formData.investmentPlanning);
    pushF('Risk Management', formData.riskManagement);
    lines.push('\n-- Score Breakdown --');
    Object.entries(scores).forEach(([k, v]) => lines.push(`${k}: ${safeF(v)}`));

    // Strategy Report (if available)
    const strategyText = loadStrategyReportIfAvailable();
  lines.push('\n\n>>> SECTION 3: AI STRATEGY & IMPLEMENTATION REPORT (FULL)');
    lines.push('-'.repeat(80));
    if (strategyText) {
      lines.push('(Full strategy report appended below)');
      lines.push(strategyText);
    } else {
      lines.push('No full strategy report found in this session. Generate strategy in dashboard to include it.');
    }

    lines.push('\nEND OF CONSOLIDATED REPORT');
    return lines.join('\n');
  };

  const downloadCumulativeReport = () => {
    try {
      const text = generateCumulativeReport();
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const company = currentAnalysis?.analysis.companyInfo.companyName?.trim().replace(/[^a-z0-9]+/gi, '_') || 'company';
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const a = document.createElement('a');
      a.href = url;
      a.download = `AI_Consolidated_Report_${company}_${timestamp}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to download consolidated report', e);
      alert('Failed to generate consolidated report.');
    }
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
              <button 
                onClick={() => onNavigateToTab?.('implementation')}
                className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm"
              >
                Implementation
              </button>
              <button className="py-2 px-1 border-b-2 border-purple-500 text-purple-600 font-medium text-sm cursor-default">
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
                <StepComponent
                  data={formData}
                  updateData={updateFormData}
                  scores={scores}
                />
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
                <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
                  <button
                    onClick={handleComplete}
                    className="flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 font-semibold shadow-md"
                  >
                    Complete Future Planning
                    <CheckCircle2 className="w-4 h-4 ml-2" />
                  </button>
                  <button
                    onClick={downloadFutureStateReport}
                    className="flex items-center px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold shadow-md"
                    aria-label="Download Future State Report"
                  >
                    Future State Report
                    <Download className="w-4 h-4 ml-2" />
                  </button>
                  <button
                    onClick={downloadCumulativeReport}
                    className="flex items-center px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold shadow-md"
                    aria-label="Download Consolidated AI Transformation Report"
                  >
                    All Reports (Combined)
                    <Download className="w-4 h-4 ml-2" />
                  </button>
                </div>
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

      
    </div>
  );
};

export default FutureStateAnalysisWizard;
