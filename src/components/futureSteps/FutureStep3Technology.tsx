import React from 'react';
import { Server, Cloud, Shield, Cpu } from 'lucide-react';
import { FutureStateAnalysis, FutureScoreBreakdown, FUTURE_SCORING_OPTIONS } from '../../types/futureStateAnalysis';

interface FutureStep3Props {
  data: FutureStateAnalysis;
  updateData: (section: string, data: any) => void;
  scores: FutureScoreBreakdown;
}

const FutureStep3Technology: React.FC<FutureStep3Props> = ({ data, updateData, scores }) => {
  const handleTechChange = (field: string, value: number) => {
    updateData('technologyRoadmap', { [field]: value });
  };

  const technologyAreas = [
    {
      key: 'plannedTechUpgrades',
      label: 'Technology Infrastructure Upgrades',
      description: 'Planned improvements to core technology systems',
      icon: Server
    },
    {
      key: 'aiImplementationAreas',
      label: 'AI Implementation Areas',
      description: 'Scope and depth of planned AI implementations',
      icon: Cpu
    },
    {
      key: 'dataIntegrationPlans',
      label: 'Data Integration Strategy',
      description: 'Plans for data consolidation and integration',
      icon: Server
    },
    {
      key: 'cloudMigrationStrategy',
      label: 'Cloud Migration Strategy',
      description: 'Cloud adoption and migration planning',
      icon: Cloud
    },
    {
      key: 'iotImplementation',
      label: 'IoT Implementation',
      description: 'Internet of Things deployment plans',
      icon: Cpu
    },
    {
      key: 'cybersecurityEnhancements',
      label: 'Cybersecurity Enhancements',
      description: 'Security improvements and risk mitigation',
      icon: Shield
    },
    {
      key: 'digitalSkillsTraining',
      label: 'Digital Skills Training',
      description: 'Technology training and capability building',
      icon: Server
    },
    {
      key: 'systemIntegrationPlanning',
      label: 'System Integration Planning',
      description: 'Integration strategy for new and existing systems',
      icon: Server
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <Server className="w-6 h-6 mr-3 text-purple-600" />
          Technology Roadmap
        </h2>
        <p className="text-gray-600">Plan your technology infrastructure and capabilities development</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {technologyAreas.map((area) => {
          const Icon = area.icon;
          
          return (
            <div key={area.key} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-start mb-3">
                <Icon className="w-5 h-5 text-purple-600 mr-2 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900">{area.label}</h4>
                  <p className="text-xs text-gray-600 mt-1">{area.description}</p>
                </div>
              </div>
              
              <select
                value={data.technologyRoadmap[area.key as keyof typeof data.technologyRoadmap]}
                onChange={(e) => handleTechChange(area.key, parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
              >
                {FUTURE_SCORING_OPTIONS.MATURITY_LEVEL.map((option) => (
                  <option key={option.score} value={option.score}>
                    {option.score} - {option.description}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>

      {/* Technology Score Display */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-purple-900">Technology Roadmap Score</h3>
          <div className="text-2xl font-bold text-purple-600">
            {scores.technologyRoadmap}/40
          </div>
        </div>
        
        <div className="text-sm text-purple-700">
          <p className="mb-2">Your technology planning maturity and implementation readiness.</p>
          <p>Higher scores indicate more comprehensive and structured technology strategies.</p>
        </div>

        <div className="mt-4 w-full bg-purple-200 rounded-full h-2">
          <div 
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(scores.technologyRoadmap / 40) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default FutureStep3Technology;
