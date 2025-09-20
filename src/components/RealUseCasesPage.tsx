import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Download, Mail, RotateCcw, Building2, Target, TrendingUp, ArrowLeft } from 'lucide-react';
import { RealUseCase } from '../types';

interface RealUseCasesPageProps {
  useCases: { [key: string]: RealUseCase };
  onRestart: () => void;
  onViewPrevious: () => void;
  strategy?: {
    businessProcess: string;
    functionalAreas: string[];
    aiUseCase: string;
  };
  realUseCasesData?: any[];
}

const supabase = createClient(
  'https://kabdokfowpwrdgywjtfv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthYmRva2Zvd3B3cmRneXdqdGZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMzM3NTUsImV4cCI6MjA3MTgwOTc1NX0.8Nt4Lc1TvnotyTXKUHAhq3W14Imx-QfbMpIw1f15pG4'
);

const RealUseCasesPage: React.FC<RealUseCasesPageProps> = ({
  useCases,
  onRestart,
  onViewPrevious,
  strategy,
  realUseCasesData
}) => {
  const [dbUseCases, setDbUseCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (realUseCasesData && realUseCasesData.length > 0) {
      // Use the passed data from MatchedUseCasesPage
      setDbUseCases(realUseCasesData);
      setLoading(false);
    } else {
      // Fallback to fetching from Supabase if no data is passed
      const fetchUseCases = async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from('Service_Real_Cases')
          .select('*');
        if (error) {
          console.error('Error fetching real use cases:', error);
          setDbUseCases([]);
        } else {
          setDbUseCases(data || []);
        }
        setLoading(false);
      };
      fetchUseCases();
    }
  }, [realUseCasesData]);

  // Helper to filter BP column by matching fields
  const filterUseCases = (bpList: any[], strategy: any) => {
    if (!strategy) return bpList;
    return bpList.filter((useCase) => {
      const bpText = useCase.BP || '';
      // Normalize dashes for matching
      const normalize = (str: string) => str.replace(/^-\s*/, '').replace(/--\s*/, '- ').trim();
      const matchBP = bpText.includes(strategy.businessProcess);
      const matchFA = bpText.includes(strategy.functionalAreas?.[0] || '');
      // Try both single and double dash for Use Case
      const useCaseOut = strategy.aiUseCase ? normalize(strategy.aiUseCase) : '';
      const matchUC = bpText.includes(useCaseOut) || bpText.includes('- ' + useCaseOut) || bpText.includes('-- ' + useCaseOut);
      return matchBP && matchFA && matchUC;
    });
  };

  // Helper to clean up project text (remove match score lines etc.)
  const sanitizeProjectText = (text: string) => {
    if (!text) return text;
    // Remove any lines like "Match Score: 5" or with decimals
    let cleaned = text.replace(/(^|\n)\s*Match\s*Score\s*:\s*\d+(?:\.\d+)?\s*(?=\n|$)/gi, '');
    return cleaned.trim();
  };

  // Helper function to format text with bold headings
  const formatTextWithBoldHeadings = (text: string) => {
    if (!text) return text;
    
    // Define patterns to make bold
    const patterns = [
      'How AI Was Applied:',
      'Continuous Learning:',
      'Outcome:',
      'Scenario:',
      'Challenge:',
      'AI Approach:',
      'Discovery:',
      'Action Taken:',
      'Results:',
      'Implementation Steps:'
    ];
    
    // Split text into parts and reconstruct with bold formatting
    let formattedText = sanitizeProjectText(text);
    
    patterns.forEach(pattern => {
      const regex = new RegExp(`(${pattern})`, 'gi');
      formattedText = formattedText.replace(regex, `<strong>$1</strong>`);
    });
    
    return formattedText;
  };

  // Use dynamic strategy from props if provided
  const useCasesList = dbUseCases.length > 0 ? filterUseCases(dbUseCases, strategy) : Object.values(useCases);

  const handleExport = () => {
    const content = useCasesList.map((useCase) => `
Company: ${useCase.Company || useCase.company || 'Unknown'}
Details: ${useCase.BP || 'No details available'}

---
`).join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-strategy-real-use-cases.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleEmailExport = () => {
    const subject = 'AI Strategy Explorer - Real Use Cases Report';
    const body = useCasesList.map((useCase) => `
Company: ${useCase.Company || useCase.company || 'Unknown'}
Details: ${useCase.BP || 'No details available'}
`).join('\n\n---\n\n');

    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Real Use Cases</h1>
          <p className="text-gray-600">Industry examples and proven implementations</p>
        </div>

        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export as TXT</span>
          </button>

          <button
            onClick={handleEmailExport}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Mail className="h-4 w-4" />
            <span>Email Report</span>
          </button>

          <button
            onClick={onViewPrevious}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>See Previous</span>
          </button>

          <button
            onClick={onRestart}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Restart Journey</span>
          </button>
        </div>
      </div>

      {/* Real Use Cases */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-12 text-lg text-gray-500">Loading real use cases...</div>
        ) : (
          useCasesList.map((useCase) => (
            <div
              key={useCase.id}
              className="bg-white rounded-xl shadow-lg border overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Building2 className="h-6 w-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-900">{useCase.company || useCase.Company || 'Unknown Company'}</h2>
                  </div>
                  <div className="text-sm text-blue-600 font-medium">
                    Real World Implementation
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <Target className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">Complete Business Case Details</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed font-sans text-justify">
                          {useCase.BP || 'No details available'}
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* Real Project 1 with formatted text */}
                  {useCase['Real Project 1'] && (
                    <div className="flex items-start space-x-3">
                      <Target className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">Real Project 1</h3>
                        <div className="bg-blue-50 rounded-lg p-4">
                          <div 
                            className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed font-sans"
                            dangerouslySetInnerHTML={{ 
                              __html: formatTextWithBoldHeadings(useCase['Real Project 1']) 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Real Project 2 with formatted text */}
                  {useCase['Real Project 2'] && (
                    <div className="flex items-start space-x-3">
                      <Target className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">Real Project 2</h3>
                        <div className="bg-green-50 rounded-lg p-4">
                          <div 
                            className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed font-sans"
                            dangerouslySetInnerHTML={{ 
                              __html: formatTextWithBoldHeadings(useCase['Real Project 2']) 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Additional fields if they exist (Company omitted to avoid duplication with header) */}

                  {useCase.Sector && (
                    <div className="flex items-start space-x-3">
                      <TrendingUp className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Sector</h4>
                        <p className="text-gray-600">{useCase.Sector}</p>
                      </div>
                    </div>
                  )}

                  {/* Display any other fields that might be in the data */}
                  {Object.entries(useCase).map(([key, value]) => {
                    // Skip fields already rendered above or known synonyms from CSV mapping to avoid duplication
                    const SKIP_KEYS = new Set([
                      'BP',
                      'details',
                      'Company',
                      'company',
                      'Sector',
                      'id',
                      'Real Project 1',
                      'Real Project 2',
                      'Real Case 1',
                      'Real Case 2',
                      'realCase1',
                      'realCase2',
                      'matchScore'
                    ]);
                    if (!SKIP_KEYS.has(key) && value) {
                      return (
                        <div key={key} className="flex items-start space-x-3">
                          <div className="h-5 w-5 bg-gray-300 rounded-full mt-0.5 flex-shrink-0"></div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1 capitalize">{key.replace(/_/g, ' ')}</h4>
                            <p className="text-gray-600 text-justify">{String(value)}</p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Section */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Ready to Implement Your AI Strategy?
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          You've explored {useCasesList.length} real-world examples of successful AI implementations. 
          These case studies demonstrate proven approaches and measurable outcomes for similar business challenges.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onViewPrevious}
            className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>See Previous</span>
          </button>
          
          <button
            onClick={handleExport}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Download Complete Report
          </button>
          
          <button
            onClick={onRestart}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Explore Another Strategy
          </button>
        </div>
      </div>
    </div>
  );
};

export default RealUseCasesPage;