import React, { useState, useEffect } from 'react';
import { X, Calculator, Download, TrendingUp, BarChart3, PieChart } from 'lucide-react';

// Define missing types locally
interface CurrentStateAnalysis {
  companyInfo: {
    companyName: string;
    processName: string;
    subProcessName: string;
    numberOfEmployees: number;
    numberOfShifts: number;
  };
}

interface FutureStateAnalysis {
  // Add any future state analysis properties as needed
}

interface ScoreBreakdown {
  total: number;
  outcome: string;
  technologySystems: number;
  automationPotential: number;
  productivityMetrics: number;
}

interface FutureScoreBreakdown {
  total: number;
  outcome: string;
  technologyRoadmap: number;
  businessImpact: number;
  implementationStrategy: number;
  investmentPlanning: number;
}

interface AIROICalculatorProps {
  onClose: () => void;
  currentAnalysis?: { analysis: CurrentStateAnalysis; scores: ScoreBreakdown };
  futureAnalysis?: { analysis: FutureStateAnalysis; scores: FutureScoreBreakdown };
}

interface ROIMetrics {
  costReductionSavings: number;
  qualityImprovementSavings: number;
  efficiencyImprovementEarnings: number;
  totalMonthlyGain: number;
  totalAnnualGain: number;
  paybackPeriod: number;
  roiPercentage: number;
}

interface ROIInputs {
  costReduction: { current: number; future: number; };
  qualityDefects: { current: number; future: number; };
  efficiencyImprovement: { current: number; future: number; };
  initialInvestment: number;
}

const AIROICalculator: React.FC<AIROICalculatorProps> = ({ onClose, currentAnalysis, futureAnalysis }) => {
  // New ROI input structure
  const [roiInputs, setROIInputs] = useState<ROIInputs>({
    costReduction: { current: 100000, future: 80000 },
    qualityDefects: { current: 50000, future: 20000 },
    efficiencyImprovement: { current: 80, future: 95 },
    initialInvestment: 500000
  });

  const [showVisualization, setShowVisualization] = useState(false);

  const [metrics, setMetrics] = useState<ROIMetrics>({
    costReductionSavings: 0,
    qualityImprovementSavings: 0,
    efficiencyImprovementEarnings: 0,
    totalMonthlyGain: 0,
    totalAnnualGain: 0,
    paybackPeriod: 0,
    roiPercentage: 0,
  });

  // Calculate metrics whenever inputs change
  useEffect(() => {
    const costReductionSavings = roiInputs.costReduction.current - roiInputs.costReduction.future;
    const qualityImprovementSavings = roiInputs.qualityDefects.current - roiInputs.qualityDefects.future;
    // Efficiency improvement earnings = percentage improvement * base revenue estimate
    const efficiencyGainPercent = ((roiInputs.efficiencyImprovement.future - roiInputs.efficiencyImprovement.current) / roiInputs.efficiencyImprovement.current) * 100;
    const efficiencyImprovementEarnings = (efficiencyGainPercent / 100) * 100000; // Assume 100k base revenue
    
    const totalMonthlyGain = costReductionSavings + qualityImprovementSavings + efficiencyImprovementEarnings;
    const totalAnnualGain = totalMonthlyGain * 12;
    const paybackPeriod = roiInputs.initialInvestment > 0 && totalMonthlyGain > 0 ? roiInputs.initialInvestment / totalMonthlyGain : 0;
    const roiPercentage = roiInputs.initialInvestment > 0 ? ((totalAnnualGain - roiInputs.initialInvestment) / roiInputs.initialInvestment) * 100 : 0;

    setMetrics({
      costReductionSavings,
      qualityImprovementSavings,
      efficiencyImprovementEarnings,
      totalMonthlyGain,
      totalAnnualGain,
      paybackPeriod,
      roiPercentage,
    });
  }, [roiInputs]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const updateROIInput = (category: keyof ROIInputs, field?: 'current' | 'future', value?: number) => {
    if (category === 'initialInvestment' && value !== undefined) {
      setROIInputs(prev => ({ ...prev, initialInvestment: value }));
    } else if (field && value !== undefined && category !== 'initialInvestment') {
      setROIInputs(prev => ({
        ...prev,
        [category]: { 
          ...prev[category as Exclude<keyof ROIInputs, 'initialInvestment'>], 
          [field]: value 
        }
      }));
    }
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
        roiInputs: {
          costReductionCurrent: formatCurrency(roiInputs.costReduction.current),
          costReductionFuture: formatCurrency(roiInputs.costReduction.future),
          qualityDefectsCurrent: formatCurrency(roiInputs.qualityDefects.current),
          qualityDefectsFuture: formatCurrency(roiInputs.qualityDefects.future),
          efficiencyCurrentPercent: `${roiInputs.efficiencyImprovement.current}%`,
          efficiencyFuturePercent: `${roiInputs.efficiencyImprovement.future}%`,
          initialInvestment: formatCurrency(roiInputs.initialInvestment)
        },
        calculatedMetrics: {
          costReductionSavings: formatCurrency(metrics.costReductionSavings),
          qualityImprovementSavings: formatCurrency(metrics.qualityImprovementSavings),
          efficiencyImprovementEarnings: formatCurrency(metrics.efficiencyImprovementEarnings),
          totalMonthlyGain: formatCurrency(metrics.totalMonthlyGain),
          totalAnnualGain: formatCurrency(metrics.totalAnnualGain),
          paybackPeriod: `${metrics.paybackPeriod.toFixed(1)} months`,
          roiPercentage: `${metrics.roiPercentage.toFixed(0)}%`
        },
        executiveSummary: `Based on the analysis, this AI project has an ROI of ${metrics.roiPercentage.toFixed(0)}% and will pay for itself in ${metrics.paybackPeriod.toFixed(1)} months. The total financial gain is projected to be ${formatCurrency(metrics.totalAnnualGain)} per year, driven by ${formatCurrency(metrics.costReductionSavings)} in cost reduction savings, ${formatCurrency(metrics.qualityImprovementSavings)} in quality improvement savings, and ${formatCurrency(metrics.efficiencyImprovementEarnings)} in efficiency improvement earnings.`
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
        body { font-family: 'Albert Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 20px; line-height: 1.6; }
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
        
        <h3>ROI Inputs</h3>
        <table>
            <tr><th>Metric</th><th>Current</th><th>Future</th></tr>
            <tr><td>Cost Reduction</td><td>${report.roiCalculation.roiInputs.costReductionCurrent}</td><td>${report.roiCalculation.roiInputs.costReductionFuture}</td></tr>
            <tr><td>Quality Defects</td><td>${report.roiCalculation.roiInputs.qualityDefectsCurrent}</td><td>${report.roiCalculation.roiInputs.qualityDefectsFuture}</td></tr>
            <tr><td>Efficiency Improvement</td><td>${report.roiCalculation.roiInputs.efficiencyCurrentPercent}</td><td>${report.roiCalculation.roiInputs.efficiencyFuturePercent}</td></tr>
            <tr><td>Initial Investment</td><td colspan="2">${report.roiCalculation.roiInputs.initialInvestment}</td></tr>
        </table>
        
        <h3>Financial Results</h3>
        <table>
            <tr><th>Metric</th><th>Value</th></tr>
            <tr><td>Cost Reduction Savings</td><td>${report.roiCalculation.calculatedMetrics.costReductionSavings}</td></tr>
            <tr><td>Quality Improvement Savings</td><td>${report.roiCalculation.calculatedMetrics.qualityImprovementSavings}</td></tr>
            <tr><td>Efficiency Improvement Earnings</td><td>${report.roiCalculation.calculatedMetrics.efficiencyImprovementEarnings}</td></tr>
            <tr><td>Total Monthly Gain</td><td>${report.roiCalculation.calculatedMetrics.totalMonthlyGain}</td></tr>
            <tr><td>Total Annual Gain</td><td>${report.roiCalculation.calculatedMetrics.totalAnnualGain}</td></tr>
            <tr><td>ROI</td><td>${report.roiCalculation.calculatedMetrics.roiPercentage}</td></tr>
            <tr><td>Payback Period</td><td>${report.roiCalculation.calculatedMetrics.paybackPeriod}</td></tr>
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

  // Generate CSV data for download
  const generateCSVData = () => {
    const csvRows = [
      // Headers
      ['Metric', 'Current', 'Future', 'Savings/Earnings', 'Category'],
      
      // ROI Inputs
      ['Cost Reduction', roiInputs.costReduction.current, roiInputs.costReduction.future, metrics.costReductionSavings, 'ROI Inputs'],
      ['Quality Defects', roiInputs.qualityDefects.current, roiInputs.qualityDefects.future, metrics.qualityImprovementSavings, 'ROI Inputs'],
      ['Efficiency Improvement (%)', roiInputs.efficiencyImprovement.current, roiInputs.efficiencyImprovement.future, metrics.efficiencyImprovementEarnings, 'ROI Inputs'],
      ['Initial Investment', roiInputs.initialInvestment, '', '', 'ROI Inputs'],
      
      // Summary metrics
      ['', '', '', '', ''],
      ['Total Monthly Gain', '', '', metrics.totalMonthlyGain, 'Summary'],
      ['Total Annual Gain', '', '', metrics.totalAnnualGain, 'Summary'],
      ['Payback Period (months)', '', '', metrics.paybackPeriod.toFixed(1), 'Summary'],
      ['ROI Percentage', '', '', `${metrics.roiPercentage.toFixed(1)}%`, 'Summary'],
    ];

    // Add Current State Analysis if available
    if (currentAnalysis) {
      csvRows.push(['', '', ''], ['Current State Analysis', '', '']);
      csvRows.push(['Total Score', `${currentAnalysis.scores.total}/300`, 'Current State']);
      csvRows.push(['Outcome', currentAnalysis.scores.outcome, 'Current State']);
      csvRows.push(['Company Name', currentAnalysis.analysis.companyInfo.companyName, 'Current State']);
      csvRows.push(['Process Name', currentAnalysis.analysis.companyInfo.processName, 'Current State']);
      csvRows.push(['Sub-Process Name', currentAnalysis.analysis.companyInfo.subProcessName, 'Current State']);
      csvRows.push(['Number of Employees', currentAnalysis.analysis.companyInfo.numberOfEmployees, 'Current State']);
      csvRows.push(['Technology Systems Score', currentAnalysis.scores.technologySystems, 'Current State']);
      csvRows.push(['Automation Potential Score', currentAnalysis.scores.automationPotential, 'Current State']);
    }

    // Add Future State Analysis if available
    if (futureAnalysis) {
      csvRows.push(['', '', ''], ['Future State Analysis', '', '']);
      csvRows.push(['Total Score', `${futureAnalysis.scores.total}/302`, 'Future State']);
      csvRows.push(['Outcome', futureAnalysis.scores.outcome, 'Future State']);
      csvRows.push(['Technology Roadmap Score', futureAnalysis.scores.technologyRoadmap, 'Future State']);
      csvRows.push(['Business Impact Score', futureAnalysis.scores.businessImpact, 'Future State']);
      csvRows.push(['Implementation Strategy Score', futureAnalysis.scores.implementationStrategy, 'Future State']);
    }

    return csvRows;
  };

  const downloadCSV = () => {
    try {
      const csvData = generateCSVData();
      const csvContent = csvData.map(row => 
        row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      ).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `AI_ROI_Analysis_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to download CSV', e);
      alert('Failed to generate CSV. Please try again.');
    }
  };

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
              {/* Cost Reduction Analysis */}
              <div className="bg-white rounded-lg p-6 shadow-lg border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-red-600" />
                  Cost Reduction Analysis
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Monthly Cost (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">₹</span>
                      <input
                        type="number"
                        value={roiInputs.costReduction.current}
                        onChange={(e) => updateROIInput('costReduction', 'current', Number(e.target.value))}
                        className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Future Monthly Cost (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">₹</span>
                      <input
                        type="number"
                        value={roiInputs.costReduction.future}
                        onChange={(e) => updateROIInput('costReduction', 'future', Number(e.target.value))}
                        className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 p-3 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-700">
                    <strong>Monthly Savings:</strong> {formatCurrency(metrics.costReductionSavings)}
                  </p>
                </div>
              </div>

              {/* Quality Defects Analysis */}
              <div className="bg-white rounded-lg p-6 shadow-lg border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calculator className="w-5 h-5 mr-2 text-yellow-600" />
                  Quality Defects Analysis
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Defect Cost/Month (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">₹</span>
                      <input
                        type="number"
                        value={roiInputs.qualityDefects.current}
                        onChange={(e) => updateROIInput('qualityDefects', 'current', Number(e.target.value))}
                        className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Future Defect Cost/Month (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">₹</span>
                      <input
                        type="number"
                        value={roiInputs.qualityDefects.future}
                        onChange={(e) => updateROIInput('qualityDefects', 'future', Number(e.target.value))}
                        className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-700">
                    <strong>Monthly Quality Savings:</strong> {formatCurrency(metrics.qualityImprovementSavings)}
                  </p>
                </div>
              </div>

              {/* Efficiency Improvement Analysis */}
              <div className="bg-white rounded-lg p-6 shadow-lg border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                  Efficiency Improvement Analysis
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Efficiency (%)
                    </label>
                    <input
                      type="number"
                      value={roiInputs.efficiencyImprovement.current}
                      onChange={(e) => updateROIInput('efficiencyImprovement', 'current', Number(e.target.value))}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      max="100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Future Efficiency (%)
                    </label>
                    <input
                      type="number"
                      value={roiInputs.efficiencyImprovement.future}
                      onChange={(e) => updateROIInput('efficiencyImprovement', 'future', Number(e.target.value))}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
                
                <div className="mt-3 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">
                    <strong>Monthly Efficiency Earnings:</strong> {formatCurrency(metrics.efficiencyImprovementEarnings)}
                  </p>
                </div>
              </div>

              {/* Initial Investment */}
              <div className="bg-white rounded-lg p-6 shadow-lg border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Download className="w-5 h-5 mr-2 text-purple-600" />
                  Initial Investment
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    One-Time Investment / CAPEX (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">₹</span>
                    <input
                      type="number"
                      value={roiInputs.initialInvestment}
                      onChange={(e) => updateROIInput('initialInvestment', undefined, Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="500000"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Total one-time cost for AI implementation</p>
                </div>
              </div>
            </div>

            {/* Right Panel - Results */}
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-3 sm:p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100 text-xs sm:text-sm">Cost Reduction</p>
                      <p className="text-lg sm:text-xl font-bold">{formatCurrency(metrics.costReductionSavings)}</p>
                    </div>
                    <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-red-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-3 sm:p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100 text-xs sm:text-sm">Quality Savings</p>
                      <p className="text-lg sm:text-xl font-bold">{formatCurrency(metrics.qualityImprovementSavings)}</p>
                    </div>
                    <Calculator className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-3 sm:p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-xs sm:text-sm">Efficiency Earnings</p>
                      <p className="text-sm sm:text-lg font-bold">{formatCurrency(metrics.efficiencyImprovementEarnings)}</p>
                    </div>
                    <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-green-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-3 sm:p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-xs sm:text-sm">ROI</p>
                      <p className="text-lg sm:text-2xl font-bold">{metrics.roiPercentage.toFixed(0)}%</p>
                    </div>
                    <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-blue-200" />
                  </div>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border shadow-sm">
                  <h4 className="text-sm font-semibold text-gray-600 mb-1">Payback Period</h4>
                  <p className="text-2xl font-bold text-gray-900">{metrics.paybackPeriod.toFixed(1)} Months</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border shadow-sm">
                  <h4 className="text-sm font-semibold text-gray-600 mb-1">Total Annual Gain</h4>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(metrics.totalAnnualGain)}</p>
                </div>
              </div>

              {/* Visualization Button */}
              <div className="bg-white rounded-lg p-6 shadow-lg border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <PieChart className="w-5 h-5 mr-2 text-indigo-600" />
                  Data Visualization
                </h3>
                
                <button
                  onClick={() => setShowVisualization(!showVisualization)}
                  className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors font-semibold"
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  {showVisualization ? 'Hide Charts' : 'Show Visual Charts'}
                </button>

                {showVisualization && (
                  <div className="mt-6 space-y-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                      Interactive ROI Analysis Charts
                    </h4>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Cost Reduction Chart */}
                      <div className="bg-white rounded-lg p-4 shadow-md border">
                        <h5 className="text-md font-semibold text-gray-900 mb-3 text-center">Cost Reduction Over Time</h5>
                        <div className="relative h-48">
                          <svg className="w-full h-full" viewBox="0 0 400 200">
                            {/* Grid lines */}
                            <defs>
                              <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                              </pattern>
                            </defs>
                            <rect width="400" height="200" fill="url(#grid)" />
                            
                            {/* Axes */}
                            <line x1="50" y1="180" x2="380" y2="180" stroke="#374151" strokeWidth="2"/>
                            <line x1="50" y1="180" x2="50" y2="20" stroke="#374151" strokeWidth="2"/>
                            
                            {/* Current to Future Cost Line */}
                            <line 
                              x1="80" 
                              y1={180 - (roiInputs.costReduction.current / Math.max(roiInputs.costReduction.current, 1000) * 140)} 
                              x2="320" 
                              y2={180 - (roiInputs.costReduction.future / Math.max(roiInputs.costReduction.current, 1000) * 140)} 
                              stroke="#ef4444" 
                              strokeWidth="4"
                              strokeDasharray="0"
                            />
                            
                            {/* Data points */}
                            <circle 
                              cx="80" 
                              cy={180 - (roiInputs.costReduction.current / Math.max(roiInputs.costReduction.current, 1000) * 140)} 
                              r="8" 
                              fill="#ef4444"
                              stroke="white"
                              strokeWidth="2"
                            />
                            <circle 
                              cx="320" 
                              cy={180 - (roiInputs.costReduction.future / Math.max(roiInputs.costReduction.current, 1000) * 140)} 
                              r="8" 
                              fill="#ef4444"
                              stroke="white"
                              strokeWidth="2"
                            />
                            
                            {/* Value labels on points */}
                            <text x="80" y={170 - (roiInputs.costReduction.current / Math.max(roiInputs.costReduction.current, 1000) * 140)} textAnchor="middle" className="text-xs fill-red-600 font-semibold">₹{(roiInputs.costReduction.current/1000).toFixed(0)}K</text>
                            <text x="320" y={170 - (roiInputs.costReduction.future / Math.max(roiInputs.costReduction.current, 1000) * 140)} textAnchor="middle" className="text-xs fill-red-600 font-semibold">₹{(roiInputs.costReduction.future/1000).toFixed(0)}K</text>
                            
                            {/* Labels */}
                            <text x="80" y="195" textAnchor="middle" className="text-xs fill-gray-600 font-medium">Current</text>
                            <text x="320" y="195" textAnchor="middle" className="text-xs fill-gray-600 font-medium">Future</text>
                            <text x="25" y="100" textAnchor="middle" className="text-xs fill-gray-600" transform="rotate(-90 25 100)">Monthly Cost (₹)</text>
                          </svg>
                          <div className="absolute top-2 right-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                            Savings: {formatCurrency(metrics.costReductionSavings)}/mo
                          </div>
                        </div>
                      </div>

                      {/* Quality Improvement Chart */}
                      <div className="bg-white rounded-lg p-4 shadow-md border">
                        <h5 className="text-md font-semibold text-gray-900 mb-3 text-center">Quality Defects Reduction</h5>
                        <div className="relative h-48">
                          <svg className="w-full h-full" viewBox="0 0 400 200">
                            <rect width="400" height="200" fill="url(#grid)" />
                            
                            {/* Axes */}
                            <line x1="50" y1="180" x2="380" y2="180" stroke="#374151" strokeWidth="2"/>
                            <line x1="50" y1="180" x2="50" y2="20" stroke="#374151" strokeWidth="2"/>
                            
                            {/* Quality Improvement Line */}
                            <line 
                              x1="80" 
                              y1={180 - (roiInputs.qualityDefects.current / Math.max(roiInputs.qualityDefects.current, 100) * 140)} 
                              x2="320" 
                              y2={180 - (roiInputs.qualityDefects.future / Math.max(roiInputs.qualityDefects.current, 100) * 140)} 
                              stroke="#eab308" 
                              strokeWidth="4"
                            />
                            
                            {/* Data points */}
                            <circle 
                              cx="80" 
                              cy={180 - (roiInputs.qualityDefects.current / Math.max(roiInputs.qualityDefects.current, 100) * 140)} 
                              r="8" 
                              fill="#eab308"
                              stroke="white"
                              strokeWidth="2"
                            />
                            <circle 
                              cx="320" 
                              cy={180 - (roiInputs.qualityDefects.future / Math.max(roiInputs.qualityDefects.current, 100) * 140)} 
                              r="8" 
                              fill="#eab308"
                              stroke="white"
                              strokeWidth="2"
                            />
                            
                            {/* Value labels */}
                            <text x="80" y={170 - (roiInputs.qualityDefects.current / Math.max(roiInputs.qualityDefects.current, 100) * 140)} textAnchor="middle" className="text-xs fill-yellow-600 font-semibold">{roiInputs.qualityDefects.current}</text>
                            <text x="320" y={170 - (roiInputs.qualityDefects.future / Math.max(roiInputs.qualityDefects.current, 100) * 140)} textAnchor="middle" className="text-xs fill-yellow-600 font-semibold">{roiInputs.qualityDefects.future}</text>
                            
                            {/* Labels */}
                            <text x="80" y="195" textAnchor="middle" className="text-xs fill-gray-600 font-medium">Current</text>
                            <text x="320" y="195" textAnchor="middle" className="text-xs fill-gray-600 font-medium">Future</text>
                            <text x="25" y="100" textAnchor="middle" className="text-xs fill-gray-600" transform="rotate(-90 25 100)">Defects Count</text>
                          </svg>
                          <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                            Savings: {formatCurrency(metrics.qualityImprovementSavings)}/mo
                          </div>
                        </div>
                      </div>

                      {/* Efficiency Improvement Chart */}
                      <div className="bg-white rounded-lg p-4 shadow-md border">
                        <h5 className="text-md font-semibold text-gray-900 mb-3 text-center">Efficiency Improvement</h5>
                        <div className="relative h-48">
                          <svg className="w-full h-full" viewBox="0 0 400 200">
                            <rect width="400" height="200" fill="url(#grid)" />
                            
                            {/* Axes */}
                            <line x1="50" y1="180" x2="380" y2="180" stroke="#374151" strokeWidth="2"/>
                            <line x1="50" y1="180" x2="50" y2="20" stroke="#374151" strokeWidth="2"/>
                            
                            {/* Efficiency Line */}
                            <line 
                              x1="80" 
                              y1={180 - (roiInputs.efficiencyImprovement.current / Math.max(roiInputs.efficiencyImprovement.future, roiInputs.efficiencyImprovement.current) * 140)} 
                              x2="320" 
                              y2={180 - (roiInputs.efficiencyImprovement.future / Math.max(roiInputs.efficiencyImprovement.future, roiInputs.efficiencyImprovement.current) * 140)} 
                              stroke="#22c55e" 
                              strokeWidth="4"
                            />
                            
                            {/* Data points */}
                            <circle 
                              cx="80" 
                              cy={180 - (roiInputs.efficiencyImprovement.current / Math.max(roiInputs.efficiencyImprovement.future, roiInputs.efficiencyImprovement.current) * 140)} 
                              r="8" 
                              fill="#22c55e"
                              stroke="white"
                              strokeWidth="2"
                            />
                            <circle 
                              cx="320" 
                              cy={180 - (roiInputs.efficiencyImprovement.future / Math.max(roiInputs.efficiencyImprovement.future, roiInputs.efficiencyImprovement.current) * 140)} 
                              r="8" 
                              fill="#22c55e"
                              stroke="white"
                              strokeWidth="2"
                            />
                            
                            {/* Value labels */}
                            <text x="80" y={170 - (roiInputs.efficiencyImprovement.current / Math.max(roiInputs.efficiencyImprovement.future, roiInputs.efficiencyImprovement.current) * 140)} textAnchor="middle" className="text-xs fill-green-600 font-semibold">{roiInputs.efficiencyImprovement.current}%</text>
                            <text x="320" y={170 - (roiInputs.efficiencyImprovement.future / Math.max(roiInputs.efficiencyImprovement.future, roiInputs.efficiencyImprovement.current) * 140)} textAnchor="middle" className="text-xs fill-green-600 font-semibold">{roiInputs.efficiencyImprovement.future}%</text>
                            
                            {/* Labels */}
                            <text x="80" y="195" textAnchor="middle" className="text-xs fill-gray-600 font-medium">Current</text>
                            <text x="320" y="195" textAnchor="middle" className="text-xs fill-gray-600 font-medium">Future</text>
                            <text x="25" y="100" textAnchor="middle" className="text-xs fill-gray-600" transform="rotate(-90 25 100)">Efficiency (%)</text>
                          </svg>
                          <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            Earnings: {formatCurrency(metrics.efficiencyImprovementEarnings)}/mo
                          </div>
                        </div>
                      </div>

                      {/* ROI Timeline Chart */}
                      <div className="bg-white rounded-lg p-4 shadow-md border">
                        <h5 className="text-md font-semibold text-gray-900 mb-3 text-center">ROI Growth Timeline</h5>
                        <div className="relative h-48">
                          <svg className="w-full h-full" viewBox="0 0 400 200">
                            <rect width="400" height="200" fill="url(#grid)" />
                            
                            {/* Axes */}
                            <line x1="50" y1="180" x2="380" y2="180" stroke="#374151" strokeWidth="2"/>
                            <line x1="50" y1="180" x2="50" y2="20" stroke="#374151" strokeWidth="2"/>
                            
                            {/* ROI Growth Curve - Quadratic curve showing exponential growth */}
                            <path 
                              d={`M 80 180 Q 150 ${180 - Math.min(60, metrics.paybackPeriod * 2)} 200 ${180 - Math.min(80, metrics.roiPercentage / 2)} T 320 ${180 - Math.min(140, metrics.roiPercentage * 1.4)}`}
                              stroke="#8b5cf6" 
                              strokeWidth="4" 
                              fill="none"
                            />
                            
                            {/* Break-even point */}
                            {metrics.paybackPeriod > 0 && metrics.paybackPeriod < 24 && (
                              <>
                                <circle cx={80 + (metrics.paybackPeriod / 24) * 240} cy="180" r="6" fill="#f59e0b" stroke="white" strokeWidth="2" />
                                <text x={80 + (metrics.paybackPeriod / 24) * 240} y={200} textAnchor="middle" className="text-xs fill-orange-600 font-semibold">
                                  Break-even
                                </text>
                              </>
                            )}
                            
                            {/* Start and End points */}
                            <circle cx="80" cy="180" r="6" fill="#8b5cf6" stroke="white" strokeWidth="2" />
                            <circle cx="320" cy={180 - Math.min(140, metrics.roiPercentage * 1.4)} r="8" fill="#8b5cf6" stroke="white" strokeWidth="2" />
                            
                            {/* Value labels */}
                            <text x="320" y={170 - Math.min(140, metrics.roiPercentage * 1.4)} textAnchor="middle" className="text-xs fill-purple-600 font-semibold">{metrics.roiPercentage.toFixed(0)}%</text>
                            
                            {/* Labels */}
                            <text x="80" y="195" textAnchor="middle" className="text-xs fill-gray-600 font-medium">Month 0</text>
                            <text x="200" y="195" textAnchor="middle" className="text-xs fill-gray-600 font-medium">Month 12</text>
                            <text x="320" y="195" textAnchor="middle" className="text-xs fill-gray-600 font-medium">Month 24</text>
                            <text x="25" y="100" textAnchor="middle" className="text-xs fill-gray-600" transform="rotate(-90 25 100)">ROI (%)</text>
                          </svg>
                          <div className="absolute top-2 right-2 bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                            Payback: {metrics.paybackPeriod.toFixed(1)}mo
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white text-center">
                        <div className="text-2xl font-bold">{formatCurrency(metrics.totalMonthlyGain)}</div>
                        <div className="text-sm text-blue-100">Monthly Gain</div>
                      </div>
                      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white text-center">
                        <div className="text-2xl font-bold">{metrics.roiPercentage.toFixed(1)}%</div>
                        <div className="text-sm text-green-100">Annual ROI</div>
                      </div>
                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white text-center">
                        <div className="text-2xl font-bold">{metrics.paybackPeriod.toFixed(1)}</div>
                        <div className="text-sm text-purple-100">Payback (Months)</div>
                      </div>
                      <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg p-4 text-white text-center">
                        <div className="text-2xl font-bold">{formatCurrency(metrics.totalAnnualGain)}</div>
                        <div className="text-sm text-indigo-100">Annual Gain</div>
                      </div>
                    </div>
                  </div>
                )}
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
                      HTML Report
                    </button>
                    <button
                      onClick={downloadCSV}
                      className="flex items-center justify-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download CSV
                    </button>
                    <button
                      onClick={downloadReport}
                      className="flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Export JSON
                    </button>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  Based on your inputs, this AI project has an ROI of <strong>{metrics.roiPercentage.toFixed(0)}%</strong> and 
                  will pay for itself in <strong>{metrics.paybackPeriod.toFixed(1)} months</strong>. The total financial gain 
                  is projected to be <strong>{formatCurrency(metrics.totalAnnualGain)}</strong> per year, driven by{' '}
                  <strong>{formatCurrency(metrics.costReductionSavings)}</strong> in cost reduction savings,{' '}
                  <strong>{formatCurrency(metrics.qualityImprovementSavings)}</strong> in quality improvement savings, and{' '}
                  <strong>{formatCurrency(metrics.efficiencyImprovementEarnings)}</strong> in efficiency improvement earnings.
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