/**
 * Constants for CivicFix application
 */

// Severity levels with colors
export const SEVERITY_COLORS = {
  low: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300',
    color: '#10B981'
  },
  medium: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-300',
    color: '#F59E0B'
  },
  high: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-300',
    color: '#F97316'
  },
  critical: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-300',
    color: '#EF4444'
  }
};

// Urgency levels with colors
export const URGENCY_COLORS = {
  low: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-300'
  },
  medium: {
    bg: 'bg-indigo-100',
    text: 'text-indigo-800',
    border: 'border-indigo-300'
  },
  high: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-300'
  },
  immediate: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-300'
  }
};

// Category icons mapping (using emoji for simplicity)
export const CATEGORY_ICONS = {
  'Sanitation': '🗑️',
  'Road Infrastructure': '🛣️',
  'Water Supply': '💧',
  'Electricity': '⚡',
  'Drainage': '🚰',
  'Public Safety': '🚨',
  'Other': '📋'
};

// Improvement types
export const IMPROVEMENT_TYPES = [
  {
    id: 'make_formal',
    label: 'Make More Formal',
    description: 'Use more formal and official language'
  },
  {
    id: 'add_urgency',
    label: 'Add Urgency',
    description: 'Emphasize the time-sensitive nature'
  },
  {
    id: 'reference_rights',
    label: 'Reference Citizen Rights',
    description: 'Include citizen rights and government responsibilities'
  },
  {
    id: 'add_legal',
    label: 'Add Legal References',
    description: 'Include relevant laws and policies'
  },
  {
    id: 'strengthen_language',
    label: 'Strengthen Language',
    description: 'Use more assertive but respectful language'
  },
  {
    id: 'add_consequences',
    label: 'Mention Consequences',
    description: 'Highlight potential consequences if not addressed'
  }
];

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  TIMEOUT_ERROR: 'Request timeout. Please try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.'
};

// Success messages
export const SUCCESS_MESSAGES = {
  COMPLAINT_COPIED: 'Complaint copied to clipboard!',
  CLASSIFICATION_SUCCESS: 'Issue classified successfully!',
  GENERATION_SUCCESS: 'Complaint generated successfully!',
  IMPROVEMENT_SUCCESS: 'Complaint improved successfully!'
};

// Made with Bob
