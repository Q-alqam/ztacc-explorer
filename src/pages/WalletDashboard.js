import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wallet, Shield, ArrowDownUp, BarChart2, 
  TrendingUp, TrendingDown, Clock, Users
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, 
  ResponsiveContainer, XAxis, YAxis, Tooltip 
} from 'recharts';

// Import components
import Layout from '../components/Layout/Layout';
import WalletSearch from '../components/Wallet/WalletSearch';

// Mock data for dashboard stats
const mockStats = {
  totalWallets: 24789,
  activeWallets: 8563,
  totalTransactions: 142853,
  transactionsToday: 3856,
  totalVolume: 12458963.45,
  volumeToday: 245789.23,
  accessRequestsToday: 12453,
  accessApprovalRate: 92.4
};

// Mock data for activity chart
const generateActivityData = () => {
  return Array.from({ length: 30 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().split('T')[0],
      transactions: Math.floor(Math.random() * 500) + 200,
      volume: Math.floor(Math.random() * 50000) + 20000,
      activeWallets: Math.floor(Math.random() * 1000) + 5000
    };
  });
};

// Mock data for recent transactions
const mockRecentTransactions = Array.from({ length: 5 }).map((_, i) => ({
  hash: `0x${Math.random().toString(16).substring(2, 14)}${Math.random().toString(16).substring(2, 14)}`,
  from: `0x${Math.random().toString(16).substring(2, 10)}`,
  to: `0x${Math.random().toString(16).substring(2, 10)}`,
  type: i % 4 === 0 ? 'Access Control' : i % 4 === 1 ? 'Token Transfer' : i % 4 === 2 ? 'Validation' : 'Smart Contract',
  timestamp: new Date(Date.now() - i * 300000).toISOString(),
  amount: Math.random() * 1000,
  status: Math.random() > 0.1 ? 'Success' : 'Failed'
}));

// Mock data for top wallets
const mockTopWallets = Array.from({ length: 5 }).map((_, i) => ({
  address: `0x${Math.random().toString(16).substring(2, 10)}`,
  balance: Math.random() * 100000 + 50000,
  transactions: Math.floor(Math.random() * 1000) + 100,
  trustScore: Math.floor(Math.random() * 20) + 80,
  lastActivity: new Date(Date.now() - i * 86400000).toISOString()
}));

const WalletDashboard = ({ darkMode = false, toggleDarkMode, sidebarOpen = false, toggleSidebar, closeSidebar }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [activityData, setActivityData] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [topWallets, setTopWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('1m'); // 1d, 1w, 1m, 3m, 1y, all
  
  // Fetch dashboard data
  useEffect(() => {
    // In a real app, this would be API calls
    setTimeout(() => {
      setStats(mockStats);
      setActivityData(generateActivityData());
      setRecentTransactions(mockRecentTransactions);
      setTopWallets(mockTopWallets);
      setLoading(false);
    }, 1000);
  }, []);
  
  // Helper function to truncate address
  const truncateAddress = (address, length = 4) => {
    if (!address) return '—';
    return `${address.substring(0, length + 2)}...${address.substring(address.length - length)}`;
  };
  
  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Helper function to format time
  const formatTime = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <Layout
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
      sidebarOpen={sidebarOpen}
      toggleSidebar={toggleSidebar}
      onCloseSidebar={closeSidebar}
      title="Wallet Explorer Dashboard"
    >
      <div className="container mx-auto px-4 py-6">
        {/* Search Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Explore Wallets
          </h1>
          <WalletSearch darkMode={darkMode} />
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Total Wallets
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.totalWallets.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <Users size={20} className="text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center">
                  <TrendingUp size={14} className="mr-1" /> 
                  {Math.floor(Math.random() * 5) + 2}% increase
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Total Transactions
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.totalTransactions.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                    <ArrowDownUp size={20} className="text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center">
                  <TrendingUp size={14} className="mr-1" /> 
                  Today: {stats.transactionsToday.toLocaleString()}
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Total Volume
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.totalVolume.toLocaleString()} ZTACC
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                    <BarChart2 size={20} className="text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center">
                  <TrendingUp size={14} className="mr-1" /> 
                  Today: {stats.volumeToday.toLocaleString()} ZTACC
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Access Approval Rate
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.accessApprovalRate}%
                    </p>
                  </div>
                  <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
                    <Shield size={20} className="text-red-600 dark:text-red-400" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center">
                  <Clock size={14} className="mr-1" /> 
                  Requests today: {stats.accessRequestsToday.toLocaleString()}
                </p>
              </div>
            </div>
            
            {/* Activity Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Network Activity
                </h2>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <select 
                    onChange={(e) => setTimeRange(e.target.value)}
                    value={timeRange}
                    className="bg-transparent text-sm font-medium text-gray-700 dark:text-gray-300 px-3 py-1 focus:outline-none"
                  >
                    <option value="1d">1 Day</option>
                    <option value="1w">1 Week</option>
                    <option value="1m">1 Month</option>
                    <option value="3m">3 Months</option>
                    <option value="1y">1 Year</option>
                    <option value="all">All Time</option>
                  </select>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData}>
                    <XAxis 
                      dataKey="date" 
                      stroke={darkMode ? "#9CA3AF" : "#4B5563"} 
                      tick={{fontSize: 12}}
                      tickFormatter={(date) => {
                        const d = new Date(date);
                        return `${d.getMonth() + 1}/${d.getDate()}`;
                      }}
                    />
                    <YAxis stroke={darkMode ? "#9CA3AF" : "#4B5563"} />
                    <Tooltip 
                      contentStyle={darkMode ? { backgroundColor: '#1F2937', border: 'none', color: '#fff' } : undefined}
                      formatter={(value, name) => [
                        value.toLocaleString(), 
                        name === 'transactions' ? 'Transactions' : 
                        name === 'volume' ? 'Volume (ZTACC)' : 
                        name === 'activeWallets' ? 'Active Wallets' : name
                      ]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="transactions" 
                      stroke="#3B82F6" 
                      fill={darkMode ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.1)"} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="activeWallets" 
                      stroke="#10B981" 
                      fill={darkMode ? "rgba(16, 185, 129, 0.2)" : "rgba(16, 185, 129, 0.1)"} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Recent Transactions */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <ArrowDownUp size={18} className="mr-2" />
                  Recent Transactions
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Hash</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {recentTransactions.map((tx, i) => (
                        <tr key={tx.hash} 
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                          onClick={() => navigate(`/transaction/${tx.hash}`)}
                        >
                          <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                            {truncateAddress(tx.hash)}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {tx.type}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {formatTime(tx.timestamp)}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {tx.amount.toFixed(2)} ZTACC
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4">
                  <button 
                    onClick={() => navigate('/transactions')}
                    className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    View all transactions
                  </button>
                </div>
              </div>
              
              {/* Top Wallets */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Wallet size={18} className="mr-2" />
                  Top Wallets
                </h2>
                <div className="space-y-4">
                  {topWallets.map((wallet, i) => (
                    <div 
                      key={wallet.address}
                      onClick={() => navigate(`/wallet/${wallet.address}`)}
                      className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    >
                      <div className="flex items-center">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 ${
                          i === 0 ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300' :
                          i === 1 ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300' :
                          i === 2 ? 'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300' :
                          'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                        }`}>
                          {i + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white font-mono">
                            {truncateAddress(wallet.address)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Balance: {wallet.balance.toLocaleString()} ZTACC
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {wallet.transactions.toLocaleString()} txns
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Trust: {wallet.trustScore}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <button 
                    onClick={() => navigate('/wallets')}
                    className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    View all wallets
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default WalletDashboard; 