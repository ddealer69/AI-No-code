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
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6 font-serif">Explore Use Cases</h1>
        <p className="text-xl text-gray-600 font-medium tracking-wide">Filter step by step to find the details you need</p>
        <div className="w-24 h-1 gold-accent mx-auto mt-6"></div>
      </div>

      <div className="bg-white classic-shadow-lg classic-border p-12 mb-12">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Step 1: Domain */}
          <div className="space-y-4">
            <label className="block text-sm font-bold text-gray-800 uppercase tracking-widest">
              Step 1: Select a Domain
            </label>
            <div className="relative">
              <select
                value={filters.domain}
                onChange={(e) => handleFilterChange('domain', e.target.value)}
                className="w-full classic-input appearance-none pr-12 font-medium"
              >
                <option value="">Choose domain...</option>
                {domains.map(domain => (
                  <option key={domain} value={domain}>
                    {domain} ({getDomainCount(domain)})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Step 2: Process */}
          <div className="space-y-4">
            <label className="block text-sm font-bold text-gray-800 uppercase tracking-widest">
              Step 2: Select a Process
            </label>
            <div className="relative">
              <select
                value={filters.process}
                onChange={(e) => handleFilterChange('process', e.target.value)}
                disabled={!filters.domain}
                className="w-full classic-input appearance-none pr-12 disabled:bg-gray-100 disabled:text-gray-500 font-medium"
              >
                <option value="">Choose process...</option>
                {processes.map(process => (
                  <option key={process} value={process}>
                    {process} ({getProcessCount(filters.domain, process)})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Step 3: Stage */}
          <div className="space-y-4">
            <label className="block text-sm font-bold text-gray-800 uppercase tracking-widest">
              Step 3: Select a Stage
            </label>
            <div className="relative">
              <select
                value={filters.stage}
                onChange={(e) => handleFilterChange('stage', e.target.value)}
                disabled={!filters.process}
                className="w-full classic-input appearance-none pr-12 disabled:bg-gray-100 disabled:text-gray-500 font-medium"
              >
                <option value="">Choose stage...</option>
                {stages.map(stage => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button
            onClick={resetFilters}
            className="flex items-center justify-center space-x-3 classic-button-secondary"
          >
            <RotateCcw className="h-5 w-5" />
            <span>Reset Filters</span>
          </button>

          <button
            onClick={handleGenerateStrategy}
            disabled={!canGenerate || isGenerating}
            className="flex items-center justify-center space-x-3 classic-button-primary disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Sparkles className="h-5 w-5" />
            <span>{isGenerating ? 'Generating Strategy...' : 'Generate My Strategy'}</span>
          </button>
        </div>

        {canGenerate && !isGenerating && (
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-900">
            <p className="text-blue-900 text-sm font-semibold tracking-wide">
              Ready to generate strategy for: <strong>{filters.domain}</strong> → <strong>{filters.process}</strong> → <strong>{filters.stage}</strong>
            </p>
          </div>
        )}

        {isGenerating && (
          <div className="mt-8 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-900 classic-shadow">
            <div className="flex items-center justify-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-3 border-blue-900"></div>
              <p className="text-blue-900 font-bold tracking-wide">Analyzing your selection and generating AI strategy recommendations...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;