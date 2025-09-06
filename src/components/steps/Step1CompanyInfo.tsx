import React from 'react';
import { Building2, MapPin, Package, Users, Settings } from 'lucide-react';
import { CurrentStateAnalysis, ScoreBreakdown } from '../../types/currentStateAnalysis';

interface Step1Props {
  data: CurrentStateAnalysis;
  updateData: (section: string, data: any) => void;
  scores: ScoreBreakdown;
}

const Step1CompanyInfo: React.FC<Step1Props> = ({ data, updateData }) => {
  const handleInputChange = (field: string, value: string | number) => {
    updateData('companyInfo', { [field]: value });
  };

  const companySizeOptions = [
    'Small (1-50 employees)',
    'Medium (51-250 employees)', 
    'Large (251-1000 employees)',
    'Enterprise (1000+ employees)'
  ];

  const productionTypeOptions = [
    'Manufacturing',
    'Service Industry',
    'Retail',
    'Healthcare',
    'Technology',
    'Other'
  ];

  const supervisorRatioOptions = [
    '1:5 or better',
    '1:10',
    '1:15',
    '1:20',
    '1:25+',
    'No clear supervision structure'
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <Building2 className="w-6 h-6 mr-3 text-blue-600" />
          Company Information
        </h2>
        <p className="text-gray-600">Tell us about your company and the specific process you want to analyze</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Name
          </label>
          <input
            type="text"
            value={data.companyInfo.companyName}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter company name"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            Location
          </label>
          <input
            type="text"
            value={data.companyInfo.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="City, Country"
          />
        </div>

        {/* Primary Products */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Package className="w-4 h-4 mr-1" />
            Primary Products/Services
          </label>
          <textarea
            value={data.companyInfo.primaryProducts}
            onChange={(e) => handleInputChange('primaryProducts', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe your main products or services"
          />
        </div>

        {/* Company Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Users className="w-4 h-4 mr-1" />
            Company Size
          </label>
          <select
            value={data.companyInfo.companySize}
            onChange={(e) => handleInputChange('companySize', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select company size</option>
            {companySizeOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Production Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Industry Type
          </label>
          <select
            value={data.companyInfo.productionType}
            onChange={(e) => handleInputChange('productionType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select industry</option>
            {productionTypeOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Process Information Section */}
      <div className="pt-8 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-blue-600" />
          Process Information
        </h3>
        <p className="text-gray-600 mb-6">Focus on the specific business process you want to analyze for AI implementation</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Process Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Process Name
            </label>
            <input
              type="text"
              value={data.companyInfo.processName}
              onChange={(e) => handleInputChange('processName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Quality Control, Order Processing"
            />
          </div>

          {/* Sub-process Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sub-process Name
            </label>
            <input
              type="text"
              value={data.companyInfo.subProcessName}
              onChange={(e) => handleInputChange('subProcessName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Visual Inspection, Order Validation"
            />
          </div>

          {/* Process Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Process Description
            </label>
            <textarea
              value={data.companyInfo.processDescription}
              onChange={(e) => handleInputChange('processDescription', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the process in detail, including key steps and current challenges"
            />
          </div>

          {/* Number of Shifts */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Shifts
            </label>
            <input
              type="number"
              min="1"
              max="4"
              value={data.companyInfo.numberOfShifts}
              onChange={(e) => handleInputChange('numberOfShifts', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Number of Employees */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employees in This Process
            </label>
            <input
              type="number"
              min="1"
              value={data.companyInfo.numberOfEmployees}
              onChange={(e) => handleInputChange('numberOfEmployees', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Number of people involved"
            />
          </div>

          {/* Supervisor Ratio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supervisor to Employee Ratio
            </label>
            <select
              value={data.companyInfo.supervisorRatio}
              onChange={(e) => handleInputChange('supervisorRatio', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select ratio</option>
              {supervisorRatioOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="text-blue-600 mr-3 mt-0.5">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">Why we need this information</h4>
            <p className="text-sm text-blue-700">
              This information helps us understand your organization's context and the specific process you want to improve. 
              The more detailed you are, the more accurate our AI readiness assessment will be.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1CompanyInfo;
