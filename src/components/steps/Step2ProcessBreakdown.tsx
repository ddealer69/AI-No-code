import React from 'react';
import { Package2, Layers, Settings2 } from 'lucide-react';
import { CurrentStateAnalysis, ScoreBreakdown, SCORING_OPTIONS } from '../../types/currentStateAnalysis';

interface Step2Props {
  data: CurrentStateAnalysis;
  updateData: (section: string, data: any) => void;
  scores: ScoreBreakdown;
}

const Step2ProcessBreakdown: React.FC<Step2Props> = ({ data, updateData }) => {
  const handleRawMaterialChange = (field: string, value: string | number) => {
    updateData('rawMaterialProcess', { [field]: value });
  };

  const handleProductionChange = (stage: 'stage1' | 'stage2', field: string, value: string | number) => {
    updateData('productionProcess', {
      [stage]: { ...data.productionProcess[stage], [field]: value }
    });
  };

  const batchSizeOptions = [
    'Small (1-100 units)',
    'Medium (101-1000 units)',
    'Large (1001-10000 units)',
    'Very Large (10000+ units)'
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <Layers className="w-6 h-6 mr-3 text-blue-600" />
          Process Breakdown
        </h2>
        <p className="text-gray-600">Describe the specific stages and materials involved in your process</p>
      </div>

      {/* Raw Material Receipt Process */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Package2 className="w-5 h-5 mr-2 text-blue-600" />
          Raw Material / Input Process
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Units in Batch */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Units in Each Batch
            </label>
            <input
              type="number"
              min="0"
              value={data.rawMaterialProcess.unitsInBatch}
              onChange={(e) => handleRawMaterialChange('unitsInBatch', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 100"
            />
          </div>

          {/* Batch Size Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Batch Size Category
            </label>
            <select
              value={data.rawMaterialProcess.batchSize}
              onChange={(e) => handleRawMaterialChange('batchSize', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select batch size</option>
              {batchSizeOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Unit Specifics */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unit Description
            </label>
            <input
              type="text"
              value={data.rawMaterialProcess.unitSpecifics}
              onChange={(e) => handleRawMaterialChange('unitSpecifics', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., widgets, documents, orders"
            />
          </div>
        </div>
      </div>

      {/* Production Process Stages */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Settings2 className="w-5 h-5 mr-2 text-blue-600" />
          Production Process Stages
        </h3>

        <div className="space-y-8">
          {/* Stage 1 */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h4 className="text-md font-semibold text-gray-800 mb-4">Stage 1</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equipment/System Name
                </label>
                <input
                  type="text"
                  value={data.productionProcess.stage1.equipmentName}
                  onChange={(e) => handleProductionChange('stage1', 'equipmentName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Assembly Line A, Order System"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Automation Level (1-5)
                </label>
                <select
                  value={data.productionProcess.stage1.automationLevel}
                  onChange={(e) => handleProductionChange('stage1', 'automationLevel', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {SCORING_OPTIONS.AUTOMATION_LEVEL.map((option) => (
                    <option key={option.score} value={option.score}>
                      {option.score} - {option.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Collection (1-5)
                </label>
                <select
                  value={data.productionProcess.stage1.dataCollected}
                  onChange={(e) => handleProductionChange('stage1', 'dataCollected', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {SCORING_OPTIONS.DATA_COLLECTION.map((option) => (
                    <option key={option.score} value={option.score}>
                      {option.score} - {option.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Stage 2 */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h4 className="text-md font-semibold text-gray-800 mb-4">Stage 2</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equipment/System Name
                </label>
                <input
                  type="text"
                  value={data.productionProcess.stage2.equipmentName}
                  onChange={(e) => handleProductionChange('stage2', 'equipmentName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Quality Check Station, Approval System"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Automation Level (1-5)
                </label>
                <select
                  value={data.productionProcess.stage2.automationLevel}
                  onChange={(e) => handleProductionChange('stage2', 'automationLevel', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {SCORING_OPTIONS.AUTOMATION_LEVEL.map((option) => (
                    <option key={option.score} value={option.score}>
                      {option.score} - {option.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Collection (1-5)
                </label>
                <select
                  value={data.productionProcess.stage2.dataCollected}
                  onChange={(e) => handleProductionChange('stage2', 'dataCollected', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {SCORING_OPTIONS.DATA_COLLECTION.map((option) => (
                    <option key={option.score} value={option.score}>
                      {option.score} - {option.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="text-blue-600 mr-3 mt-0.5">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">Automation Level Guide</h4>
              <p className="text-sm text-blue-700">
                1: Fully manual, 2: Some tools, 3: Semi-automated with human oversight, 4: Mostly automated, 5: Fully automated
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="text-green-600 mr-3 mt-0.5">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-green-900 mb-1">Data Collection Guide</h4>
              <p className="text-sm text-green-700">
                1: No data collected, 2: Manual logs, 3: Some digital records, 4: Mostly digital, 5: Real-time automated data
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2ProcessBreakdown;
