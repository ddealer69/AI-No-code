import React from 'react';
import { BarChart3, Clock, DollarSign, TrendingUp } from 'lucide-react';
import { CurrentStateAnalysis, ScoreBreakdown } from '../../types/currentStateAnalysis';

interface Step6Props {
  data: CurrentStateAnalysis;
  updateData: (section: string, data: any) => void;
  scores: ScoreBreakdown;
}

const Step6Productivity: React.FC<Step6Props> = ({ data, updateData, scores }) => {
  const handleProductivityChange = (field: string, value: string | number) => {
    updateData('productivityMetrics', { [field]: value });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <BarChart3 className="w-6 h-6 mr-3 text-green-600" />
          Productivity Metrics
        </h2>
        <p className="text-gray-600">Quantify your current process performance and costs</p>
      </div>

      {/* Process Metrics */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-green-600" />
          Process Performance
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Outputs Generated per Process
            </label>
            <input
              type="number"
              value={data.productivityMetrics.outputsGenerated}
              onChange={(e) => handleProductivityChange('outputsGenerated', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Average Time per Step (minutes)
            </label>
            <input
              type="number"
              value={data.productivityMetrics.avgTimePerStep}
              onChange={(e) => handleProductivityChange('avgTimePerStep', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 15"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Average Time per Complete Process (hours)
            </label>
            <input
              type="number"
              value={data.productivityMetrics.avgTimePerProcess}
              onChange={(e) => handleProductivityChange('avgTimePerProcess', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Process Frequency per Month
            </label>
            <input
              type="number"
              value={data.productivityMetrics.processFrequency}
              onChange={(e) => handleProductivityChange('processFrequency', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Error Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={data.productivityMetrics.errorRate}
              onChange={(e) => handleProductivityChange('errorRate', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 2.5"
            />
          </div>
        </div>
      </div>

      {/* Cost Analysis */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-green-600" />
          Cost Analysis
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Labor Cost per Step ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={data.productivityMetrics.laborCostPerStep}
              onChange={(e) => handleProductivityChange('laborCostPerStep', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 25.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Other Direct Costs per Step ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={data.productivityMetrics.otherDirectCosts}
              onChange={(e) => handleProductivityChange('otherDirectCosts', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 10.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Cost per Step ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={data.productivityMetrics.totalCostPerStep}
              onChange={(e) => handleProductivityChange('totalCostPerStep', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Calculated: {(data.productivityMetrics.laborCostPerStep + data.productivityMetrics.otherDirectCosts).toFixed(2)}"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Monthly Cost ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={data.productivityMetrics.totalMonthlyCost}
              onChange={(e) => handleProductivityChange('totalMonthlyCost', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Calculated from frequency × cost per process"
            />
          </div>
        </div>
      </div>

      {/* Key Bottlenecks */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Key Bottlenecks & Issues
        </h3>
        <textarea
          value={data.productivityMetrics.keyBottlenecks}
          onChange={(e) => handleProductivityChange('keyBottlenecks', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe the main bottlenecks, inefficiencies, and issues in your current process..."
        />
      </div>

      {/* Productivity Score Display */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-green-900">Productivity Score</h3>
          <div className="text-2xl font-bold text-green-600">
            {scores.productivityMetrics}/17
          </div>
        </div>
        
        <div className="text-sm text-green-700">
          <p className="mb-2">This score reflects the potential for improvement through AI implementation.</p>
          <p>Higher scores indicate better baseline performance and clearer metrics for improvement.</p>
        </div>

        <div className="mt-4 w-full bg-green-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(scores.productivityMetrics / 17) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Step6Productivity;
