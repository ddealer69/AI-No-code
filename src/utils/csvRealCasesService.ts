import Papa from 'papaparse';

interface CSVRow {
  'S No.': string;
  'Details': string;
  'Real case 1': string;
  'Real case 2': string;
}

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
// Helper function to clean text according to specific formatting rules
const cleanSearchText = (text: string): string => {
  if (!text) return '';
  
  return text
    .replace(/^-\s*/, '') // Remove leading dash and space
    .replace(/-/g, '') // Remove all hyphens (step-by-step -> stepbystep)
    .replace(/e\.g\.,?/gi, 'eg') // Replace e.g., with eg
    .replace(/\./g, '') // Remove all periods
    .replace(/[^\w\s]/g, '') // Remove special characters except letters, numbers, and spaces
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim()
    .toLowerCase();
};

// Enhanced search function for real use cases in CSV data
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

  console.log('Searching CSV with criteria:', { businessProcess, functionalArea, aiUseCase });

  // Clean the search criteria according to the formatting rules
  const cleanedBusinessProcess = cleanSearchText(businessProcess);
  const cleanedFunctionalArea = cleanSearchText(functionalArea);
  const cleanedAiUseCase = cleanSearchText(aiUseCase);
  
  console.log('Cleaned search criteria:', { 
    cleanedBusinessProcess, 
    cleanedFunctionalArea, 
    cleanedAiUseCase 
  });
  
  const matches: RealCaseMatch[] = [];

  csvData.forEach((row, index) => {
    console.log(`Row ${index} structure:`, Object.keys(row));
    console.log(`Row ${index} data:`, row);
    
    // Try different possible column names for the details
    const detailsField = row.Details || row['Details'] || row.details;
    if (!detailsField) {
      console.log(`Row ${index} has no Details field, skipping`);
      return;
    }

    console.log(`Processing row ${index}:`, detailsField);
    
    // Parse the Details column according to the specific structure:
    // {Business-process},  {Key_functional_areas}, {AI Use Cases},{Impact}
    // Note: 2 spaces after business process comma, no space after AI use cases comma
    
    // First, let's split by commas but handle the specific spacing
    let detailParts: string[] = [];
    let remainingText = detailsField;
    
    // Extract business process (everything up to first ", " with 2 spaces)
    const businessProcessMatch = remainingText.match(/^([^,]+),\s{2}/);
    if (businessProcessMatch) {
      detailParts.push(businessProcessMatch[1].trim());
      remainingText = remainingText.substring(businessProcessMatch[0].length);
    } else {
      // Fallback: split by comma and take first part
      const parts = remainingText.split(',');
      detailParts.push(parts[0].trim());
      remainingText = parts.slice(1).join(',');
    }
    
    // Extract functional area (everything up to next comma)
    const functionalAreaMatch = remainingText.match(/^([^,]+),/);
    if (functionalAreaMatch) {
      detailParts.push(functionalAreaMatch[1].trim());
      remainingText = remainingText.substring(functionalAreaMatch[0].length);
    } else {
      const parts = remainingText.split(',');
      detailParts.push(parts[0].trim());
      remainingText = parts.slice(1).join(',');
    }
    
    // Extract AI use case (everything up to next comma, no space after)
    const aiUseCaseMatch = remainingText.match(/^([^,]+),([^,]*)/);
    if (aiUseCaseMatch) {
      detailParts.push(aiUseCaseMatch[1].trim());
      detailParts.push(aiUseCaseMatch[2].trim()); // Impact
    } else {
      // Fallback: split remaining by comma
      const parts = remainingText.split(',');
      detailParts.push(parts[0]?.trim() || '');
      detailParts.push(parts[1]?.trim() || '');
    }
    
    if (detailParts.length < 3) {
      console.log(`Row ${index} doesn't have enough detail parts, skipping`);
      return;
    }

    // Extract and clean the parts
    const [csvBusinessProcess, csvFunctionalArea, csvAiUseCase, csvImpact] = detailParts;
    
    // Clean the CSV data according to the same rules
    const cleanedCsvBusinessProcess = cleanSearchText(csvBusinessProcess);
    const cleanedCsvFunctionalArea = cleanSearchText(csvFunctionalArea);
    const cleanedCsvAiUseCase = cleanSearchText(csvAiUseCase);
    const cleanedCsvImpact = csvImpact ? cleanSearchText(csvImpact.replace(/[\u{1F300}-\u{1F9FF}]/gu, '')) : ''; // Remove emojis from impact

    console.log(`Row ${index} parsed and cleaned:`, {
      original: { csvBusinessProcess, csvFunctionalArea, csvAiUseCase, csvImpact },
      cleaned: { cleanedCsvBusinessProcess, cleanedCsvFunctionalArea, cleanedCsvAiUseCase, cleanedCsvImpact }
    });

    // Calculate match score based on all three criteria
    let matchScore = 0;
    const maxScore = 3;

    // First check for exact matches (highest priority)
    const businessProcessExactMatch = cleanedCsvBusinessProcess === cleanedBusinessProcess;
    const functionalAreaExactMatch = cleanedCsvFunctionalArea === cleanedFunctionalArea;
    const aiUseCaseExactMatch = cleanedCsvAiUseCase === cleanedAiUseCase;

    // Check business process match (exact match gets full score, partial gets 0.8)
    if (cleanedCsvBusinessProcess && cleanedBusinessProcess) {
      if (businessProcessExactMatch) {
        matchScore++;
        console.log(`Business process EXACT match found for row ${index}`);
      } else if (cleanedCsvBusinessProcess.includes(cleanedBusinessProcess) ||
                 cleanedBusinessProcess.includes(cleanedCsvBusinessProcess)) {
        matchScore += 0.8;
        console.log(`Business process partial match found for row ${index}`);
      }
    }

    // Check functional area match (exact match gets full score, partial gets 0.8)
    if (cleanedCsvFunctionalArea && cleanedFunctionalArea) {
      if (functionalAreaExactMatch) {
        matchScore++;
        console.log(`Functional area EXACT match found for row ${index}`);
      } else if (cleanedCsvFunctionalArea.includes(cleanedFunctionalArea) ||
                 cleanedFunctionalArea.includes(cleanedCsvFunctionalArea)) {
        matchScore += 0.8;
        console.log(`Functional area partial match found for row ${index}`);
      }
    }

    // Check AI use case match (exact match gets full score, partial gets 0.8)
    if (cleanedCsvAiUseCase && cleanedAiUseCase) {
      if (aiUseCaseExactMatch) {
        matchScore++;
        console.log(`AI use case EXACT match found for row ${index}`);
      } else if (cleanedCsvAiUseCase.includes(cleanedAiUseCase) ||
                 cleanedAiUseCase.includes(cleanedCsvAiUseCase)) {
        matchScore += 0.8;
        console.log(`AI use case partial match found for row ${index}`);
      }
    }

    console.log(`Row ${index} match score: ${matchScore}/${maxScore}`);

    // Include results with at least 1.5 out of 3 matches for better coverage
    // Exact matches will have higher scores (3.0) and appear first
    if (matchScore >= 1.5) {
      matches.push({
        id: index + 1,
        // Use a clean summary for details instead of the full CSV field
        details: `${csvBusinessProcess}, ${csvFunctionalArea}, ${csvAiUseCase}${csvImpact ? ', ' + csvImpact : ''}`,
        realCase1: row['Real case 1'] || '',
        realCase2: row['Real case 2'] || '',
        matchScore: matchScore / maxScore,
        csvBusinessProcess,
        csvFunctionalArea,
        csvAiUseCase,
        csvImpact,
        isExactMatch: businessProcessExactMatch && functionalAreaExactMatch && aiUseCaseExactMatch
      });
    }
  });

  console.log(`Found ${matches.length} matches with score >= 1.5/3`);
  
  // Sort by match score (highest first), with exact matches prioritized
  const sortedMatches = matches.sort((a, b) => {
    // If one is exact match and other isn't, prioritize exact match
    if (a.isExactMatch && !b.isExactMatch) return -1;
    if (!a.isExactMatch && b.isExactMatch) return 1;
    // Otherwise sort by match score
    return b.matchScore - a.matchScore;
  });
  
  // Get top 3 relevant matches, but return only the highest scoring one
  const top3Matches = sortedMatches.slice(0, 3);
  console.log(`Top 3 matches:`, top3Matches.map(m => ({ id: m.id, score: m.matchScore, isExact: m.isExactMatch })));
  
  // Return only the highest scoring match (first in sorted array)
  const bestMatch = top3Matches.length > 0 ? [top3Matches[0]] : [];
  console.log(`Returning best match:`, bestMatch.length > 0 ? { id: bestMatch[0].id, score: bestMatch[0].matchScore } : 'No matches');
  
  return bestMatch;
};

/**
 * Load CSV file content
 * @param filePath - Path to the CSV file
 * @returns Promise resolving to CSV content as string
 */
// Function to load CSV content from public directory based on sector
export const loadCSVContent = async (sector: string): Promise<any[]> => {
  try {
    // Determine which CSV file to use based on sector
    const csvPath = sector.toLowerCase() === 'service' ? '/serv-cases.csv' : '/manu-cases.csv';
    
    console.log('Loading CSV from path:', csvPath, 'for sector:', sector);
    
    const response = await fetch(csvPath);
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`);
    }
    const csvText = await response.text();
    
    console.log('CSV text loaded, length:', csvText.length);
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log('Parsed CSV data:', results.data.length, 'rows');
          console.log('Sample row:', results.data[0]);
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