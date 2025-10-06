import React, { useState, useEffect } from 'react';
import { ChevronDown, RotateCcw, Sparkles, CheckCircle2, Target, Building2, TrendingUp, Filter, Globe, MapPin, Lightbulb, Zap, Award, Users, Code, Database, Wrench, Download, Calculator } from 'lucide-react';
import { REAL_USE_CASES } from '../data/demoData';
import AIROICalculator from './AIROICalculator';
import { FilterData, StrategyResponse } from '../types';
import { saveToLocalStorage } from '../utils/jsonStorage';
import supabase, { saveStrategyData, processAIUseCases } from '../utils/supabaseClient';
import { searchRealCasesInCSV, loadCSVContent, RealCaseMatch } from '../utils/csvRealCasesService';

interface DashboardProps {
  onGenerateStrategy: (response: StrategyResponse) => void;
  onStartAnalysis: () => void;
  onStartFutureAnalysis?: () => void;
  onSectorChange?: (sector: string) => void;
  initialTab?: 'identification' | 'implementation' | 'financials' | 'roi';
  realUseCasesData?: any[];
}

const Dashboard: React.FC<DashboardProps> = ({ 
  onGenerateStrategy, 
  onStartAnalysis, 
  onStartFutureAnalysis,
  onSectorChange,
  initialTab = 'identification',
  realUseCasesData: propRealUseCasesData = []
}) => {
  // Tab navigation state
  const [activeTab, setActiveTab] = useState<'identification' | 'implementation' | 'financials' | 'roi'>(initialTab);
  // ROI Calculator state
  const [showROICalculator, setShowROICalculator] = useState(false);
  // Strategy data state
  const [generatedStrategy, setGeneratedStrategy] = useState<StrategyResponse | null>(null);
  // Metric filter state for implementation tab
  const [selectedMetric, setSelectedMetric] = useState<string>('');
  // Real use cases data from Supabase
  const [realUseCasesData, setRealUseCasesData] = useState<any[]>(propRealUseCasesData);
  const [loadingRealUseCases, setLoadingRealUseCases] = useState(false);
  // Financial dropdown state
  const [showFinancialDropdown, setShowFinancialDropdown] = useState(false);
  
  // If we receive real use cases data from props, use it
  useEffect(() => {
    if (propRealUseCasesData && propRealUseCasesData.length > 0) {
      setRealUseCasesData(propRealUseCasesData);
      console.log("Received real use cases data from props:", propRealUseCasesData);
    }
  }, [propRealUseCasesData]);

  // Reset metric filter when switching tabs
  useEffect(() => {
    setSelectedMetric('');
  }, [activeTab]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowFinancialDropdown(false);
    };

    if (showFinancialDropdown) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showFinancialDropdown]);
  
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
      // Notify parent component of sector change
      if (onSectorChange) {
        onSectorChange(value);
      }
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

  // Helper function to format text with bold headings
  const formatTextWithBoldHeadings = (text: string) => {
    if (!text) return text;
    
    // Define patterns to make bold
    const patterns = [
      'How AI Was Applied:',
      'Continuous Learning:',
      'Outcome:'
    ];
    
    // Split text into parts and reconstruct with bold formatting
    let formattedText = text;
    
    patterns.forEach(pattern => {
      const regex = new RegExp(`(${pattern})`, 'gi');
      formattedText = formattedText.replace(regex, '<strong>$1</strong>');
    });
    
    return formattedText;
  };

  // Generate comprehensive summary text
  const generateSummaryText = () => {
    const currentDate = new Date().toLocaleDateString();
    let summary = '';

    summary += `AI STRATEGY DASHBOARD SUMMARY\n`;
    summary += `Generated on: ${currentDate}\n`;
    summary += `${'='.repeat(50)}\n\n`;

    // Add filter information
    if (filters.sector || filters.domain || filters.process || filters.stage) {
      summary += `CURRENT FILTERS:\n`;
      summary += `${'-'.repeat(20)}\n`;
      if (filters.sector) summary += `Sector: ${filters.sector}\n`;
      if (filters.domain) summary += `Domain: ${filters.domain}\n`;
      if (filters.process) summary += `Process: ${filters.process}\n`;
      if (filters.stage) summary += `Stage: ${filters.stage}\n`;
      summary += `\n`;
    }

    // Add strategy data if available
    if (generatedStrategy) {
      summary += `GENERATED AI STRATEGY:\n`;
      summary += `${'-'.repeat(25)}\n`;
      
      if (generatedStrategy.matchedUseCases && generatedStrategy.matchedUseCases.length > 0) {
        summary += `MATCHED BUSINESS USE CASES (${generatedStrategy.matchedUseCases.length}):\n`;
        generatedStrategy.matchedUseCases.forEach((useCase, index) => {
          summary += `\n${index + 1}. ${useCase.name || useCase.title || 'Use Case'}\n`;
          if (useCase.description) {
            summary += `   Description: ${useCase.description}\n`;
          }
          if (useCase.impact) {
            summary += `   Impact: ${useCase.impact}\n`;
          }
          if (useCase.sector) {
            summary += `   Sector: ${useCase.sector}\n`;
          }
          if (useCase.domain) {
            summary += `   Domain: ${useCase.domain}\n`;
          }
        });
        summary += `\n`;
      }

      if (generatedStrategy.implementationDetails) {
        summary += `IMPLEMENTATION DETAILS:\n`;
        summary += `${generatedStrategy.implementationDetails}\n\n`;
      }

      if (generatedStrategy.recommendations) {
        summary += `RECOMMENDATIONS:\n`;
        summary += `${generatedStrategy.recommendations}\n\n`;
      }
    }

    // Add real world implementation examples
    if (filteredRealUseCases.length > 0) {
      summary += `REAL WORLD IMPLEMENTATION EXAMPLES (${filteredRealUseCases.length}):\n`;
      summary += `${'-'.repeat(40)}\n`;
      
      filteredRealUseCases.forEach((useCase, index) => {
        summary += `\n${index + 1}. ${useCase.company || useCase.Company || 'Implementation Example'}\n`;
        summary += `${'='.repeat(30)}\n`;
        
        if (useCase.BP) {
          summary += `BUSINESS OVERVIEW:\n`;
          summary += `${useCase.BP}\n\n`;
        }
        
        if (useCase['Real Project 1']) {
          summary += `GLOBAL IMPLEMENTATION:\n`;
          summary += `${useCase['Real Project 1']}\n\n`;
        }
        
        if (useCase['Real Project 2']) {
          summary += `REGIONAL IMPLEMENTATION:\n`;
          summary += `${useCase['Real Project 2']}\n\n`;
        }
        
        if (useCase.Sector) {
          summary += `Sector: ${useCase.Sector}\n`;
        }
        
        summary += `\n`;
      });
    }

    // Add summary statistics
    summary += `SUMMARY STATISTICS:\n`;
    summary += `${'-'.repeat(20)}\n`;
    if (generatedStrategy?.matchedUseCases) {
      summary += `Total Matched Use Cases: ${generatedStrategy.matchedUseCases.length}\n`;
    }
    summary += `Total Real World Examples: ${filteredRealUseCases.length}\n`;
    if (selectedMetric) {
      summary += `Applied Filter: ${selectedMetric}\n`;
    }
    summary += `Active Tab: ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}\n`;
    
    summary += `\n${'='.repeat(50)}\n`;
    summary += `End of AI Strategy Dashboard Summary\n`;

    return summary;
  };

  // Download summary as text file
  const downloadSummary = () => {
    const summaryText = generateSummaryText();
    const blob = new Blob([summaryText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai-strategy-summary-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Search CSV file for real use cases matching the given use case
  const searchRealUseCases = async (useCase: any) => {
    if (!useCase || !useCase.businessProcess) {
      console.log('No use case provided or missing businessProcess');
      return;
    }
    
    console.log('Starting real use cases search with:', useCase);
    
    setLoadingRealUseCases(true);
    
    try {
      console.log('Searching real cases for:', {
        businessProcess: useCase.businessProcess,
        functionalArea: useCase.functionalAreas?.[0],
        aiUseCase: useCase.aiUseCase,
        sector: filters.sector
      });

      // Load CSV content based on sector
      const csvContent = await loadCSVContent(filters.sector || 'service');
      
      console.log('CSV content loaded, rows:', csvContent.length);
      
      // Search using the three criteria in order
      const matches = searchRealCasesInCSV(
        csvContent,
        useCase.businessProcess,
        useCase.functionalAreas?.[0] || '',
        useCase.aiUseCase || ''
      );

      console.log('CSV search results:', matches.length, 'matches found');
      console.log('First match:', matches[0]);

      // Convert matches to the expected format
      const formattedMatches = matches.map((match) => ({
        id: match.id,
        // Use the clean details from CSV service (already formatted)
        BP: match.details, // This now contains the clean business process summary
        details: match.details, // Same clean summary, no duplication with real cases
        realCase1: match.realCase1,
        realCase2: match.realCase2,
        matchScore: match.matchScore,
        // Map CSV fields to expected display fields - no duplicate mappings
        'Real Project 1': match.realCase1, // First real case example
        'Real Project 2': match.realCase2, // Second real case example
        company: 'Real Case Example', // Generic company name since CSV doesn't specify
        Company: 'Real Case Example'
      }));

      console.log('Formatted matches:', formattedMatches.length);
      setRealUseCasesData(formattedMatches);
      
    } catch (error) {
      console.error('Error searching CSV for real cases:', error);
      setRealUseCasesData([]);
    } finally {
      setLoadingRealUseCases(false);
    }
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
      const aiTableName = filters.sector === 'Service' ? 'Service_Ai_Cases_Updated' : 'Manufacturing_Ai_Cases_Updated';
      
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
            // expectedROI: useCase['Impact'] ? 'High' : 'Medium',
            expectedROI: useCase['Expected ROI'],
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
            }
            
            // Determine if custom development is required
            const customDevField = aiCase['Custom Development (Yes/No)'] || aiCase.customDev;
            const customDev = 
              customDevField === 'Yes' || 
              customDevField === 'yes' || 
              customDevField === 'YES' ||
              customDevField === true;
            
            // Use existing useCase field or the Use_Case field from database
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
              
              // Use the correct column names from your database
              dataQuantitative: aiCase['Data Needs (Quantitative)'] || '',
              dataQualitative: aiCase['Data Needs (Qualitative)'] || '',
              exampleSources: aiCase['Example Sources'] || '',
              dataAvailabilityNotes: aiCase['Data Availability Notes'] || '',
              
              // Add additional fields if available
              // expectedROI: aiCase['Expected ROI'] || aiCase.expectedROI || 'Medium'
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
              dataAvailability: "Unknown",
              dataAvailabilityNotes: "",
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
      
      // Search for real use cases based on the first matched use case
      if (response.matchedUseCases && Object.keys(response.matchedUseCases).length > 0) {
        const firstUseCase = response.matchedUseCases[Object.keys(response.matchedUseCases)[0]];
        await searchRealUseCases(firstUseCase);
      }
      
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
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white classic-shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex flex-wrap justify-center gap-x-8 gap-y-2" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('identification')}
              className={`py-3 px-2 border-b-2 font-medium text-lg min-h-[48px] ${
                activeTab === 'identification'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } transition-colors duration-200`}
            >
              Identification
            </button>
            <button
              onClick={() => setActiveTab('implementation')}
              className={`py-3 px-2 border-b-2 font-medium text-lg min-h-[48px] ${
                activeTab === 'implementation'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } transition-colors duration-200`}
            >
              Implementation
            </button>
            {/* ROI Calculator Tab */}
            <button
              onClick={() => setActiveTab('roi')}
              className={`py-3 px-2 border-b-2 font-medium text-lg min-h-[48px] flex items-center gap-2 ${
                activeTab === 'roi'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } transition-colors duration-200`}
            >
              <Calculator className="w-4 h-4" />
              ROI Calculator
            </button>
            
            {/* Financials Tab with Dropdown */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFinancialDropdown(!showFinancialDropdown);
                }}
                onMouseEnter={() => setShowFinancialDropdown(true)}
                className={`py-3 px-2 border-b-2 font-medium text-lg min-h-[48px] flex items-center gap-1 ${
                  activeTab === 'financials'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition-colors duration-200`}
              >
                Financials
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showFinancialDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              <div 
                className={`absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 transition-all duration-200 ${
                  showFinancialDropdown ? 'opacity-100 visible transform translate-y-0' : 'opacity-0 invisible transform -translate-y-2'
                }`}
                onClick={(e) => e.stopPropagation()}
                onMouseEnter={() => setShowFinancialDropdown(true)}
                onMouseLeave={() => setShowFinancialDropdown(false)}
              >
                <div className="py-2">
                  <button
                    onClick={() => {
                      setActiveTab('financials');
                      setShowFinancialDropdown(false);
                      if (onStartAnalysis) {
                        onStartAnalysis();
                      }
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 flex items-start gap-3"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Target className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">Current State Analysis</div>
                      <div className="text-xs text-gray-500">Assess your current AI readiness and capabilities</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => {
                      setActiveTab('financials');
                      setShowFinancialDropdown(false);
                      if (onStartFutureAnalysis) {
                        onStartFutureAnalysis();
                      }
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-150 flex items-start gap-3"
                  >
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">Future State Analysis</div>
                      <div className="text-xs text-gray-500">Plan your future AI implementation and ROI</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </nav>
        </div>
        
        {/* Download Summary Button */}
        <div className="flex justify-end">
          <button
            onClick={downloadSummary}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Download className="w-4 h-4" />
            Download Summary
          </button>
        </div>
      </div>

      {/* Header Title - Only show for identification tab */}
      {activeTab === 'identification' && (
        <div className="text-center mb-8 sm:mb-10 px-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 font-serif leading-tight">Explore Use Cases</h1>
          {/* a slogun for identifications tab */}
          {/* <p className="text-base sm:text-lg text-gray-600 font-medium tracking-wide">Filter step by step to find the details you need</p> */}
          <div className="w-24 h-1 gold-accent mx-auto mt-4"></div>
        </div>
      )}
    </div>
  </div>

  {/* Main Content */}
  <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
    {/* Tab Content */}
    {activeTab === 'identification' && (
      <>

      <div className="bg-white classic-shadow-lg classic-border p-6 sm:p-8 mb-10 sm:mb-12 rounded-lg">
        <div className="grid md:grid-cols-4 gap-6 mb-8 sm:mb-10">
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
              Step 4: Select a Job Role
            </label>
            <div className="relative">
              <select
                value={filters.stage}
                onChange={(e) => handleFilterChange('stage', e.target.value)}
                disabled={!filters.process}
                className="w-full classic-input appearance-none pr-10 disabled:bg-gray-100 disabled:text-gray-500 font-medium text-sm"
              >
                <option value="">Choose job role...</option>
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

  <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center mt-2">
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
        </div>

        {canGenerate && !isGenerating && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-900 rounded-r-lg text-sm sm:text-base">
            <p className="text-blue-900 text-sm font-semibold tracking-wide">
              Ready to generate strategy for: <strong>{filters.sector}</strong> → <strong>{filters.domain}</strong> → <strong>{filters.process}</strong> → <strong>{filters.stage}</strong>
            </p>
          </div>
        )}

        {isGenerating && (
          <div className="mt-6 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-900 classic-shadow rounded-r-lg">
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
        <div>
          {generatedStrategy ? (
            <div className="space-y-8">
              <div className="text-center mb-8 sm:mb-10 px-2">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 font-serif leading-tight">AI Strategy Implementation</h2>
                <p className="text-base sm:text-lg text-gray-600 font-medium tracking-wide">Your personalized AI transformation roadmap</p>
                <div className="w-24 h-1 gold-accent mx-auto mt-4"></div>
              </div>

              {/* Filter Controls */}
              <div className="bg-white classic-shadow classic-border p-5 sm:p-6 mb-8">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                    <Filter className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-bold text-gray-800 uppercase tracking-widest">Filter by Value Metric:</span>
                    <select
                      value={selectedMetric}
                      onChange={(e) => setSelectedMetric(e.target.value)}
                      className="classic-input text-sm font-medium"
                    >
                      <option value="">All Metrics</option>
                      <option value="Finance">Finance</option>
                      <option value="Quality">Quality</option>
                      <option value="Time">Time</option>
                    </select>
                  </div>
                  <button
                    onClick={() => setSelectedMetric('')}
                    className="flex items-center space-x-2 sm:space-x-3 classic-button-secondary text-xs"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Clear Filter</span>
                  </button>
                </div>
              </div>

              {/* Strategy Content */}
              <div className="grid gap-8">
                {(() => {
                  // Filter use cases by selected metric
                  const filteredUseCases = Object.entries(generatedStrategy.matchedUseCases).filter(([, useCase]: [string, any]) => {
                    if (!selectedMetric) return true; // Show all if no filter selected
                    return useCase.primaryMetric === selectedMetric || useCase.secondaryMetric === selectedMetric;
                  });

                  // Get the AI use case names from filtered matched use cases
                  const filteredAIUseCaseNames = filteredUseCases.map(([, useCase]: [string, any]) => useCase.aiUseCase);
                  
                  // Filter AI use cases based on matched use cases
                  const filteredAIUseCases = Object.entries(generatedStrategy.aiUseCases).filter(([, aiCase]: [string, any]) => {
                    if (!selectedMetric) return true; // Show all if no filter selected
                    return filteredAIUseCaseNames.includes(aiCase.useCase);
                  });

                  // Filter real use cases based on matched use cases (if they have similar business process/functional areas)
                  const filteredRealUseCases = realUseCasesData.filter((realCase: any) => {
                    if (!selectedMetric) return true; // Show all if no filter selected
                    // Check if any filtered matched use case relates to this real use case
                    return filteredUseCases.some(([, useCase]: [string, any]) => {
                      const bpText = realCase.BP || '';
                      return bpText.includes(useCase.businessProcess) || 
                             bpText.includes(useCase.functionalAreas?.[0] || '') ||
                             bpText.includes(useCase.aiUseCase || '');
                    });
                  });

                  return (
                    <>
                      {/* Matched Use Cases Section */}
                      {filteredUseCases.length > 0 && (
                        <div className="bg-white classic-shadow-lg classic-border rounded-lg p-6 sm:p-8">
                          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <CheckCircle2 className="w-6 h-6 mr-3 text-green-600" />
                            Matched Business Use Cases
                            {selectedMetric && (
                              <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                Filtered by: {selectedMetric}
                              </span>
                            )}
                          </h3>
                          <div className="grid gap-6">
                            {filteredUseCases.map(([key, useCase]: [string, any]) => (
                              <div key={key} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Business Process</h4>
                                    <p className="text-gray-700 mb-4">{useCase.businessProcess}</p>
                                    
                                    <h4 className="font-semibold text-gray-900 mb-2">Job Role</h4>
                                    <p className="text-gray-700 mb-4">{useCase.jobRole}</p>

                                    {/* Primary and Secondary Metrics */}
                                    <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                                      <div>
                                        <h4 className="text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide">Primary Metric</h4>
                                        <span className="px-3 py-1 bg-green-50 text-green-800 text-xs font-bold uppercase tracking-wide border border-green-200 rounded">
                                          {useCase.primaryMetric}
                                        </span>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide">Secondary Metric</h4>
                                        <span className="px-3 py-1 bg-orange-50 text-orange-800 text-xs font-bold uppercase tracking-wide border border-orange-200 rounded">
                                          {useCase.secondaryMetric}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">AI Use Case</h4>
                                    <p className="text-gray-700 mb-4">{useCase.aiUseCase}</p>
                                    
                                    <h4 className="font-semibold text-gray-900 mb-2">Expected Impact</h4>
                                    <p className="text-gray-700 mb-4">{useCase.impact}</p>

                                    {/* Expected ROI */}
                                    <div className="pt-4 border-t border-gray-200">
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-gray-800 uppercase tracking-wide">Expected ROI:</span>
                                        <span className="text-sm font-bold text-green-700 bg-green-50 px-3 py-1 border border-green-200 rounded">{useCase.expectedROI}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {filteredUseCases.length === 0 && selectedMetric && (
                            <div className="text-center py-8">
                              <p className="text-gray-500">No use cases match the selected metric: <strong>{selectedMetric}</strong></p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* AI Use Cases Section */}
                      {filteredAIUseCases.length > 0 && (
                        <div className="bg-white classic-shadow-lg classic-border rounded-lg p-6 sm:p-8">
                          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <Sparkles className="w-6 h-6 mr-3 text-blue-600" />
                            AI Implementation Details
                            {selectedMetric && (
                              <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                Filtered by: {selectedMetric}
                              </span>
                            )}
                          </h3>
                          <div className="grid gap-6">
                            {filteredAIUseCases.map(([key, aiCase]: [string, any]) => (
                              <div key={key} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                <h4 className="font-semibold text-gray-900 mb-4 text-lg">{aiCase.useCase}</h4>
                                
                                {/* First Row - AI System Type and Custom Development */}
                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <span className="text-sm font-medium text-gray-500">AI System Type:</span>
                                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                                      {aiCase.aiSystemType}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium text-gray-500">Custom Development Needed:</span>
                                    <span className={`ml-2 px-2 py-1 rounded text-sm ${
                                      aiCase.customDev 
                                        ? 'bg-orange-100 text-orange-800' 
                                        : 'bg-green-100 text-green-800'
                                    }`}>
                                      {aiCase.customDev ? 'Yes' : 'No'}
                                    </span>
                                  </div>
                                </div>

                                {/* Data Requirements Section */}
                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                  {aiCase.dataQuantitative && (
                                    <div>
                                      <span className="text-sm font-medium text-gray-500 block mb-2">Data Needs (Quantitative):</span>
                                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                        <p className="text-blue-800 text-sm">{aiCase.dataQuantitative}</p>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {aiCase.dataQualitative && (
                                    <div>
                                      <span className="text-sm font-medium text-gray-500 block mb-2">Data Needs (Qualitative):</span>
                                      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                                        <p className="text-indigo-800 text-sm">{aiCase.dataQualitative}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Example Sources */}
                                {aiCase.exampleSources && (
                                  <div className="mb-4">
                                    <span className="text-sm font-medium text-gray-500 block mb-2">Example Sources:</span>
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                      <p className="text-green-800 text-sm leading-relaxed whitespace-pre-wrap">{aiCase.exampleSources}</p>
                                    </div>
                                  </div>
                                )}

                                {/* Data Availability Notes */}
                                {aiCase.dataAvailabilityNotes && (
                                  <div className="mb-4">
                                    <span className="text-sm font-medium text-gray-500 block mb-2">Data Availability Notes:</span>
                                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                                      <p className="text-purple-800 text-sm leading-relaxed whitespace-pre-wrap">{aiCase.dataAvailabilityNotes}</p>
                                    </div>
                                  </div>
                                )}

                                {/* Recommended Tools */}
                                {aiCase.tools && aiCase.tools.length > 0 && (
                                  <div className="mb-4">
                                    <span className="text-sm font-medium text-gray-500 block mb-2">Recommended Tools/Platforms:</span>
                                    <div className="flex flex-wrap gap-2">
                                      {aiCase.tools.map((tool: string, index: number) => (
                                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                                          {tool}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Implementation Notes */}
                                {aiCase.implementationNotes && (
                                  <div className="mb-4">
                                    <span className="text-sm font-medium text-gray-500 block mb-2">Notes on Implementation:</span>
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                      <p className="text-yellow-800 text-sm leading-relaxed whitespace-pre-wrap">
                                        {aiCase.implementationNotes}
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {/* Expected ROI */}
                                {aiCase.expectedROI && (
                                  <div className="pt-3 border-t border-gray-200">
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm font-medium text-gray-500">Expected ROI:</span>
                                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                        {aiCase.expectedROI}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Real Use Cases Section */}
                      {filteredRealUseCases.length > 0 && (
                        <div className="bg-white classic-shadow-lg classic-border rounded-lg p-8">
                          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <Target className="w-6 h-6 mr-3 text-purple-600" />
                            Real World Implementation Examples
                            {selectedMetric && (
                              <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                Filtered by: {selectedMetric}
                              </span>
                            )}
                          </h3>
                          
                          <div className="grid gap-8">
                            {filteredRealUseCases.map((useCase) => (
                              <div
                                key={useCase.id}
                                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                              >
                                <div className="p-8">
                                  {/* Business Case Overview */}
                                  {useCase.BP && (
                                    <div className="mb-8">
                                      <div className="flex items-center mb-4">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                          <Lightbulb className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">Business Overview</h3>
                                      </div>
                                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-l-4 border-blue-500">
                                        <div className="text-sm text-gray-700 leading-relaxed">
                                          {useCase.BP}
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Implementation Projects */}
                                  <div className="grid lg:grid-cols-2 gap-6">
                                    {/* Real Project 1 */}
                                    {useCase['Real Project 1'] && (
                                      <div className="group">
                                        <div className="flex items-center mb-4">
                                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3 text-white">
                                            <span className="text-sm font-bold">1</span>
                                          </div>
                                          <h3 className="text-lg font-semibold text-gray-900">Global Implementation</h3>
                                          <div className="ml-auto">
                                            <Globe className="w-5 h-5 text-blue-500" />
                                          </div>
                                        </div>
                                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 group-hover:shadow-lg transition-shadow duration-300">
                                          <div 
                                            className="text-sm text-blue-800 leading-relaxed space-y-3"
                                            dangerouslySetInnerHTML={{ __html: formatTextWithBoldHeadings(useCase['Real Project 1']) }}
                                          />
                                        </div>
                                      </div>
                                    )}

                                    {/* Real Project 2 */}
                                    {useCase['Real Project 2'] && (
                                      <div className="group">
                                        <div className="flex items-center mb-4">
                                          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3 text-white">
                                            <span className="text-sm font-bold">2</span>
                                          </div>
                                          <h3 className="text-lg font-semibold text-gray-900">Regional Implementation</h3>
                                          <div className="ml-auto">
                                            <MapPin className="w-5 h-5 text-emerald-500" />
                                          </div>
                                        </div>
                                        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200 group-hover:shadow-lg transition-shadow duration-300">
                                          <div 
                                            className="text-sm text-emerald-800 leading-relaxed space-y-3"
                                            dangerouslySetInnerHTML={{ __html: formatTextWithBoldHeadings(useCase['Real Project 2']) }}
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>


                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* No Results Message */}
                      {selectedMetric && filteredUseCases.length === 0 && (
                        <div className="text-center py-12">
                          <p className="text-lg text-gray-500">No use cases match the selected metric: <strong>{selectedMetric}</strong></p>
                          <p className="text-sm text-gray-400 mt-2">Try selecting a different metric or clear the filter to see all results.</p>
                        </div>
                      )}
                    </>
                  );
                })()}

                {loadingRealUseCases && (
                  <div className="bg-white classic-shadow-lg classic-border rounded-lg p-8">
                    <div className="text-center py-8">
                      <p className="text-gray-500">Loading real world implementation examples...</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 px-2">
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
            <div className="text-center py-4 sm:py-6 px-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Implementation Phase</h2>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">Generate an AI strategy from the Identification tab to see your implementation roadmap.</p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 max-w-2xl mx-auto">
                <p className="text-blue-800 text-sm sm:text-base">Once you generate a strategy, this section will contain your personalized implementation guides, AI use cases, and execution roadmap.</p>
              </div>
              <button
                onClick={() => setActiveTab('identification')}
                className="mt-3 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Identification
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'financials' && (
        <div className="max-w-4xl mx-auto px-4 py-16 sm:py-20">
          {/* Financial Analysis Dropdown Navigation */}
          <div className="mb-8">
            <div className="flex justify-center">
              <div className="relative">
                <button
                  onClick={() => setShowFinancialDropdown(!showFinancialDropdown)}
                  className="bg-white border border-gray-300 rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <span className="text-gray-700 font-medium">Financial Analysis Options</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showFinancialDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showFinancialDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <button
                      onClick={() => {
                        if (onStartAnalysis) {
                          onStartAnalysis();
                        }
                        setShowFinancialDropdown(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex items-center gap-3 border-b border-gray-100"
                    >
                      <Target className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="font-medium text-gray-900">Current State Analysis</div>
                        <div className="text-sm text-gray-500">Assess AI readiness & gaps</div>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        if (onStartFutureAnalysis) {
                          onStartFutureAnalysis();
                        }
                        setShowFinancialDropdown(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-green-50 transition-colors flex items-center gap-3"
                    >
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <div>
                        <div className="font-medium text-gray-900">Future State Analysis</div>
                        <div className="text-sm text-gray-500">ROI projections & planning</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Financial Analysis Hub</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose your analysis path to understand the financial impact of AI implementation in your business.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Current State Analysis Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Current State Analysis</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Assess your organization's current AI readiness, capabilities, and identify opportunities for improvement across technology, processes, and people.
                </p>
                <ul className="space-y-2 mb-6 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Technology infrastructure assessment
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Current process evaluation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Team readiness analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Comprehensive scoring report
                  </li>
                </ul>
                <button
                  onClick={() => {
                    if (onStartAnalysis) {
                      onStartAnalysis();
                    }
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <Target className="w-4 h-4" />
                  Start Current State Analysis
                </button>
              </div>
            </div>

            {/* Future State Analysis Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Future State Analysis</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Plan your future AI implementation strategy, calculate ROI projections, and create a roadmap for achieving your AI transformation goals.
                </p>
                <ul className="space-y-2 mb-6 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ROI calculation and projections
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Implementation timeline planning
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Resource requirement analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Strategic roadmap creation
                  </li>
                </ul>
                <button
                  onClick={() => {
                    if (onStartFutureAnalysis) {
                      onStartFutureAnalysis();
                    }
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  Start Future State Analysis
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
              <p className="text-blue-800 text-sm leading-relaxed">
                <strong>Recommendation:</strong> Start with the Current State Analysis to establish your baseline, 
                then proceed to Future State Analysis for strategic planning and ROI projections.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'roi' && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 font-serif leading-tight">AI ROI Calculator</h2>
            <p className="text-base sm:text-lg text-gray-600 font-medium tracking-wide">Calculate your AI transformation return on investment</p>
            <div className="w-24 h-1 gold-accent mx-auto mt-4"></div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calculator className="w-8 h-8 mr-3" />
                  <div>
                    <h3 className="text-xl font-bold">ROI Dashboard & Calculator</h3>
                    <p className="text-blue-100">Comprehensive AI investment analysis tools</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowROICalculator(true)}
                  className="bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2 backdrop-blur-sm"
                >
                  <Calculator className="w-4 h-4" />
                  Open Calculator
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">ROI Analysis</h4>
                  <p className="text-sm text-gray-600">Calculate return on investment, payback period, and financial metrics</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Process Analysis</h4>
                  <p className="text-sm text-gray-600">Analyze current vs. future process efficiency and cost savings</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Export Reports</h4>
                  <p className="text-sm text-gray-600">Download comprehensive reports in multiple formats (CSV, PDF, HTML)</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">Real-time ROI calculations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">Process efficiency analysis</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">Cost-benefit breakdown</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">Investment payback timeline</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">Executive summary reports</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">CSV data export</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowROICalculator(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 mx-auto"
                >
                  <Calculator className="w-5 h-5" />
                  Launch ROI Calculator
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ROI Calculator Modal */}
      {showROICalculator && (
        <AIROICalculator 
          onClose={() => setShowROICalculator(false)}
        />
      )}
    </div>
  </div>
  );
};

export default Dashboard;