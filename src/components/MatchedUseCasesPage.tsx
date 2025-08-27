import React, { useState } from 'react';
import { ArrowRight, RotateCcw, Filter } from 'lucide-react';
import { UseCase } from '../types';

interface MatchedUseCasesPageProps {
  useCases: { [key: string]: UseCase };
  onViewAIUseCases: () => void;
  onRestart: () => void;
}

const MatchedUseCasesPage: React.FC<MatchedUseCasesPageProps> = ({
  useCases,
  onViewAIUseCases,
  onRestart
}) => {
  const [selectedMetric, setSelectedMetric] = useState<string>('');

  const useCasesList = Object.values(useCases);
  const filteredUseCases = selectedMetric 
    ? useCasesList.filter(useCase => 
        useCase.primaryMetric === selectedMetric || useCase.secondaryMetric === selectedMetric
      )
    : useCasesList;

  const metrics = ['Finance', 'Quality', 'Time'];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Matched Use Cases</h1>
        <p className="text-gray-600">AI strategies aligned with your business requirements</p>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by Value Metric:</span>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Metrics</option>
              {metrics.map(metric => (
                <option key={metric} value={metric}>{metric}</option>
              ))}
            </select>
          </div>

          <button
            onClick={onRestart}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Restart Journey</span>
          </button>
        </div>
      </div>

      {/* Use Cases Grid */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {filteredUseCases.map((useCase) => (
          <div
            key={useCase.id}
            className="bg-white rounded-xl shadow-lg border hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={onViewAIUseCases}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {useCase.businessProcess}
                  </h3>
                  <p className="text-sm text-gray-600">{useCase.jobRole}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Key Functional Areas</h4>
                  <div className="flex flex-wrap gap-2">
                    {useCase.functionalAreas.map((area, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Primary Metric</h4>
                    <span className="px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs font-medium">
                      {useCase.primaryMetric}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Secondary Metric</h4>
                    <span className="px-2 py-1 bg-orange-50 text-orange-700 rounded-md text-xs font-medium">
                      {useCase.secondaryMetric}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">AI Use Case</h4>
                  <p className="text-sm text-gray-600">{useCase.aiUseCase}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Expected Impact</h4>
                  <p className="text-sm text-gray-900 font-medium">{useCase.impact}</p>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Expected ROI:</span>
                    <span className="text-sm font-bold text-green-600">{useCase.expectedROI}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredUseCases.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No use cases match the selected criteria.</p>
        </div>
      )}

      {/* Action Button */}
      <div className="text-center">
        <button
          onClick={onViewAIUseCases}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          View AI Implementation Details
        </button>
      </div>
    </div>
  );
};

export default MatchedUseCasesPage;