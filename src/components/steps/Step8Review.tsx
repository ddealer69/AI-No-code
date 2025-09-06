import React from 'react';
import { CheckCircle, FileText, TrendingUp, AlertCircle } from 'lucide-react';
import { CurrentStateAnalysis, ScoreBreakdown } from '../../types/currentStateAnalysis';

interface Step8Props {
  data: CurrentStateAnalysis;
  updateData: (section: string, data: any) => void;
  scores: ScoreBreakdown;
}

const Step8Review: React.FC<Step8Props> = ({ data, scores }) => {
  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-blue-600 bg-blue-100';
    if (percentage >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'Very high potential':
        return <CheckCircle className="w-8 h-8 text-green-600" />;
      case 'High potential':
        return <TrendingUp className="w-8 h-8 text-blue-600" />;
      case 'Low potential':
        return <AlertCircle className="w-8 h-8 text-yellow-600" />;
      default:
        return <AlertCircle className="w-8 h-8 text-red-600" />;
    }
  };

  const scoreCategories = [
    { 
      name: 'Technology Systems', 
      score: scores.technologySystems, 
      maxScore: 40,
      description: 'Current technology infrastructure and digital systems'
    },
    { 
      name: 'Workforce Skills', 
      score: scores.workforceSkills, 
      maxScore: 15,
      description: 'Employee digital literacy and change readiness'
    },
    { 
      name: 'Pain Points', 
      score: scores.painPoints, 
      maxScore: 70,
      description: 'Severity of current business challenges'
    },
    { 
      name: 'Productivity Metrics', 
      score: scores.productivityMetrics, 
      maxScore: 17,
      description: 'Current process performance and measurement'
    },
    { 
      name: 'Automation Potential', 
      score: scores.automationPotential, 
      maxScore: 25,
      description: 'Suitability for AI and automation implementation'
    },
    { 
      name: 'Data Readiness', 
      score: scores.dataReadiness, 
      maxScore: 20,
      description: 'Data quality, availability, and infrastructure'
    },
    { 
      name: 'Strategic Alignment', 
      score: scores.strategicAlignment, 
      maxScore: 20,
      description: 'Organizational readiness and leadership support'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <FileText className="w-6 h-6 mr-3 text-green-600" />
          Assessment Review & Results
        </h2>
        <p className="text-gray-600">Review your complete assessment and AI readiness analysis</p>
      </div>

      {/* Overall Score Card */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-8 border border-blue-200">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            {getOutcomeIcon(scores.outcome)}
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">
            {scores.total}/300
          </h3>
          <p className="text-xl font-semibold text-gray-700 mb-4">
            {scores.outcome}
          </p>
          <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                scores.total >= 240 ? 'bg-green-500' :
                scores.total >= 180 ? 'bg-blue-500' :
                scores.total >= 120 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${(scores.total / 300) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Company Summary */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Company & Process Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p><strong>Company:</strong> {data.companyInfo.companyName || 'Not provided'}</p>
            <p><strong>Location:</strong> {data.companyInfo.location || 'Not provided'}</p>
            <p><strong>Industry:</strong> {data.companyInfo.productionType || 'Not provided'}</p>
            <p><strong>Company Size:</strong> {data.companyInfo.companySize || 'Not provided'}</p>
          </div>
          <div>
            <p><strong>Process:</strong> {data.companyInfo.processName || 'Not provided'}</p>
            <p><strong>Sub-process:</strong> {data.companyInfo.subProcessName || 'Not provided'}</p>
            <p><strong>Employees:</strong> {data.companyInfo.numberOfEmployees}</p>
            <p><strong>Shifts:</strong> {data.companyInfo.numberOfShifts}</p>
          </div>
        </div>
      </div>

      {/* Detailed Score Breakdown */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Detailed Score Breakdown</h3>
        
        <div className="space-y-4">
          {scoreCategories.map((category, index) => {
            const percentage = (category.score / category.maxScore) * 100;
            
            return (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{category.name}</h4>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                  <div className={`text-lg font-bold px-3 py-1 rounded ${getScoreColor(category.score, category.maxScore)}`}>
                    {category.score}/{category.maxScore}
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      percentage >= 80 ? 'bg-green-500' :
                      percentage >= 60 ? 'bg-blue-500' :
                      percentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'
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

      {/* Recommendations */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-900 mb-4">Key Recommendations</h3>
        
        <div className="space-y-3 text-sm text-yellow-800">
          {scores.total >= 240 && (
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <p>Excellent AI readiness! You're ready to implement comprehensive AI solutions. Focus on pilot projects in your strongest areas.</p>
            </div>
          )}
          
          {scores.total >= 180 && scores.total < 240 && (
            <div className="flex items-start space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p>Good AI potential. Address any low-scoring areas and start with targeted AI implementations in your strongest categories.</p>
            </div>
          )}
          
          {scores.total >= 120 && scores.total < 180 && (
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <p>Limited AI potential. Focus on improving technology infrastructure and data quality before major AI investments.</p>
            </div>
          )}
          
          {scores.total < 120 && (
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p>Significant preparation needed. Invest in basic digitization, process standardization, and workforce training before considering AI.</p>
            </div>
          )}

          {/* Specific recommendations based on low scores */}
          {scores.technologySystems < 20 && (
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <p><strong>Technology:</strong> Invest in digital infrastructure and data collection systems.</p>
            </div>
          )}
          
          {scores.workforceSkills < 8 && (
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <p><strong>Workforce:</strong> Implement digital literacy training programs.</p>
            </div>
          )}
          
          {scores.dataReadiness < 10 && (
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <p><strong>Data:</strong> Improve data collection, quality, and governance practices.</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Next Steps</h3>
        
        <div className="text-sm text-blue-800 space-y-2">
          <p>1. <strong>Review</strong> the detailed breakdown above to understand your strengths and gaps</p>
          <p>2. <strong>Prioritize</strong> improvements in the lowest-scoring categories</p>
          <p>3. <strong>Plan</strong> your AI implementation strategy based on your readiness level</p>
          <p>4. <strong>Start</strong> with pilot projects in your highest-scoring areas</p>
          <p>5. <strong>Monitor</strong> progress and reassess periodically</p>
        </div>
      </div>
    </div>
  );
};

export default Step8Review;
