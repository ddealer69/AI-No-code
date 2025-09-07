import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, TrendingUp, Clock, Target, BarChart3, PieChart, Gauge, X, Download } from 'lucide-react';
import { CurrentStateAnalysis, ScoreBreakdown } from '../types/currentStateAnalysis';
import { FutureStateAnalysis, FutureScoreBreakdown } from '../types/futureStateAnalysis';

interface AIROICalculatorProps {
  onClose: () => void;
  currentAnalysis?: { analysis: CurrentStateAnalysis; scores: ScoreBreakdown };
  futureAnalysis?: { analysis: FutureStateAnalysis; scores: FutureScoreBreakdown };
}

interface ROIMetrics {
  newTimePerInstance: number;
  timeSavedPerMonth: number;
  laborCostSavings: number;
  totalMonthlyGain: number;
  totalAnnualGain: number;
  paybackPeriod: number;
  roiPercentage: number;
}

const AIROICalculator: React.FC<AIROICalculatorProps> = ({ onClose, currentAnalysis, futureAnalysis }) => {
  // User inputs for process analysis
  const [totalEffortPerMonth, setTotalEffortPerMonth] = useState<number>(160);
  const [currentProcessCost, setCurrentProcessCost] = useState<number>(600000);
  const [timePerInstanceBefore, setTimePerInstanceBefore] = useState<number>(120);
  const [timePerInstanceAfter, setTimePerInstanceAfter] = useState<number>(30);
  const [effortAfterAutomation, setEffortAfterAutomation] = useState<number>(60);
  const [costAfterAutomation, setCostAfterAutomation] = useState<number>(200000);

  // User inputs for financial analysis
  const [revenueImpact, setRevenueImpact] = useState<number>(0);
  const [capex, setCapex] = useState<number>(0);

  const [metrics, setMetrics] = useState<ROIMetrics>({
    newTimePerInstance: 0,
    timeSavedPerMonth: 0,
    laborCostSavings: 0,
    totalMonthlyGain: 0,
    totalAnnualGain: 0,
    paybackPeriod: 0,
    roiPercentage: 0,
  });

  // Calculate metrics whenever inputs change
  useEffect(() => {
    const newTimePerInstance = timePerInstanceBefore - timePerInstanceAfter;
    const timeSavedPerMonth = totalEffortPerMonth - effortAfterAutomation;
    const laborCostSavings = currentProcessCost - costAfterAutomation;
    const totalMonthlyGain = laborCostSavings + revenueImpact;
    const totalAnnualGain = totalMonthlyGain * 12;
    const paybackPeriod = capex > 0 && totalMonthlyGain > 0 ? capex / totalMonthlyGain : 0;
    const roiPercentage = capex > 0 ? ((totalAnnualGain - capex) / capex) * 100 : 0;

    setMetrics({
      newTimePerInstance,
      timeSavedPerMonth,
      laborCostSavings,
      totalMonthlyGain,
      totalAnnualGain,
      paybackPeriod,
      roiPercentage,
    });
  }, [revenueImpact, capex, totalEffortPerMonth, currentProcessCost, timePerInstanceBefore, timePerInstanceAfter, effortAfterAutomation, costAfterAutomation]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const generateComprehensiveReport = () => {
    const currentDate = new Date().toLocaleDateString('en-IN');
    
    const report = {
      title: "AI Transformation Analysis & ROI Report",
      generatedOn: currentDate,
      currentStateAnalysis: currentAnalysis ? {
        totalScore: currentAnalysis.scores.total,
        outcome: currentAnalysis.scores.outcome,
        companyInfo: currentAnalysis.analysis.companyInfo,
        processBreakdown: {
          processName: currentAnalysis.analysis.companyInfo.processName,
          subProcessName: currentAnalysis.analysis.companyInfo.subProcessName,
          numberOfEmployees: currentAnalysis.analysis.companyInfo.numberOfEmployees,
          numberOfShifts: currentAnalysis.analysis.companyInfo.numberOfShifts
        },
        technologyReadiness: currentAnalysis.scores.technologySystems,
        automationPotential: currentAnalysis.scores.automationPotential,
        productivity: currentAnalysis.scores.productivityMetrics
      } : null,
      futureStateAnalysis: futureAnalysis ? {
        totalScore: futureAnalysis.scores.total,
        outcome: futureAnalysis.scores.outcome,
        technologyRoadmap: futureAnalysis.scores.technologyRoadmap,
        businessImpact: futureAnalysis.scores.businessImpact,
        implementationStrategy: futureAnalysis.scores.implementationStrategy,
        investmentPlanning: futureAnalysis.scores.investmentPlanning
      } : null,
      roiCalculation: {
        processInputs: {
          totalEffortPerMonth,
          currentProcessCost: formatCurrency(currentProcessCost),
          timePerInstanceBefore,
          timePerInstanceAfter,
          effortAfterAutomation,
          costAfterAutomation: formatCurrency(costAfterAutomation)
        },
        financialInputs: {
          revenueImpact: formatCurrency(revenueImpact),
          capexInvestment: formatCurrency(capex)
        },
        calculatedMetrics: {
          newTimePerInstance: metrics.newTimePerInstance,
          timeSavedPerMonth: metrics.timeSavedPerMonth,
          laborCostSavings: formatCurrency(metrics.laborCostSavings),
          totalMonthlyGain: formatCurrency(metrics.totalMonthlyGain),
          totalAnnualGain: formatCurrency(metrics.totalAnnualGain),
          paybackPeriod: `${metrics.paybackPeriod.toFixed(1)} months`,
          roiPercentage: `${metrics.roiPercentage.toFixed(0)}%`
        },
        executiveSummary: `Based on the analysis, this AI project has an ROI of ${metrics.roiPercentage.toFixed(0)}% and will pay for itself in ${metrics.paybackPeriod.toFixed(1)} months. The total financial gain is projected to be ${formatCurrency(metrics.totalAnnualGain)} per year, driven by ${formatCurrency(metrics.laborCostSavings)} in monthly cost reductions and ${formatCurrency(revenueImpact)} in new revenue.`
      }
    };

    return report;
  };

  const downloadReport = () => {
    const report = generateComprehensiveReport();
    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AI_Transformation_Report_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadPrintableReport = () => {
    const report = generateComprehensiveReport();
    const printContent = `
<!DOCTYPE html>
<html>
<head>
    <title>AI Transformation Analysis & ROI Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        h1, h2, h3 { color: #333; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 20px; }
        .metric { margin: 10px 0; }
        .highlight { background-color: #f0f8ff; padding: 15px; border-left: 4px solid #0066cc; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f5f5f5; }
    </style>
</head>
<body>
    <div class="header">
        <h1>AI Transformation Analysis & ROI Report</h1>
        <p>Generated on: ${report.generatedOn}</p>
    </div>
    
    ${report.currentStateAnalysis ? `
    <div class="section">
        <h2>Current State Analysis</h2>
        <p><strong>Overall Score:</strong> ${report.currentStateAnalysis.totalScore}/300 - ${report.currentStateAnalysis.outcome}</p>
        <h3>Company Information</h3>
        <p><strong>Company:</strong> ${report.currentStateAnalysis.companyInfo.companyName}</p>
        <p><strong>Process:</strong> ${report.currentStateAnalysis.processBreakdown.processName}</p>
        <p><strong>Sub-Process:</strong> ${report.currentStateAnalysis.processBreakdown.subProcessName}</p>
        <p><strong>Employees:</strong> ${report.currentStateAnalysis.processBreakdown.numberOfEmployees}</p>
        <p><strong>Shifts:</strong> ${report.currentStateAnalysis.processBreakdown.numberOfShifts}</p>
    </div>
    ` : ''}
    
    ${report.futureStateAnalysis ? `
    <div class="section">
        <h2>Future State Analysis</h2>
        <p><strong>Overall Score:</strong> ${report.futureStateAnalysis.totalScore}/302 - ${report.futureStateAnalysis.outcome}</p>
        <p><strong>Technology Roadmap:</strong> ${report.futureStateAnalysis.technologyRoadmap}</p>
        <p><strong>Business Impact:</strong> ${report.futureStateAnalysis.businessImpact}</p>
        <p><strong>Investment Planning:</strong> ${report.futureStateAnalysis.investmentPlanning}</p>
    </div>
    ` : ''}
    
    <div class="section">
        <h2>ROI Analysis</h2>
        
        <h3>Process Inputs</h3>
        <table>
            <tr><th>Metric</th><th>Value</th></tr>
            <tr><td>Total Effort per Month</td><td>${report.roiCalculation.processInputs.totalEffortPerMonth} hours</td></tr>
            <tr><td>Current Process Cost</td><td>${report.roiCalculation.processInputs.currentProcessCost}</td></tr>
            <tr><td>Time per Instance (Before)</td><td>${report.roiCalculation.processInputs.timePerInstanceBefore} minutes</td></tr>
            <tr><td>Time per Instance (After)</td><td>${report.roiCalculation.processInputs.timePerInstanceAfter} minutes</td></tr>
            <tr><td>Effort After Automation</td><td>${report.roiCalculation.processInputs.effortAfterAutomation} hours/month</td></tr>
            <tr><td>Cost After Automation</td><td>${report.roiCalculation.processInputs.costAfterAutomation}</td></tr>
        </table>
        
        <h3>Financial Results</h3>
        <table>
            <tr><th>Metric</th><th>Value</th></tr>
            <tr><td>ROI</td><td>${report.roiCalculation.calculatedMetrics.roiPercentage}</td></tr>
            <tr><td>Payback Period</td><td>${report.roiCalculation.calculatedMetrics.paybackPeriod}</td></tr>
            <tr><td>Annual Financial Gain</td><td>${report.roiCalculation.calculatedMetrics.totalAnnualGain}</td></tr>
            <tr><td>Monthly Time Saved</td><td>${report.roiCalculation.calculatedMetrics.timeSavedPerMonth} hours</td></tr>
        </table>
        
        <div class="highlight">
            <h3>Executive Summary</h3>
            <p>${report.roiCalculation.executiveSummary}</p>
        </div>
    </div>
</body>
</html>
    `;
    
    const printBlob = new Blob([printContent], { type: 'text/html' });
    const printUrl = URL.createObjectURL(printBlob);
    const printLink = document.createElement('a');
    printLink.href = printUrl;
    printLink.download = `AI_Transformation_Report_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(printLink);
    printLink.click();
    document.body.removeChild(printLink);
    URL.revokeObjectURL(printUrl);
  };

  const getROICategory = (roi: number) => {
    if (roi >= 150) return { category: 'Gold', color: 'text-yellow-600' };
    if (roi >= 51) return { category: 'Silver', color: 'text-gray-600' };
    return { category: 'Bronze', color: 'text-orange-600' };
  };

  const roiCategory = getROICategory(metrics.roiPercentage);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-50 rounded-lg shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:p-6 rounded-t-lg sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calculator className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3" />
              <div>
                <h1 className="text-lg sm:text-2xl font-bold">AI ROI Scorecard & Dashboard</h1>
                <p className="text-blue-100 text-sm sm:text-base hidden sm:block">Calculate your AI transformation return on investment</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white/20"
              aria-label="Close"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Panel - Inputs */}
            <div className="space-y-6">
              {/* Process Analysis Inputs */}
              <div className="bg-white rounded-lg p-6 shadow-lg border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-blue-600" />
                  Process Analysis Inputs
                </h3>
                
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Total Effort Spent per Month (hours)
                      </label>
                      <input
                        type="number"
                        value={totalEffortPerMonth}
                        onChange={(e) => setTotalEffortPerMonth(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="160"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Process Cost (₹/month)
                      </label>
                      <input
                        type="number"
                        value={currentProcessCost}
                        onChange={(e) => setCurrentProcessCost(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="600000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Time per Instance Before (minutes)
                      </label>
                      <input
                        type="number"
                        value={timePerInstanceBefore}
                        onChange={(e) => setTimePerInstanceBefore(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="120"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Time per Instance After (minutes)
                      </label>
                      <input
                        type="number"
                        value={timePerInstanceAfter}
                        onChange={(e) => setTimePerInstanceAfter(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Effort After Automation (hours/month)
                      </label>
                      <input
                        type="number"
                        value={effortAfterAutomation}
                        onChange={(e) => setEffortAfterAutomation(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="60"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cost After Automation (₹/month)
                      </label>
                      <input
                        type="number"
                        value={costAfterAutomation}
                        onChange={(e) => setCostAfterAutomation(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="200000"
                      />
                    </div>
                  </div>
              </div>

              {/* Financial Inputs */}
              <div className="bg-white rounded-lg p-6 shadow-lg border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                  Financial Inputs
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Revenue Impact (₹/month)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">₹</span>
                      <input
                        type="number"
                        value={revenueImpact}
                        onChange={(e) => setRevenueImpact(Number(e.target.value))}
                        className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Additional revenue generated per month due to AI</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      One-Time Investment / CAPEX (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">₹</span>
                      <input
                        type="number"
                        value={capex}
                        onChange={(e) => setCapex(Number(e.target.value))}
                        className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Total one-time cost for AI implementation</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Results */}
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-3 sm:p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-xs sm:text-sm">ROI</p>
                      <p className="text-lg sm:text-2xl font-bold">{metrics.roiPercentage.toFixed(0)}%</p>
                    </div>
                    <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-3 sm:p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-xs sm:text-sm">Payback Period</p>
                      <p className="text-lg sm:text-2xl font-bold">{metrics.paybackPeriod.toFixed(1)} Months</p>
                    </div>
                    <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-blue-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-3 sm:p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-xs sm:text-sm">Annual Gain</p>
                      <p className="text-sm sm:text-xl font-bold">{formatCurrency(metrics.totalAnnualGain)}</p>
                    </div>
                    <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-purple-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-3 sm:p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-xs sm:text-sm">Time Saved</p>
                      <p className="text-lg sm:text-2xl font-bold">{metrics.timeSavedPerMonth} Hrs</p>
                    </div>
                    <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-orange-200" />
                  </div>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 sm:p-6 border border-blue-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-0">Executive Summary</h3>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={downloadPrintableReport}
                      className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download Report
                    </button>
                    <button
                      onClick={downloadReport}
                      className="flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Export Data
                    </button>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  Based on your inputs, this AI project has an ROI of <strong>{metrics.roiPercentage.toFixed(0)}%</strong> and 
                  will pay for itself in <strong>{metrics.paybackPeriod.toFixed(1)} months</strong>. The total financial gain 
                  is projected to be <strong>{formatCurrency(metrics.totalAnnualGain)}</strong> per year, driven by{' '}
                  <strong>{formatCurrency(metrics.laborCostSavings)}</strong> in monthly cost reductions and{' '}
                  <strong>{formatCurrency(revenueImpact)}</strong> in new revenue.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIROICalculator;