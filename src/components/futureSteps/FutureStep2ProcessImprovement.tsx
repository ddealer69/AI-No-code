import React from 'react';
import { TrendingUp, Target, Zap, BarChart3 } from 'lucide-react';
import { FutureStateAnalysis, FutureScoreBreakdown, FUTURE_SCORING_OPTIONS } from '../../types/futureStateAnalysis';

interface FutureStep2Props {
  data: FutureStateAnalysis;
  updateData: (section: string, data: any) => void;
  scores: FutureScoreBreakdown;
}

const FutureStep2ProcessImprovement: React.FC<FutureStep2Props> = ({ data, updateData }) => {
  const handleProcessChange = (field: string, value: string | number) => {
    updateData('processImprovement', { [field]: value });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <TrendingUp className="w-6 h-6 mr-3 text-purple-600" />
          Process Improvement Goals
        </h2>
        <p className="text-gray-600">Define your target improvements and expected outcomes</p>
      </div>

      {/* Automation Targets */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-purple-600" />
          Automation & Efficiency Targets
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Automation Level
            </label>
            <select
              value={data.processImprovement.targetAutomationLevel}
              onChange={(e) => handleProcessChange('targetAutomationLevel', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              {FUTURE_SCORING_OPTIONS.GENERAL_5_POINT.map((option) => (
                <option key={option.score} value={option.score}>
                  {option.score} - {option.description}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Efficiency Gains
            </label>
            <select
              value={data.processImprovement.expectedEfficiencyGains}
              onChange={(e) => handleProcessChange('expectedEfficiencyGains', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              {FUTURE_SCORING_OPTIONS.IMPACT_POTENTIAL.map((option) => (
                <option key={option.score} value={option.score}>
                  {option.score} - {option.description}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Specific Targets */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Target className="w-5 h-5 mr-2 text-purple-600" />
          Specific Performance Targets
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quality Targets
            </label>
            <textarea
              value={data.processImprovement.qualityTargets}
              onChange={(e) => handleProcessChange('qualityTargets', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="e.g., Reduce defect rate to <1%, achieve 99.9% accuracy..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Throughput Goals
            </label>
            <textarea
              value={data.processImprovement.throughputGoals}
              onChange={(e) => handleProcessChange('throughputGoals', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="e.g., Increase output by 50%, process 1000 units/hour..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cost Reduction Targets
            </label>
            <textarea
              value={data.processImprovement.costReductionTargets}
              onChange={(e) => handleProcessChange('costReductionTargets', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="e.g., Reduce operating costs by 30%, save $100k annually..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Implementation Timeline
            </label>
            <textarea
              value={data.processImprovement.timelineForImplementation}
              onChange={(e) => handleProcessChange('timelineForImplementation', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="e.g., Phase 1: 6 months, Phase 2: 12 months, Full deployment: 18 months..."
            />
          </div>
        </div>
      </div>

      {/* Success Metrics */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="text-blue-600 mr-3 mt-0.5">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">Setting SMART Goals</h4>
            <p className="text-sm text-blue-700">
              Define Specific, Measurable, Achievable, Relevant, and Time-bound goals. 
              Consider both quantitative metrics (cost savings, time reduction, error rates) and 
              qualitative improvements (customer satisfaction, employee engagement).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FutureStep2ProcessImprovement;
