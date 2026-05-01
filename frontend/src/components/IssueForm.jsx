import React, { useState } from 'react';
import { FiSend } from 'react-icons/fi';

const IssueForm = ({ onSubmit, loading }) => {
  const [issueDescription, setIssueDescription] = useState('');
  const [location, setLocation] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!issueDescription.trim()) {
      newErrors.issueDescription = 'Issue description is required';
    } else if (issueDescription.trim().length < 10) {
      newErrors.issueDescription = 'Description must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        issueDescription: issueDescription.trim(),
        location: location.trim()
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Report a Civic Issue
      </h2>
      <p className="text-gray-600 mb-6">
        Describe the issue you're facing, and we'll help you create a professional complaint.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Issue Description */}
        <div>
          <label 
            htmlFor="issueDescription" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Issue Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="issueDescription"
            rows="6"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none ${
              errors.issueDescription ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Describe the civic issue in detail (e.g., garbage accumulation, pothole, water leakage, etc.)"
            value={issueDescription}
            onChange={(e) => setIssueDescription(e.target.value)}
            disabled={loading}
          />
          {errors.issueDescription && (
            <p className="mt-1 text-sm text-red-500">{errors.issueDescription}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            {issueDescription.length} characters (minimum 10 required)
          </p>
        </div>

        {/* Location */}
        <div>
          <label 
            htmlFor="location" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Location <span className="text-gray-400">(Optional)</span>
          </label>
          <input
            id="location"
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Enter the location (e.g., Main Street, Ward 5)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={loading}
          />
          <p className="mt-1 text-sm text-gray-500">
            Providing a location helps authorities respond faster
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-white transition-colors ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-primary hover:bg-blue-600'
          }`}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Processing...
            </>
          ) : (
            <>
              <FiSend className="w-5 h-5" />
              Submit Issue
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default IssueForm;

// Made with Bob
