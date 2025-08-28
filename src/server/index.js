const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { saveJsonToFile, loadJsonFromFile, listJsonFiles } = require('./fileStorage');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Route to save data
app.post('/api/save', async (req, res) => {
  try {
    const { data, filename } = req.body;
    
    if (!data || !filename) {
      return res.status(400).json({ error: 'Data and filename are required' });
    }
    
    const savedFilePath = await saveJsonToFile(data, filename);
    
    res.json({
      success: true,
      message: 'Data saved successfully',
      filePath: savedFilePath
    });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save data',
      error: error.message
    });
  }
});

// Route to get a list of saved files
app.get('/api/files', async (req, res) => {
  try {
    const files = await listJsonFiles();
    res.json({ files });
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to list files',
      error: error.message
    });
  }
});

// Route to load a specific file
app.get('/api/load/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const data = await loadJsonFromFile(filename);
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error loading file:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load file',
      error: error.message
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
