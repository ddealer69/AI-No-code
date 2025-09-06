import React from 'react';
import { Target, TrendingUp, Zap, CheckCircle, AlertCircle, Rocket } from 'lucide-react';
import { FutureScoreBreakdown } from '../types/futureStateAnalysis';

interface FutureScoreDashboardProps {
  scores: FutureScoreBreakdown;
}

const FutureScoreDashboard: React.FC<FutureScoreDashboardProps> = ({ scores }) => {
  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'Comprehensive transformation strategy':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Well-structured implementation plan':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Solid strategic foundation':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'Developing implementation roadmap':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-orange-600 bg-orange-50 border-orange-200';
    }
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-blue-600 bg-blue-100';
    if (percentage >= 40) return 'text-purple-600 bg-purple-100';
    return 'text-orange-600 bg-orange-100';
  };

  const scoreCategories = [
    { 
      name: 'Technology Roadmap', 
      score: scores.technologyRoadmap, 
      maxScore: 40,
      icon: TrendingUp 
    },
    { 
      name: 'Future Workforce', 
      score: scores.futureWorkforce, 
      maxScore: 20,
      icon: Target 
    },
    { 
      name: 'Business Impact', 
      score: scores.businessImpact, 
      maxScore: 60,
      icon: Zap 
    },
    { 
      name: 'Future Productivity', 
      score: scores.futureProductivity, 
      maxScore: 17,
      icon: TrendingUp 
    },
    { 
      name: 'Implementation Strategy', 
      score: scores.implementationStrategy, 
      maxScore: 25,
      icon: Rocket 
    },
    { 
      name: 'Investment Planning', 
      score: scores.investmentPlanning, 
      maxScore: 20,
      icon: CheckCircle 
    },
    { 
      name: 'Risk Management', 
      score: scores.riskManagement, 
      maxScore: 20,
      icon: AlertCircle 
    }
  ];

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'Comprehensive transformation strategy':
        return <Rocket className="w-6 h-6 text-green-600" />;
      case 'Well-structured implementation plan':
        return <CheckCircle className="w-6 h-6 text-blue-600" />;
      case 'Solid strategic foundation':
        return <Target className="w-6 h-6 text-purple-600" />;
      case 'Developing implementation roadmap':
        return <TrendingUp className="w-6 h-6 text-yellow-600" />;
      default:
        return <AlertCircle className="w-6 h-6 text-orange-600" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8 border border-purple-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <Target className="w-5 h-5 mr-2 text-purple-600" />
        Future State Dashboard
      </h3>

      {/* Total Score */}
      <div className={`p-4 rounded-lg border-2 mb-6 ${getOutcomeColor(scores.outcome)}`}>
        <div className="text-center">
          <div className="flex items-center justify-center mb-3">
            {getOutcomeIcon(scores.outcome)}
          </div>
          <div className="text-2xl font-bold mb-1">
            {scores.total}/302
          </div>
          <div className="text-sm font-medium mb-3">
            {scores.outcome}
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min((scores.total / 302) * 100, 100)}%` }}
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
                        percentage >= 40 ? 'bg-purple-500' : 'bg-orange-500'
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

      {/* Strategic Insights */}
      <div className="mt-6 p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Strategic Insights</h4>
        <div className="text-xs text-gray-600 space-y-1">
          {scores.total >= 280 && (
            <div className="flex items-start space-x-2">
              <Rocket className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Ready for comprehensive AI transformation initiative!</span>
            </div>
          )}
          {scores.total >= 220 && scores.total < 280 && (
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
              <span>Strong strategic foundation - proceed with phased implementation</span>
            </div>
          )}
          {scores.total >= 160 && scores.total < 220 && (
            <div className="flex items-start space-x-2">
              <Target className="w-3 h-3 text-purple-500 mt-0.5 flex-shrink-0" />
              <span>Good planning base - refine strategy and secure resources</span>
            </div>
          )}
          {scores.total >= 100 && scores.total < 160 && (
            <div className="flex items-start space-x-2">
              <TrendingUp className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
              <span>Developing roadmap - focus on strategic alignment and planning</span>
            </div>
          )}
          {scores.total < 100 && (
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-3 h-3 text-orange-500 mt-0.5 flex-shrink-0" />
              <span>Early planning stage - develop comprehensive strategy first</span>
            </div>
          )}

          {/* Specific recommendations based on low scores */}
          {scores.investmentPlanning < 10 && (
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
              <span><strong>Investment:</strong> Develop detailed budget and ROI projections</span>
            </div>
          )}
          
          {scores.riskManagement < 10 && (
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
              <span><strong>Risk:</strong> Create comprehensive risk mitigation strategies</span>
            </div>
          )}
          
          {scores.implementationStrategy < 15 && (
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
              <span><strong>Implementation:</strong> Structure detailed phased approach</span>
            </div>
          )}
        </div>
      </div>

      {/* Readiness Indicator */}
      <div className="mt-4 text-center">
        <div className="text-xs text-gray-500 mb-1">Transformation Readiness</div>
        <div className="flex justify-center space-x-1">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className={`w-4 h-2 rounded-full ${
                scores.total >= level * 60 
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500' 
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FutureScoreDashboard;
