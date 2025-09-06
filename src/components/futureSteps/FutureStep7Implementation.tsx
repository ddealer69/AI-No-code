import React from 'react';
import { Rocket } from 'lucide-react';
import { FutureStateAnalysis, FutureScoreBreakdown, FUTURE_SCORING_OPTIONS } from '../../types/futureStateAnalysis';

const FutureStep7Implementation: React.FC<{
  data: FutureStateAnalysis;
  updateData: (section: string, data: any) => void;
  scores: FutureScoreBreakdown;
}> = ({ data, updateData }) => {
  const handleChange = (field: string, value: number) => {
    updateData('implementationStrategy', { [field]: value });
  };

  const phases = [
    { key: 'phaseOneActivities', label: 'Phase 1 Activities (0-6 months)' },
    { key: 'phaseTwoActivities', label: 'Phase 2 Activities (6-12 months)' },
    { key: 'phaseThreeActivities', label: 'Phase 3 Activities (12+ months)' },
    { key: 'pilotProgramApproach', label: 'Pilot Program Approach' },
    { key: 'changeManagementStrategy', label: 'Change Management Strategy' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <Rocket className="w-6 h-6 mr-3 text-purple-600" />
          Implementation Strategy
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {phases.map((phase) => (
          <div key={phase.key} className="bg-white rounded-lg p-4 border">
            <h4 className="font-semibold mb-2">{phase.label}</h4>
            <select
              value={data.implementationStrategy[phase.key as keyof typeof data.implementationStrategy]}
              onChange={(e) => handleChange(phase.key, parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              {FUTURE_SCORING_OPTIONS.IMPLEMENTATION_READINESS.map((option) => (
                <option key={option.score} value={option.score}>
                  {option.score} - {option.description}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FutureStep7Implementation;
