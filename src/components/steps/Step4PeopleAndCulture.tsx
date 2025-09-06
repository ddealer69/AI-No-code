import React from 'react';
import { Users, GraduationCap, Lightbulb } from 'lucide-react';
import { CurrentStateAnalysis, ScoreBreakdown, SCORING_OPTIONS } from '../../types/currentStateAnalysis';

interface Step4Props {
  data: CurrentStateAnalysis;
  updateData: (section: string, data: any) => void;
  scores: ScoreBreakdown;
}

const Step4PeopleAndCulture: React.FC<Step4Props> = ({ data, updateData, scores }) => {
  const handleWorkforceChange = (field: string, value: number) => {
    updateData('workforceSkills', { [field]: value });
  };

  const handleStrategicChange = (field: string, value: number) => {
    updateData('strategicAlignment', { [field]: value });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <Users className="w-6 h-6 mr-3 text-blue-600" />
          People & Culture Assessment
        </h2>
        <p className="text-gray-600">Evaluate your workforce readiness and organizational alignment for AI adoption</p>
      </div>

      {/* Workforce Skills */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
          Workforce Digital Skills
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-gray-900">Digital Tool Usage</h4>
              <p className="text-xs text-gray-600 mt-1">How comfortable are operators with digital tools?</p>
            </div>
            <select
              value={data.workforceSkills.operatorDigitalUse}
              onChange={(e) => handleWorkforceChange('operatorDigitalUse', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              {SCORING_OPTIONS.GENERAL_5_POINT.map((option) => (
                <option key={option.score} value={option.score}>
                  {option.score} - {option.description}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-gray-900">Training Availability</h4>
              <p className="text-xs text-gray-600 mt-1">How available is technology training?</p>
            </div>
            <select
              value={data.workforceSkills.techTrainingAvailability}
              onChange={(e) => handleWorkforceChange('techTrainingAvailability', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              {SCORING_OPTIONS.GENERAL_5_POINT.map((option) => (
                <option key={option.score} value={option.score}>
                  {option.score} - {option.description}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-gray-900">Openness to Change</h4>
              <p className="text-xs text-gray-600 mt-1">How receptive is the team to new technology?</p>
            </div>
            <select
              value={data.workforceSkills.opennessToNewTech}
              onChange={(e) => handleWorkforceChange('opennessToNewTech', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              {SCORING_OPTIONS.GENERAL_5_POINT.map((option) => (
                <option key={option.score} value={option.score}>
                  {option.score} - {option.description}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Strategic Alignment */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2 text-blue-600" />
          Strategic Alignment
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-gray-900">AI in Business Strategy</h4>
              <p className="text-xs text-gray-600 mt-1">How integrated is AI in your strategic planning?</p>
            </div>
            <select
              value={data.strategicAlignment.aiInBusinessStrategy}
              onChange={(e) => handleStrategicChange('aiInBusinessStrategy', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              {SCORING_OPTIONS.GENERAL_5_POINT.map((option) => (
                <option key={option.score} value={option.score}>
                  {option.score} - {option.description}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-gray-900">Leadership Buy-in</h4>
              <p className="text-xs text-gray-600 mt-1">How supportive is leadership of AI initiatives?</p>
            </div>
            <select
              value={data.strategicAlignment.leadershipBuyIn}
              onChange={(e) => handleStrategicChange('leadershipBuyIn', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              {SCORING_OPTIONS.GENERAL_5_POINT.map((option) => (
                <option key={option.score} value={option.score}>
                  {option.score} - {option.description}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-gray-900">AI Understanding</h4>
              <p className="text-xs text-gray-600 mt-1">How well does the organization understand AI?</p>
            </div>
            <select
              value={data.strategicAlignment.aiUnderstanding}
              onChange={(e) => handleStrategicChange('aiUnderstanding', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              {SCORING_OPTIONS.GENERAL_5_POINT.map((option) => (
                <option key={option.score} value={option.score}>
                  {option.score} - {option.description}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-gray-900">Willingness to Change</h4>
              <p className="text-xs text-gray-600 mt-1">How ready is the organization for process changes?</p>
            </div>
            <select
              value={data.strategicAlignment.willingnessToChange}
              onChange={(e) => handleStrategicChange('willingnessToChange', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              {SCORING_OPTIONS.GENERAL_5_POINT.map((option) => (
                <option key={option.score} value={option.score}>
                  {option.score} - {option.description}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Current Scores Display */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-green-900">People & Culture Score</h3>
          <div className="text-2xl font-bold text-green-600">
            {(scores.workforceSkills + scores.strategicAlignment)}/35
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-green-900 mb-2">Workforce Skills</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-green-700">Digital Tool Usage:</span>
                <span className="font-medium">{data.workforceSkills.operatorDigitalUse}/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Training Availability:</span>
                <span className="font-medium">{data.workforceSkills.techTrainingAvailability}/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Openness to Change:</span>
                <span className="font-medium">{data.workforceSkills.opennessToNewTech}/5</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-green-900 mb-2">Strategic Alignment</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-green-700">AI in Strategy:</span>
                <span className="font-medium">{data.strategicAlignment.aiInBusinessStrategy}/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Leadership Buy-in:</span>
                <span className="font-medium">{data.strategicAlignment.leadershipBuyIn}/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">AI Understanding:</span>
                <span className="font-medium">{data.strategicAlignment.aiUnderstanding}/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Willingness to Change:</span>
                <span className="font-medium">{data.strategicAlignment.willingnessToChange}/5</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 w-full bg-green-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((scores.workforceSkills + scores.strategicAlignment) / 35) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Step4PeopleAndCulture;
