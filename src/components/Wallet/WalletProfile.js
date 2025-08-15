import React, { useState, useEffect } from 'react';
import { 
  User, Wallet, ArrowDownUp, FileText, Shield, Clock, 
  ChevronRight, Filter, RefreshCw, BarChart2, 
  Key, Copy, ExternalLink, Hash, PlusCircle, TrendingUp, TrendingDown
} from 'lucide-react';

// Import the tab components
import WalletOverviewTab from './WalletOverviewTab';
import WalletTransactionsTab from './WalletTransactionsTab';
import WalletAccessTab from './WalletAccessTab';
import WalletAnalyticsTab from './WalletAnalyticsTab';

// Helper functions
const truncateAddress = (address, length = 6) => {
  if (!address) return '—';
  return `${address.substring(0, length + 2)}...${address.substring(address.length - length)}`;
};

const formatDate = (dateString) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Mock wallet data
const mockWalletData = {
  address: '0x13ff81ff7d19a',  // Using your blockchain's address format
  balance: 2456.78,
  transactions: 143,
  firstActivity: '2023-07-15T14:22:35Z',
  lastActivity: '2025-03-10T09:45:12Z',
  accessRequests: 87,
  accessGranted: 82,
  accessDenied: 5,
  tokensSent: 1245.32,
  tokensReceived: 3702.10,
  delegatedStake: 1000.00,
  validatorRewards: 67.45,
  tags: ['Active Validator', 'High Volume'],
  watchlisted: false,
  trustScore: 95,  // Added for your blockchain's trust system
  accessLevel: 'High',  // Added for your blockchain's access control
  validatorStatus: 'Active'  // Added for your blockchain's validation system
};

// Mock transaction history
const mockTransactionHistory = Array.from({ length: 15 }).map((_, i) => ({
  hash: `0x${Math.random().toString(16).substring(2, 14)}${Math.random().toString(16).substring(2, 14)}`,
  blockNumber: 10000 - i * 10,
  type: i % 4 === 0 ? 'Access Control' : i % 4 === 1 ? 'Token Transfer' : i % 4 === 2 ? 'Validation' : 'Smart Contract',
  timestamp: new Date(Date.now() - i * 86400000 * (Math.random() * 3 + 1)).toISOString(),
  direction: i % 3 === 0 ? 'out' : i % 3 === 1 ? 'in' : 'self',
  status: Math.random() > 0.1 ? 'Success' : 'Failed',
  amount: Math.random() * 100,
  fee: (Math.random() * 0.01).toFixed(6),
  from: `0x${Math.random().toString(16).substring(2, 10)}`,  // Using your shorter address format
  to: `0x${Math.random().toString(16).substring(2, 10)}`,    // Using your shorter address format
  trustScore: Math.floor(Math.random() * 100),  // Added for your blockchain
  accessLevel: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)],  // Added for your blockchain
  validationWeight: Math.random() * 10  // Added for your blockchain
}));

// Mock chart data
const generateActivityData = () => {
  return Array.from({ length: 30 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().split('T')[0],
      transactions: Math.floor(Math.random() * 8) + 1,
      accessRequests: Math.floor(Math.random() * 5),
      volume: Math.floor(Math.random() * 200) + 50
    };
  });
};

// Main wallet profile component
const WalletProfile = ({ darkMode = false, address, wallet, transactions: initialTransactions = [], onWalletClick, hideHeader = false }) => {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(!wallet);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('1m');
  
  // Fetch wallet data if not provided
  useEffect(() => {
    if (wallet && initialTransactions.length > 0) {
      setTransactions(initialTransactions);
      setActivityData(generateActivityData());
      setLoading(false);
      return;
    }

    // In a real app, this would be an API call
    setTimeout(() => {
      setTransactions(mockTransactionHistory);
      setActivityData(generateActivityData());
      setLoading(false);
    }, 1000);
  }, [address, wallet, initialTransactions]);

  // Add clipboard functionality
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    // You could add a toast notification here
  };

  // Add trust score indicator
  const getTrustScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const currentWallet = wallet || mockWalletData;

  return (
    <div className="space-y-8">
      {/* Wallet Header - Only show if hideHeader is false */}
      {!hideHeader && (
        <>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full mr-4">
              <Wallet size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                {truncateAddress(address, 10)}
                <button 
                  onClick={handleCopyAddress}
                  className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <Copy size={16} />
                </button>
              </h1>
              <div className="flex items-center mt-1 space-x-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                      First seen: {formatDate(currentWallet?.firstActivity)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                      Last active: {formatDate(currentWallet?.lastActivity)}
                </p>
                    <p className={`text-sm font-medium ${getTrustScoreColor(currentWallet?.trustScore)}`}>
                      Trust Score: {currentWallet?.trustScore}%
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
                {currentWallet?.tags.map(tag => (
              <span 
                key={tag} 
                className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 rounded-full text-xs font-medium"
              >
                {tag}
              </span>
            ))}
            <button className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 rounded-full text-xs font-medium flex items-center">
              <PlusCircle size={12} className="mr-1" /> Add Tag
            </button>
          </div>
        </div>
      </div>

          {/* Key Stats - Only show if hideHeader is false */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">Balance</p>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
                {currentWallet?.balance.toLocaleString()} ZTACC
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">Access Level</p>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
                {currentWallet?.accessLevel}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">Validator Status</p>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
                {currentWallet?.validatorStatus}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">Trust Score</p>
              <p className={`text-2xl font-bold mt-1 ${getTrustScoreColor(currentWallet?.trustScore)}`}>
                {currentWallet?.trustScore}%
          </p>
        </div>
      </div>
        </>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-6 overflow-x-auto scrollbar-hide py-2">
          <button
            className={`pb-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'overview' 
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`pb-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'transactions' 
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('transactions')}
          >
            Transactions
          </button>
          <button
            className={`pb-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'access' 
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('access')}
          >
            Access Control
          </button>
          <button
            className={`pb-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'analytics' 
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <WalletOverviewTab 
            darkMode={darkMode} 
            wallet={currentWallet} 
            transactions={transactions.slice(0, 5)} 
            activityData={activityData}
            onWalletClick={onWalletClick}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
          />
        )}
        {activeTab === 'transactions' && (
          <WalletTransactionsTab 
            darkMode={darkMode} 
            transactions={transactions}
            onWalletClick={onWalletClick}
          />
        )}
        {activeTab === 'access' && (
          <WalletAccessTab 
            darkMode={darkMode}
            wallet={currentWallet} 
          />
        )}
        {activeTab === 'analytics' && (
          <WalletAnalyticsTab 
            darkMode={darkMode} 
            wallet={currentWallet} 
            activityData={activityData}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
          />
        )}
      </div>
    </div>
  );
};

export default WalletProfile; 