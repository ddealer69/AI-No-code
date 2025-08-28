/**
 * Service for interacting with the data storage API
 */

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3001/api';

/**
 * Save data to a file on the server
 * 
 * @param {Object} data - The data to save
 * @param {string} filename - Name of the file (without extension)
 * @returns {Promise<Object>} - Response from the server
 */
export const saveDataToServer = async (data: any, filename: string): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data, filename }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to save data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving data to server:', error);
    throw error;
  }
};

/**
 * Get a list of all saved files
 * 
 * @returns {Promise<Array<string>>} - List of filenames
 */
export const listSavedFiles = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_URL}/files`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to list files');
    }
    
    const { files } = await response.json();
    return files;
  } catch (error) {
    console.error('Error listing saved files:', error);
    throw error;
  }
};

/**
 * Load data from a saved file
 * 
 * @param {string} filename - Name of the file to load
 * @returns {Promise<Object>} - The loaded data
 */
export const loadDataFromServer = async (filename: string): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/load/${filename}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to load data');
    }
    
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading data from server:', error);
    throw error;
  }
};
