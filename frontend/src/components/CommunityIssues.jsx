import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { FiMap, FiList, FiFilter, FiSearch } from 'react-icons/fi';
import { getCommunityIssues } from '../services/api';
import { SEVERITY_COLORS, CATEGORY_ICONS } from '../utils/constants';
import LoadingSpinner from './LoadingSpinner';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const CommunityIssues = () => {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [filters, setFilters] = useState({
    category: '',
    severity: '',
    status: '',
    search: ''
  });
  
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchIssues();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [issues, filters]);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const response = await getCommunityIssues();
      setIssues(response.issues || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching issues:', err);
      setError('Failed to load community issues. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...issues];

    if (filters.category) {
      filtered = filtered.filter(issue => issue.category === filters.category);
    }

    if (filters.severity) {
      filtered = filtered.filter(issue => issue.severity === filters.severity);
    }

    if (filters.status) {
      filtered = filtered.filter(issue => issue.status === filters.status);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(issue =>
        issue.issue_description.toLowerCase().includes(searchLower) ||
        (issue.location || '').toLowerCase().includes(searchLower)
      );
    }

    setFilteredIssues(filtered);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      severity: '',
      status: '',
      search: ''
    });
  };

  const getMarkerColor = (severity) => {
    const colors = {
      low: '#10B981',
      medium: '#F59E0B',
      high: '#F97316',
      critical: '#EF4444'
    };
    return colors[severity] || '#6B7280';
  };

  const createCustomIcon = (severity) => {
    const color = getMarkerColor(severity);
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${color}; width: 25px; height: 25px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [25, 25],
      iconAnchor: [12, 12],
    });
  };

  // Default center - configure this for your deployment location
  // TODO: Move to environment variable for production deployments
  const defaultCenter = [28.6139, 77.2090]; // Delhi, India
  const defaultZoom = 12;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner message="Loading community issues..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Community Issues
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {filteredIssues.length} issue{filteredIssues.length !== 1 ? 's' : ''} reported by the community
              </p>
            </div>
            
            {/* View Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FiList className="w-5 h-5" />
                List View
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'map'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FiMap className="w-5 h-5" />
                Map View
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
            >
              <FiFilter className="w-5 h-5" />
              <span className="font-medium">Filters</span>
            </button>
            {(filters.category || filters.severity || filters.status || filters.search) && (
              <button
                onClick={clearFilters}
                className="text-sm text-primary hover:text-blue-700"
              >
                Clear all filters
              </button>
            )}
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search issues..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  <option value="Sanitation">Sanitation</option>
                  <option value="Road Infrastructure">Road Infrastructure</option>
                  <option value="Water Supply">Water Supply</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Drainage">Drainage</option>
                  <option value="Public Safety">Public Safety</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Severity Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Severity
                </label>
                <select
                  value={filters.severity}
                  onChange={(e) => handleFilterChange('severity', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">All Severities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {filteredIssues.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <span className="text-6xl mb-4 block">🔍</span>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Issues Found
            </h3>
            <p className="text-gray-600">
              {filters.category || filters.severity || filters.status || filters.search
                ? 'Try adjusting your filters'
                : 'No issues have been reported yet'}
            </p>
          </div>
        ) : viewMode === 'list' ? (
          <ListView issues={filteredIssues} />
        ) : (
          <MapView issues={filteredIssues} defaultCenter={defaultCenter} defaultZoom={defaultZoom} createCustomIcon={createCustomIcon} />
        )}
      </div>
    </div>
  );
};

// List View Component
const ListView = ({ issues }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} />
      ))}
    </div>
  );
};

// Map View Component
const MapView = ({ issues, defaultCenter, defaultZoom, createCustomIcon }) => {
  const issuesWithCoords = issues.filter(issue => issue.has_location_coordinates);

  if (issuesWithCoords.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <span className="text-6xl mb-4 block">📍</span>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          No Location Data Available
        </h3>
        <p className="text-gray-600">
          None of the filtered issues have geographic coordinates for map display.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ height: '600px' }}>
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {issuesWithCoords.map((issue) => (
          <Marker
            key={issue.id}
            position={[parseFloat(issue.latitude), parseFloat(issue.longitude)]}
            icon={createCustomIcon(issue.severity)}
          >
            <Popup>
              <div className="p-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{CATEGORY_ICONS[issue.category]}</span>
                  <h3 className="font-semibold text-gray-800">{issue.category}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                  {issue.issue_description}
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${SEVERITY_COLORS[issue.severity]?.bg} ${SEVERITY_COLORS[issue.severity]?.text}`}>
                    {issue.severity}
                  </span>
                  <span className="text-xs text-gray-500">
                    {issue.age_in_days} days ago
                  </span>
                </div>
                {issue.location && (
                  <p className="text-xs text-gray-500">📍 {issue.location}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

// Issue Card Component
const IssueCard = ({ issue }) => {
  const severityStyle = SEVERITY_COLORS[issue.severity] || SEVERITY_COLORS.medium;
  const categoryIcon = CATEGORY_ICONS[issue.category] || CATEGORY_ICONS.Other;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{categoryIcon}</span>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{issue.category}</h3>
            {issue.location && (
              <p className="text-sm text-gray-500">📍 {issue.location}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${severityStyle.bg} ${severityStyle.text}`}>
            {issue.severity}
          </span>
          <span className="text-xs text-gray-500">
            {issue.age_in_days} days ago
          </span>
        </div>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-3">
        {issue.issue_description}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>👁️ {issue.view_count} views</span>
          <span className={`px-2 py-1 rounded text-xs ${
            issue.status === 'resolved' ? 'bg-green-100 text-green-800' :
            issue.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
            issue.status === 'rejected' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {issue.status.replace('_', ' ')}
          </span>
        </div>
        <span className="text-sm text-gray-500">
          {issue.authority_department}
        </span>
      </div>
    </div>
  );
};

export default CommunityIssues;

// Made with Bob
