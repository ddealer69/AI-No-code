/**
 * Utility functions for saving and loading JSON data
 */

/**
 * Save data to a JSON file in the browser's localStorage
 * 
 * @param key The key to use for storing the data
 * @param data The data to store
 */
export const saveToLocalStorage = (key: string, data: any): void => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
    console.log(`Successfully saved data to localStorage with key: ${key}`);
  } catch (error) {
    console.error(`Error saving data to localStorage: ${error}`);
  }
};

/**
 * Load data from localStorage by key
 * 
 * @param key The key used to store the data
 * @returns The parsed data or null if not found
 */
export const loadFromLocalStorage = <T>(key: string): T | null => {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      return null;
    }
    return JSON.parse(serializedData) as T;
  } catch (error) {
    console.error(`Error loading data from localStorage: ${error}`);
    return null;
  }
};

/**
 * Download data as a JSON file
 * 
 * @param data The data to download
 * @param filename The name of the file
 */
export const downloadJson = (data: any, filename: string): void => {
  try {
    const serializedData = JSON.stringify(data, null, 2);
    const blob = new Blob([serializedData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = filename.endsWith('.json') ? filename : `${filename}.json`;
    
    // Append to the document, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL
    URL.revokeObjectURL(url);
    
    console.log(`Successfully downloaded data as ${link.download}`);
  } catch (error) {
    console.error(`Error downloading JSON data: ${error}`);
  }
};
