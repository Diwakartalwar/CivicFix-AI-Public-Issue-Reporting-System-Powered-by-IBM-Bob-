import React, { useState } from 'react';
import { FiSend, FiMapPin } from 'react-icons/fi';
import { COMPLAINT_LANGUAGES } from '../utils/constants';

const IssueForm = ({ onSubmit, loading }) => {
  const [issueDescription, setIssueDescription] = useState('');
  const [location, setLocation] = useState('');
  const [complaintLanguage, setComplaintLanguage] = useState('English');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);
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

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Backend accepts up to 8 decimal places for coordinates.
        setLatitude(Number(position.coords.latitude.toFixed(8)));
        setLongitude(Number(position.coords.longitude.toFixed(8)));
        setGettingLocation(false);
        // Optionally, you can use reverse geocoding here to get address
        alert(`Location captured: ${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get your location. Please enter it manually.');
        setGettingLocation(false);
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        issueDescription: issueDescription.trim(),
        location: location.trim(),
        complaintLanguage,
        latitude,
        longitude
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
          <div className="flex gap-2">
            <input
              id="location"
              type="text"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter the location (e.g., Main Street, Ward 5)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={loading}
            />
            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={loading || gettingLocation}
              className={`px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                gettingLocation
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Get current location"
            >
              <FiMapPin className="w-5 h-5" />
              {gettingLocation ? 'Getting...' : 'Use GPS'}
            </button>
          </div>
          {errors.location && (
            <p className="mt-1 text-sm text-red-500">{errors.location}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            {latitude && longitude ? (
              <span className="text-green-600">
                ✓ GPS coordinates captured ({latitude.toFixed(6)}, {longitude.toFixed(6)})
              </span>
            ) : (
              'Providing a location helps authorities respond faster and shows your issue on the community map'
            )}
          </p>
        </div>

        <div>
          <label
            htmlFor="complaintLanguage"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Complaint Language
          </label>
          <select
            id="complaintLanguage"
            value={complaintLanguage}
            onChange={(e) => setComplaintLanguage(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {COMPLAINT_LANGUAGES.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
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
