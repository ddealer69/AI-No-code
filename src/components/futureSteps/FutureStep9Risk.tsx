import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { FutureStateAnalysis, FutureScoreBreakdown, FUTURE_SCORING_OPTIONS } from '../../types/futureStateAnalysis';

const FutureStep9Risk: React.FC<{
  data: FutureStateAnalysis;
  updateData: (section: string, data: any) => void;
  scores: FutureScoreBreakdown;
}> = ({ data, updateData }) => {
  const handleChange = (field: string, value: number) => {
    updateData('riskManagement', { [field]: value });
  };

  const risks = [
    { key: 'technicalRisks', label: 'Technical Risks Assessment' },
    { key: 'organizationalRisks', label: 'Organizational Risks' },
    { key: 'marketRisks', label: 'Market Risks' },
    { key: 'mitigationStrategies', label: 'Mitigation Strategies' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <AlertTriangle className="w-6 h-6 mr-3 text-purple-600" />
          Risk Management
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {risks.map((risk) => (
          <div key={risk.key} className="bg-white rounded-lg p-4 border">
            <h4 className="font-semibold mb-2">{risk.label}</h4>
            <select
              value={data.riskManagement[risk.key as keyof typeof data.riskManagement]}
              onChange={(e) => handleChange(risk.key, parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
    </div>
  );
};

export default FutureStep9Risk;
