import React from 'react';
import { Bot, RefreshCw, Zap } from 'lucide-react';
import { CurrentStateAnalysis, ScoreBreakdown, SCORING_OPTIONS } from '../../types/currentStateAnalysis';

interface Step7Props {
  data: CurrentStateAnalysis;
  updateData: (section: string, data: any) => void;
  scores: ScoreBreakdown;
}

const Step7AutomationPotential: React.FC<Step7Props> = ({ data, updateData, scores }) => {
  const handleAutomationChange = (field: string, value: number) => {
    updateData('automationPotential', { [field]: value });
  };

  const automationCategories = [
    {
      key: 'repetitiveTasks',
      label: 'Repetitive Tasks',
      description: 'How many repetitive, rule-based tasks are in this process?',
      icon: RefreshCw
    },
    {
      key: 'dataIntensiveProcesses',
      label: 'Data-Intensive Processes',
      description: 'How much of the process involves analyzing or processing data?',
      icon: Bot
    },
    {
      key: 'ruleBasedDecisions',
      label: 'Rule-Based Decisions',
      description: 'How many decisions follow clear, logical rules?',
      icon: Zap
    },
    {
      key: 'personalizedInteractions',
      label: 'Personalized Interactions',
      description: 'How much personalization or customization is required?',
      icon: Bot
    },
    {
      key: 'qualityControl',
      label: 'Quality Control Potential',
      description: 'How suitable is this process for automated quality control?',
      icon: RefreshCw
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <Bot className="w-6 h-6 mr-3 text-purple-600" />
          Automation Potential Assessment
        </h2>
        <p className="text-gray-600">Evaluate how suitable your process is for AI and automation implementation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {automationCategories.map((category) => {
          const Icon = category.icon;
          
          return (
            <div key={category.key} className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-start mb-4">
                <Icon className="w-6 h-6 text-purple-600 mr-3 mt-1" />
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{category.label}</h4>
                  <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                </div>
              </div>
              
              <select
                value={data.automationPotential[category.key as keyof typeof data.automationPotential]}
                onChange={(e) => handleAutomationChange(category.key, parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {SCORING_OPTIONS.GENERAL_5_POINT.map((option) => (
                  <option key={option.score} value={option.score}>
                    {option.score} - {option.description}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>

      {/* Automation Readiness Summary */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-purple-900">Automation Potential Score</h3>
          <div className="text-2xl font-bold text-purple-600">
            {scores.automationPotential}/25
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-purple-900 mb-2">High Automation Potential</h4>
            <div className="space-y-1">
              {automationCategories.map((category) => {
                const score = data.automationPotential[category.key as keyof typeof data.automationPotential];
                return (
                  <div key={category.key} className="flex justify-between">
                    <span className="text-purple-700">{category.label}:</span>
                    <span className={`font-medium ${score >= 4 ? 'text-green-600' : score >= 3 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {score}/5
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-purple-900 mb-2">Recommendations</h4>
            <div className="text-purple-700 space-y-2">
              {scores.automationPotential >= 20 && (
                <p className="text-sm">✅ Excellent automation potential - proceed with AI implementation</p>
              )}
              {scores.automationPotential >= 15 && scores.automationPotential < 20 && (
                <p className="text-sm">⚡ Good automation potential - focus on highest-scoring areas</p>
              )}
              {scores.automationPotential >= 10 && scores.automationPotential < 15 && (
                <p className="text-sm">⚠️ Moderate potential - consider process optimization first</p>
              )}
              {scores.automationPotential < 10 && (
                <p className="text-sm">🔄 Limited potential - focus on standardizing processes</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 w-full bg-purple-200 rounded-full h-2">
          <div 
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(scores.automationPotential / 25) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Automation Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="text-blue-600 mr-3 mt-0.5">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">Automation Scoring Guide</h4>
            <p className="text-sm text-blue-700">
              Rate each category based on how much of your process involves these characteristics. 
              Higher scores indicate better suitability for AI/automation implementation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step7AutomationPotential;
