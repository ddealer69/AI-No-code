import Papa from 'papaparse';



export interface RealCaseMatch {
  id: number;
  details: string;
  realCase1: string;
  realCase2: string;
  matchScore: number;
  csvBusinessProcess?: string;
  csvFunctionalArea?: string;
  csvAiUseCase?: string;
  csvImpact?: string;
  isExactMatch?: boolean;
}

/**
 * Parse CSV content and search for matching real cases
 * @param csvContent - The raw CSV content as string
 * @param businessProcess - Business process name to search for
 * @param functionalArea - Functional area to search for  
 * @param aiUseCase - AI use case description to search for
 * @returns Array of matching real cases from the CSV
 */
// Helper function to clean text with better normalization for AI use cases
const cleanSearchText = (text: string): string => {
  if (!text) return '';
  
  return text
    .replace(/^[-\s•*]+/, '') // Remove leading dash, bullets, spaces
    .replace(/[-\s•*]+$/, '') // Remove trailing dash, bullets, spaces
    .replace(/\s*[-•*]\s*/g, ' ') // Replace bullets/dashes within text with spaces
    .replace(/e\.g\.,?/gi, 'eg') // Replace e.g., with eg
    .replace(/AI/gi, 'ai') // Normalize AI capitalization
    .replace(/ML/gi, 'ml') // Normalize ML capitalization  
    .replace(/NLP/gi, 'nlp') // Normalize NLP capitalization
    .replace(/GPT/gi, 'gpt') // Normalize GPT capitalization
    .replace(/[^\w\s\-\&\/\(\)]/g, '') // Keep alphanumeric, spaces, hyphens, &, /, ()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim()
    .toLowerCase();
};





// Simple but robust search function
export const searchRealCasesInCSV = (
  csvData: any[],
  businessProcess: string,
  functionalArea: string,
  aiUseCase: string
): RealCaseMatch[] => {
  if (!csvData || csvData.length === 0) {
    console.log('No CSV data available for search');
    return [];
  }

  console.log('🔍 Simple Robust CSV Search Started');
  console.log('Search criteria:', { businessProcess, functionalArea, aiUseCase });
  
  const matches: RealCaseMatch[] = [];
  
  // Clean search terms - simple but effective
  const cleanBP = cleanSearchText(businessProcess || '');
  const cleanFA = cleanSearchText(functionalArea || '');
  const cleanAI = cleanSearchText(aiUseCase || '');
  
  console.log('Cleaned search terms:', { cleanBP, cleanFA, cleanAI });

  csvData.forEach((row, index) => {
    // Skip header row or empty rows
    if (!row || !row.Details || row.Details === 'Details') {
      return;
    }

    const detailsField = row.Details.toString().trim();
    if (!detailsField) return;

    // Parse the Details field - Format: "BusinessProcess1, BusinessProcess2, FunctionalArea, AIUseCase, Impact"
    const parts = detailsField.split(',').map((part: string) => part.trim());
    
    if (parts.length < 4) {
      return; // Skip if not enough parts
    }

    const csvData_parsed = {
      businessProcess: cleanSearchText((parts[0] + ' ' + (parts[1] || '')).trim()),
      functionalArea: cleanSearchText(parts[2] || ''), 
      aiUseCase: cleanSearchText(parts[3] || ''),
      impact: parts[4] || ''
    };

    // Simple scoring - focus on what matters most
    let score = 0;
    let matchDetails = '';

    // 1. AI Use Case is most important (50% weight)
    if (cleanAI && csvData_parsed.aiUseCase) {
      if (csvData_parsed.aiUseCase.includes(cleanAI) || cleanAI.includes(csvData_parsed.aiUseCase)) {
        score += 50; // Perfect AI match
        matchDetails += 'AI-exact ';
      } else {
        // Check word overlap for AI use case
        const aiWords = cleanAI.split(' ').filter(w => w.length > 2);
        const csvAiWords = csvData_parsed.aiUseCase.split(' ').filter(w => w.length > 2);
        let aiMatches = 0;
        
        for (const word of aiWords) {
          if (csvAiWords.some(csvWord => csvWord.includes(word) || word.includes(csvWord))) {
            aiMatches++;
          }
        }
        
        if (aiMatches >= Math.max(1, aiWords.length * 0.4)) {
          score += Math.min(40, aiMatches * 8); // Scale based on matches
          matchDetails += `AI-partial(${aiMatches}) `;
        }
      }
    }

    // 2. Business Process is second most important (30% weight)  
    if (cleanBP && csvData_parsed.businessProcess) {
      if (csvData_parsed.businessProcess.includes(cleanBP) || cleanBP.includes(csvData_parsed.businessProcess)) {
        score += 30; 
        matchDetails += 'BP-exact ';
      } else {
        const bpWords = cleanBP.split(' ').filter(w => w.length > 2);
        const csvBpWords = csvData_parsed.businessProcess.split(' ').filter(w => w.length > 2);
        let bpMatches = 0;
        
        for (const word of bpWords) {
          if (csvBpWords.some(csvWord => csvWord.includes(word) || word.includes(csvWord))) {
            bpMatches++;
          }
        }
        
        if (bpMatches >= Math.max(1, bpWords.length * 0.3)) {
          score += Math.min(20, bpMatches * 5);
          matchDetails += `BP-partial(${bpMatches}) `;
        }
      }
    }

    // 3. Functional Area is least important (20% weight) - often missing
    if (cleanFA && csvData_parsed.functionalArea) {
      if (csvData_parsed.functionalArea.includes(cleanFA) || cleanFA.includes(csvData_parsed.functionalArea)) {
        score += 20;
        matchDetails += 'FA-exact ';
      } else {
        const faWords = cleanFA.split(' ').filter(w => w.length > 2);
        const csvFaWords = csvData_parsed.functionalArea.split(' ').filter(w => w.length > 2);
        let faMatches = 0;
        
        for (const word of faWords) {
          if (csvFaWords.some(csvWord => csvWord.includes(word) || word.includes(csvWord))) {
            faMatches++;
          }
        }
        
        if (faMatches >= Math.max(1, faWords.length * 0.3)) {
          score += Math.min(15, faMatches * 3);
          matchDetails += `FA-partial(${faMatches}) `;
        }
      }
    }

    // Bonus points for multiple field matches
    const fieldsMatched = (score >= 25 ? 1 : 0) + (score >= 10 ? 1 : 0) + (score >= 5 ? 1 : 0);
    if (fieldsMatched >= 2) {
      score += fieldsMatched * 5; // Bonus for multi-field matches
      matchDetails += `MultiMatch(${fieldsMatched}) `;
    }

    // Minimum threshold - be more lenient
    const threshold = cleanFA && cleanFA.length > 0 ? 25 : 20; // Lower threshold if no functional area
    
    console.log(`Row ${index + 1}: Score=${score}, Threshold=${threshold}, Match=${matchDetails}, CSV_AI="${csvData_parsed.aiUseCase.substring(0, 60)}..."`);

    if (score >= threshold) {
      matches.push({
        id: index + 1,
        details: `${parts[0]}, ${parts[1]}, ${parts[2]}, ${parts[3]}${parts[4] ? ', ' + parts[4] : ''}`,
        realCase1: row['Real case 1'] || '',
        realCase2: row['Real case 2'] || '',
        matchScore: Math.min(score / 100, 1.0), // Normalize to 0-1
        csvBusinessProcess: parts[0] + ' ' + (parts[1] || ''),
        csvFunctionalArea: parts[2],
        csvAiUseCase: parts[3],
        csvImpact: parts[4] || '',
        isExactMatch: score >= 80
      });
    }
  });

  console.log(`✅ Found ${matches.length} matches using simple robust algorithm`);
  
  // Sort by score (highest first)
  const sortedMatches = matches.sort((a, b) => b.matchScore - a.matchScore);
  
  // Return only the best match
  const result = sortedMatches.slice(0, 1);
  
  if (result.length > 0) {
    console.log(`🎯 Best match:`, result.map(m => ({
      id: m.id,
      score: (m.matchScore * 100).toFixed(0) + '%',
      ai: m.csvAiUseCase?.substring(0, 40) + '...'
    })));
  } else {
    console.log('❌ No matches found');
  }
  
  return result;
};

/**
 * Load CSV file content
 * @param filePath - Path to the CSV file
 * @returns Promise resolving to CSV content as string
 */
// Comprehensive search across all available CSV files
export const searchAllCSVFiles = async (
  businessProcess: string,
  functionalArea: string,
  aiUseCase: string
): Promise<RealCaseMatch[]> => {
  const csvFiles = ['service', 'product', 'manufacturing'];
  const allMatches: RealCaseMatch[] = [];
  
  console.log('🔍 Searching across all CSV files for best matches...');
  
  for (const sector of csvFiles) {
    try {
      const csvData = await loadCSVContent(sector);
      const matches = searchRealCasesInCSV(csvData, businessProcess, functionalArea, aiUseCase);
      
      if (matches.length > 0) {
        console.log(`✅ Found ${matches.length} matches in ${sector} sector`);
        allMatches.push(...matches);
      }
    } catch (error) {
      console.log(`⚠️ Could not load ${sector} CSV:`, (error as Error).message);
    }
  }
  
  // Sort all matches by score and return the best
  const sortedMatches = allMatches.sort((a, b) => b.matchScore - a.matchScore);
  return sortedMatches.slice(0, 1); // Return only the best match across all files
};

// Optimized search function for Dashboard use cases (handles missing functional area gracefully)
export const searchRealCasesForDashboard = async (
  businessProcess: string,
  functionalArea: string | undefined,
  aiUseCase: string,
  sector: string = 'service'
): Promise<RealCaseMatch[]> => {
  console.log('🎯 Dashboard-optimized search started');
  console.log('Search params:', { 
    businessProcess, 
    functionalArea: functionalArea || '(not provided)', 
    aiUseCase: aiUseCase?.substring(0, 50) + '...',
    sector 
  });

  try {
    // Try primary sector first
    let csvData = await loadCSVContent(sector);
    let matches = searchRealCasesInCSV(csvData, businessProcess, functionalArea || '', aiUseCase);
    
    // If no good matches, try other sectors
    if (matches.length === 0 || matches[0].matchScore < 0.6) {
      console.log('🔄 Trying additional sectors for better matches...');
      const additionalMatches = await searchAllCSVFiles(businessProcess, functionalArea || '', aiUseCase);
      
      if (additionalMatches.length > 0 && additionalMatches[0].matchScore > (matches[0]?.matchScore || 0)) {
        matches = additionalMatches;
      }
    }
    
    console.log(`✅ Dashboard search complete: ${matches.length} matches found`);
    return matches;
    
  } catch (error) {
    console.error('❌ Dashboard search error:', error);
    return [];
  }
};

// Function to load CSV content from public directory based on sector
export const loadCSVContent = async (sector: string): Promise<any[]> => {
  try {
    // Determine which CSV file to use based on sector
    let csvPath: string;
    const sectorLower = sector.toLowerCase();
    
    if (sectorLower === 'service' || sectorLower === 'services') {
      csvPath = '/serv-cases.csv';
    } else if (sectorLower === 'manufacturing' || sectorLower === 'manu') {
      csvPath = '/manu-cases.csv';
    } else if (sectorLower === 'product' || sectorLower === 'products') {
      csvPath = '/real-cases.csv';
    } else {
      // Default fallback - try service first, then others
      csvPath = '/serv-cases.csv';
    }
    
    console.log('Loading CSV from path:', csvPath, 'for sector:', sector);
    
    let response = await fetch(csvPath);
    
    // If the primary file fails, try fallback files
    if (!response.ok && csvPath === '/serv-cases.csv') {
      console.log('Service CSV failed, trying real-cases.csv');
      csvPath = '/real-cases.csv';
      response = await fetch(csvPath);
    }
    
    if (!response.ok && csvPath === '/real-cases.csv') {
      console.log('Real cases CSV failed, trying manu-cases.csv');
      csvPath = '/manu-cases.csv';
      response = await fetch(csvPath);
    }
    
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`);
    }
    
    const csvText = await response.text();
    console.log('CSV text loaded, length:', csvText.length, 'from:', csvPath);
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log('Parsed CSV data:', results.data.length, 'rows');
          if (results.data.length > 0) {
            console.log('Sample row structure:', Object.keys(results.data[0] as object));
            console.log('Sample row data:', results.data[0]);
          }
          resolve(results.data);
        },
        error: (error: any) => {
          console.error('CSV parsing error:', error);
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error loading CSV:', error);
    throw error;
  }
};