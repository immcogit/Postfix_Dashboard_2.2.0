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
  GlobeAltIcon,
  ArrowPathIcon
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

  const defaultRange = getLastNDaysRange(7);
  const [filter, setFilter] = useState<{ startDate: string; endDate: string }>(defaultRange);
  const [limit, setLimit] = useState(50);

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
        setError('Failed to fetch analytics data. Please try again.');
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
    fetchAnalytics(); // Auto-refresh
  };

  const escapeCSV = (value: any): string => {
    const str = String(value ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]).map(escapeCSV).join(',');
    const rows = data.map(item =>
      Object.values(item).map(escapeCSV).join(',')
    ).join('\n');
    const csv = `${headers}\n${rows}`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${filter.startDate}_to_${filter.endDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const truncate = (str: string, max: number = 15): string => {
    return str.length > max ? `${str.slice(0, max - 3)}...` : str;
  };

  const getChartData = () => {
    if (activeTab === 'senders') {
      return topSenders.slice(0, 10).map(s => ({
        name: truncate(s.email.split('@')[0], 12),
        total: s.totalMessages,
        sent: s.sent,
        bounced: s.bounced,
        deferred: s.deferred,
      }));
    } else if (activeTab === 'recipients') {
      return topRecipients.slice(0, 10).map(r => ({
        name: truncate(r.email.split('@')[0], 12),
        total: r.totalMessages,
        sent: r.sent,
        bounced: r.bounced,
        deferred: r.deferred,
      }));
    } else {
      return connectedIPs.slice(0, 10).map(ip => ({
        name: ip.ip.split('.').slice(0, 2).join('.') + '.*.*',
        connections: ip.connections,
        messages: ip.totalMessages,
      }));
    }
  };

  const renderRelayIPs = (ips: string[]) => {
    if (!ips || ips.length === 0) return <span className="text-gray-500 text-xs">N/A</span>;

    const displayed = ips.slice(0, 3);
    const remaining = ips.length - displayed.length;

    return (
      <div className="flex flex-wrap gap-1">
        {displayed.map((ip, idx) => (
          <span
            key={idx}
            className="font-mono text-xs bg-gray-900/50 px-2 py-1 rounded"
            title={ip}
          >
            {ip}
          </span>
        ))}
        {remaining > 0 && (
          <span
            className="text-xs text-primary cursor-help"
            title={ips.slice(3).join(', ')}
          >
            +{remaining} more
          </span>
        )}
      </div>
    );
  };

  const handleCardKeyDown = (e: React.KeyboardEvent, tab: 'senders' | 'recipients' | 'ips') => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveTab(tab);
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
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-200">Date Range:</h3>
            <input
              type="date"
              name="startDate"
              value={filter.startDate}
              onChange={handleFilterChange}
              className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-200 text-sm focus:ring-primary focus:border-primary"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              name="endDate"
              value={filter.endDate}
              onChange={handleFilterChange}
              className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-200 text-sm focus:ring-primary focus:border-primary"
            />
            <button
              onClick={handleApplyFilter}
              className="px-5 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors text-sm font-medium"
            >
              Apply
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { label: 'Today', days: 1 },
              { label: 'Last 7 Days', days: 7 },
              { label: 'Last 30 Days', days: 30 },
            ].map(({ label, days }) => (
              <button
                key={label}
                onClick={() => handleQuickFilter(days)}
                className="px-3 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors text-sm"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-800 p-6 rounded-lg border border-gray-700 animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-700 rounded w-16"></div>
              </div>
            ))}
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 h-64 animate-pulse"></div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-6 rounded-lg flex items-center justify-between">
          <div>
            <p className="font-medium">Failed to load analytics data</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
          <button
            onClick={fetchAnalytics}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          >
            <ArrowPathIcon className="w-4 h-4" />
            Retry
          </button>
        </div>
      )}

      {/* Content */}
      {!loading && !error && summary && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: 'Unique Senders',
                value: summary.uniqueSenders,
                sub: `${summary.senderDomains} domains`,
                icon: UserGroupIcon,
                color: 'text-primary',
                tab: 'senders' as const,
              },
              {
                label: 'Unique Recipients',
                value: summary.uniqueRecipients,
                sub: `${summary.recipientDomains} domains`,
                icon: UserGroupIcon,
                color: 'text-success',
                tab: 'recipients' as const,
              },
              {
                label: 'Connected IPs',
                value: summary.uniqueIPs,
                sub: 'unique addresses',
                icon: GlobeAltIcon,
                color: 'text-warning',
                tab: 'ips' as const,
              },
              {
                label: 'Total Messages',
                value: summary.totalMessages.toLocaleString(),
                sub: 'in period',
                icon: ChartBarIcon,
                color: 'text-danger',
              },
            ].map((card, i) => (
              <div
                key={i}
                className={`bg-gray-800 p-6 rounded-lg border border-gray-700 transition-all ${
                  card.tab ? 'cursor-pointer hover:border-primary hover:shadow-lg hover:shadow-primary/20' : ''
                }`}
                onClick={() => card.tab && setActiveTab(card.tab)}
                onKeyDown={(e) => card.tab && handleCardKeyDown(e, card.tab)}
                role={card.tab ? 'button' : undefined}
                tabIndex={card.tab ? 0 : undefined}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 font-medium">{card.label}</p>
                    <p className="text-3xl font-bold text-gray-100 mt-1">{card.value}</p>
                    <p className="text-sm text-gray-500 mt-2">{card.sub}</p>
                  </div>
                  <card.icon className={`w-12 h-12 ${card.color} opacity-50`} />
                </div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Top 10 Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getChartData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
                <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e1e1e',
                    border: '1px solid #444444',
                    color: '#e5e7eb',
                    borderRadius: '6px'
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
                    <Bar dataKey="total" fill="#6b7280" name="Total" />
                    <Bar dataKey="sent" fill="#10b981" name="Sent" />
                    <Bar dataKey="bounced" fill="#ef4444" name="Bounced" />
                    <Bar dataKey="deferred" fill="#f59e0b" name="Deferred" />
                  </>
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tabs */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="border-b border-gray-700">
              <div className="flex flex-wrap">
                {[
                  { key: 'senders' as const, label: 'Top Senders', count: topSenders.length },
                  { key: 'recipients' as const, label: 'Top Recipients', count: topRecipients.length },
                  { key: 'ips' as const, label: 'Connected IPs', count: connectedIPs.length },
                ].map(({ key, label, count }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`px-6 py-3 font-medium transition-colors text-sm ${
                      activeTab === key
                        ? 'text-primary border-b-2 border-primary bg-gray-700/50'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/30'
                    }`}
                  >
                    {label} ({count})
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  Show:
                  <select
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                    className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-gray-200 text-sm"
                  >
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={200}>200</option>
                  </select>
                </label>
                <button
                  onClick={() => {
                    const data = activeTab === 'senders' ? topSenders :
                                activeTab === 'recipients' ? topRecipients : connectedIPs;
                    const name = activeTab === 'senders' ? 'top_senders' :
                                activeTab === 'recipients' ? 'top_recipients' : 'connected_ips';
                    exportToCSV(data, name);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors text-sm"
                >
                  <ArrowDownTrayIcon className="w-5 h-5" />
                  Export CSV
                </button>
              </div>

              {/* Tables */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-gray-300 uppercase bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left">#</th>
                      <th className="px-4 py-3 text-left">
                        {activeTab === 'ips' ? 'IP Address' : 'Email'}
                      </th>
                      {activeTab !== 'ips' && (
                        <th className="px-4 py-3 text-left">Relay IP(s)</th>
                      )}
                      {activeTab === 'ips' && (
                        <th className="px-4 py-3 text-left">Hostname(s)</th>
                      )}
                      <th className="px-4 py-3 text-right">Total</th>
                      {activeTab !== 'ips' && (
                        <>
                          <th className="px-4 py-3 text-right">Sent</th>
                          <th className="px-4 py-3 text-right">Bounced</th>
                          <th className="px-4 py-3 text-right">Deferred</th>
                        </>
                      )}
                      {activeTab === 'ips' && (
                        <>
                          <th className="px-4 py-3 text-right">Connections</th>
                          <th className="px-4 py-3 text-right">Messages</th>
                        </>
                      )}
                      <th className="px-4 py-3 text-right">
                        {activeTab === 'ips' ? 'Success Rate' : activeTab === 'recipients' ? 'Delivery Rate' : 'Success Rate'}
                      </th>
                      <th className="px-4 py-3 text-left">Last Seen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeTab === 'senders' && topSenders.map((s, i) => (
                      <SenderRow key={s.email} sender={s} index={i} />
                    ))}
                    {activeTab === 'recipients' && topRecipients.map((r, i) => (
                      <RecipientRow key={r.email} recipient={r} index={i} />
                    ))}
                    {activeTab === 'ips' && connectedIPs.map((ip, i) => (
                      <IPRow key={ip.ip} ip={ip} index={i} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Extracted Row Components for Cleanliness
const SenderRow: React.FC<{ sender: TopSender; index: number }> = ({ sender, index }) => (
  <tr className="border-b border-gray-700 hover:bg-gray-700/30">
    <td className="px-4 py-3 text-gray-400">{index + 1}</td>
    <td className="px-4 py-3 font-mono text-sm">{sender.email}</td>
    <td className="px-4 py-3">{renderRelayIPs(sender.relayIPs)}</td>
    <td className="px-4 py-3 text-right font-semibold">{sender.totalMessages}</td>
    <td className="px-4 py-3 text-right text-green-400">{sender.sent}</td>
    <td className="px-4 py-3 text-right text-red-400">{sender.bounced}</td>
    <td className="px-4 py-3 text-right text-yellow-400">{sender.deferred}</td>
    <td className="px-4 py-3 text-right">
      <RateBadge rate={sender.successRate} />
    </td>
    <td className="px-4 py-3 text-sm text-gray-400">
      {new Date(sender.lastSeen).toLocaleString()}
    </td>
  </tr>
);

const RecipientRow: React.FC<{ recipient: TopRecipient; index: number }> = ({ recipient, index }) => (
  <tr className="border-b border-gray-700 hover:bg-gray-700/30">
    <td className="px-4 py-3 text-gray-400">{index + 1}</td>
    <td className="px-4 py-3 font-mono text-sm">{recipient.email}</td>
    <td className="px-4 py-3">{renderRelayIPs(recipient.relayIPs)}</td>
    <td className="px-4 py-3 text-right font-semibold">{recipient.totalMessages}</td>
    <td className="px-4 py-3 text-right text-green-400">{recipient.sent}</td>
    <td className="px-4 py-3 text-right text-red-400">{recipient.bounced}</td>
    <td className="px-4 py-3 text-right text-yellow-400">{recipient.deferred}</td>
    <td className="px-4 py-3 text-right">
      <RateBadge rate={recipient.deliveryRate} />
    </td>
    <td className="px-4 py-3 text-sm text-gray-400">
      {new Date(recipient.lastSeen).toLocaleString()}
    </td>
  </tr>
);

const IPRow: React.FC<{ ip: ConnectedIP; index: number }> = ({ ip, index }) => (
  <tr className="border-b border-gray-700 hover:bg-gray-700/30">
    <td className="px-4 py-3 text-gray-400">{index + 1}</td>
    <td className="px-4 py-3 font-mono text-sm">{ip.ip}</td>
    <td className="px-4 py-3 text-sm max-w-xs" title={ip.hostnames.join(', ')}>
      {ip.hostnames.length > 0 ? ip.hostnames.join(', ') : 'N/A'}
    </td>
    <td className="px-4 py-3 text-right font-semibold">{ip.connections}</td>
    <td className="px-4 py-3 text-right">{ip.totalMessages}</td>
    <td className="px-4 py-3 text-right text-green-400">{ip.sent}</td>
    <td className="px-4 py-3 text-right">
      <RateBadge rate={ip.successRate} />
    </td>
    <td className="px-4 py-3 text-sm text-gray-400">
      {new Date(ip.lastSeen).toLocaleString()}
    </td>
  </tr>
);

const RateBadge: React.FC<{ rate: string }> = ({ rate }) => {
  const num = parseFloat(rate);
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${
      num >= 90 ? 'bg-green-500/20 text-green-400' :
      num >= 70 ? 'bg-yellow-500/20 text-yellow-400' :
      'bg-red-500/20 text-red-400'
    }`}>
      {rate}%
    </span>
  );
};

// Helper outside component
const renderRelayIPs = (ips: string[]) => {
  if (!ips || ips.length === 0) return <span className="text-gray-500 text-xs">N/A</span>;

  const displayed = ips.slice(0, 3);
  const remaining = ips.length - displayed.length;

  return (
    <div className="flex flex-wrap gap-1">
      {displayed.map((ip, idx) => (
        <span
          key={idx}
          className="font-mono text-xs bg-gray-900/50 px-2 py-1 rounded"
          title={ip}
        >
          {ip}
        </span>
      ))}
      {remaining > 0 && (
        <span
          className="text-xs text-primary cursor-help"
          title={ips.slice(3).join(', ')}
        >
          +{remaining} more
        </span>
      )}
    </div>
  );
};

export default Analytics;