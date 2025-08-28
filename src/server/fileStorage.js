const fs = require('fs');
const path = require('path');

/**
 * Save data to a JSON file on the server
 * 
 * @param {Object} data - The data to save
 * @param {string} filename - Name of the file (without extension)
 * @returns {Promise<string>} - Path to the saved file
 */
const saveJsonToFile = async (data, filename) => {
  try {
    // Create the data directory if it doesn't exist
    const dataDir = path.join(__dirname, '..', '..', 'data', 'saved');
    
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Ensure filename has .json extension
    const filePath = path.join(dataDir, `${filename}${filename.endsWith('.json') ? '' : '.json'}`);
    
    // Write the data to a file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    
    console.log(`Data saved successfully to ${filePath}`);
    return filePath;
  } catch (error) {
    console.error('Error saving data to file:', error);
    throw error;
  }
};

/**
 * Load data from a JSON file on the server
 * 
 * @param {string} filename - Name of the file to load
 * @returns {Promise<Object>} - The loaded data
 */
const loadJsonFromFile = async (filename) => {
  try {
    const dataDir = path.join(__dirname, '..', '..', 'data', 'saved');
    const filePath = path.join(dataDir, `${filename}${filename.endsWith('.json') ? '' : '.json'}`);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File ${filePath} does not exist`);
    }
    
    const fileData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileData);
  } catch (error) {
    console.error('Error loading data from file:', error);
    throw error;
  }
};

/**
 * List all saved JSON files
 * 
 * @returns {Promise<Array<string>>} - List of filenames
 */
const listJsonFiles = async () => {
  try {
    const dataDir = path.join(__dirname, '..', '..', 'data', 'saved');
    
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      return [];
    }
    
    const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.json'));
    return files;
  } catch (error) {
    console.error('Error listing JSON files:', error);
    throw error;
  }
};

module.exports = {
  saveJsonToFile,
  loadJsonFromFile,
  listJsonFiles
};
