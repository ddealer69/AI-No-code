import React, { useState, useEffect } from 'react';
import { ChevronDown, RotateCcw, Sparkles, Save, CheckCircle2 } from 'lucide-react';
import { REAL_USE_CASES } from '../data/demoData';
import { FilterData, StrategyResponse } from '../types';
import { saveToLocalStorage } from '../utils/jsonStorage';
import supabase, { saveStrategyData, processAIUseCases } from '../utils/supabaseClient';

interface DashboardProps {
  onGenerateStrategy: (response: StrategyResponse) => void;
  onStartAnalysis: () => void;
  initialTab?: 'identification' | 'implementation' | 'financials';
}

const Dashboard: React.FC<DashboardProps> = ({ onGenerateStrategy, onStartAnalysis, initialTab = 'identification' }) => {
  // Tab navigation state
  const [activeTab, setActiveTab] = useState<'identification' | 'implementation' | 'financials'>(initialTab);
  // Strategy data state
  const [generatedStrategy, setGeneratedStrategy] = useState<StrategyResponse | null>(null);
  
  const [filters, setFilters] = useState<FilterData>({
    sector: '',
    domain: '',
    process: '',
    stage: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const sectors = ['Service', 'Manufacturing'];
  const [domains, setDomains] = useState<string[]>([]);
  const [processes, setProcesses] = useState<string[]>([]); // Now used for Key Functional Areas
  const [stages, setStages] = useState<string[]>([]);

  // Fetch Key Functional Areas when domain changes
  useEffect(() => {
    const fetchProcesses = async () => {
      if (!filters.sector || !filters.domain) {
        setProcesses([]);
        return;
      }
      
      try {
        const tableName = filters.sector === 'Service' ? 'Service_Match_Cases' : 'Manufacturing_Match_Case';
        const { data, error } = await supabase
          .from(tableName)
          .select('Business-process,Key_Functional_Areas');
          
        if (error) {
          console.error('Supabase error:', error);
          setProcesses([]);
          return;
        }
        
        if (!data || !data.length) {
          console.log('No data returned for', filters.domain);
          setProcesses([]);
          return;
        }
        
        console.log('Data returned:', data);
        
        // Case-insensitive match for Business-process
        const filtered = data.filter((row: any) => 
          row['Business-process'] && 
          typeof row['Business-process'] === 'string' && 
          row['Business-process'].toLowerCase() === filters.domain.toLowerCase()
        );
        
        console.log('Filtered data:', filtered);
        
        const uniqueAreas = Array.from(new Set(filtered.map((row: any) => row['Key_Functional_Areas']).filter(Boolean)));
        console.log('Unique areas:', uniqueAreas);
        
        setProcesses(uniqueAreas);
      } catch (err) {
        console.error('Failed to fetch processes:', err);
        setProcesses([]);
      }
    };
    
    fetchProcesses();
  }, [filters.sector, filters.domain]);

  // Fetch domains when sector changes
  useEffect(() => {
    const fetchDomains = async () => {
      if (!filters.sector) {
        setDomains([]);
        return;
      }
      const tableName = filters.sector === 'Service' ? 'Service_Match_Cases' : 'Manufacturing_Match_Case';
      const { data, error } = await supabase
        .from(tableName)
        .select('Business-process');
      if (error || !data) {
        setDomains([]);
        return;
      }
      // Extract unique business processes
      const uniqueDomains = Array.from(new Set(data.map((row: any) => row['Business-process']).filter(Boolean)));
      setDomains(uniqueDomains);
    };
    fetchDomains();
  }, [filters.sector]);

  // Fetch Job_role for Step 4 when Key_Functional_Areas (process) changes
  useEffect(() => {
    const fetchStages = async () => {
      if (!filters.sector || !filters.domain || !filters.process) {
        setStages([]);
        return;
      }
      
      try {
        const tableName = filters.sector === 'Service' ? 'Service_Match_Cases' : 'Manufacturing_Match_Case';
        const { data, error } = await supabase
          .from(tableName)
          .select('Business-process,Key_Functional_Areas,Job_role')
          .eq('Business-process', filters.domain)
          .eq('Key_Functional_Areas', filters.process);
          
        if (error) {
          console.error('Supabase error:', error);
          setStages([]);
          return;
        }
        
        if (!data || !data.length) {
          console.log('No job roles found for', filters.process);
          setStages([]);
          return;
        }
        
        console.log('Job role data:', data);
        
        // Split job roles by newline and extract unique values
        let allRoles: string[] = [];
        data.forEach((row: any) => {
          if (row.Job_role) {
            const roles = row.Job_role.split('\n')
              .map((role: string) => role.trim())
              .filter((role: string) => role);
            allRoles = [...allRoles, ...roles];
          }
        });
        
        // Remove any numbering or bullets at the start (e.g., "1. ", "2. ", etc.)
        const cleanedRoles = allRoles.map((role: string) => 
          role.replace(/^\d+\.\s*|\-\s*/, '').trim()
        );
        
        const uniqueRoles = Array.from(new Set(cleanedRoles)).filter(Boolean);
        console.log('Unique job roles:', uniqueRoles);
        
        setStages(uniqueRoles);
      } catch (err) {
        console.error('Failed to fetch job roles:', err);
        setStages([]);
      }
    };
    
    fetchStages();
  }, [filters.sector, filters.domain, filters.process]);

  const handleFilterChange = (type: keyof FilterData, value: string) => {
    if (type === 'sector') {
      setFilters({ sector: value, domain: '', process: '', stage: '' });
    } else if (type === 'domain') {
      setFilters({ ...filters, domain: value, process: '', stage: '' });
    } else if (type === 'process') {
      setFilters({ ...filters, process: value, stage: '' });
    } else {
      setFilters({ ...filters, [type]: value });
    }
  };

  const resetFilters = () => {
    setFilters({ sector: '', domain: '', process: '', stage: '' });
  };

  const handleGenerateStrategy = async () => {
      // Check if demo text exists in the single column
      const demoText = `Business Process - Client Acquisition & Engagement. \nFunctional area - 2.1 Lead Generation & Qualification.\nUse Case - - AI tools to scrape and score potential leads based on web presence, firmographics, and intent signals.\nOutcome - Higher quality leads.\nExpected ROI - 40-50% improvement in lead quality.`;
      const { data: demoExists, error: demoError } = await supabase
        .from('Service_Real_Cases')
        .select('*')
        .ilike('BP, Function, Use case, Outcome', `%${demoText}%`);
      if (demoError) {
        console.error('Supabase error (demo check):', demoError);
      } else {
        console.log('Demo text exists:', demoExists && demoExists.length > 0);
      }
    if (!filters.sector || !filters.domain || !filters.process || !filters.stage) return;

    setIsGenerating(true);

    try {
      // Fetch the complete data from Supabase based on all filters
      const tableName = filters.sector === 'Service' ? 'Service_Match_Cases' : 'Manufacturing_Match_Case';
      const { data, error } = await supabase
        .from(tableName)
        .select('*') // Fetch all columns
        .eq('Business-process', filters.domain)
        .eq('Key_Functional_Areas', filters.process);
        
      if (error) {
        console.error('Supabase error:', error);
        setIsGenerating(false);
        return;
      }
      
      // Filter data by the selected job role
      const matchedData = data.filter((row: any) => {
        if (row.Job_role) {
          const roles = row.Job_role.split('\n')
            .map((role: string) => role.trim())
            .filter((role: string) => role)
            .map((role: string) => role.replace(/^\d+\.\s*|\-\s*/, '').trim());
          return roles.some((role: string) => role === filters.stage);
        }
        return false;
      });
      
      console.log('Matched use cases for selected filters:', matchedData);
      
      // Function to clean AI use case text
      const cleanAIUseCaseText = (text: string): string[] => {
        if (!text) return [];
        
        // AI use cases might be separated by newlines or bullets
        // First split by newlines to get individual entries
        const lines = text.replace(/\r/g, '').split('\n');
        
        // Process each line to remove leading dashes and clean up
        return lines
          .map((line: string) => {
            // Remove the dash prefix, any numbers, and trim whitespace
            return line.replace(/^\s*(?:-|\d+\.)\s*/, '').trim();
          })
          .filter((line: string) => line.length > 5); // Only keep meaningful content
      };
      
      // Collect all AI use case descriptions from matched data
      const aiUseCaseDescriptions: string[] = [];
      matchedData.forEach((useCase: any) => {
        if (useCase['AI Use Cases']) {
          const cleanedUseCases = cleanAIUseCaseText(useCase['AI Use Cases']);
          aiUseCaseDescriptions.push(...cleanedUseCases);
        }
      });
      
      console.log('Cleaned AI Use Case descriptions:', aiUseCaseDescriptions);
      
      console.log('AI Use Case descriptions to search for:', aiUseCaseDescriptions);
      
      // Fetch matching AI use cases from the appropriate table
      const aiTableName = filters.sector === 'Service' ? 'Service_Ai_Cases' : 'Manufacturing_Ai_Cases';
      
      // Create an array of promises for each AI use case search
      const aiUseCasePromises = aiUseCaseDescriptions.map(async (description: string) => {
        if (description.length < 10) {
          console.log(`Skipping short description: "${description}"`);
          return []; // Skip very short descriptions
        }
        
        console.log(`Searching for AI use case matching: "${description}"`);
        
        // Extract key terms (first 2-3 words) for more focused search
        const keyTerms = description.split(' ').slice(0, 3).join(' ');
        
        // Log the table we're searching in
        console.log(`Searching in table: ${aiTableName}`);
        
        // Search for any AI use cases that match our use case description
        // First try exact match on the Use_Case column (note the underscore)
        console.log(`Executing query: .from('${aiTableName}').select('*').ilike('Use_Case', '${description.trim()}')`);
        let { data: aiCases, error: aiError } = await supabase
          .from(aiTableName)
          .select('*')
          .ilike('Use_Case', description.trim()); // Try exact match (case-insensitive)
        
        console.log(`Exact match results for "${description}" in Use_Case column:`, aiCases?.length || 0);
        
        // If no results, try with partial match using ILIKE with wildcards
        if ((!aiCases || aiCases.length === 0) && keyTerms.length > 0) {
          console.log(`Trying partial match with key terms: "${keyTerms}"`);
          const { data: partialMatches, error: partialError } = await supabase
            .from(aiTableName)
            .select('*')
            .or(`Use_Case.ilike.%${keyTerms}%, Notes on Implementation.ilike.%${keyTerms}%`); // Try partial match with key terms in two columns
          
          console.log(`Partial match results for "${keyTerms}":`, partialMatches?.length || 0);
          
          if (partialError) {
            console.error(`Error fetching AI cases with partial match for "${description}":`, partialError);
          } else if (partialMatches && partialMatches.length > 0) {
            aiCases = partialMatches;
          }
        }
        
        // If still no results, try an even broader search
        if ((!aiCases || aiCases.length === 0) && description.includes(' ')) {
          // Try each word in the description
          const words = description.split(' ')
            .filter(word => word.length > 3) // Only use meaningful words
            .slice(0, 2); // Take just the first couple words
            
          if (words.length > 0) {
            const { data: wordMatches, error: wordError } = await supabase
              .from(aiTableName)
              .select('*')
              .ilike('Use Case', `%${words[0]}%`); // Try match with first significant word
              
            if (wordError) {
              console.error(`Error fetching AI cases with word match for "${words[0]}":`, wordError);
            } else if (wordMatches && wordMatches.length > 0) {
              aiCases = wordMatches;
            }
          }
        }
        
        if (aiError) {
          console.error(`Error fetching AI cases for "${description}":`, aiError);
          return [];
        }
        
        console.log(`Search results for "${description}"`, aiCases);
        return aiCases || [];
      });
      
      // Wait for all AI use case queries to complete
      const aiUseCaseResults = await Promise.all(aiUseCasePromises);
      
      // Flatten and deduplicate the results
      const allAiCases = aiUseCaseResults.flat();
      
      // Process AI cases to clean formatting and standardize data
      const processedAiCases = processAIUseCases(allAiCases);
      
      // Remove duplicates based on Use Case
      const uniqueAiCases = Array.from(
        new Map(processedAiCases.map((item: any) => [item['Use Case'], item])).values()
      );
      
      console.log('Matched AI use cases:', uniqueAiCases);
      
      // If no AI use cases found, try a more general search
      if (uniqueAiCases.length === 0) {
        console.log("No AI use cases found initially, trying broader search");
        
        // Try a broader search in the database
        try {
          // First, let's check what columns are available
          console.log(`Checking schema for table: ${aiTableName}`);
          
          // Query for some specific AI use cases
          console.log(`Executing query: .from('${aiTableName}').select('*').limit(5)`);
          
          // Get some general AI use cases from the table
          const { data: generalCases, error } = await supabase
            .from(aiTableName)
            .select('*')
            .limit(5);
            
          if (error) {
            console.error("Error fetching general AI use cases:", error);
          } else if (generalCases && generalCases.length > 0) {
            console.log("Found general AI use cases:", generalCases.length);
            console.log("Sample use case structure:", generalCases[0]);
            uniqueAiCases.push(...generalCases);
          } else {
            // Only if we still have nothing, add fallback cases
            console.log("No AI use cases found, adding fallback cases");
            uniqueAiCases.push({
              'Use_Case': 'AI-powered data analysis for business insights',
              'AI System Type': 'ML',
              'Recommended Tools/Platforms': 'TensorFlow, Python, PowerBI',
              'Custom Development (Yes/No)': 'Yes',
              'Notes on Implementation': 'Requires data engineering expertise and integration with existing systems.'
            });
            uniqueAiCases.push({
              'Use_Case': 'Customer service chatbot with natural language processing',
              'AI System Type': 'NLP',
              'Recommended Tools/Platforms': 'Dialogflow, AWS Lex, Node.js',
              'Custom Development (Yes/No)': 'Yes',
              'Notes on Implementation': 'Can be integrated with existing customer support platforms.'
            });
          }
        } catch (error) {
          console.error("Error in broader AI use case search:", error);
        }
      }
      
      // Format the data for MatchedUseCasesPage
      const response: StrategyResponse = {
        matchedUseCases: matchedData.reduce((acc: any, useCase: any, index: number) => {
          acc[(index + 1).toString()] = {
            id: index + 1,
            businessProcess: useCase['Business-process'] || '',
            functionalAreas: [useCase['Key_Functional_Areas'] || ''],
            jobRole: filters.stage,
            primaryMetric: useCase['Primary Value Metric'] || '',
            secondaryMetric: useCase['Secondary Value Metric'] || '',
            aiUseCase: useCase['AI Use Cases'] || '',
            impact: useCase['Impact'] || '',
            // Set expectedROI based on Impact if available
            expectedROI: useCase['Impact'] ? 'High' : 'Medium',
          };
          return acc;
        }, {} as { [key: string]: any }),
        
        // Use the real AI use cases from the database
        aiUseCases: uniqueAiCases.reduce((acc: any, aiCase: any, index: number) => {
          if (!aiCase) {
            console.warn("Found undefined or null AI case at index", index);
            return acc;
          }
          
          console.log(`Processing AI case ${index}:`, aiCase);
          
          try {
            // Process the tools string to ensure it's always a valid array
            let tools: string[] = [];
            if (aiCase['Recommended Tools/Platforms']) {
              if (typeof aiCase['Recommended Tools/Platforms'] === 'string') {
                tools = aiCase['Recommended Tools/Platforms']
                  .split(/[;,]/) // Split by both semicolons and commas
                  .map((tool: string) => tool.trim())
                  .filter((tool: string) => tool.length > 0);
              } else if (Array.isArray(aiCase['Recommended Tools/Platforms'])) {
                tools = aiCase['Recommended Tools/Platforms'];
              }
            } else if (aiCase.tools && Array.isArray(aiCase.tools)) {
              tools = aiCase.tools;
            }
            
            // Determine if custom development is required
            const customDevField = aiCase['Custom Development (Yes/No)'] || aiCase.customDev;
            const customDev = 
              customDevField === 'Yes' || 
              customDevField === 'yes' || 
              customDevField === 'YES' ||
              customDevField === true;
            
            // Use existing useCase field or the Use_Case field from database (note the underscore)
            const useCaseText = aiCase.useCase || aiCase['Use_Case'] || aiCase['Use Case'] || '';
            
            if (!useCaseText) {
              console.warn(`AI case at index ${index} has no use case text, skipping`);
              return acc;
            }
            
            // Debug the AI case structure
            console.log(`AI case ${index} structure:`, Object.keys(aiCase));
            
            acc[(index + 1).toString()] = {
              id: index + 1,
              useCase: useCaseText,
              aiSystemType: aiCase['AI System Type'] || aiCase.aiSystemType || 'Other',
              tools: tools || [],
              customDev: customDev || false,
              implementationNotes: aiCase['Notes on Implementation'] || aiCase.implementationNotes || '',
              // Add additional fields if available
              expectedROI: aiCase['Expected ROI'] || aiCase.expectedROI || 'Medium'
            };
          } catch (error) {
            console.error(`Error processing AI case at index ${index}:`, error);
            // Add a placeholder AI use case to avoid breaking the UI
            acc[(index + 1).toString()] = {
              id: index + 1,
              useCase: "AI Use Case " + (index + 1),
              aiSystemType: "Other",
              tools: ["Various tools"],
              customDev: false,
              implementationNotes: "Details not available",
              expectedROI: "Medium"
            };
          }
          return acc;
        }, {} as { [key: string]: any }),
        
        // Keep the demo data for real use cases for now
        realUseCases: REAL_USE_CASES.reduce((acc, realCase, index) => {
          acc[(index + 1).toString()] = realCase;
          return acc;
        }, {} as { [key: string]: any })
      };

      // Save all data to localStorage and Supabase
      try {
        // Create separate objects for each data type
        const matchedUseCasesData = matchedData;
        const aiUseCasesData = uniqueAiCases;
        
        // Save to localStorage for future use
        saveToLocalStorage('matchedUseCases', matchedUseCasesData);
        saveToLocalStorage('aiUseCases', aiUseCasesData);
        saveToLocalStorage('filters', filters);
        
        // Create a comprehensive data object
        const fullDataObject = {
          matchedUseCases: matchedUseCasesData,
          aiUseCases: aiUseCasesData,
          response: response
        };
        
        // Save the comprehensive data to Supabase
        const recordId = await saveStrategyData(fullDataObject);
        
        console.log(`Successfully saved data to Supabase with ID: ${recordId}`);
      } catch (saveError) {
        console.error('Failed to save data:', saveError);
      }
      
      // Print and save the generated strategy output
      console.log('Generated AI Strategy Output:', response);
      setGeneratedStrategy(response);
      setActiveTab('implementation');
      onGenerateStrategy(response);
    } catch (err) {
      console.error('Failed to generate strategy:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const canGenerate = filters.sector && filters.domain && filters.process && filters.stage;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex justify-center space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('identification')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'identification'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } transition-colors duration-200`}
            >
              Identification
            </button>
            <button
              onClick={() => setActiveTab('implementation')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'implementation'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } transition-colors duration-200`}
            >
              Implementation
            </button>
            <button
              onClick={() => {
                setActiveTab('financials');
                if (onStartAnalysis) {
                  onStartAnalysis();
                }
              }}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'financials'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } transition-colors duration-200`}
            >
              Financials
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'identification' && (
        <>
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 font-serif">Explore Use Cases</h1>
            <p className="text-lg text-gray-600 font-medium tracking-wide">Filter step by step to find the details you need</p>
            <div className="w-24 h-1 gold-accent mx-auto mt-4"></div>
          </div>

      <div className="bg-white classic-shadow-lg classic-border p-8 mb-12 rounded-lg">
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          {/* Step 1: Sector */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-gray-800 uppercase tracking-widest">
              Step 1: Select Sector
            </label>
            <div className="relative">
              <select
                value={filters.sector}
                onChange={(e) => handleFilterChange('sector', e.target.value)}
                className="w-full classic-input appearance-none pr-10 font-medium text-sm"
              >
                <option value="">Choose sector...</option>
                {sectors.map(sector => (
                  <option key={sector} value={sector}>
                    {sector}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Step 2: Domain */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-gray-800 uppercase tracking-widest">
              Step 2: Select a Domain
            </label>
            <div className="relative">
              <select
                value={filters.domain}
                onChange={(e) => handleFilterChange('domain', e.target.value)}
                disabled={!filters.sector}
                className="w-full classic-input appearance-none pr-10 disabled:bg-gray-100 disabled:text-gray-500 font-medium text-sm"
              >
                <option value="">Choose domain...</option>
                {domains.map(domain => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Step 3: Key Functional Areas */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-gray-800 uppercase tracking-widest">
              Step 3: Select Key Functional Area
            </label>
            <div className="relative">
              <select
                value={filters.process}
                onChange={(e) => handleFilterChange('process', e.target.value)}
                disabled={!filters.domain}
                className="w-full classic-input appearance-none pr-10 disabled:bg-gray-100 disabled:text-gray-500 font-medium text-sm"
              >
                <option value="">Choose area...</option>
                {processes.map((area: string) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Step 4: Stage */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-gray-800 uppercase tracking-widest">
              Step 4: Select a Stage
            </label>
            <div className="relative">
              <select
                value={filters.stage}
                onChange={(e) => handleFilterChange('stage', e.target.value)}
                disabled={!filters.process}
                className="w-full classic-input appearance-none pr-10 disabled:bg-gray-100 disabled:text-gray-500 font-medium text-sm"
              >
                <option value="">Choose stage...</option>
                {stages.map((stage: string) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={resetFilters}
            className="flex items-center justify-center space-x-2 classic-button-secondary"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset Filters</span>
          </button>

          <button
            onClick={handleGenerateStrategy}
            disabled={!canGenerate || isGenerating}
            className="flex items-center justify-center space-x-2 classic-button-primary disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
          >
            <Sparkles className="h-4 w-4" />
            <span>{isGenerating ? 'Generating Strategy...' : 'Generate My Strategy'}</span>
          </button>
          
          {onStartAnalysis && (
            <button
              onClick={onStartAnalysis}
              className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <span>Current State Analysis</span>
            </button>
          )}
          
          <button
            onClick={async () => {
              // Instead of downloading, we'll save to Supabase
              try {
                // Get data from localStorage
                const savedMatchedData = localStorage.getItem('matchedUseCases');
                const savedAIData = localStorage.getItem('aiUseCases');
                const savedFilters = localStorage.getItem('filters');
                
                if (savedMatchedData || savedAIData) {
                  const parsedMatchedData = savedMatchedData ? JSON.parse(savedMatchedData) : [];
                  const parsedAIData = savedAIData ? JSON.parse(savedAIData) : [];
                  const parsedFilters = savedFilters ? JSON.parse(savedFilters) : {};
                  
                  const fullDataObject = {
                    filters: parsedFilters,
                    matchedUseCases: parsedMatchedData,
                    aiUseCases: parsedAIData,
                    timestamp: new Date().toISOString()
                  };
                  
                  // Save to Supabase
                  const recordId = await saveStrategyData(fullDataObject);
                  alert(`Data successfully saved to database with ID: ${recordId}`);
                } else {
                  alert('No saved data found. Generate a strategy first.');
                }
              } catch (error) {
                console.error('Error saving data:', error);
                alert('Error saving data to database');
              }
            }}
            className="flex items-center justify-center space-x-2 classic-button-secondary"
          >
            <Save className="h-4 w-4" />
            <span>Save Data to Server</span>
          </button>
        </div>

        {canGenerate && !isGenerating && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-900 rounded-r-lg">
            <p className="text-blue-900 text-sm font-semibold tracking-wide">
              Ready to generate strategy for: <strong>{filters.sector}</strong> → <strong>{filters.domain}</strong> → <strong>{filters.process}</strong> → <strong>{filters.stage}</strong>
            </p>
          </div>
        )}

        {isGenerating && (
          <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-900 classic-shadow rounded-r-lg">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-900"></div>
              <p className="text-blue-900 font-bold tracking-wide text-sm">Analyzing your selection and generating AI strategy recommendations...</p>
            </div>
          </div>
        )}
      </div>
        </>
      )}

      {activeTab === 'implementation' && (
        <div className="py-8">
          {generatedStrategy ? (
            <div className="space-y-8">
              <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-gray-900 mb-4 font-serif">AI Strategy Implementation</h2>
                <p className="text-lg text-gray-600 font-medium tracking-wide">Your personalized AI transformation roadmap</p>
                <div className="w-24 h-1 gold-accent mx-auto mt-4"></div>
              </div>

              {/* Strategy Content */}
              <div className="grid gap-8">
                {/* Matched Use Cases Section */}
                {Object.keys(generatedStrategy.matchedUseCases).length > 0 && (
                  <div className="bg-white classic-shadow-lg classic-border rounded-lg p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <CheckCircle2 className="w-6 h-6 mr-3 text-green-600" />
                      Matched Business Use Cases
                    </h3>
                    <div className="grid gap-6">
                      {Object.entries(generatedStrategy.matchedUseCases).map(([key, useCase]: [string, any]) => (
                        <div key={key} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Business Process</h4>
                              <p className="text-gray-700 mb-4">{useCase.businessProcess}</p>
                              
                              <h4 className="font-semibold text-gray-900 mb-2">Job Role</h4>
                              <p className="text-gray-700">{useCase.jobRole}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">AI Use Case</h4>
                              <p className="text-gray-700 mb-4">{useCase.aiUseCase}</p>
                              
                              <h4 className="font-semibold text-gray-900 mb-2">Expected Impact</h4>
                              <p className="text-gray-700">{useCase.impact}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Use Cases Section */}
                {Object.keys(generatedStrategy.aiUseCases).length > 0 && (
                  <div className="bg-white classic-shadow-lg classic-border rounded-lg p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <Sparkles className="w-6 h-6 mr-3 text-blue-600" />
                      AI Implementation Details
                    </h3>
                    <div className="grid gap-6">
                      {Object.entries(generatedStrategy.aiUseCases).map(([key, aiCase]: [string, any]) => (
                        <div key={key} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <h4 className="font-semibold text-gray-900 mb-3">{aiCase.useCase}</h4>
                          
                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <span className="text-sm font-medium text-gray-500">AI System Type:</span>
                              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                                {aiCase.aiSystemType}
                              </span>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-500">Custom Development:</span>
                              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                                aiCase.customDev 
                                  ? 'bg-orange-100 text-orange-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {aiCase.customDev ? 'Required' : 'Not Required'}
                              </span>
                            </div>
                          </div>

                          {aiCase.tools && aiCase.tools.length > 0 && (
                            <div className="mb-4">
                              <span className="text-sm font-medium text-gray-500 block mb-2">Recommended Tools:</span>
                              <div className="flex flex-wrap gap-2">
                                {aiCase.tools.map((tool: string, index: number) => (
                                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                                    {tool}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {aiCase.implementationNotes && (
                            <div>
                              <span className="text-sm font-medium text-gray-500 block mb-2">Implementation Notes:</span>
                              <p className="text-gray-700 text-sm">{aiCase.implementationNotes}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4 mt-8">
                  <button
                    onClick={() => {
                      setActiveTab('identification');
                      setGeneratedStrategy(null);
                    }}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Generate New Strategy
                  </button>
                  <button
                    onClick={() => setActiveTab('financials')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Proceed to Financial Analysis
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Implementation Phase</h2>
              <p className="text-gray-600 mb-8">Generate an AI strategy from the Identification tab to see your implementation roadmap.</p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 max-w-2xl mx-auto">
                <p className="text-blue-800">Once you generate a strategy, this section will contain your personalized implementation guides, AI use cases, and execution roadmap.</p>
              </div>
              <button
                onClick={() => setActiveTab('identification')}
                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Identification
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'financials' && (
        <div className="text-center py-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Financial Analysis</h2>
          <p className="text-gray-600 mb-8">Click the button below to start your comprehensive financial analysis.</p>
          {onStartAnalysis && (
            <button
              onClick={onStartAnalysis}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Start Financial Analysis
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;