import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { FiMap, FiList, FiFilter, FiSearch } from 'react-icons/fi';
import { getCommunityIssues, getIssueClusters, voteIssue } from '../services/api';
import { SEVERITY_COLORS, CATEGORY_ICONS } from '../utils/constants';
import LoadingSpinner from './LoadingSpinner';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import L from 'leaflet';
import 'leaflet.markercluster';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const CommunityIssues = () => {
  const [viewMode, setViewMode] = useState('list');
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showClusters, setShowClusters] = useState(true);
  const [votingIssueIds, setVotingIssueIds] = useState(new Set());
  
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
      const [issuesResponse, clustersResponse] = await Promise.all([
        getCommunityIssues(),
        getIssueClusters(500)
      ]);
      setIssues(issuesResponse.issues || []);
      setClusters(clustersResponse || []);
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

  const handleVote = async (issueId) => {
    if (votingIssueIds.has(issueId)) return;

    setVotingIssueIds(prev => new Set(prev).add(issueId));

    try {
      const result = await voteIssue(issueId);
      setIssues(prev => prev.map(issue =>
        issue.id === issueId
          ? { ...issue, vote_count: result.vote_count }
          : issue
      ));
    } catch (err) {
      console.error('Error voting for issue:', err);
      setError('Failed to submit vote. Please try again.');
    } finally {
      setVotingIssueIds(prev => {
        const next = new Set(prev);
        next.delete(issueId);
        return next;
      });
    }
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

  const appendTextElement = (parent, tagName, className, text) => {
    const element = document.createElement(tagName);
    element.className = className;
    element.textContent = text;
    parent.appendChild(element);
    return element;
  };

  const createPopupContent = (item) => {
    const container = document.createElement('div');
    container.className = 'p-2';

    appendTextElement(
      container,
      'h3',
      'font-bold text-lg mb-2',
      item.category || 'Issue'
    );

    if (item.count) {
      appendTextElement(
        container,
        'p',
        'text-sm text-gray-600 mb-2',
        `${item.count} issues in this area`
      );
    }

    appendTextElement(
      container,
      'p',
      'text-sm mb-2',
      item.location || 'No location'
    );

    const badge = appendTextElement(
      container,
      'span',
      'inline-block px-2 py-1 text-xs rounded',
      item.severity || 'unknown'
    );
    badge.style.backgroundColor = getMarkerColor(item.severity);
    badge.style.color = 'white';

    return container;
  };

  const MapController = () => {
    const map = useMap();

    useEffect(() => {
      const markerClusterGroup = L.markerClusterGroup({
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true
      });

      const dataToShow = showClusters ? clusters : filteredIssues;

      dataToShow.forEach(item => {
        if (item.latitude && item.longitude) {
          const marker = L.marker([item.latitude, item.longitude], {
            icon: createCustomIcon(item.severity)
          });

          marker.bindPopup(createPopupContent(item));
          markerClusterGroup.addLayer(marker);
        }
      });

      map.addLayer(markerClusterGroup);

      return () => {
        map.removeLayer(markerClusterGroup);
      };
    }, [map, showClusters, clusters, filteredIssues]);

    return null;
  };

  const defaultCenter = [20.5937, 78.9629]; // India center
  const defaultZoom = 5;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner message="Loading community issues..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Community Issues</h1>
              <p className="mt-2 text-gray-600">
                {filteredIssues.length} issue{filteredIssues.length !== 1 ? 's' : ''} found
              </p>
            </div>
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
              {viewMode === 'map' && (
                <button
                  onClick={() => setShowClusters(!showClusters)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    showClusters
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {showClusters ? 'Clusters On' : 'Clusters Off'}
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
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
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
            <button
              onClick={fetchIssues}
              className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {viewMode === 'map' ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <MapContainer
              center={defaultCenter}
              zoom={defaultZoom}
              style={{ height: '600px', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <MapController />
            </MapContainer>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredIssues.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-600">No issues found matching your filters.</p>
              </div>
            ) : (
              filteredIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{CATEGORY_ICONS[issue.category] || '📋'}</span>
                        <h3 className="text-xl font-semibold text-gray-900">{issue.category}</h3>
                        <span
                          className="px-3 py-1 rounded-full text-sm font-medium text-white"
                          style={{ backgroundColor: SEVERITY_COLORS[issue.severity]?.color || '#6B7280' }}
                        >
                          {issue.severity}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">{issue.issue_description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                        <span>📍 {issue.location || 'No location specified'}</span>
                        <span>📅 {new Date(issue.created_at).toLocaleDateString()}</span>
                        <span className={`px-2 py-1 rounded ${
                          issue.status === 'resolved' ? 'bg-green-100 text-green-800' :
                          issue.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {issue.status.replace('_', ' ')}
                        </span>
                        {issue.is_verified && (
                          <span className="px-2 py-1 rounded bg-green-100 text-green-800 flex items-center gap-1">
                            ✓ Verified
                          </span>
                        )}
                        {issue.escalation_level && issue.escalation_level !== 'ward' && (
                          <span className="px-2 py-1 rounded bg-red-100 text-red-800 flex items-center gap-1">
                            ⚠️ {issue.escalation_level.toUpperCase()}
                          </span>
                        )}
                        <button
                          onClick={() => handleVote(issue.id)}
                          disabled={votingIssueIds.has(issue.id)}
                          className="px-2 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center gap-1"
                        >
                          👍 {issue.vote_count || 0}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityIssues;

// Made with Bob
