import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Download } from 'lucide-react';
import { CurrentStateAnalysis, ScoreBreakdown } from '../types/currentStateAnalysis';
import ScoreDashboard from './ScoreDashboard';
import Step1CompanyInfo from './steps/Step1CompanyInfo';
import Step2ROICalculation from './steps/Step2ROICalculation';
import Step3ProcessBreakdown from './steps/Step2ProcessBreakdown';
import Step4Technology from './steps/Step3Technology';
import Step5PeopleAndCulture from './steps/Step4PeopleAndCulture';
import Step6PainPoints from './steps/Step5PainPoints';
import Step7Productivity from './steps/Step6Productivity';
import Step8AutomationPotential from './steps/Step7AutomationPotential';
import Step9Review from './steps/Step8Review';

interface CurrentStateAnalysisProps {
  onComplete: (analysis: CurrentStateAnalysis, scores: ScoreBreakdown) => void;
  onStartFutureAnalysis?: () => void;
  onNavigateToTab?: (tab: 'identification' | 'implementation' | 'financials') => void;
}

const CurrentStateAnalysisWizard: React.FC<CurrentStateAnalysisProps> = ({ onComplete, onStartFutureAnalysis, onNavigateToTab }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CurrentStateAnalysis>({
    companyInfo: {
      companyName: '',
      location: '',
      primaryProducts: '',
      companySize: '',
      productionType: '',
      processName: '',
      subProcessName: '',
      processDescription: '',
      numberOfShifts: 1,
      numberOfEmployees: 1,
      supervisorRatio: ''
    },
    roiCalculation: {
      totalEffortPerMonth: 160,
      currentProcessCost: 600000,
      timePerInstanceBefore: 120,
      timePerInstanceAfter: 30,
      effortAfterAutomation: 60,
      costAfterAutomation: 200000,
      revenueImpact: 0,
      capex: 0,
      calculatedMetrics: {
        newTimePerInstance: 0,
        timeSavedPerMonth: 0,
        laborCostSavings: 0,
        totalMonthlyGain: 0,
        totalAnnualGain: 0,
        paybackPeriod: 0,
        roiPercentage: 0,
      }
    },
    rawMaterialProcess: {
      unitsInBatch: 0,
      batchSize: '',
      unitSpecifics: ''
    },
    productionProcess: {
      stage1: {
        equipmentName: '',
        automationLevel: 1,
        dataCollected: 1
      },
      stage2: {
        equipmentName: '',
        automationLevel: 1,
        dataCollected: 1
      }
    },
    technologySystems: {
      productionDataTracking: 1,
      machinesNetworked: 1,
      qualityInspections: 1,
      maintenanceType: 1,
      inventoryManagement: 1,
      existingAutomation: 1,
      digitalRecords: 1,
      overallDigitalMaturity: 1
    },
    workforceSkills: {
      operatorDigitalUse: 1,
      techTrainingAvailability: 1,
      opennessToNewTech: 1
    },
    painPoints: {
      defectRates: { absoluteValue: '', score: 1 },
      inconsistentQuality: { absoluteValue: '', score: 1 },
      materialWaste: { absoluteValue: '', score: 1 },
      schedulingDelays: { absoluteValue: '', score: 1 },
      inventoryIssues: { absoluteValue: '', score: 1 },
      laborShortages: { absoluteValue: '', score: 1 },
      safetyIncidents: { absoluteValue: '', score: 1 },
      energyCosts: { absoluteValue: '', score: 1 },
      lackVisibility: { absoluteValue: '', score: 1 },
      manualDataEntry: { absoluteValue: '', score: 1 },
      interdeptCommunication: { absoluteValue: '', score: 1 },
      vendorCommunication: { absoluteValue: '', score: 1 },
      cybersecurityRisks: { absoluteValue: '', score: 1 },
      customerComplaints: { absoluteValue: '', score: 1 }
    },
    productivityMetrics: {
      outputsGenerated: 0,
      avgTimePerStep: 0,
      avgTimePerProcess: 0,
      laborCostPerStep: 0,
      otherDirectCosts: 0,
      totalCostPerStep: 0,
      totalCostPerProcess: 0,
      processFrequency: 0,
      totalMonthlyCost: 0,
      errorRate: 0,
      keyBottlenecks: '',
      currentSystem: 1,
      qualitativeImpact: 1
    },
    automationPotential: {
      repetitiveTasks: 1,
      dataIntensiveProcesses: 1,
      ruleBasedDecisions: 1,
      personalizedInteractions: 1,
      qualityControl: 1
    },
    dataReadiness: {
      dataAvailability: 1,
      dataQuality: 1,
      dataInfrastructure: 1,
      dataGovernance: 1
    },
    strategicAlignment: {
      aiInBusinessStrategy: 1,
      leadershipBuyIn: 1,
      aiUnderstanding: 1,
      willingnessToChange: 1
    }
  });

  const [scores, setScores] = useState<ScoreBreakdown>({
    technologySystems: 8,
    workforceSkills: 3,
    painPoints: 14,
    productivityMetrics: 13,
    automationPotential: 5,
    dataReadiness: 4,
    strategicAlignment: 4,
    total: 51,
    outcome: 'No potential'
  });

  const calculateScores = (): ScoreBreakdown => {
    const tech = Object.values(formData.technologySystems).reduce((sum, val) => sum + val, 0);
    const workforce = Object.values(formData.workforceSkills).reduce((sum, val) => sum + val, 0);
    const pain = Object.values(formData.painPoints).reduce((sum, val) => sum + val.score, 0);
    const productivity = formData.productivityMetrics.currentSystem + 
                       formData.productivityMetrics.qualitativeImpact +
                       (formData.productivityMetrics.errorRate <= 3 ? 5 : formData.productivityMetrics.errorRate <= 10 ? 3 : 1) +
                       (formData.productivityMetrics.avgTimePerStep <= 10 ? 5 : formData.productivityMetrics.avgTimePerStep <= 30 ? 3 : 1) +
                       (formData.productivityMetrics.processFrequency > 100 ? 5 : formData.productivityMetrics.processFrequency > 10 ? 3 : 1);
    
    const automation = Object.values(formData.automationPotential).reduce((sum, val) => sum + val, 0);
    const data = Object.values(formData.dataReadiness).reduce((sum, val) => sum + val, 0);
    const strategic = Object.values(formData.strategicAlignment).reduce((sum, val) => sum + val, 0);
    
    const total = tech + workforce + pain + productivity + automation + data + strategic;
    
    let outcome = 'No potential';
    if (total > 240) outcome = 'Very high potential';
    else if (total > 180) outcome = 'High potential';
    else if (total > 120) outcome = 'Low potential';

    return {
      technologySystems: tech,
      workforceSkills: workforce,
      painPoints: pain,
      productivityMetrics: productivity,
      automationPotential: automation,
      dataReadiness: data,
      strategicAlignment: strategic,
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
      [section]: { ...prev[section as keyof CurrentStateAnalysis], ...data }
    }));
  };

  const steps = [
    { id: 1, title: 'Company Info', component: Step1CompanyInfo },
    { id: 2, title: 'ROI Analysis', component: Step2ROICalculation },
    { id: 3, title: 'Process Breakdown', component: Step3ProcessBreakdown },
    { id: 4, title: 'Technology & Data', component: Step4Technology },
    { id: 5, title: 'People & Culture', component: Step5PeopleAndCulture },
    { id: 6, title: 'Pain Points', component: Step6PainPoints },
    { id: 7, title: 'Productivity', component: Step7Productivity },
    { id: 8, title: 'Automation Potential', component: Step8AutomationPotential },
    { id: 9, title: 'Review & Submit', component: Step9Review }
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

  // Generate a human-readable plain-text report of all captured inputs & scores
  const generateCurrentStateReportText = (): string => {
    const ts = new Date().toISOString();
    const { companyInfo, roiCalculation, rawMaterialProcess, productionProcess, technologySystems, workforceSkills, painPoints, productivityMetrics, automationPotential, dataReadiness, strategicAlignment } = formData;

    const line = (label: string, value: any) => `${label}: ${value === undefined || value === null || value === '' ? '—' : value}`;

    const section = (title: string) => `\n==================== ${title} ====================\n`;

    const painPointLines = Object.entries(painPoints).map(([k, v]: any) => `${k}: value=${v.absoluteValue || '—'} | score=${v.score}`);

    const simpleObjectLines = (obj: Record<string, any>) => Object.entries(obj).map(([k, v]) => line(k, v));

    const calc = roiCalculation?.calculatedMetrics || {
      newTimePerInstance: 0,
      timeSavedPerMonth: 0,
      laborCostSavings: 0,
      totalMonthlyGain: 0,
      totalAnnualGain: 0,
      paybackPeriod: 0,
      roiPercentage: 0,
    };

    const report: string[] = [];
    report.push('CURRENT STATE ANALYSIS REPORT');
    report.push(`Generated: ${ts}`);
    report.push(section('Company Information'));
    report.push(...simpleObjectLines(companyInfo));

    report.push(section('ROI Calculation (Inputs)'));
    const { calculatedMetrics, ...roiInputs } = roiCalculation as any;
    report.push(...simpleObjectLines(roiInputs));
    report.push(section('ROI Calculation (Calculated Metrics)'));
    report.push(...simpleObjectLines(calc));

    report.push(section('Raw Material / Process'));
    report.push(...simpleObjectLines(rawMaterialProcess));

    report.push(section('Production Process - Stage 1'));
    report.push(...simpleObjectLines(productionProcess.stage1));
    report.push(section('Production Process - Stage 2'));
    report.push(...simpleObjectLines(productionProcess.stage2));

    report.push(section('Technology & Systems'));
    report.push(...simpleObjectLines(technologySystems));

    report.push(section('Workforce Skills'));
    report.push(...simpleObjectLines(workforceSkills));

    report.push(section('Pain Points'));
    report.push(...painPointLines);

    report.push(section('Productivity Metrics'));
    report.push(...simpleObjectLines(productivityMetrics));

    report.push(section('Automation Potential'));
    report.push(...simpleObjectLines(automationPotential));

    report.push(section('Data Readiness'));
    report.push(...simpleObjectLines(dataReadiness));

    report.push(section('Strategic Alignment'));
    report.push(...simpleObjectLines(strategicAlignment));

    report.push(section('Score Breakdown'));
    report.push(line('Technology Systems', scores.technologySystems));
    report.push(line('Workforce Skills', scores.workforceSkills));
    report.push(line('Pain Points', scores.painPoints));
    report.push(line('Productivity Metrics', scores.productivityMetrics));
    report.push(line('Automation Potential', scores.automationPotential));
    report.push(line('Data Readiness', scores.dataReadiness));
    report.push(line('Strategic Alignment', scores.strategicAlignment));
    report.push(line('TOTAL SCORE', scores.total));
    report.push(line('OUTCOME', scores.outcome));

    return report.join('\n');
  };

  const downloadCurrentStateReport = () => {
    try {
      const text = generateCurrentStateReportText();
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const company = formData.companyInfo.companyName?.trim().replace(/[^a-z0-9]+/gi, '_') || 'company';
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      a.href = url;
      a.download = `CurrentState_${company}_${timestamp}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to download current state report', e);
      alert('Failed to generate report. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex justify-center">
            <div className="flex space-x-8 border-b border-gray-200">
              <button 
                onClick={() => onNavigateToTab?.('identification')}
                className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-lg"
              >
                Identification
              </button>
              <button 
                onClick={() => onNavigateToTab?.('implementation')}
                className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-lg"
              >
                Implementation
              </button>
              <button className="py-2 px-1 border-b-2 border-blue-500 text-blue-600 font-medium text-lg cursor-default">
                Financials
              </button>
            </div>  
          </nav>
        </div>

        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 px-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 font-serif leading-tight">Current State Analysis</h1>
          <p className="text-base sm:text-lg text-gray-600 font-medium tracking-wide">Comprehensive assessment of your business process</p>
          <div className="w-24 h-1 gold-accent mx-auto mt-4"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
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
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
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
                      ? 'bg-blue-600 text-white'
                      : currentStep > step.id
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
            <div className="bg-white rounded-lg shadow-lg p-5 sm:p-8 mb-8">
              {StepComponent && (
                <StepComponent
                  data={formData}
                  updateData={updateFormData}
                  scores={scores}
                />
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center justify-center px-5 sm:px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </button>
              
              {currentStep === steps.length ? (
                <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                  <button
                    onClick={handleComplete}
                    className="flex items-center justify-center px-6 sm:px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-sm sm:text-base"
                  >
                    Complete Analysis
                    <CheckCircle2 className="w-4 h-4 ml-2" />
                  </button>
                  <button
                    onClick={downloadCurrentStateReport}
                    className="flex items-center justify-center px-6 sm:px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm sm:text-base"
                    aria-label="Download Current State Report"
                  >
                    Download Report
                    <Download className="w-4 h-4 ml-2" />
                  </button>
                  {onStartFutureAnalysis && (
                    <button
                      onClick={onStartFutureAnalysis}
                      className="flex items-center justify-center px-6 sm:px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 font-semibold text-sm sm:text-base"
                    >
                      Start Future Planning
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={nextStep}
                  className="flex items-center justify-center px-5 sm:px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              )}
            </div>
          </div>
          {/* Score Dashboard */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <ScoreDashboard scores={scores} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentStateAnalysisWizard;
