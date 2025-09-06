import React from 'react';
import { TrendingUp, DollarSign } from 'lucide-react';
import { FutureStateAnalysis, FutureScoreBreakdown, FUTURE_SCORING_OPTIONS } from '../../types/futureStateAnalysis';

interface FutureStep5Props {
  data: FutureStateAnalysis;
  updateData: (section: string, data: any) => void;
  scores: FutureScoreBreakdown;
}

const FutureStep5BusinessImpact: React.FC<FutureStep5Props> = ({ data, updateData, scores }) => {
  const handleImpactChange = (field: string, scoreValue: number, absoluteValue: string) => {
    updateData('businessImpact', { 
      [field]: { 
        score: scoreValue, 
        absoluteValue: absoluteValue || data.businessImpact[field as keyof typeof data.businessImpact].absoluteValue 
      } 
    });
  };

  const impactAreas = [
    { key: 'revenueGrowthTargets', label: 'Revenue Growth Targets' },
    { key: 'costSavingsTargets', label: 'Cost Savings Targets' },
    { key: 'productivityImprovements', label: 'Productivity Improvements' },
    { key: 'customerExperienceGoals', label: 'Customer Experience Goals' },
    { key: 'timeToMarketImprovements', label: 'Time to Market Improvements' },
    { key: 'qualityImprovements', label: 'Quality Improvements' },
    { key: 'sustainabilityGoals', label: 'Sustainability Goals' },
    { key: 'innovationMetrics', label: 'Innovation Metrics' },
    { key: 'marketShareTargets', label: 'Market Share Targets' },
    { key: 'customerSatisfactionGoals', label: 'Customer Satisfaction Goals' },
    { key: 'employeeEngagementTargets', label: 'Employee Engagement Targets' },
    { key: 'complianceImprovements', label: 'Compliance Improvements' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <TrendingUp className="w-6 h-6 mr-3 text-purple-600" />
          Expected Business Impact
        </h2>
        <p className="text-gray-600">Define your expected business outcomes and impact targets</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {impactAreas.map((area) => {
          const impact = data.businessImpact[area.key as keyof typeof data.businessImpact];
          
          return (
            <div key={area.key} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center mb-3">
                <DollarSign className="w-4 h-4 text-purple-600 mr-2" />
                <h4 className="text-sm font-semibold text-gray-900">{area.label}</h4>
              </div>
              
              <div className="space-y-2">
                <select
                  value={impact.score}
                  onChange={(e) => handleImpactChange(area.key, parseInt(e.target.value), impact.absoluteValue)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                >
                  {FUTURE_SCORING_OPTIONS.IMPACT_POTENTIAL.map((option) => (
                    <option key={option.score} value={option.score}>
                      {option.score} - {option.description}
                    </option>
                  ))}
                </select>
                
                <input
                  type="text"
                  value={impact.absoluteValue}
                  onChange={(e) => handleImpactChange(area.key, impact.score, e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., 25% increase, $500K savings"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-blue-900">Business Impact Score</h3>
          <div className="text-2xl font-bold text-blue-600">
            {scores.businessImpact}/60
          </div>
        </div>
      </div>
    </div>
  );
};

export default FutureStep5BusinessImpact;
