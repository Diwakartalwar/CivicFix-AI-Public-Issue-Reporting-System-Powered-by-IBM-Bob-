import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

/**
 * Classify a civic issue
 * @param {string} issueDescription - Description of the issue
 * @param {string} location - Location of the issue (optional)
 * @returns {Promise} Classification result
 */
export const classifyIssue = async (issueDescription, location = '') => {
  try {
    const response = await api.post('/classify', {
      issueDescription,
      location,
    });
    return response.data;
  } catch (error) {
    console.error('Error classifying issue:', error);
    throw error;
  }
};

/**
 * Generate a formal complaint
 * @param {string} issueDescription - Description of the issue
 * @param {string} location - Location of the issue (optional)
 * @param {object} classification - Classification result
 * @returns {Promise} Generated complaint
 */
export const generateComplaint = async (issueDescription, location = '', classification) => {
  try {
    const response = await api.post('/generate', {
      issueDescription,
      location,
      classification,
    });
    return response.data;
  } catch (error) {
    console.error('Error generating complaint:', error);
    throw error;
  }
};

/**
 * Improve an existing complaint
 * @param {string} complaint - Original complaint text
 * @param {array} improvementTypes - Array of improvement types
 * @returns {Promise} Improved complaint
 */
export const improveComplaint = async (complaint, improvementTypes) => {
  try {
    const response = await api.post('/improve', {
      complaint,
      improvementTypes,
    });
    return response.data;
  } catch (error) {
    console.error('Error improving complaint:', error);
    throw error;
  }
};

/**
 * Health check
 * @returns {Promise} Health status
 */
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Error checking health:', error);
    throw error;
  }
};

export default api;

// Made with Bob
