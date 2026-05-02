import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CommunityIssues from './components/CommunityIssues';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/community" element={<CommunityIssues />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

function Header() {
  const location = useLocation();
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <span className="text-4xl">🏛️</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                CivicFix
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                AI-Powered Public Issue Reporting System
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex gap-4">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                location.pathname === '/'
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Report Issue
            </Link>
            <Link
              to="/community"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                location.pathname === '/community'
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Community Issues
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center text-sm text-gray-600">
          <p>
            Powered by <strong>IBM watsonx.ai</strong> | Built for better civic engagement
          </p>
          <p className="mt-2">
            Made with ❤️ for the IBM Bob Hackathon
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Anonymous reporting - No user tracking or authentication required
          </p>
        </div>
      </div>
    </footer>
  );
}

export default App;

// Made with Bob
