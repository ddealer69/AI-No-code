import React from 'react';
import { AlertTriangle, TrendingDown, DollarSign } from 'lucide-react';
import { CurrentStateAnalysis, ScoreBreakdown, SCORING_OPTIONS } from '../../types/currentStateAnalysis';

interface Step5Props {
  data: CurrentStateAnalysis;
  updateData: (section: string, data: any) => void;
  scores: ScoreBreakdown;
}

const Step5PainPoints: React.FC<Step5Props> = ({ data, updateData, scores }) => {
  const handlePainPointChange = (field: string, scoreValue: number, absoluteValue: string) => {
    updateData('painPoints', { 
      [field]: { 
        score: scoreValue, 
        absoluteValue: absoluteValue || data.painPoints[field as keyof typeof data.painPoints].absoluteValue 
      } 
    });
  };

  const painPointCategories = [
    { key: 'defectRates', label: 'Defect Rates', icon: AlertTriangle },
    { key: 'inconsistentQuality', label: 'Inconsistent Quality', icon: TrendingDown },
    { key: 'materialWaste', label: 'Material Waste', icon: DollarSign },
    { key: 'schedulingDelays', label: 'Scheduling Delays', icon: AlertTriangle },
    { key: 'inventoryIssues', label: 'Inventory Issues', icon: TrendingDown },
    { key: 'laborShortages', label: 'Labor Shortages', icon: AlertTriangle },
    { key: 'safetyIncidents', label: 'Safety Incidents', icon: AlertTriangle },
    { key: 'energyCosts', label: 'Energy Costs', icon: DollarSign },
    { key: 'lackVisibility', label: 'Lack of Visibility', icon: TrendingDown },
    { key: 'manualDataEntry', label: 'Manual Data Entry', icon: AlertTriangle },
    { key: 'interdeptCommunication', label: 'Interdept Communication', icon: TrendingDown },
    { key: 'vendorCommunication', label: 'Vendor Communication', icon: TrendingDown },
    { key: 'cybersecurityRisks', label: 'Cybersecurity Risks', icon: AlertTriangle },
    { key: 'customerComplaints', label: 'Customer Complaints', icon: TrendingDown }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <AlertTriangle className="w-6 h-6 mr-3 text-red-600" />
          Pain Points Assessment
        </h2>
        <p className="text-gray-600">Identify and rate the severity of current business challenges</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {painPointCategories.map((category) => {
          const Icon = category.icon;
          const painPoint = data.painPoints[category.key as keyof typeof data.painPoints];
          
          return (
            <div key={category.key} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center mb-3">
                <Icon className="w-5 h-5 text-red-600 mr-2" />
                <h4 className="text-sm font-semibold text-gray-900">{category.label}</h4>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Severity Level</label>
                  <select
                    value={painPoint.score}
                    onChange={(e) => handlePainPointChange(category.key, parseInt(e.target.value), painPoint.absoluteValue)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {SCORING_OPTIONS.PAIN_POINT_SEVERITY.map((option) => (
                      <option key={option.score} value={option.score}>
                        {option.score} - {option.description}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Current Value/Description</label>
                  <input
                    type="text"
                    value={painPoint.absoluteValue}
                    onChange={(e) => handlePainPointChange(category.key, painPoint.score, e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 5% defect rate, $10k/month waste"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pain Points Score Display */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-red-900">Pain Points Score</h3>
          <div className="text-2xl font-bold text-red-600">
            {scores.painPoints}/70
          </div>
        </div>
        
        <div className="text-sm text-red-700">
          <p className="mb-2">Higher scores indicate more severe problems that AI could potentially solve.</p>
          <p>Focus on the highest-scoring pain points for maximum AI implementation impact.</p>
        </div>

        <div className="mt-4 w-full bg-red-200 rounded-full h-2">
          <div 
            className="bg-red-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(scores.painPoints / 70) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Step5PainPoints;
