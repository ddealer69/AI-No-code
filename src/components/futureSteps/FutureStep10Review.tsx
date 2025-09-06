import React from 'react';
import { FileText, CheckCircle, Target, TrendingUp } from 'lucide-react';
import { FutureStateAnalysis, FutureScoreBreakdown } from '../../types/futureStateAnalysis';

const FutureStep10Review: React.FC<{
  data: FutureStateAnalysis;
  updateData: (section: string, data: any) => void;
  scores: FutureScoreBreakdown;
}> = ({ data, scores }) => {
  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-blue-600 bg-blue-100';
    if (percentage >= 40) return 'text-purple-600 bg-purple-100';
    return 'text-orange-600 bg-orange-100';
  };

  const scoreCategories = [
    { name: 'Technology Roadmap', score: scores.technologyRoadmap, maxScore: 40 },
    { name: 'Future Workforce', score: scores.futureWorkforce, maxScore: 20 },
    { name: 'Business Impact', score: scores.businessImpact, maxScore: 60 },
    { name: 'Future Productivity', score: scores.futureProductivity, maxScore: 17 },
    { name: 'Implementation Strategy', score: scores.implementationStrategy, maxScore: 25 },
    { name: 'Investment Planning', score: scores.investmentPlanning, maxScore: 20 },
    { name: 'Risk Management', score: scores.riskManagement, maxScore: 20 }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <FileText className="w-6 h-6 mr-3 text-purple-600" />
          Future State Review & Results
        </h2>
        <p className="text-gray-600">Review your future state planning and transformation strategy</p>
      </div>

      {/* Overall Score Card */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-8 border border-purple-200">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Target className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">
            {scores.total}/302
          </h3>
          <p className="text-xl font-semibold text-gray-700 mb-4">
            {scores.outcome}
          </p>
          <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((scores.total / 302) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Detailed Score Breakdown */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Detailed Planning Score Breakdown</h3>
        
        <div className="space-y-4">
          {scoreCategories.map((category, index) => {
            const percentage = (category.score / category.maxScore) * 100;
            
            return (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{category.name}</h4>
                  <div className={`text-lg font-bold px-3 py-1 rounded ${getScoreColor(category.score, category.maxScore)}`}>
                    {category.score}/{category.maxScore}
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      percentage >= 80 ? 'bg-green-500' :
                      percentage >= 60 ? 'bg-blue-500' :
                      percentage >= 40 ? 'bg-purple-500' : 'bg-orange-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                
                <div className="text-right text-sm text-gray-500 mt-1">
                  {percentage.toFixed(0)}% of maximum
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Next Steps</h3>
        
        <div className="text-sm text-blue-800 space-y-2">
          <p>1. <strong>Review</strong> the detailed breakdown above to understand your strategic planning maturity</p>
          <p>2. <strong>Prioritize</strong> improvements in the lowest-scoring categories</p>
          <p>3. <strong>Plan</strong> your transformation strategy based on your readiness level</p>
          <p>4. <strong>Start</strong> with pilot projects in your highest-scoring areas</p>
          <p>5. <strong>Monitor</strong> progress and reassess periodically</p>
        </div>
      </div>
    </div>
  );
};

export default FutureStep10Review;
