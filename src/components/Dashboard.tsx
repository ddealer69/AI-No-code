import React, { useState } from 'react';
import { ChevronDown, RotateCcw, Sparkles } from 'lucide-react';
import { DOMAIN_DATA, MATCHED_USE_CASES, AI_USE_CASES, REAL_USE_CASES } from '../data/demoData';
import { FilterData, StrategyResponse } from '../types';

interface DashboardProps {
  onGenerateStrategy: (response: StrategyResponse) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onGenerateStrategy }) => {
  const [filters, setFilters] = useState<FilterData>({
    domain: '',
    process: '',
    stage: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const domains = Object.keys(DOMAIN_DATA);
  const processes = filters.domain ? Object.keys(DOMAIN_DATA[filters.domain]) : [];
  const stages = filters.domain && filters.process ? DOMAIN_DATA[filters.domain][filters.process] : [];

  const getDomainCount = (domain: string) => {
    return Object.keys(DOMAIN_DATA[domain]).reduce((total, process) => {
      return total + DOMAIN_DATA[domain][process].length;
    }, 0);
  };

  const getProcessCount = (domain: string, process: string) => {
    return DOMAIN_DATA[domain][process].length;
  };

  const handleFilterChange = (type: keyof FilterData, value: string) => {
    if (type === 'domain') {
      setFilters({ domain: value, process: '', stage: '' });
    } else if (type === 'process') {
      setFilters({ ...filters, process: value, stage: '' });
    } else {
      setFilters({ ...filters, [type]: value });
    }
  };

  const resetFilters = () => {
    setFilters({ domain: '', process: '', stage: '' });
  };

  const handleGenerateStrategy = async () => {
    if (!filters.domain || !filters.process || !filters.stage) return;

    setIsGenerating(true);

    // Simulate API call
    setTimeout(() => {
      const response: StrategyResponse = {
        matchedUseCases: MATCHED_USE_CASES.reduce((acc, useCase, index) => {
          acc[(index + 1).toString()] = useCase;
          return acc;
        }, {} as { [key: string]: any }),
        aiUseCases: AI_USE_CASES.reduce((acc, aiCase, index) => {
          acc[(index + 1).toString()] = aiCase;
          return acc;
        }, {} as { [key: string]: any }),
        realUseCases: REAL_USE_CASES.reduce((acc, realCase, index) => {
          acc[(index + 1).toString()] = realCase;
          return acc;
        }, {} as { [key: string]: any })
      };

      onGenerateStrategy(response);
      setIsGenerating(false);
    }, 1500);
  };

  const canGenerate = filters.domain && filters.process && filters.stage;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Use Cases</h1>
        <p className="text-xl text-gray-600">Filter step by step to find the details you need</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Step 1: Domain */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Step 1: Select a Domain
            </label>
            <div className="relative">
              <select
                value={filters.domain}
                onChange={(e) => handleFilterChange('domain', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white pr-10 transition-colors"
              >
                <option value="">Choose domain...</option>
                {domains.map(domain => (
                  <option key={domain} value={domain}>
                    {domain} ({getDomainCount(domain)})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Step 2: Process */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Step 2: Select a Process
            </label>
            <div className="relative">
              <select
                value={filters.process}
                onChange={(e) => handleFilterChange('process', e.target.value)}
                disabled={!filters.domain}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white pr-10 disabled:bg-gray-50 disabled:text-gray-400 transition-colors"
              >
                <option value="">Choose process...</option>
                {processes.map(process => (
                  <option key={process} value={process}>
                    {process} ({getProcessCount(filters.domain, process)})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Step 3: Stage */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Step 3: Select a Stage
            </label>
            <div className="relative">
              <select
                value={filters.stage}
                onChange={(e) => handleFilterChange('stage', e.target.value)}
                disabled={!filters.process}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white pr-10 disabled:bg-gray-50 disabled:text-gray-400 transition-colors"
              >
                <option value="">Choose stage...</option>
                {stages.map(stage => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={resetFilters}
            className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset Filters</span>
          </button>

          <button
            onClick={handleGenerateStrategy}
            disabled={!canGenerate || isGenerating}
            className="flex items-center justify-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            <span>{isGenerating ? 'Generating Strategy...' : 'Generate My Strategy'}</span>
          </button>
        </div>

        {canGenerate && !isGenerating && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 text-sm">
              Ready to generate strategy for: <strong>{filters.domain}</strong> → <strong>{filters.process}</strong> → <strong>{filters.stage}</strong>
            </p>
          </div>
        )}

        {isGenerating && (
          <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="text-blue-800 font-medium">Analyzing your selection and generating AI strategy recommendations...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;