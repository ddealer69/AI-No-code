import React from 'react';
import { Target, Lightbulb, Globe, Zap } from 'lucide-react';
import { FutureStateAnalysis, FutureScoreBreakdown } from '../../types/futureStateAnalysis';

interface FutureStep1Props {
  data: FutureStateAnalysis;
  updateData: (section: string, data: any) => void;
  scores: FutureScoreBreakdown;
}

const FutureStep1Vision: React.FC<FutureStep1Props> = ({ data, updateData }) => {
  const handleVisionChange = (field: string, value: string) => {
    updateData('companyVision', { [field]: value });
  };

  const timeframeOptions = [
    '6 months',
    '1 year',
    '2 years',
    '3-5 years',
    '5+ years'
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <Target className="w-6 h-6 mr-3 text-purple-600" />
          Vision & Strategic Goals
        </h2>
        <p className="text-gray-600">Define your organization's future vision and strategic objectives</p>
      </div>

      {/* Vision Statement */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2 text-purple-600" />
          Vision Statement
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Vision Statement
          </label>
          <textarea
            value={data.companyVision.visionStatement}
            onChange={(e) => handleVisionChange('visionStatement', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Describe your organization's long-term vision and aspirational goals..."
          />
        </div>
      </div>

      {/* Strategic Goals */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-purple-600" />
          Strategic Objectives
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strategic Goals */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Strategic Goals
            </label>
            <textarea
              value={data.companyVision.strategicGoals}
              onChange={(e) => handleVisionChange('strategicGoals', e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="List your key strategic goals and objectives..."
            />
          </div>

          {/* Timeframe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Implementation Timeframe
            </label>
            <select
              value={data.companyVision.timeframe}
              onChange={(e) => handleVisionChange('timeframe', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 mb-4"
            >
              <option value="">Select timeframe</option>
              {timeframeOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>

            <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">
              Target Markets & Customers
            </label>
            <textarea
              value={data.companyVision.targetMarkets}
              onChange={(e) => handleVisionChange('targetMarkets', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Describe your target markets and customer segments..."
            />
          </div>

          {/* Competitive Advantage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Competitive Advantage
            </label>
            <textarea
              value={data.companyVision.competitiveAdvantage}
              onChange={(e) => handleVisionChange('competitiveAdvantage', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="How will AI/automation give you competitive advantage?"
            />
          </div>

          {/* Digital Transformation Goals */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Digital Transformation Goals
            </label>
            <textarea
              value={data.companyVision.digitalTransformationGoals}
              onChange={(e) => handleVisionChange('digitalTransformationGoals', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Specific digital transformation and AI implementation goals..."
            />
          </div>
        </div>
      </div>

      {/* Guidance Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="text-blue-600 mr-3 mt-0.5">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">Vision Planning Guide</h4>
            <p className="text-sm text-blue-700">
              A clear vision statement should be inspiring, memorable, and achievable. Focus on the transformational 
              impact you want to achieve through AI and digital technologies. Consider how your vision aligns with 
              market trends, customer needs, and your organization's core capabilities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FutureStep1Vision;
