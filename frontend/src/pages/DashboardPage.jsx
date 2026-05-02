import React, { useState, useEffect } from 'react';
import {
  FiDownload,
  FiTrendingUp,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiShield,
  FiZap,
  FiThumbsUp
} from 'react-icons/fi';
import { getIssueStats, getCommunityIssues } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { SEVERITY_COLORS, CATEGORY_ICONS } from '../utils/constants';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('all'); // all, week, month

  const escapeCSVValue = (value) => {
    const stringValue = value == null ? '' : String(value);
    if (/[",\n\r]/.test(stringValue)) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, issuesData] = await Promise.all([
        getIssueStats(),
        getCommunityIssues()
      ]);
      setStats(statsData);
      setIssues(issuesData.issues || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Category', 'Severity', 'Status', 'Location', 'Date', 'Description'];
    const rows = issues.map(issue => [
      issue.id,
      issue.category,
      issue.severity,
      issue.status,
      issue.location || 'N/A',
      new Date(issue.created_at).toLocaleDateString(),
      issue.issue_description.replace(/,/g, ';')
    ]);

    const csvContent = [
      headers.map(escapeCSVValue).join(','),
      ...rows.map(row => row.map(escapeCSVValue).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `civic-issues-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const calculateTrends = () => {
    if (!issues.length) return { resolved: 0, pending: 0, avgResolutionTime: 0 };

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const recentIssues = issues.filter(i => new Date(i.created_at) > weekAgo);
    const resolved = recentIssues.filter(i => i.status === 'resolved').length;
    const pending = recentIssues.filter(i => i.status === 'pending').length;

    return { resolved, pending, total: recentIssues.length };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner message="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const trends = calculateTrends();
  const totalIssues = stats?.total_issues || 0;
  const statusCounts = stats?.by_status || {};
  const categoryCounts = stats?.by_category || {};
  const severityCounts = stats?.by_severity || {};
  const impact = stats?.impact || {};
  const resolutionRate = totalIssues && statusCounts.resolved
    ? ((statusCounts.resolved / totalIssues) * 100).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Government Dashboard</h1>
              <p className="mt-2 text-gray-600">Analytics and insights for civic issue management</p>
            </div>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FiDownload className="w-5 h-5" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Issues</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalIssues}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FiAlertCircle className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              {trends.total} new this week
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {statusCounts.resolved || 0}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FiCheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              {resolutionRate}% resolution rate
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">
                  {statusCounts.pending || 0}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <FiClock className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Awaiting action
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {statusCounts.in_progress || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FiTrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Being addressed
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Civic Impact Snapshot</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg shadow-md p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">High Priority</p>
                  <p className="text-2xl font-bold text-red-600 mt-2">{impact.high_priority || 0}</p>
                </div>
                <FiZap className="w-7 h-7 text-red-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Community Votes</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">{impact.community_votes || 0}</p>
                </div>
                <FiThumbsUp className="w-7 h-7 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Verified Reports</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">{impact.verified || 0}</p>
                </div>
                <FiShield className="w-7 h-7 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Escalated Cases</p>
                  <p className="text-2xl font-bold text-orange-600 mt-2">{impact.escalated || 0}</p>
                </div>
                <FiAlertCircle className="w-7 h-7 text-orange-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Map Ready</p>
                  <p className="text-2xl font-bold text-indigo-600 mt-2">{impact.geo_tagged || 0}</p>
                </div>
                <FiMapPin className="w-7 h-7 text-indigo-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Category Breakdown */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Issues by Category</h2>
            <div className="space-y-3">
              {Object.entries(categoryCounts).map(([category, count]) => {
                const percentage = totalIssues ? ((count / totalIssues) * 100).toFixed(1) : 0;
                return (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{CATEGORY_ICONS[category] || '📋'}</span>
                        <span className="text-sm font-medium text-gray-700">{category}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Severity Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Severity Distribution</h2>
            <div className="space-y-3">
              {Object.entries(severityCounts).map(([severity, count]) => {
                const percentage = totalIssues ? ((count / totalIssues) * 100).toFixed(1) : 0;
                return (
                  <div key={severity}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 capitalize">{severity}</span>
                      <span className="text-sm font-semibold text-gray-900">{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: SEVERITY_COLORS[severity]?.color || '#6B7280'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Issues Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Issues</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {issues.slice(0, 10).map((issue) => (
                  <tr key={issue.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{CATEGORY_ICONS[issue.category] || '📋'}</span>
                        <span className="text-sm font-medium text-gray-900">{issue.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {issue.location || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="px-2 py-1 text-xs font-medium rounded-full text-white"
                        style={{ backgroundColor: SEVERITY_COLORS[issue.severity]?.color || '#6B7280' }}
                      >
                        {issue.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        issue.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        issue.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {issue.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(issue.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

// Made with Bob
