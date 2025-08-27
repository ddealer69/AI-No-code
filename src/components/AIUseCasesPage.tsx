import React, { useState } from 'react';
import { ArrowRight, RotateCcw, Filter, CheckCircle, XCircle } from 'lucide-react';
import { AIUseCase } from '../types';

interface AIUseCasesPageProps {
  useCases: { [key: string]: AIUseCase };
  onViewRealUseCases: () => void;
  onRestart: () => void;
}

const AIUseCasesPage: React.FC<AIUseCasesPageProps> = ({
  useCases,
  onViewRealUseCases,
  onRestart
}) => {
  const [selectedType, setSelectedType] = useState<string>('');

  const useCasesList = Object.values(useCases);
  const filteredUseCases = selectedType 
    ? useCasesList.filter(useCase => useCase.aiSystemType === selectedType)
    : useCasesList;

  const aiTypes = ['Computer Vision', 'Generative AI', 'NLP', 'ML', 'Predictive Analysis', 'RPA'];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Use Cases</h1>
        <p className="text-gray-600">Technical implementation details and requirements</p>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by AI System Type:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              {aiTypes.map(type => (
                <option key={type} value={type}>{type}</option>
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

      {/* AI Use Cases Grid */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {filteredUseCases.map((useCase) => (
          <div
            key={useCase.id}
            className="bg-white rounded-xl shadow-lg border hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={onViewRealUseCases}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {useCase.useCase}
                  </h3>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    {useCase.aiSystemType}
                  </span>
                </div>
                <ArrowRight className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Tools & Platforms</h4>
                  <div className="flex flex-wrap gap-2">
                    {useCase.tools.map((tool, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">Custom Development:</span>
                    {useCase.customDev ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm text-gray-600">
                      {useCase.customDev ? 'Required' : 'Not Required'}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Implementation Notes</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {useCase.implementationNotes}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredUseCases.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No AI use cases match the selected criteria.</p>
        </div>
      )}

      {/* Action Button */}
      <div className="text-center">
        <button
          onClick={onViewRealUseCases}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          View Real World Examples
        </button>
      </div>
    </div>
  );
};

export default AIUseCasesPage;