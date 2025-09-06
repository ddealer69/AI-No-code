import React from 'react';
import { BarChart3 } from 'lucide-react';
import { FutureStateAnalysis, FutureScoreBreakdown } from '../../types/futureStateAnalysis';

const FutureStep6Productivity: React.FC<{
  data: FutureStateAnalysis;
  updateData: (section: string, data: any) => void;
  scores: FutureScoreBreakdown;
}> = ({ data, updateData }) => {
  const handleChange = (field: string, value: string | number) => {
    updateData('futureProductivity', { [field]: value });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <BarChart3 className="w-6 h-6 mr-3 text-purple-600" />
          Future Productivity Targets
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Target Output Increase (%)</label>
          <input
            type="number"
            value={data.futureProductivity.targetOutputIncrease}
            onChange={(e) => handleChange('targetOutputIncrease', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Expected Monthly Savings ($)</label>
          <input
            type="number"
            value={data.futureProductivity.expectedMonthlySavings}
            onChange={(e) => handleChange('expectedMonthlySavings', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default FutureStep6Productivity;
