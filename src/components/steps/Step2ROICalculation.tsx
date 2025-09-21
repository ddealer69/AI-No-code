import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, TrendingUp, Clock, Target, Download, BarChart3 } from 'lucide-react';
import { CurrentStateAnalysis, ScoreBreakdown } from '../../types/currentStateAnalysis';

interface ROIMetrics {
  newTimePerInstance: number;
  timeSavedPerMonth: number;
  laborCostSavings: number;
  totalMonthlyGain: number;
  totalAnnualGain: number;
  paybackPeriod: number;
  roiPercentage: number;
}

interface Step2ROICalculationProps {
  data: CurrentStateAnalysis;
  updateData: (section: string, data: any) => void;
  scores: ScoreBreakdown;
}

const Step2ROICalculation: React.FC<Step2ROICalculationProps> = ({ data, updateData }) => {
  // ROI calculation inputs
  const [totalEffortPerMonth, setTotalEffortPerMonth] = useState<number>(160);
  const [currentProcessCost, setCurrentProcessCost] = useState<number>(600000);
  const [timePerInstanceBefore, setTimePerInstanceBefore] = useState<number>(120);
  const [timePerInstanceAfter, setTimePerInstanceAfter] = useState<number>(30);
  const [effortAfterAutomation, setEffortAfterAutomation] = useState<number>(60);
  const [costAfterAutomation, setCostAfterAutomation] = useState<number>(200000);
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

    // Update the data in the parent component
    updateData('roiCalculation', {
      totalEffortPerMonth,
      currentProcessCost,
      timePerInstanceBefore,
      timePerInstanceAfter,
      effortAfterAutomation,
      costAfterAutomation,
      revenueImpact,
      capex,
      calculatedMetrics: {
        newTimePerInstance,
        timeSavedPerMonth,
        laborCostSavings,
        totalMonthlyGain,
        totalAnnualGain,
        paybackPeriod,
        roiPercentage,
      }
    });
  }, [totalEffortPerMonth, currentProcessCost, timePerInstanceBefore, timePerInstanceAfter, effortAfterAutomation, costAfterAutomation, revenueImpact, capex, updateData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getROICategory = (roi: number) => {
    if (roi >= 150) return { category: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-50' };
    if (roi >= 100) return { category: 'Very Good', color: 'text-blue-600', bgColor: 'bg-blue-50' };
    if (roi >= 51) return { category: 'Good', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    return { category: 'Needs Improvement', color: 'text-red-600', bgColor: 'bg-red-50' };
  };

  const roiCategory = getROICategory(metrics.roiPercentage);

  const generateQuickReport = () => {
    const reportContent = `
AI ROI Analysis Report
Generated on: ${new Date().toLocaleDateString('en-IN')}

Process Analysis:
- Current Effort: ${totalEffortPerMonth} hours/month
- Current Cost: ${formatCurrency(currentProcessCost)}/month
- Time Before AI: ${timePerInstanceBefore} minutes/instance
- Time After AI: ${timePerInstanceAfter} minutes/instance
- Effort After AI: ${effortAfterAutomation} hours/month
- Cost After AI: ${formatCurrency(costAfterAutomation)}/month

Financial Projections:
- ROI: ${metrics.roiPercentage.toFixed(1)}%
- Payback Period: ${metrics.paybackPeriod.toFixed(1)} months
- Annual Gain: ${formatCurrency(metrics.totalAnnualGain)}
- Monthly Savings: ${formatCurrency(metrics.laborCostSavings)}
- Time Saved: ${metrics.timeSavedPerMonth} hours/month

Investment:
- Initial CAPEX: ${formatCurrency(capex)}
- Revenue Impact: ${formatCurrency(revenueImpact)}/month

Assessment: ${roiCategory.category}
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ROI_Analysis_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <Calculator className="w-6 h-6 mr-3 text-blue-600" />
          ROI Analysis & Financial Planning
        </h2>
        <p className="text-gray-600">
          Calculate the potential return on investment for AI implementation in your business process.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                  Total Effort per Month (hours)
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
                  Time per Instance Before AI (minutes)
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
                  Time per Instance After AI (minutes)
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
                  Effort After AI (hours/month)
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
                  Cost After AI (₹/month)
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
          {/* ROI Category Badge */}
          <div className={`${roiCategory.bgColor} rounded-lg p-4 border-l-4 border-current`}>
            <div className="flex items-center">
              <BarChart3 className={`w-6 h-6 mr-2 ${roiCategory.color}`} />
              <div>
                <p className="text-sm text-gray-600">ROI Assessment</p>
                <p className={`text-lg font-bold ${roiCategory.color}`}>{roiCategory.category}</p>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">ROI</p>
                  <p className="text-2xl font-bold">{metrics.roiPercentage.toFixed(0)}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Payback Period</p>
                  <p className="text-2xl font-bold">{metrics.paybackPeriod.toFixed(1)} Months</p>
                </div>
                <Clock className="w-8 h-8 text-blue-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Annual Gain</p>
                  <p className="text-xl font-bold">{formatCurrency(metrics.totalAnnualGain)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Time Saved</p>
                  <p className="text-2xl font-bold">{metrics.timeSavedPerMonth} Hrs</p>
                </div>
                <Clock className="w-8 h-8 text-orange-200" />
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Executive Summary</h3>
              <button
                onClick={generateQuickReport}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Download className="w-4 h-4 mr-1" />
                Export Report
              </button>
            </div>
            <p className="text-gray-700 leading-relaxed text-sm">
              Based on your inputs, this AI project has an ROI of <strong>{metrics.roiPercentage.toFixed(0)}%</strong> and 
              will pay for itself in <strong>{metrics.paybackPeriod.toFixed(1)} months</strong>. The total financial gain 
              is projected to be <strong>{formatCurrency(metrics.totalAnnualGain)}</strong> per year, driven by{' '}
              <strong>{formatCurrency(metrics.laborCostSavings)}</strong> in monthly cost reductions{revenueImpact > 0 && (
                <span> and <strong>{formatCurrency(revenueImpact)}</strong> in new revenue</span>
              )}.
            </p>
          </div>

          {/* Detailed Breakdown */}
          <div className="bg-white rounded-lg p-6 shadow-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Breakdown</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Time saved per instance:</span>
                <span className="font-medium">{metrics.newTimePerInstance} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly time savings:</span>
                <span className="font-medium">{metrics.timeSavedPerMonth} hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly cost savings:</span>
                <span className="font-medium">{formatCurrency(metrics.laborCostSavings)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly total gain:</span>
                <span className="font-medium">{formatCurrency(metrics.totalMonthlyGain)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between">
                  <span className="text-gray-900 font-semibold">Annual total gain:</span>
                  <span className="font-bold text-green-600">{formatCurrency(metrics.totalAnnualGain)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2ROICalculation;