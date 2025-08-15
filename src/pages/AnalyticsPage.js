import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { 
  BarChart2, PieChart as PieChartIcon, TrendingUp, ArrowRight, 
  Clock, Activity, DollarSign, Users, Database, Shield,
  Filter, Search, Download, RefreshCw
} from 'lucide-react';
import { 
  AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from 'recharts';

// Mock data for network stats over time
const generateNetworkData = (days = 30) => {
  const baseDate = new Date();
  baseDate.setHours(0, 0, 0, 0);
  
  return Array.from({ length: days }).map((_, index) => {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - (days - index - 1));
    
    // Create a sine wave pattern for transactions with random noise
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const baseValue = Math.sin(dayOfYear / 15) * 0.4 + 0.5;
    
    return {
      date,
      transactions: Math.floor(baseValue * 2500 + Math.random() * 500),
      activeUsers: Math.floor(baseValue * 800 + Math.random() * 200),
      blockTime: 2.5 + Math.random() * 1,
      gasPrice: 20 + Math.random() * 15
    };
  });
};

// Mock data for transaction types
const transactionTypeData = [
  { name: 'Transfers', value: 45 },
  { name: 'Smart Contracts', value: 30 },
  { name: 'Access Control', value: 15 },
  { name: 'Staking', value: 7 },
  { name: 'Other', value: 3 }
];

// Mock data for gas usage by contract type
const gasUsageData = [
  { name: 'DeFi', value: 38 },
  { name: 'NFT', value: 22 },
  { name: 'Access Control', value: 18 },
  { name: 'DAO', value: 12 },
  { name: 'Gaming', value: 10 }
];

const AnalyticsPage = ({ darkMode = false, toggleDarkMode, sidebarOpen = false, toggleSidebar, closeSidebar }) => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('1m');
  const [activeMetric, setActiveMetric] = useState('transactions');
  const [networkData, setNetworkData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Chart colors
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
  
  // Format date for display
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Format large numbers
  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toFixed(0);
  };
  
  // Load network data
  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      
      // Simulate API delay
      setTimeout(() => {
        let days = 30;
        if (timeRange === '7d') days = 7;
        if (timeRange === '3m') days = 90;
        if (timeRange === '6m') days = 180;
        if (timeRange === '1y') days = 365;
        
        setNetworkData(generateNetworkData(days));
        setIsLoading(false);
      }, 800);
    };
    
    fetchData();
  }, [timeRange]);
  
  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate refresh
    setTimeout(() => {
      let days = 30;
      if (timeRange === '7d') days = 7;
      if (timeRange === '3m') days = 90;
      if (timeRange === '6m') days = 180;
      if (timeRange === '1y') days = 365;
      
      setNetworkData(generateNetworkData(days));
      setIsRefreshing(false);
    }, 1000);
  };
  
  // Calculate summary metrics
  const calculateMetrics = () => {
    if (networkData.length === 0) return { totalTx: 0, avgTx: 0, activeUsers: 0, avgBlockTime: 0 };
    
    const totalTx = networkData.reduce((sum, day) => sum + day.transactions, 0);
    const avgTx = totalTx / networkData.length;
    const activeUsers = networkData.reduce((max, day) => Math.max(max, day.activeUsers), 0);
    const avgBlockTime = networkData.reduce((sum, day) => sum + day.blockTime, 0) / networkData.length;
    
    return { totalTx, avgTx, activeUsers, avgBlockTime };
  };
  
  const metrics = calculateMetrics();

  return (
    <Layout
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
      sidebarOpen={sidebarOpen}
      toggleSidebar={toggleSidebar}
      onCloseSidebar={closeSidebar}
      title="Analytics"
    >
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
            <BarChart2 className="mr-2" size={24} />
            Network Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive analytics and insights for the Zero-Trust Access Control Chain
          </p>
        </div>
        
        {/* Analytics Controls */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center">
              <div className="mr-4">
                <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Time Range:</span>
                <div className="inline-flex bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
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
                    onClick={() => setTimeRange('6m')}
                    className={`px-3 py-1 text-sm ${
                      timeRange === '6m'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    6M
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
                </div>
              </div>
              
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Metric:</span>
                <select
                  value={activeMetric}
                  onChange={(e) => setActiveMetric(e.target.value)}
                  className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm"
                >
                  <option value="transactions">Transactions</option>
                  <option value="activeUsers">Active Users</option>
                  <option value="blockTime">Block Time</option>
                  <option value="gasPrice">Gas Price</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
              >
                <RefreshCw size={16} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              
              <button
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
              >
                <Download size={16} className="mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
                <Activity size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Transactions</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">{formatNumber(metrics.totalTx)}</p>
              </div>
            </div>
            <div className="mt-2 flex items-center">
              <div className="h-2 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: '75%' }}
                ></div>
              </div>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                {formatNumber(metrics.avgTx)} avg/day
              </span>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 mr-4">
                <Users size={20} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Users</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">{formatNumber(metrics.activeUsers)}</p>
              </div>
            </div>
            <div className="mt-2 flex items-center">
              <div className="h-2 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: '60%' }}
                ></div>
              </div>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                +12% this period
              </span>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 mr-4">
                <Clock size={20} className="text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Block Time</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">{metrics.avgBlockTime.toFixed(2)}s</p>
              </div>
            </div>
            <div className="mt-2 flex items-center">
              <div className="h-2 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500 rounded-full"
                  style={{ width: '85%' }}
                ></div>
              </div>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                -0.3s from avg
              </span>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 mr-4">
                <Database size={20} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Chain Size</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">256.4 GB</p>
              </div>
            </div>
            <div className="mt-2 flex items-center">
              <div className="h-2 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: '45%' }}
                ></div>
              </div>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                +3.2 GB this week
              </span>
            </div>
          </div>
        </div>
        
        {/* Main Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {activeMetric === 'transactions' && 'Transaction Volume'}
            {activeMetric === 'activeUsers' && 'Active Users'}
            {activeMetric === 'blockTime' && 'Block Time (seconds)'}
            {activeMetric === 'gasPrice' && 'Gas Price (Gwei)'}
          </h3>
          <div className="h-80">
            {isLoading ? (
              <div className="h-full flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-500 dark:text-gray-400">Loading data...</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={networkData}>
                  <defs>
                    <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#E5E7EB"} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: darkMode ? "#9CA3AF" : "#4B5563" }}
                    tickFormatter={formatDate}
                    axisLine={{ stroke: darkMode ? "#4B5563" : "#E5E7EB" }}
                  />
                  <YAxis 
                    tick={{ fill: darkMode ? "#9CA3AF" : "#4B5563" }}
                    axisLine={{ stroke: darkMode ? "#4B5563" : "#E5E7EB" }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: darkMode ? '#1F2937' : 'white',
                      borderColor: darkMode ? '#4B5563' : '#E5E7EB',
                      color: darkMode ? 'white' : 'black',
                    }}
                    formatter={(value) => [
                      activeMetric === 'blockTime' ? `${value.toFixed(2)}s` : 
                      activeMetric === 'gasPrice' ? `${value.toFixed(1)} Gwei` : 
                      formatNumber(value),
                      activeMetric === 'activeUsers' ? 'Active Users' : 
                      activeMetric === 'transactions' ? 'Transactions' :
                      activeMetric === 'blockTime' ? 'Block Time' : 'Gas Price'
                    ]}
                    labelFormatter={(date) => {
                      if (typeof date === 'string') return date;
                      return new Date(date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      });
                    }}
                    cursor={{ fill: 'rgba(0, 0, 0, 0.1)', stroke: 'none' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey={activeMetric} 
                    stroke="#3B82F6" 
                    fill="url(#colorMetric)" 
                    strokeWidth={2}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        
        {/* Transaction Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Transaction Types */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Transaction Types</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={transactionTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    isAnimationActive={false}
                  >
                    {transactionTypeData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                        strokeWidth={0}
                        fillOpacity={1}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Percentage']}
                    contentStyle={{
                      backgroundColor: darkMode ? '#1F2937' : 'white',
                      borderColor: darkMode ? '#4B5563' : '#E5E7EB',
                      color: darkMode ? 'white' : 'black',
                    }}
                    cursor={false}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Gas Usage by Contract Type */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Gas Usage by Contract Type</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={gasUsageData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#E5E7EB"} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: darkMode ? "#9CA3AF" : "#4B5563" }}
                    axisLine={{ stroke: darkMode ? "#4B5563" : "#E5E7EB" }}
                  />
                  <YAxis 
                    tick={{ fill: darkMode ? "#9CA3AF" : "#4B5563" }}
                    axisLine={{ stroke: darkMode ? "#4B5563" : "#E5E7EB" }}
                  />
                  <Tooltip
                    formatter={(value) => [`${value}%`, 'Percentage']}
                    contentStyle={{
                      backgroundColor: darkMode ? '#1F2937' : 'white',
                      borderColor: darkMode ? '#4B5563' : '#E5E7EB',
                      color: darkMode ? 'white' : 'black',
                    }}
                    cursor={{ fill: 'rgba(0, 0, 0, 0.1)', stroke: 'none' }}
                  />
                  <Bar 
                    dataKey="value" 
                    name="Gas Usage" 
                    radius={[4, 4, 0, 0]}
                    isAnimationActive={false}
                  >
                    {gasUsageData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                        strokeWidth={0}
                        fillOpacity={1}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Access Control Stats */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Access Control Stats</h3>
            <button 
              onClick={() => navigate('/access')}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
            >
              View Details <ArrowRight size={16} className="ml-1" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">Total Access Requests</h4>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-2">15,842</p>
              <div className="flex items-center text-sm text-blue-600 dark:text-blue-300">
                <TrendingUp size={14} className="mr-1" /> 
                <span>+12.5% this period</span>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 dark:bg-green-900 rounded-lg">
              <h4 className="font-medium text-green-800 dark:text-green-200 mb-1">Approval Rate</h4>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2">72.4%</p>
              <div className="flex items-center text-sm text-green-600 dark:text-green-300">
                <TrendingUp size={14} className="mr-1" /> 
                <span>+3.2% from previous</span>
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 dark:bg-purple-900 rounded-lg">
              <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-1">Avg. Trust Score</h4>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-2">83.7</p>
              <div className="flex items-center text-sm text-purple-600 dark:text-purple-300">
                <TrendingUp size={14} className="mr-1" /> 
                <span>+1.8 points from average</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AnalyticsPage; 