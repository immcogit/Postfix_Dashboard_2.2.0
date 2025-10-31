import React, { useState, useEffect, useCallback } from 'react';
import { 
  TopSender, 
  TopRecipient, 
  ConnectedIP, 
  AnalyticsSummary 
} from '../types';
import apiService, { ApiError } from '../services/apiService';
import { 
  ChartBarIcon, 
  ArrowDownTrayIcon,
  UserGroupIcon,
  GlobeAltIcon
} from './icons/IconComponents';
import { getLastNDaysRange } from '../utils/dateUtils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'senders' | 'recipients' | 'ips'>('senders');
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [topSenders, setTopSenders] = useState<TopSender[]>([]);
  const [topRecipients, setTopRecipients] = useState<TopRecipient[]>([]);
  const [connectedIPs, setConnectedIPs] = useState<ConnectedIP[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Default to last 7 days
  const defaultRange = getLastNDaysRange(7);
  const [filter, setFilter] = useState<{ startDate: string; endDate: string }>(defaultRange);
  const [limit, setLimit] = useState(50);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const query = {
        startDate: filter.startDate,
        endDate: filter.endDate,
        limit: limit.toString(),
      };

      const [summaryData, sendersData, recipientsData, ipsData] = await Promise.all([
        apiService.get<AnalyticsSummary>('/api/analytics/summary', query),
        apiService.get<{ total: number; data: TopSender[] }>('/api/analytics/top-senders', query),
        apiService.get<{ total: number; data: TopRecipient[] }>('/api/analytics/top-recipients', query),
        apiService.get<{ total: number; data: ConnectedIP[] }>('/api/analytics/connected-ips', query),
      ]);

      setSummary(summaryData);
      setTopSenders(sendersData.data);
      setTopRecipients(recipientsData.data);
      setConnectedIPs(ipsData.data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to fetch analytics data.');
      }
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [filter, limit]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleApplyFilter = () => {
    fetchAnalytics();
  };

  const handleQuickFilter = (days: number) => {
    const newFilter = getLastNDaysRange(days);
    setFilter(newFilter);
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => Object.values(item).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${filter.startDate}_to_${filter.endDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getChartData = () => {
    if (activeTab === 'senders') {
      return topSenders.slice(0, 10).map(s => ({
        name: s.email.split('@')[0],
        total: s.totalMessages,
        sent: s.sent,
        bounced: s.bounced,
      }));
    } else if (activeTab === 'recipients') {
      return topRecipients.slice(0, 10).map(r => ({
        name: r.email.split('@')[0],
        total: r.totalMessages,
        sent: r.sent,
        bounced: r.bounced,
      }));
    } else {
      return connectedIPs.slice(0, 10).map(ip => ({
        name: ip.ip.split('.').slice(0, 2).join('.') + '.*.*',
        connections: ip.connections,
        messages: ip.totalMessages,
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-semibold flex items-center">
            <ChartBarIcon className="w-7 h-7 mr-2 text-primary"/>
            Mail Analytics
          </h2>
          <p className="text-gray-400 mt-1">
            Analyze top senders, recipients, and connected IP addresses
          </p>
        </div>
      </div>

      {/* Date Filter */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <h3 className="text-lg font-semibold text-gray-200">Date Range:</h3>
            <div>
              <label htmlFor="startDate" className="text-sm font-medium text-gray-400 mr-2">
                From
              </label>
              <input
                type="date"
                name="startDate"
                id="startDate"
                value={filter.startDate}
                onChange={handleFilterChange}
                className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-200 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="text-sm font-medium text-gray-400 mr-2">
                To
              </label>
              <input
                type="date"
                name="endDate"
                id="endDate"
                value={filter.endDate}
                onChange={handleFilterChange}
                className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-200 focus:ring-primary focus:border-primary"
              />
            </div>
            <button
              onClick={handleApplyFilter}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors"
            >
              Apply
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => handleQuickFilter(1)}
              className="px-3 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors text-sm"
            >
              Today
            </button>
            <button
              onClick={() => handleQuickFilter(7)}
              className="px-3 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors text-sm"
            >
              Last 7 Days
            </button>
            <button
              onClick={() => handleQuickFilter(30)}
              className="px-3 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors text-sm"
            >
              Last 30 Days
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-8 text-gray-400">
          <div className="flex items-center justify-center">
            <svg className="animate-spin h-8 w-8 mr-3 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading analytics...
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-4 rounded-md">
          {error}
        </div>
      )}

      {!loading && !error && summary && (
        <>
          {/* Summary Cards - Make them clickable */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div 
              className="bg-gray-800 p-6 rounded-lg border border-gray-700 cursor-pointer hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all"
              onClick={() => setActiveTab('senders')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setActiveTab('senders')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 font-medium">Unique Senders</p>
                  <p className="text-3xl font-bold text-gray-100 mt-1">{summary.uniqueSenders}</p>
                  <p className="text-sm text-gray-500 mt-2">{summary.senderDomains} domains</p>
                </div>
                <UserGroupIcon className="w-12 h-12 text-primary opacity-50" />
              </div>
            </div>

            <div 
              className="bg-gray-800 p-6 rounded-lg border border-gray-700 cursor-pointer hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all"
              onClick={() => setActiveTab('recipients')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setActiveTab('recipients')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 font-medium">Unique Recipients</p>
                  <p className="text-3xl font-bold text-gray-100 mt-1">{summary.uniqueRecipients}</p>
                  <p className="text-sm text-gray-500 mt-2">{summary.recipientDomains} domains</p>
                </div>
                <UserGroupIcon className="w-12 h-12 text-success opacity-50" />
              </div>
            </div>

            <div 
              className="bg-gray-800 p-6 rounded-lg border border-gray-700 cursor-pointer hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all"
              onClick={() => setActiveTab('ips')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setActiveTab('ips')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 font-medium">Connected IPs</p>
                  <p className="text-3xl font-bold text-gray-100 mt-1">{summary.uniqueIPs}</p>
                  <p className="text-sm text-gray-500 mt-2">unique addresses</p>
                </div>
                <GlobeAltIcon className="w-12 h-12 text-warning opacity-50" />
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 font-medium">Total Messages</p>
                  <p className="text-3xl font-bold text-gray-100 mt-1">{summary.totalMessages.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-2">in period</p>
                </div>
                <ChartBarIcon className="w-12 h-12 text-danger opacity-50" />
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Top 10 Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e1e1e',
                    border: '1px solid #444444',
                    color: '#e5e7eb'
                  }}
                />
                <Legend />
                {activeTab === 'ips' ? (
                  <>
                    <Bar dataKey="connections" fill="#3b82f6" name="Connections" />
                    <Bar dataKey="messages" fill="#10b981" name="Messages" />
                  </>
                ) : (
                  <>
                    <Bar dataKey="total" fill="#3b82f6" name="Total" />
                    <Bar dataKey="sent" fill="#10b981" name="Sent" />
                    <Bar dataKey="bounced" fill="#ef4444" name="Bounced" />
                  </>
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tabs */}
          <div className="bg-gray-800 rounded-lg border border-gray-700">
            <div className="border-b border-gray-700">
              <div className="flex flex-wrap">
                <button
                  onClick={() => setActiveTab('senders')}
                  className={`px-6 py-3 font-medium transition-colors ${
                    activeTab === 'senders'
                      ? 'text-primary border-b-2 border-primary bg-gray-700/50'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/30'
                  }`}
                >
                  Top Senders ({topSenders.length})
                </button>
                <button
                  onClick={() => setActiveTab('recipients')}
                  className={`px-6 py-3 font-medium transition-colors ${
                    activeTab === 'recipients'
                      ? 'text-primary border-b-2 border-primary bg-gray-700/50'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/30'
                  }`}
                >
                  Top Recipients ({topRecipients.length})
                </button>
                <button
                  onClick={() => setActiveTab('ips')}
                  className={`px-6 py-3 font-medium transition-colors ${
                    activeTab === 'ips'
                      ? 'text-primary border-b-2 border-primary bg-gray-700/50'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/30'
                  }`}
                >
                  Connected IPs ({connectedIPs.length})
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm text-gray-400">
                    Show:
                    <select
                      value={limit}
                      onChange={(e) => setLimit(Number(e.target.value))}
                      className="ml-2 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-gray-200"
                    >
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                      <option value={200}>200</option>
                    </select>
                  </label>
                </div>
                <button
                  onClick={() => {
                    if (activeTab === 'senders') exportToCSV(topSenders, 'top_senders');
                    else if (activeTab === 'recipients') exportToCSV(topRecipients, 'top_recipients');
                    else exportToCSV(connectedIPs, 'connected_ips');
                  }}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors"
                >
                  <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                  Export CSV
                </button>
              </div>

              {/* Top Senders Table */}
              {activeTab === 'senders' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left">#</th>
                        <th className="px-4 py-3 text-left">Email</th>
                        <th className="px-4 py-3 text-left">Source/Relay IP(s)</th>
                        <th className="px-4 py-3 text-right">Total</th>
                        <th className="px-4 py-3 text-right">Sent</th>
                        <th className="px-4 py-3 text-right">Bounced</th>
                        <th className="px-4 py-3 text-right">Deferred</th>
                        <th className="px-4 py-3 text-right">Success Rate</th>
                        <th className="px-4 py-3 text-left">Last Seen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topSenders.map((sender, index) => (
                        <tr key={sender.email} className="border-b border-gray-700 hover:bg-gray-700/30">
                          <td className="px-4 py-3 text-gray-400">{index + 1}</td>
                          <td className="px-4 py-3 font-mono text-sm">{sender.email}</td>
                          <td className="px-4 py-3 text-sm max-w-xs">
                            {sender.relayIPs && sender.relayIPs.length > 0 ? (
                              <div className="space-y-1">
                                {sender.relayIPs.map((ip, idx) => (
                                  <div key={idx} className="font-mono text-xs bg-gray-900/50 px-2 py-1 rounded inline-block mr-1">
                                    {ip}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-500">N/A</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold">{sender.totalMessages}</td>
                          <td className="px-4 py-3 text-right text-green-400">{sender.sent}</td>
                          <td className="px-4 py-3 text-right text-red-400">{sender.bounced}</td>
                          <td className="px-4 py-3 text-right text-yellow-400">{sender.deferred}</td>
                          <td className="px-4 py-3 text-right">
                            <span className={`px-2 py-1 rounded ${
                              parseFloat(sender.successRate) >= 90 ? 'bg-green-500/20 text-green-400' :
                              parseFloat(sender.successRate) >= 70 ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {sender.successRate}%
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-400">
                            {new Date(sender.lastSeen).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Top Recipients Table */}
              {activeTab === 'recipients' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left">#</th>
                        <th className="px-4 py-3 text-left">Email</th>
                        <th className="px-4 py-3 text-left">Source/Relay IP(s)</th>
                        <th className="px-4 py-3 text-right">Total</th>
                        <th className="px-4 py-3 text-right">Delivered</th>
                        <th className="px-4 py-3 text-right">Bounced</th>
                        <th className="px-4 py-3 text-right">Deferred</th>
                        <th className="px-4 py-3 text-right">Delivery Rate</th>
                        <th className="px-4 py-3 text-left">Last Seen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topRecipients.map((recipient, index) => (
                        <tr key={recipient.email} className="border-b border-gray-700 hover:bg-gray-700/30">
                          <td className="px-4 py-3 text-gray-400">{index + 1}</td>
                          <td className="px-4 py-3 font-mono text-sm">{recipient.email}</td>
                          <td className="px-4 py-3 text-sm max-w-xs">
                            {recipient.relayIPs && recipient.relayIPs.length > 0 ? (
                              <div className="space-y-1">
                                {recipient.relayIPs.map((ip, idx) => (
                                  <div key={idx} className="font-mono text-xs bg-gray-900/50 px-2 py-1 rounded inline-block mr-1">
                                    {ip}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-500">N/A</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold">{recipient.totalMessages}</td>
                          <td className="px-4 py-3 text-right text-green-400">{recipient.sent}</td>
                          <td className="px-4 py-3 text-right text-red-400">{recipient.bounced}</td>
                          <td className="px-4 py-3 text-right text-yellow-400">{recipient.deferred}</td>
                          <td className="px-4 py-3 text-right">
                            <span className={`px-2 py-1 rounded ${
                              parseFloat(recipient.deliveryRate) >= 90 ? 'bg-green-500/20 text-green-400' :
                              parseFloat(recipient.deliveryRate) >= 70 ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {recipient.deliveryRate}%
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-400">
                            {new Date(recipient.lastSeen).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Connected IPs Table */}
              {activeTab === 'ips' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left">#</th>
                        <th className="px-4 py-3 text-left">IP Address</th>
                        <th className="px-4 py-3 text-left">Hostname(s)</th>
                        <th className="px-4 py-3 text-right">Connections</th>
                        <th className="px-4 py-3 text-right">Messages</th>
                        <th className="px-4 py-3 text-right">Sent</th>
                        <th className="px-4 py-3 text-right">Success Rate</th>
                        <th className="px-4 py-3 text-left">Last Seen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {connectedIPs.map((ip, index) => (
                        <tr key={ip.ip} className="border-b border-gray-700 hover:bg-gray-700/30">
                          <td className="px-4 py-3 text-gray-400">{index + 1}</td>
                          <td className="px-4 py-3 font-mono text-sm">{ip.ip}</td>
                          <td className="px-4 py-3 text-sm max-w-xs truncate" title={ip.hostnames.join(', ')}>
                            {ip.hostnames.length > 0 ? ip.hostnames.join(', ') : 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold">{ip.connections}</td>
                          <td className="px-4 py-3 text-right">{ip.totalMessages}</td>
                          <td className="px-4 py-3 text-right text-green-400">{ip.sent}</td>
                          <td className="px-4 py-3 text-right">
                            <span className={`px-2 py-1 rounded ${
                              parseFloat(ip.successRate) >= 90 ? 'bg-green-500/20 text-green-400' :
                              parseFloat(ip.successRate) >= 70 ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {ip.successRate}%
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-400">
                            {new Date(ip.lastSeen).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
