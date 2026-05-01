import React, { useState } from 'react';
import { FiX, FiCheck } from 'react-icons/fi';
import { IMPROVEMENT_TYPES } from '../utils/constants';

const ImprovementModal = ({ isOpen, onClose, onImprove, loading }) => {
  const [selectedTypes, setSelectedTypes] = useState([]);

  if (!isOpen) return null;

  const handleToggle = (typeId) => {
    setSelectedTypes(prev => 
      prev.includes(typeId)
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  const handleSubmit = () => {
    if (selectedTypes.length > 0) {
      onImprove(selectedTypes);
      setSelectedTypes([]);
    }
  };

  const handleClose = () => {
    setSelectedTypes([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">
            Improve Your Complaint
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Select one or more improvement options to enhance your complaint:
          </p>

          <div className="space-y-3">
            {IMPROVEMENT_TYPES.map((type) => (
              <label
                key={type.id}
                className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedTypes.includes(type.id)
                    ? 'border-primary bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type.id)}
                  onChange={() => handleToggle(type.id)}
                  className="mt-1 w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
                  disabled={loading}
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-800 mb-1">
                    {type.label}
                  </div>
                  <div className="text-sm text-gray-600">
                    {type.description}
                  </div>
                </div>
                {selectedTypes.includes(type.id) && (
                  <FiCheck className="w-5 h-5 text-primary mt-1" />
                )}
              </label>
            ))}
          </div>

          {selectedTypes.length === 0 && (
            <p className="mt-4 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
              Please select at least one improvement option
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={selectedTypes.length === 0 || loading}
            className={`px-6 py-2 rounded-lg font-medium text-white transition-colors ${
              selectedTypes.length === 0 || loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary hover:bg-blue-600'
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Improving...
              </span>
            ) : (
              `Apply ${selectedTypes.length} Improvement${selectedTypes.length !== 1 ? 's' : ''}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImprovementModal;

// Made with Bob
