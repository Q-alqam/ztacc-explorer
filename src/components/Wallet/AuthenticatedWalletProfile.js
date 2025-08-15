import React, { useState } from 'react';
import { 
  Wallet, Copy, Send, Download, ArrowRight, X, RefreshCw, 
  ChevronDown, Filter, PlusCircle, Clock, Shield, Activity 
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, ResponsiveContainer, 
  XAxis, YAxis, Tooltip 
} from 'recharts';

// Import wallet tab components
import WalletOverviewTab from './WalletOverviewTab';
import WalletTransactionsTab from './WalletTransactionsTab';
import WalletAccessTab from './WalletAccessTab';
import WalletAnalyticsTab from './WalletAnalyticsTab';

// Helper functions
const truncateAddress = (address) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

const formatAmount = (amount) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Mock data - replace with real data in production
const mockWalletData = {
  address: '0x13ff81ff7d19a',
  balance: 1234.56,
  pendingTransactions: 2,
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
  trustScore: 95,
  accessLevel: 'High',
  validatorStatus: 'Active',
  recentTransactions: [
    {
      hash: '0x123abc',
      type: 'Token Transfer',
      direction: 'out',
      amount: 50,
      to: '0x789def',
      from: '0x13ff81ff7d19a',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'Success'
    },
    {
      hash: '0x456def',
      type: 'Token Transfer',
      direction: 'in',
      amount: 100,
      from: '0xabc123',
      to: '0x13ff81ff7d19a',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      status: 'Success'
    }
  ]
};

// Generate mock transaction history
const mockTransactionHistory = Array.from({ length: 15 }).map((_, i) => ({
  hash: `0x${Math.random().toString(16).substring(2, 14)}${Math.random().toString(16).substring(2, 14)}`,
  blockNumber: 10000 - i * 10,
  type: i % 4 === 0 ? 'Access Control' : i % 4 === 1 ? 'Token Transfer' : i % 4 === 2 ? 'Validation' : 'Smart Contract',
  timestamp: new Date(Date.now() - i * 86400000 * (Math.random() * 3 + 1)).toISOString(),
  direction: i % 3 === 0 ? 'out' : i % 3 === 1 ? 'in' : 'self',
  status: Math.random() > 0.1 ? 'Success' : 'Failed',
  amount: Math.random() * 100,
  fee: (Math.random() * 0.01).toFixed(6),
  from: i % 3 === 0 ? mockWalletData.address : `0x${Math.random().toString(16).substring(2, 10)}`,
  to: i % 3 === 1 ? mockWalletData.address : `0x${Math.random().toString(16).substring(2, 10)}`,
  trustScore: Math.floor(Math.random() * 100),
  accessLevel: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)],
  validationWeight: Math.random() * 10
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

const AuthenticatedWalletProfile = ({ darkMode = false, address, onDisconnect }) => {
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [wallet, setWallet] = useState(mockWalletData);
  const [transactions, setTransactions] = useState(mockTransactionHistory);
  const [activityData, setActivityData] = useState(generateActivityData());

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    // You could add a toast notification here
  };

  const handleSend = () => {
    setShowSendModal(true);
  };

  const handleReceive = () => {
    setShowReceiveModal(true);
  };

  // Add trust score indicator
  const getTrustScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const SendModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`relative w-full max-w-md rounded-lg shadow-xl ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        <div className="p-6">
          <button
            onClick={() => setShowSendModal(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
          
          <h2 className="text-2xl font-bold mb-6">Send Tokens</h2>
          
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Recipient Address
              </label>
              <input 
                type="text" 
                placeholder="0x..." 
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Amount
              </label>
              <div className="flex">
                <input 
                  type="number" 
                  placeholder="0.00" 
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <span className="px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-r-md text-gray-700 dark:text-gray-300">
                  ZTACC
                </span>
              </div>
            </div>
            
            <div className="pt-4">
              <button 
                type="button"
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
              >
                Send Tokens
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const ReceiveModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`relative w-full max-w-md rounded-lg shadow-xl ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        <div className="p-6">
          <button
            onClick={() => setShowReceiveModal(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
          
          <h2 className="text-2xl font-bold mb-6">Receive Tokens</h2>
          
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <div className="w-48 h-48 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                {/* QR code would go here */}
                <span className="text-gray-500 dark:text-gray-400">QR Code</span>
              </div>
              
              <div className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-between">
                <span className="font-mono text-sm text-gray-700 dark:text-gray-300">
                  {address}
                </span>
                <button 
                  onClick={handleCopyAddress}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
            
            <div className="pt-2">
              <button 
                type="button"
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
                onClick={() => setShowReceiveModal(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {showSendModal && <SendModal />}
      {showReceiveModal && <ReceiveModal />}
      
      {/* Wallet Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full mr-4">
              <Wallet size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                My Wallet
                <button 
                  onClick={handleCopyAddress}
                  className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <Copy size={16} />
                </button>
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {address}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={handleSend}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md flex items-center"
            >
              <Send size={16} className="mr-2" /> Send
            </button>
            <button 
              onClick={handleReceive}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center"
            >
              <Download size={16} className="mr-2" /> Receive
            </button>
            <button 
              onClick={onDisconnect}
              className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 font-medium rounded-md hover:bg-red-200 dark:hover:bg-red-800"
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Balance</h2>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          {formatAmount(wallet.balance)} <span className="text-gray-500 dark:text-gray-400">ZTACC</span>
        </p>
        <div className="mt-4 flex items-center text-sm">
          <span className={`${getTrustScoreColor(wallet.trustScore)}`}>
            Trust Score: {wallet.trustScore}%
          </span>
          <span className="mx-2 text-gray-400">•</span>
          <span className="text-gray-500 dark:text-gray-400">
            {wallet.pendingTransactions} Pending Transactions
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-6">
          <button
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview' 
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' 
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'transactions' 
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' 
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('transactions')}
          >
            Transactions
          </button>
          <button
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'access' 
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' 
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('access')}
          >
            Access Control
          </button>
          <button
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'analytics' 
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' 
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && (
          <WalletOverviewTab 
            wallet={wallet} 
            transactions={transactions} 
            activityData={activityData}
            darkMode={darkMode}
            onWalletClick={() => {}}
          />
        )}
        
        {activeTab === 'transactions' && (
          <WalletTransactionsTab 
            wallet={wallet} 
            transactions={transactions}
            darkMode={darkMode}
            onWalletClick={() => {}}
          />
        )}
        
        {activeTab === 'access' && (
          <WalletAccessTab 
            wallet={wallet} 
            transactions={transactions.filter(tx => tx.type === 'Access Control')}
            darkMode={darkMode}
            onWalletClick={() => {}}
          />
        )}
        
        {activeTab === 'analytics' && (
          <WalletAnalyticsTab 
            wallet={wallet} 
            activityData={activityData}
            darkMode={darkMode}
          />
        )}
      </div>
    </div>
  );
};

export default AuthenticatedWalletProfile; 