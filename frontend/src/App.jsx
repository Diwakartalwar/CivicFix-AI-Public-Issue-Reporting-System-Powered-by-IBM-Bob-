import React, { useState } from 'react';
import IssueForm from './components/IssueForm';
import ClassificationCard from './components/ClassificationCard';
import ComplaintDisplay from './components/ComplaintDisplay';
import ImprovementModal from './components/ImprovementModal';
import LoadingSpinner from './components/LoadingSpinner';
import { classifyIssue, generateComplaint, improveComplaint } from './services/api';
import { ERROR_MESSAGES } from './utils/constants';
import './App.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [classification, setClassification] = useState(null);
  const [complaint, setComplaint] = useState('');
  const [error, setError] = useState(null);
  const [showImproveModal, setShowImproveModal] = useState(false);
  const [improvingComplaint, setImprovingComplaint] = useState(false);
  const [issueData, setIssueData] = useState(null);

  const handleSubmit = async (data) => {
    setLoading(true);
    setError(null);
    setClassification(null);
    setComplaint('');
    setIssueData(data);

    try {
      // Step 1: Classify the issue
      const classificationResult = await classifyIssue(
        data.issueDescription,
        data.location
      );
      setClassification(classificationResult);

      // Step 2: Generate complaint
      const complaintResult = await generateComplaint(
        data.issueDescription,
        data.location,
        {
          category: classificationResult.category,
          severity: classificationResult.severity,
          urgency: classificationResult.urgency
        }
      );
      setComplaint(complaintResult.formattedComplaint);
    } catch (err) {
      console.error('Error processing issue:', err);
      
      let errorMessage = ERROR_MESSAGES.UNKNOWN_ERROR;
      if (err.code === 'ECONNABORTED') {
        errorMessage = ERROR_MESSAGES.TIMEOUT_ERROR;
      } else if (err.response) {
        if (err.response.status >= 500) {
          errorMessage = ERROR_MESSAGES.SERVER_ERROR;
        } else if (err.response.status >= 400) {
          errorMessage = err.response.data?.error || ERROR_MESSAGES.VALIDATION_ERROR;
        }
      } else if (err.request) {
        errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleImprove = async (improvementTypes) => {
    setImprovingComplaint(true);
    setError(null);

    try {
      const result = await improveComplaint(complaint, improvementTypes);
      setComplaint(result.improvedComplaint);
      setShowImproveModal(false);
    } catch (err) {
      console.error('Error improving complaint:', err);
      
      let errorMessage = ERROR_MESSAGES.UNKNOWN_ERROR;
      if (err.response?.status >= 500) {
        errorMessage = ERROR_MESSAGES.SERVER_ERROR;
      } else if (err.request) {
        errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
      }
      
      setError(errorMessage);
    } finally {
      setImprovingComplaint(false);
    }
  };

  const hasResults = classification && complaint;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🏛️</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                CivicFix
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                AI-Powered Public Issue Reporting System
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Issue Form */}
        <div className="mb-8">
          <IssueForm onSubmit={handleSubmit} loading={loading} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="font-semibold text-red-800 mb-1">Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <LoadingSpinner message="Analyzing your issue and generating complaint..." />
          </div>
        )}

        {/* Results */}
        {hasResults && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Classification */}
            <div>
              <ClassificationCard classification={classification} />
            </div>

            {/* Right Column: Complaint */}
            <div>
              <ComplaintDisplay
                complaint={complaint}
                onImprove={() => setShowImproveModal(true)}
              />
            </div>
          </div>
        )}

        {/* Empty State */}
        {!hasResults && !loading && !error && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <span className="text-6xl mb-4 block">📝</span>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Ready to Report an Issue?
            </h3>
            <p className="text-gray-600">
              Fill out the form above to get started. We'll help you create a professional complaint.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>
              Powered by <strong>IBM watsonx.ai</strong> | Built for better civic engagement
            </p>
            <p className="mt-2">
              Made with ❤️ for the IBM Bob Hackathon
            </p>
          </div>
        </div>
      </footer>

      {/* Improvement Modal */}
      <ImprovementModal
        isOpen={showImproveModal}
        onClose={() => setShowImproveModal(false)}
        onImprove={handleImprove}
        loading={improvingComplaint}
      />
    </div>
  );
}

export default App;

// Made with Bob
