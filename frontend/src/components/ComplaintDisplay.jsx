import React, { useState } from 'react';
import { FiCopy, FiCheck, FiEdit3 } from 'react-icons/fi';
import { SUCCESS_MESSAGES } from '../utils/constants';

const ComplaintDisplay = ({ complaint, onImprove }) => {
  const [copied, setCopied] = useState(false);

  if (!complaint) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(complaint);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy to clipboard');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          Generated Complaint
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title="Copy to clipboard"
          >
            {copied ? (
              <>
                <FiCheck className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <FiCopy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
          <button
            onClick={onImprove}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            title="Improve complaint"
          >
            <FiEdit3 className="w-4 h-4" />
            Improve
          </button>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed">
          {complaint}
        </pre>
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>💡 Tip:</strong> You can copy this complaint and submit it to the appropriate authority mentioned in the classification card.
        </p>
      </div>
    </div>
  );
};

export default ComplaintDisplay;

// Made with Bob
