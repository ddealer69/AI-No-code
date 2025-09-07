import React from 'react';
import { DollarSign, Calculator } from 'lucide-react';
import { FutureStateAnalysis, FutureScoreBreakdown, FUTURE_SCORING_OPTIONS } from '../../types/futureStateAnalysis';

const FutureStep8Investment: React.FC<{
  data: FutureStateAnalysis;
  updateData: (section: string, data: any) => void;
  scores: FutureScoreBreakdown;
  onOpenROICalculator?: () => void;
}> = ({ data, updateData, onOpenROICalculator }) => {
  const handleChange = (field: string, value: number) => {
    updateData('investmentPlanning', { [field]: value });
  };

  const areas = [
    { key: 'budgetAllocation', label: 'Budget Allocation Planning' },
    { key: 'roiExpectations', label: 'ROI Expectations' },
    { key: 'fundingSources', label: 'Funding Sources' },
    { key: 'costBenefitAnalysis', label: 'Cost-Benefit Analysis' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <DollarSign className="w-6 h-6 mr-3 text-purple-600" />
          Investment Planning
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {areas.map((area) => (
          <div key={area.key} className="bg-white rounded-lg p-4 border">
            <h4 className="font-semibold mb-2">{area.label}</h4>
            <select
              value={data.investmentPlanning[area.key as keyof typeof data.investmentPlanning]}
              onChange={(e) => handleChange(area.key, parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              {FUTURE_SCORING_OPTIONS.INVESTMENT_COMMITMENT.map((option) => (
                <option key={option.score} value={option.score}>
                  {option.score} - {option.description}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* ROI Calculator Button */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready for ROI Analysis?</h3>
        <p className="text-gray-600 mb-4">Calculate the return on investment for your AI transformation</p>
        
        {onOpenROICalculator && (
          <button
            onClick={onOpenROICalculator}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-semibold shadow-md transition-all duration-200"
          >
            <Calculator className="w-5 h-5 mr-2" />
            Calculate AI ROI
          </button>
        )}
      </div>
    </div>
  );
};

export default FutureStep8Investment;
