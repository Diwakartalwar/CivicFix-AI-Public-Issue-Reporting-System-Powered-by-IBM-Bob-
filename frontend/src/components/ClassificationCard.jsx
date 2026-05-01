import React from 'react';
import { FiInfo, FiAlertCircle } from 'react-icons/fi';
import { SEVERITY_COLORS, URGENCY_COLORS, CATEGORY_ICONS } from '../utils/constants';

const ClassificationCard = ({ classification }) => {
  if (!classification) return null;

  const { category, severity, urgency, authority, reasoning } = classification;
  
  const severityStyle = SEVERITY_COLORS[severity] || SEVERITY_COLORS.medium;
  const urgencyStyle = URGENCY_COLORS[urgency] || URGENCY_COLORS.medium;
  const categoryIcon = CATEGORY_ICONS[category] || CATEGORY_ICONS.Other;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <FiInfo className="w-5 h-5 text-primary" />
        Issue Classification
      </h3>

      {/* Category */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Category
        </label>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <span className="text-3xl">{categoryIcon}</span>
          <span className="text-lg font-semibold text-gray-800">{category}</span>
        </div>
      </div>

      {/* Severity */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Severity Level
        </label>
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${severityStyle.bg} ${severityStyle.text} border ${severityStyle.border}`}>
          <FiAlertCircle className="w-4 h-4" />
          <span className="font-semibold capitalize">{severity}</span>
        </div>
      </div>

      {/* Urgency */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Urgency
        </label>
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${urgencyStyle.bg} ${urgencyStyle.text} border ${urgencyStyle.border}`}>
          <span className="font-semibold capitalize">{urgency}</span>
        </div>
      </div>

      {/* Authority Information */}
      {authority && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-gray-800 mb-2">
            Responsible Authority
          </h4>
          <div className="space-y-1 text-sm text-gray-700">
            <p>
              <span className="font-medium">Department:</span> {authority.department}
            </p>
            <p>
              <span className="font-medium">Jurisdiction:</span> {authority.jurisdiction}
            </p>
            <p>
              <span className="font-medium">Contact:</span> {authority.contact}
            </p>
            {authority.typical_response_time && (
              <p>
                <span className="font-medium">Expected Response:</span> {authority.typical_response_time}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Reasoning */}
      {reasoning && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2 text-sm">
            Analysis
          </h4>
          <p className="text-sm text-gray-700">{reasoning}</p>
        </div>
      )}
    </div>
  );
};

export default ClassificationCard;

// Made with Bob
