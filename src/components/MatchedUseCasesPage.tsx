import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ArrowRight, RotateCcw, Filter, ArrowLeft } from 'lucide-react';
import { UseCase } from '../types';

interface MatchedUseCasesPageProps {
  useCases: { [key: string]: UseCase };
  onViewAIUseCases: (realUseCasesData?: any[]) => void;
  onViewPrevious: () => void;
  onRestart: () => void;
}

const MatchedUseCasesPage: React.FC<MatchedUseCasesPageProps> = ({
  useCases,
  onViewAIUseCases,
  onViewPrevious,
  onRestart
}) => {
  const [selectedMetric, setSelectedMetric] = useState<string>('');
  const [realUseCasesData, setRealUseCasesData] = useState<any[]>([]);

  const supabase = createClient(
    'https://kabdokfowpwrdgywjtfv.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthYmRva2Zvd3B3cmRneXdqdGZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMzM3NTUsImV4cCI6MjA3MTgwOTc1NX0.8Nt4Lc1TvnotyTXKUHAhq3W14Imx-QfbMpIw1f15pG4'
  );

  const useCasesList = Object.values(useCases);

  // Search BP column for each use case and print output
  const searchBP = async (useCase: UseCase) => {
    // Templates for Service_Real_Cases
    const bpTemplate = `Business Process - ${useCase.businessProcess}`;
    const faTemplate = `Functional area - ${useCase.functionalAreas[0]}`;
    const ucTemplate = `Use Case - ${useCase.aiUseCase}`;
    const serviceSearchString = `${bpTemplate}*${faTemplate}*${ucTemplate}`;
    
    // Templates for Manufacturing_Real_Cases (without "- " in Use Case)
    const manufacturingBpTemplate = `Business Process - ${useCase.businessProcess}`;
    const manufacturingFaTemplate = `Functional area - ${useCase.functionalAreas[0]}`;
    const manufacturingUcTemplate = `Use Case ${useCase.aiUseCase}`;
    const manufacturingSearchString = `${manufacturingBpTemplate}*${manufacturingFaTemplate}*${manufacturingUcTemplate}`;
    
    try {
      // Search in Service_Real_Cases first
      const { data: serviceData, error: serviceError } = await supabase
        .from('Service_Real_Cases')
        .select('*')
        .ilike('BP', `%${useCase.businessProcess}%`)
        .ilike('BP', `%${useCase.functionalAreas[0]}%`)
        .ilike('BP', `%${useCase.aiUseCase}%`);

      if (serviceError) {
        console.error('Service BP search error:', serviceError);
      } else {
        console.log('Service BP search result for:', serviceSearchString, serviceData);
        if (serviceData && serviceData.length > 0) {
          setRealUseCasesData(serviceData);
          return;
        }
      }

      // If no data found in Service_Real_Cases, search in Manufacturing_Real_Cases
      const { data: manufacturingData, error: manufacturingError } = await supabase
        .from('Manufacturing_Real_Cases')
        .select('*')
        .ilike('BP', `%${useCase.businessProcess}%`)
        .ilike('BP', `%${useCase.functionalAreas[0]}%`)
        .ilike('BP', `%${useCase.aiUseCase}%`);

      if (manufacturingError) {
        console.error('Manufacturing BP search error:', manufacturingError);
      } else {
        console.log('Manufacturing BP search result for:', manufacturingSearchString, manufacturingData);
        if (manufacturingData && manufacturingData.length > 0) {
          setRealUseCasesData(manufacturingData);
          return;
        }
      }

      // If no data found in either table, set empty array
      console.log('No data found in either table for Service:', serviceSearchString, 'Manufacturing:', manufacturingSearchString);
      setRealUseCasesData([]);
      
    } catch (error) {
      console.error('Error searching BP:', error);
      setRealUseCasesData([]);
    }
  };

  // Example: search for first filtered use case on mount
  React.useEffect(() => {
    if (useCasesList.length > 0) {
      searchBP(useCasesList[0]);
    }
  }, [useCasesList]);
  const filteredUseCases = selectedMetric 
    ? useCasesList.filter(useCase => 
        useCase.primaryMetric === selectedMetric || useCase.secondaryMetric === selectedMetric
      )
    : useCasesList;

  const metrics = ['Finance', 'Quality', 'Time'];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 font-serif">Matched Use Cases</h1>
        <p className="text-xl text-gray-600 font-medium tracking-wide">AI strategies aligned with your business requirements</p>
        <div className="w-24 h-1 gold-accent mx-auto mt-6"></div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white classic-shadow classic-border p-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center space-x-6">
            <Filter className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-bold text-gray-800 uppercase tracking-widest">Filter by Value Metric:</span>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="classic-input text-sm font-medium"
            >
              <option value="">All Metrics</option>
              {metrics.map(metric => (
                <option key={metric} value={metric}>{metric}</option>
              ))}
            </select>
          </div>

          <button
            onClick={onViewPrevious}
            className="flex items-center space-x-3 classic-button-secondary text-xs"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>See Previous</span>
          </button>

          <button
            onClick={onRestart}
            className="flex items-center space-x-3 classic-button-secondary text-xs"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Restart Journey</span>
          </button>
        </div>
      </div>

      {/* Use Cases Grid */}
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {filteredUseCases.map((useCase) => (
          <div
            key={useCase.id}
            className="bg-white classic-shadow-lg classic-border hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-1"
            onClick={() => onViewAIUseCases(realUseCasesData)}
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 font-serif">
                    {useCase.businessProcess}
                  </h3>
                  <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide">{useCase.jobRole}</p>
                </div>
                <ArrowRight className="h-6 w-6 text-blue-900 flex-shrink-0 mt-1" />
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide">Key Functional Areas</h4>
                  <div className="flex flex-wrap gap-2">
                    {useCase.functionalAreas.map((area, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-900 text-xs font-bold uppercase tracking-wide border border-blue-200"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide">Primary Metric</h4>
                    <span className="px-3 py-1 bg-green-50 text-green-800 text-xs font-bold uppercase tracking-wide border border-green-200">
                      {useCase.primaryMetric}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide">Secondary Metric</h4>
                    <span className="px-3 py-1 bg-orange-50 text-orange-800 text-xs font-bold uppercase tracking-wide border border-orange-200">
                      {useCase.secondaryMetric}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide">AI Use Case</h4>
                  <p className="text-sm text-gray-700 font-medium leading-relaxed">{useCase.aiUseCase}</p>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide">Expected Impact</h4>
                  <p className="text-sm text-gray-900 font-bold">{useCase.impact}</p>
                </div>

                <div className="pt-4 border-t-2 border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-800 uppercase tracking-wide">Expected ROI:</span>
                    <span className="text-sm font-bold text-green-700 bg-green-50 px-3 py-1 border border-green-200">{useCase.expectedROI}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredUseCases.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No use cases match the selected criteria.</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={onViewPrevious}
          className="flex items-center space-x-2 classic-button-secondary"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>See Previous</span>
        </button>
        
        <button
          onClick={() => onViewAIUseCases(realUseCasesData)}
          className="classic-button-primary"
        >
          View AI Implementation Details
        </button>
      </div>
    </div>
  );
};

export default MatchedUseCasesPage;