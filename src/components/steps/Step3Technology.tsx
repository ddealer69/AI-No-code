import React from 'react';
import { Server, Wifi, Database, Shield } from 'lucide-react';
import { CurrentStateAnalysis, ScoreBreakdown, SCORING_OPTIONS } from '../../types/currentStateAnalysis';

interface Step3Props {
  data: CurrentStateAnalysis;
  updateData: (section: string, data: any) => void;
  scores: ScoreBreakdown;
}

const Step3Technology: React.FC<Step3Props> = ({ data, updateData, scores }) => {
  const handleTechSystemChange = (field: string, value: number) => {
    updateData('technologySystems', { [field]: value });
  };

  const handleDataReadinessChange = (field: string, value: number) => {
    updateData('dataReadiness', { [field]: value });
  };

  const technologyQuestions = [
    {
      key: 'productionDataTracking',
      label: 'Production Data Tracking',
      description: 'How well does your system track production metrics?',
      icon: Database
    },
    {
      key: 'machinesNetworked',
      label: 'Equipment Connectivity',
      description: 'Are your machines/equipment connected to networks?',
      icon: Wifi
    },
    {
      key: 'qualityInspections',
      label: 'Quality Control Systems',
      description: 'How automated are your quality inspections?',
      icon: Shield
    },
    {
      key: 'maintenanceType',
      label: 'Maintenance Management',
      description: 'How do you manage equipment maintenance?',
      icon: Server
    },
    {
      key: 'inventoryManagement',
      label: 'Inventory Management',
      description: 'How sophisticated is your inventory tracking?',
      icon: Package
    },
    {
      key: 'existingAutomation',
      label: 'Current Automation Level',
      description: 'What is your overall automation level?',
      icon: Settings
    },
    {
      key: 'digitalRecords',
      label: 'Digital Record Keeping',
      description: 'How digitized are your business records?',
      icon: FileText
    },
    {
      key: 'overallDigitalMaturity',
      label: 'Overall Digital Maturity',
      description: 'How would you rate your digital transformation?',
      icon: TrendingUp
    }
  ];

  const dataReadinessQuestions = [
    {
      key: 'dataAvailability',
      label: 'Data Availability',
      description: 'How much relevant data do you currently collect?',
      options: SCORING_OPTIONS.DATA_AVAILABILITY
    },
    {
      key: 'dataQuality',
      label: 'Data Quality',
      description: 'How accurate and consistent is your data?',
      options: SCORING_OPTIONS.DATA_QUALITY
    },
    {
      key: 'dataInfrastructure',
      label: 'Data Infrastructure',
      description: 'How robust is your data storage and processing?',
      options: SCORING_OPTIONS.DATA_INFRASTRUCTURE
    },
    {
      key: 'dataGovernance',
      label: 'Data Governance',
      description: 'How well-managed are your data policies and access?',
      options: SCORING_OPTIONS.DATA_GOVERNANCE
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <Server className="w-6 h-6 mr-3 text-blue-600" />
          Technology Systems & Data Infrastructure
        </h2>
        <p className="text-gray-600">Assess your current technology capabilities and data management practices</p>
      </div>

      {/* Technology Systems */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Server className="w-5 h-5 mr-2 text-blue-600" />
          Technology Systems Assessment
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {technologyQuestions.map((question) => (
            <div key={question.key} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-start mb-3">
                <question.icon className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900">{question.label}</h4>
                  <p className="text-xs text-gray-600 mt-1">{question.description}</p>
                </div>
              </div>
              
              <select
                value={data.technologySystems[question.key as keyof typeof data.technologySystems]}
                onChange={(e) => handleTechSystemChange(question.key, parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                {SCORING_OPTIONS.GENERAL_5_POINT.map((option) => (
                  <option key={option.score} value={option.score}>
                    {option.score} - {option.description}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Data Readiness */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Database className="w-5 h-5 mr-2 text-blue-600" />
          Data Readiness Assessment
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dataReadinessQuestions.map((question) => (
            <div key={question.key} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="mb-3">
                <h4 className="text-sm font-semibold text-gray-900">{question.label}</h4>
                <p className="text-xs text-gray-600 mt-1">{question.description}</p>
              </div>
              
              <select
                value={data.dataReadiness[question.key as keyof typeof data.dataReadiness]}
                onChange={(e) => handleDataReadinessChange(question.key, parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                {question.options.map((option) => (
                  <option key={option.score} value={option.score}>
                    {option.score} - {option.description}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Current Technology Score Display */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-blue-900">Technology Readiness Score</h3>
          <div className="text-2xl font-bold text-blue-600">
            {(scores.technologySystems + scores.dataReadiness)}/60
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Technology Systems</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-blue-700">Production Data Tracking:</span>
                <span className="font-medium">{data.technologySystems.productionDataTracking}/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Equipment Connectivity:</span>
                <span className="font-medium">{data.technologySystems.machinesNetworked}/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Quality Control:</span>
                <span className="font-medium">{data.technologySystems.qualityInspections}/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Maintenance Management:</span>
                <span className="font-medium">{data.technologySystems.maintenanceType}/5</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Data Readiness</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-blue-700">Data Availability:</span>
                <span className="font-medium">{data.dataReadiness.dataAvailability}/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Data Quality:</span>
                <span className="font-medium">{data.dataReadiness.dataQuality}/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Data Infrastructure:</span>
                <span className="font-medium">{data.dataReadiness.dataInfrastructure}/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Data Governance:</span>
                <span className="font-medium">{data.dataReadiness.dataGovernance}/5</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 w-full bg-blue-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((scores.technologySystems + scores.dataReadiness) / 60) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="text-yellow-600 mr-3 mt-0.5">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-yellow-900 mb-1">Scoring Guide</h4>
            <p className="text-sm text-yellow-700">
              Higher scores indicate better AI readiness. Technology systems and data quality are crucial foundations for successful AI implementation.
              Focus on areas with low scores for maximum improvement potential.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Missing imports - add these at the top
import { Package, Settings, FileText, TrendingUp } from 'lucide-react';

export default Step3Technology;
