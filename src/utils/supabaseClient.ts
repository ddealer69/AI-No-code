// Save the strategy data to Supabase table for future reference
import { createClient } from '@supabase/supabase-js';

// Create a single Supabase client instance
const supabase = createClient(
  'https://kabdokfowpwrdgywjtfv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthYmRva2Zvd3B3cmRneXdqdGZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMzM3NTUsImV4cCI6MjA3MTgwOTc1NX0.8Nt4Lc1TvnotyTXKUHAhq3W14Imx-QfbMpIw1f15pG4'
);

/**
 * Save strategy data to Supabase
 * @param data The strategy data to save
 * @returns {Promise<string>} ID of the saved record
 */
export const saveStrategyData = async (data: any): Promise<string> => {
  try {
    // Create a record with timestamp
    const record = {
      created_at: new Date().toISOString(),
      data: data,
      type: data.filters?.sector || 'unknown'
    };
    
    // Save to Supabase
    const { data: savedRecord, error } = await supabase
      .from('saved_strategies')
      .insert(record)
      .select('id')
      .single();
    
    if (error) {
      console.error('Error saving strategy data to Supabase:', error);
      throw error;
    }
    
    return savedRecord.id;
  } catch (error) {
    console.error('Error in saveStrategyData:', error);
    throw error;
  }
};

/**
 * Get a list of all saved strategies
 * @returns {Promise<Array>} List of saved strategies
 */
export const getSavedStrategies = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('saved_strategies')
      .select('id, created_at, type')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching saved strategies:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getSavedStrategies:', error);
    return [];
  }
};

/**
 * Get a specific saved strategy by ID
 * @param id The strategy ID
 * @returns {Promise<Object|null>} The strategy data
 */
export const getStrategyById = async (id: string): Promise<any|null> => {
  try {
    const { data, error } = await supabase
      .from('saved_strategies')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error(`Error fetching strategy with ID ${id}:`, error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error(`Error in getStrategyById for ID ${id}:`, error);
    return null;
  }
};

/**
 * Clean text by removing common prefix characters like dashes and dots
 * @param text The text to clean
 * @returns The cleaned text
 */
export const cleanTextFormatting = (text: string): string => {
  if (!text) return '';
  
  // First replace common prefixes like dashes, bullets, numbers
  let cleaned = text.replace(/^\s*(?:-|\d+\.|•|\*)\s*/, '').trim();
  
  // Convert to lowercase for better matching
  const lowercased = cleaned.toLowerCase();
  
  // Normalize common patterns in AI use case descriptions
  if (lowercased.startsWith('ai for') || lowercased.startsWith('ai to')) {
    cleaned = cleaned.slice(3).trim(); // Remove 'AI ' prefix
  }
  
  return cleaned;
};

/**
 * Process an array of AI use cases by cleaning text and formatting
 * @param useCases Array of use cases with potential formatting issues
 * @returns Array of properly formatted use cases
 */
export const processAIUseCases = (useCases: any[]): any[] => {
  if (!useCases || !Array.isArray(useCases)) return [];
  
  return useCases.map(useCase => {
    const processedCase = {...useCase};
    
    // Clean the Use Case text if it exists and has a dash prefix
    if (processedCase['Use Case']) {
      processedCase['Use Case'] = cleanTextFormatting(processedCase['Use Case']);
    }
    
    // Process tools if they're in string format
    if (processedCase['Recommended Tools/Platforms'] && 
        typeof processedCase['Recommended Tools/Platforms'] === 'string') {
      processedCase.tools = processedCase['Recommended Tools/Platforms']
        .split(/[;,]/)
        .map((tool: string) => tool.trim())
        .filter((tool: string) => tool.length > 0);
    }
    
    return processedCase;
  });
};

export default supabase;
