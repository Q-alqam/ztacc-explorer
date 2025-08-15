import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell
} from 'recharts';
import { 
  Filter, BarChart2, TrendingUp, PieChart as PieChartIcon, Clock
} from 'lucide-react';

const WalletAnalyticsTab = ({ darkMode = false, wallet }) => {
  const [timeRange, setTimeRange] = useState('1m');
  const [activeChart, setActiveChart] = useState('activity');
  
  // Helper function to format large numbers with K, M suffix
  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num;
  };

  // Helper function to format currency values
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Mock empty data for charts
  const generateActivityData = () => {
    return Array.from({ length: 30 }).map((_, i) => ({
      date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000),
      transactions: 0,
      volume: 0,
      value: 0
    }));
  };

  // Mock empty data for transaction types (for pie chart)
  const transactionTypeData = [
    { name: 'Transfers', value: 0 },
    { name: 'Swaps', value: 0 },
    { name: 'Approvals', value: 0 },
    { name: 'Staking', value: 0 },
    { name: 'Other', value: 0 }
  ];

  // Static colors for pie chart segments
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD'];

  // Activity data filtered by time range
  const activityData = generateActivityData();

  // Calculate summary metrics
  const calculateMetrics = () => {
    return {
      totalTransactions: activityData.reduce((sum, day) => sum + day.transactions, 0) || 0,
      totalVolume: activityData.reduce((sum, day) => sum + day.volume, 0) || 0,
      avgValue: activityData.length > 0 
        ? activityData.reduce((sum, day) => sum + day.value, 0) / activityData.length 
        : 0
    };
  };

  const metrics = calculateMetrics();
  
  return (
    <div className="space-y-6">
      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Transactions */}
        <div className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow ${darkMode ? 'border border-gray-700' : ''}`}>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Transactions</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatNumber(wallet?.totalTransactions || metrics.totalTransactions || 0)}
          </p>
        </div>
        
        {/* Total Volume */}
        <div className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow ${darkMode ? 'border border-gray-700' : ''}`}>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Volume</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(wallet?.totalVolume || metrics.totalVolume || 0)}
          </p>
        </div>
        
        {/* Average Transaction Value */}
        <div className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow ${darkMode ? 'border border-gray-700' : ''}`}>
          <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Transaction Value</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(wallet?.avgTransactionValue || metrics.avgValue || 0)}
          </p>
        </div>
      </div>
      
      {/* Chart Controls */}
      <div className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow ${darkMode ? 'border border-gray-700' : ''}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-3 sm:space-y-0">
          <div className="flex items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Analytics</h3>
            <div className="flex ml-4 space-x-2">
            <button 
              onClick={() => setActiveChart('activity')}
                className={`flex items-center px-3 py-1 rounded-md text-sm ${
                activeChart === 'activity' 
                  ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                <TrendingUp size={14} className="mr-1" /> Activity
              </button>
              <button
                onClick={() => setActiveChart('volume')}
                className={`flex items-center px-3 py-1 rounded-md text-sm ${
                  activeChart === 'volume'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                <BarChart2 size={14} className="mr-1" /> Volume
              </button>
              <button
                onClick={() => setActiveChart('types')}
                className={`flex items-center px-3 py-1 rounded-md text-sm ${
                  activeChart === 'types'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                <PieChartIcon size={14} className="mr-1" /> Tx Types
              </button>
            </div>
          </div>
          
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1 text-sm ${
                timeRange === '7d'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              7D
            </button>
            <button
              onClick={() => setTimeRange('1m')}
              className={`px-3 py-1 text-sm ${
                timeRange === '1m'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              1M
            </button>
            <button
              onClick={() => setTimeRange('3m')}
              className={`px-3 py-1 text-sm ${
                timeRange === '3m'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              3M
            </button>
            <button 
              onClick={() => setTimeRange('1y')}
              className={`px-3 py-1 text-sm ${
                timeRange === '1y'
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              1Y
            </button>
            <button 
              onClick={() => setTimeRange('all')}
              className={`px-3 py-1 text-sm ${
                timeRange === 'all'
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              All
            </button>
          </div>
        </div>
        
        {/* Chart Display */}
        <div className="h-80">
        {activeChart === 'activity' && (
              <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={activityData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#E5E7EB"} vertical={false} />
                  <XAxis 
                    dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(date) => {
                    if (typeof date === 'string') return date;
                    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  }}
                  stroke={darkMode ? "#9CA3AF" : "#4B5563"} 
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                    stroke={darkMode ? "#9CA3AF" : "#4B5563"} 
                />
                <Tooltip 
                  contentStyle={darkMode ? { backgroundColor: '#1F2937', border: 'none', color: '#fff' } : undefined}
                  formatter={(value, name) => [value, name === 'transactions' ? 'Transactions' : '']}
                  labelFormatter={(label) => {
                    if (typeof label === 'string') return label;
                    return new Date(label).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    });
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="transactions" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
          
          {activeChart === 'volume' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={activityData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#E5E7EB"} vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(date) => {
                    if (typeof date === 'string') return date;
                    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    }}
                  stroke={darkMode ? "#9CA3AF" : "#4B5563"} 
                  />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => formatCurrency(value).replace('.00', '')}
                  stroke={darkMode ? "#9CA3AF" : "#4B5563"} 
                />
                  <Tooltip 
                    contentStyle={darkMode ? { backgroundColor: '#1F2937', border: 'none', color: '#fff' } : undefined}
                  formatter={(value, name) => [formatCurrency(value), name === 'volume' ? 'Volume' : '']}
                  labelFormatter={(label) => {
                    if (typeof label === 'string') return label;
                    return new Date(label).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    });
                  }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="volume" 
                    stroke="#3B82F6" 
                  fillOpacity={1}
                  fill="url(#colorVolume)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
        )}
        
          {activeChart === 'types' && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <p className="mb-2">No transaction data available</p>
                <p className="text-sm">Transactions will appear here once the wallet has activity</p>
              </div>
            </div>
          )}
                </div>
              </div>
              
      {/* Top Trading Partners */}
      <div className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow ${darkMode ? 'border border-gray-700' : ''}`}>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Top Trading Partners</h3>
        <div className="h-64 flex items-center justify-center">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p className="mb-2">No trading partners yet</p>
            <p className="text-sm">Partners will appear here once the wallet has transaction activity</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletAnalyticsTab; 