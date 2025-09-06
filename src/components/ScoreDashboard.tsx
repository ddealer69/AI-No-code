import React from 'react';
import { TrendingUp, Target, AlertCircle, CheckCircle } from 'lucide-react';
import { ScoreBreakdown } from '../types/currentStateAnalysis';

interface ScoreDashboardProps {
  scores: ScoreBreakdown;
}

const ScoreDashboard: React.FC<ScoreDashboardProps> = ({ scores }) => {
  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'Very high potential':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'High potential':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Low potential':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-blue-600 bg-blue-100';
    if (percentage >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const scoreCategories = [
    { 
      name: 'Technology Systems', 
      score: scores.technologySystems, 
      maxScore: 40,
      icon: TrendingUp 
    },
    { 
      name: 'Workforce Skills', 
      score: scores.workforceSkills, 
      maxScore: 15,
      icon: Target 
    },
    { 
      name: 'Pain Points', 
      score: scores.painPoints, 
      maxScore: 70,
      icon: AlertCircle 
    },
    { 
      name: 'Productivity Metrics', 
      score: scores.productivityMetrics, 
      maxScore: 17,
      icon: TrendingUp 
    },
    { 
      name: 'Automation Potential', 
      score: scores.automationPotential, 
      maxScore: 25,
      icon: Target 
    },
    { 
      name: 'Data Readiness', 
      score: scores.dataReadiness, 
      maxScore: 20,
      icon: CheckCircle 
    },
    { 
      name: 'Strategic Alignment', 
      score: scores.strategicAlignment, 
      maxScore: 20,
      icon: Target 
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
        Live Score Dashboard
      </h3>

      {/* Total Score */}
      <div className={`p-4 rounded-lg border-2 mb-6 ${getOutcomeColor(scores.outcome)}`}>
        <div className="text-center">
          <div className="text-3xl font-bold mb-1">
            {scores.total}/300
          </div>
          <div className="text-sm font-medium">
            {scores.outcome}
          </div>
        </div>
        <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-current h-2 rounded-full transition-all duration-500"
            style={{ width: `${(scores.total / 300) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Category Scores */}
      <div className="space-y-3">
        {scoreCategories.map((category, index) => {
          const Icon = category.icon;
          const percentage = (category.score / category.maxScore) * 100;
          
          return (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3 flex-1">
                <Icon className="w-4 h-4 text-gray-500" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {category.name}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                    <div 
                      className={`h-1 rounded-full transition-all duration-300 ${
                        percentage >= 80 ? 'bg-green-500' :
                        percentage >= 60 ? 'bg-blue-500' :
                        percentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className={`text-xs font-semibold px-2 py-1 rounded ${getScoreColor(category.score, category.maxScore)}`}>
                {category.score}/{category.maxScore}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recommendations */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Quick Recommendations</h4>
        <div className="text-xs text-gray-600 space-y-1">
          {scores.total < 120 && (
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
              <span>Focus on addressing major pain points and improving technology infrastructure</span>
            </div>
          )}
          {scores.technologySystems < 20 && (
            <div className="flex items-start space-x-2">
              <TrendingUp className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
              <span>Consider investing in digital systems and automation tools</span>
            </div>
          )}
          {scores.workforceSkills < 8 && (
            <div className="flex items-start space-x-2">
              <Target className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
              <span>Training programs needed for workforce digital readiness</span>
            </div>
          )}
          {scores.total >= 180 && (
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Excellent foundation for AI implementation!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScoreDashboard;
