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
 * @param {number} latitude - Latitude coordinate (optional)
 * @param {number} longitude - Longitude coordinate (optional)
 * @param {object} classification - Classification result
 * @param {string} complaintLanguage - Target language for the generated complaint
 * @returns {Promise} Generated complaint with issue ID
 */
export const generateComplaint = async (
  issueDescription,
  location = '',
  latitude = null,
  longitude = null,
  classification,
  complaintLanguage = 'English'
) => {
  try {
    const response = await api.post('/generate', {
      issueDescription,
      location,
      latitude,
      longitude,
      complaintLanguage,
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
 * Get all community issues with optional filtering
 * @param {object} filters - Filter parameters (category, severity, status, search)
 * @returns {Promise} List of issues
 */
export const getCommunityIssues = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.severity) params.append('severity', filters.severity);
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    
    const response = await api.get(`/issues?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching community issues:', error);
    throw error;
  }
};

/**
 * Get detailed information about a specific issue
 * @param {number} issueId - Issue ID
 * @returns {Promise} Issue details
 */
export const getIssueDetail = async (issueId) => {
  try {
    const response = await api.get(`/issues/${issueId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching issue detail:', error);
    throw error;
  }
};

/**
 * Upvote an issue
 * @param {number} issueId - Issue ID
 * @returns {Promise} Updated vote count
 */
export const voteIssue = async (issueId) => {
  try {
    const response = await api.post(`/issues/${issueId}/vote`);
    return response.data;
  } catch (error) {
    console.error('Error voting for issue:', error);
    throw error;
  }
};

/**
 * Get statistics about community issues
 * @returns {Promise} Statistics
 */
export const getIssueStats = async () => {
  try {
    const response = await api.get('/issues/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching issue stats:', error);
    throw error;
  }
};
/**
 * Get clustered issues for map visualization
 * @param {number} radius - Clustering radius in meters (default: 500)
 * @returns {Promise} Clustered issues
 */
export const getIssueClusters = async (radius = 500) => {
  try {
    const response = await api.get(`/clusters?radius=${radius}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching issue clusters:', error);
    throw error;
  }
};

/**
 * Get heatmap data for visualization
 * @returns {Promise} Heatmap data points
 */
export const getHeatmapData = async () => {
  try {
    const response = await api.get('/heatmap');
    return response.data;
  } catch (error) {
    console.error('Error fetching heatmap data:', error);
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
