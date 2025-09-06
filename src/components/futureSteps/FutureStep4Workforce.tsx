import React from 'react';
import { Users, GraduationCap } from 'lucide-react';
import { FutureStateAnalysis, FutureScoreBreakdown, FUTURE_SCORING_OPTIONS } from '../../types/futureStateAnalysis';

interface FutureStep4Props {
  data: FutureStateAnalysis;
  updateData: (section: string, data: any) => void;
  scores: FutureScoreBreakdown;
}

const FutureStep4Workforce: React.FC<FutureStep4Props> = ({ data, updateData, scores }) => {
  const handleWorkforceChange = (field: string, value: number) => {
    updateData('futureWorkforce', { [field]: value });
  };

  const workforceAreas = [
    {
      key: 'skillDevelopmentPlans',
      label: 'Skill Development Plans',
      description: 'Comprehensive training and upskilling strategies'
    },
    {
      key: 'roleEvolutionStrategy',
      label: 'Role Evolution Strategy',
      description: 'How job roles will evolve with AI implementation'
    },
    {
      key: 'changeManagementApproach',
      label: 'Change Management Approach',
      description: 'Strategy for managing organizational change'
    },
    {
      key: 'trainingInvestment',
      label: 'Training Investment Level',
      description: 'Commitment to workforce development'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <Users className="w-6 h-6 mr-3 text-purple-600" />
          Future Workforce Planning
        </h2>
        <p className="text-gray-600">Plan your workforce transformation and capability development</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {workforceAreas.map((area) => (
          <div key={area.key} className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-gray-900">{area.label}</h4>
              <p className="text-xs text-gray-600 mt-1">{area.description}</p>
            </div>
            
            <select
              value={data.futureWorkforce[area.key as keyof typeof data.futureWorkforce]}
              onChange={(e) => handleWorkforceChange(area.key, parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
            >
              {FUTURE_SCORING_OPTIONS.MATURITY_LEVEL.map((option) => (
                <option key={option.score} value={option.score}>
                  {option.score} - {option.description}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-green-900 flex items-center">
            <GraduationCap className="w-5 h-5 mr-2" />
            Workforce Readiness Score
          </h3>
          <div className="text-2xl font-bold text-green-600">
            {scores.futureWorkforce}/20
          </div>
        </div>
      </div>
    </div>
  );
};

export default FutureStep4Workforce;
