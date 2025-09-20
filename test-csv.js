// Test script to verify CSV loading
import { loadCSVContent, searchRealCasesInCSV } from './src/utils/csvRealCasesService.js';

async function testCSVLoading() {
  try {
    console.log('Testing CSV loading...');
    
    // Test loading service CSV
    const serviceData = await loadCSVContent('service');
    console.log('Service CSV loaded:', serviceData.length, 'rows');
    if (serviceData.length > 0) {
      console.log('First service row:', serviceData[0]);
      console.log('Service row keys:', Object.keys(serviceData[0]));
    }
    
    // Test search functionality
    if (serviceData.length > 0) {
      const testMatches = searchRealCasesInCSV(
        serviceData,
        'Service Design',
        'Market Research',
        'NLP for extracting insights'
      );
      console.log('Test search results:', testMatches);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testCSVLoading();