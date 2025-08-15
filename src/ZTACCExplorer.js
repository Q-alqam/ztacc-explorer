import React, { useState, useEffect } from 'react';
import { Search, Shield, Box, FileText, Activity, Users, Database, Clock, ChevronRight, Filter, RefreshCw, Moon, Sun, BarChart2, X, AlertTriangle, TrendingUp, Bot, AlertCircle, Play, Pause, Wallet, Code, CheckCircle, List, Copy } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

// Add WalletProfile import at the top with other imports
import WalletProfile from './components/Wallet/WalletProfile';
import AuthenticatedWalletProfile from './components/Wallet/AuthenticatedWalletProfile';

// Helper functions for data consistency and dark mode
const safeNumber = (value) => {
  if (typeof value === 'number' && !isNaN(value)) {
    return value.toLocaleString();
  }
  return '—';
};

const safeString = (value, defaultValue = '—') => {
  return value || defaultValue;
};

const truncateHash = (hash) => {
  if (!hash) return '—';
  if (hash.length < 16) return hash;
  return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
};

const getButtonColorClasses = (color, isActive) => {
  if (!isActive) return 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 shadow-sm';
  
  const colorMaps = {
    'green': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border border-green-200 dark:border-green-800 shadow-sm',
    'blue': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 border border-blue-200 dark:border-blue-800 shadow-sm',
    'purple': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 border border-purple-200 dark:border-purple-800 shadow-sm',
    'indigo': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100 border border-indigo-200 dark:border-indigo-800 shadow-sm',
    'yellow': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 border border-yellow-200 dark:border-yellow-800 shadow-sm',
    'red': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 border border-red-200 dark:border-red-800 shadow-sm',
  };
  
  return colorMaps[color] || colorMaps['blue'];
};

const getStatusColorClasses = (status) => {
  return status === 'Success' || status === 'Active'
    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border border-green-200 dark:border-green-800 shadow-sm'
    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 border border-red-200 dark:border-red-800 shadow-sm';
};

const getSecurityLevelClasses = (level) => {
  const classes = {
    normal: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border border-green-200 dark:border-green-800',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 border border-yellow-200 dark:border-yellow-800',
    critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 border border-red-200 dark:border-red-800'
  };
  return classes[level] || classes.normal;
};

// Mock data - This would be replaced with actual API calls to your ZTACC blockchain backend
const mockBlocks = Array.from({ length: 20 }).map((_, i) => ({
  number: 10000 - i,
  hash: `0x${Math.random().toString(16).substring(2, 14)}${Math.random().toString(16).substring(2, 14)}`,
  timestamp: new Date(Date.now() - i * 12000).toISOString(),
  transactions: Math.floor(Math.random() * 15) + 1,
  validator: `validator-${Math.floor(Math.random() * 5) + 1}`,
  size: Math.floor(Math.random() * 1000) + 500,
  age: `${Math.floor(Math.random() * 60)} mins ago`,
  gasUsed: Math.floor(Math.random() * 1000000)
}));

const mockTransactions = Array.from({ length: 30 }).map((_, i) => ({
  hash: `0x${Math.random().toString(16).substring(2, 14)}${Math.random().toString(16).substring(2, 14)}`,
  blockNumber: 10000 - Math.floor(i / 2),
  from: `0x${Math.random().toString(16).substring(2, 42)}`,
  to: `0x${Math.random().toString(16).substring(2, 42)}`,
  amount: Math.random() * 100,
  type: i % 4 === 0 ? 'Access Control' : i % 4 === 1 ? 'Token Transfer' : i % 4 === 2 ? 'Validation' : 'Smart Contract',
  status: Math.random() > 0.1 ? 'Success' : 'Failed',
  timestamp: new Date(Date.now() - i * 8000).toISOString(),
  gasFee: (Math.random() * 0.01).toFixed(6),
  executionTime: (Math.random() * 100).toFixed(2),
  validator: `validator-${Math.floor(Math.random() * 5) + 1}`,
  trustScore: (Math.random() * 100).toFixed(2),
  signature: `0x${Array(64).fill(0).map(() => Math.random().toString(16)[2]).join('')}`,
  publicKey: `0x${Array(40).fill(0).map(() => Math.random().toString(16)[2]).join('')}`,
  verificationStatus: 'Verified'
}));

const mockStatistics = {
  totalBlocks: 10000,
  totalTransactions: 158945,
  activeValidators: 5,
  avgBlockTime: 12.3,
  tps: 8.7,
  accessRequests: 89543,
  accessApproved: 85244,
  accessDenied: 4299,
  latestBlock: 10000,
  txPerBlock: 15,
  totalStake: 5000000,
  averageUptime: 99.98
};

// Add new mock data for enhanced features
const mockSecurityStats = {
  deniedRequests24h: 142,
  failedTransactions24h: 7,
  securityLevel: 'normal', // 'normal', 'warning', 'critical'
  activeWallets24h: 15234,
  smartContractsExecuted24h: 856,
  averageTransactionSize: 2.45, // in KB
  totalValueLocked: '234.5M',
};

const mockTokenData = {
  price: 1.23,
  priceChange: 2.4,
  marketCap: '123.4M',
  volume24h: '5.6M',
};

const mockNetworkStats = {
  pendingTransactions: 32,
  networkStatus: 'healthy', // 'healthy', 'warning', 'critical'
  liveTPS: 10.5,
  nextBlockIn: 12, // seconds
  lastBlockConfirmationTime: 0.8, // seconds
  averageGasFee: 0.00023, // ZTAC
  highestGasFee24h: 0.00156, // ZTAC
  mempoolSize: 128, // number of pending transactions
};

// Generate mock chart data
const generateChartData = (points = 24) => {
  return Array.from({ length: points }).map((_, i) => ({
    time: new Date(Date.now() - (points - i) * 3600000).toLocaleTimeString(),
    tps: Math.floor(Math.random() * 15) + 5,
    approved: Math.floor(Math.random() * 100) + 50,
    denied: Math.floor(Math.random() * 30) + 5,
  }));
};

const generateValidatorStats = () => {
  return Array.from({ length: 5 }).map((_, i) => ({
    address: `0x${Math.random().toString(16).substring(2, 42)}`,
    stake: Math.floor(Math.random() * 1000000) + 100000,
    delegators: Math.floor(Math.random() * 100) + 10,
    commission: Math.floor(Math.random() * 10) + 1,
    uptime: 99 + Math.random(),
    status: 'Active',
    blocks: Math.floor(Math.random() * 1000) + 500,
    value: Math.floor(Math.random() * 30) + 10
  }));
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ZTACCExplorer = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [blocks, setBlocks] = useState(mockBlocks);
  const [transactions, setTransactions] = useState(mockTransactions);
  const [statistics, setStatistics] = useState(mockStatistics);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [chartData, setChartData] = useState(generateChartData());
  const [validatorStats, setValidatorStats] = useState(generateValidatorStats());
  const [securityStats, setSecurityStats] = useState(mockSecurityStats);
  const [tokenData, setTokenData] = useState(mockTokenData);
  const [networkStats, setNetworkStats] = useState(mockNetworkStats);
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [connectedWallet, setConnectedWallet] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Apply dark mode with localStorage persistence
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Block countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setNetworkStats(prev => ({
        ...prev,
        nextBlockIn: prev.nextBlockIn > 0 ? prev.nextBlockIn - 1 : 12
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate data refresh
  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // In a real app, this would fetch fresh data from your API
      setIsRefreshing(false);
    }, 1000);
  };

  // Simulation of a search function
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.startsWith('0x') && searchQuery.length === 42) {
      setSelectedWallet(searchQuery);
      setActiveTab('wallet');
    }
    console.log("Searching for:", searchQuery);
    // In a real app, this would query your blockchain API
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update TPS chart
      setChartData(prevData => {
        const newData = [...prevData.slice(1), {
          time: new Date().toLocaleTimeString(),
          tps: Math.floor(Math.random() * 15) + 5,
          approved: Math.floor(Math.random() * 100) + 50,
          denied: Math.floor(Math.random() * 30) + 5,
        }];
        return newData;
      });

      // Update blocks and transactions
      setBlocks(prevBlocks => {
        const newBlock = {
          id: prevBlocks[0].id + 1,
          hash: `0x${Math.random().toString(16).substring(2, 14)}${Math.random().toString(16).substring(2, 14)}`,
          timestamp: new Date().toISOString(),
          transactions: Math.floor(Math.random() * 15) + 1,
          validator: `validator-${Math.floor(Math.random() * 5) + 1}`,
          size: Math.floor(Math.random() * 1000) + 500,
        };
        return [newBlock, ...prevBlocks.slice(0, -1)];
      });

      // Update statistics
      setStatistics(prev => ({
        ...prev,
        totalBlocks: prev.totalBlocks + 1,
        totalTransactions: prev.totalTransactions + Math.floor(Math.random() * 15) + 1,
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Quick Filter component
  const QuickFilters = () => (
    <div className="flex flex-wrap gap-2 mt-2">
      <button className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm hover:bg-red-200 shadow-sm border border-red-200 dark:bg-red-900 dark:text-red-100 dark:border-red-800 dark:hover:bg-red-800">
        <AlertCircle size={14} className="mr-1" /> Failed TXs
      </button>
      <button className="flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200 shadow-sm border border-purple-200 dark:bg-purple-900 dark:text-purple-100 dark:border-purple-800 dark:hover:bg-purple-800">
        <FileText size={14} className="mr-1" /> Smart Contracts
      </button>
      <button className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 shadow-sm border border-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-800 dark:hover:bg-green-800">
        <TrendingUp size={14} className="mr-1" /> High-Value
      </button>
      <button className="flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm hover:bg-indigo-200 shadow-sm border border-indigo-200 dark:bg-indigo-900 dark:text-indigo-100 dark:border-indigo-800 dark:hover:bg-indigo-800">
        <Shield size={14} className="mr-1" /> Access Denials
      </button>
    </div>
  );

  // Security Insights Badge component
  const SecurityInsightsBadge = ({ securityStats }) => {
    if (!securityStats) return null;
    
    return (
      <div className={`flex items-center px-4 py-2 rounded-lg shadow-md ${getSecurityLevelClasses(securityStats.securityLevel)}`}>
        <AlertTriangle size={18} className="mr-2" />
        <div className="text-sm">
          <span className="font-medium">Last 24h:</span>
          <span className="ml-1">{safeNumber(securityStats.deniedRequests24h)} Denied Requests,</span>
          <span className="ml-1">{safeNumber(securityStats.failedTransactions24h)} Failed Transactions</span>
        </div>
      </div>
    );
  };

  // Network Stats Ticker component
  const NetworkStatsTicker = () => (
    <div className={`py-2 px-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white bg-opacity-90'} shadow text-xs`}>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full mr-1.5 ${
            networkStats.networkStatus === 'healthy' 
              ? 'bg-green-500' 
              : networkStats.networkStatus === 'warning' 
                ? 'bg-yellow-500' 
                : 'bg-red-500'
          }`}></div>
          <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Network Status:</span>
          <span className={`ml-1 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {networkStats.networkStatus === 'healthy' ? 'Healthy' : networkStats.networkStatus === 'warning' ? 'Warning' : 'Critical'}
          </span>
        </div>
          <div className="flex items-center">
          <Clock size={12} className={`mr-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Next Block:</span>
          <span className={`ml-1 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {networkStats.nextBlockIn}s
            </span>
          </div>
          <div className="flex items-center">
          <Activity size={12} className={`mr-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Live TPS:</span>
          <span className={`ml-1 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {networkStats.liveTPS}
            </span>
          </div>
          <div className="flex items-center">
          <Database size={12} className={`mr-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Pending Tx:</span>
          <span className={`ml-1 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {networkStats.pendingTransactions}
            </span>
          </div>
          <div className="flex items-center">
          <Wallet size={12} className={`mr-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Gas Fee:</span>
          <span className={`ml-1 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {networkStats.averageGasFee} ZTAC
            </span>
        </div>
      </div>
    </div>
  );

  // Token Price component
  const TokenPrice = () => (
    <div className={`rounded-lg px-2 py-1 flex items-center text-xs ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
      <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-blue-800'}`}>
        ZTAC: ${tokenData.price}
      </span>
      <span className={`ml-1 ${
        tokenData.priceChange >= 0 
          ? 'text-green-500' 
          : 'text-red-500'
      }`}>
        {tokenData.priceChange >= 0 ? '+' : ''}{tokenData.priceChange}%
      </span>
    </div>
  );

  // AI Assistant Button component
  const AiAssistantButton = () => (
    <button
      onClick={() => setShowAiAssistant(!showAiAssistant)}
      className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition-colors shadow-md"
    >
      <Bot size={18} className="mr-2" />
      AI Assistant
    </button>
  );

  // Connect Wallet Button component
  const ConnectWalletButton = () => (
    <button
      onClick={() => {
        // Mock wallet connection - in real app, this would integrate with actual wallet
        const mockWalletAddress = `0x${Math.random().toString(16).substring(2, 42)}`;
        setConnectedWallet(mockWalletAddress);
        setActiveTab('connected-wallet');
      }}
      className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-colors shadow-md"
    >
      {connectedWallet ? (
        <>
          <Wallet size={18} className="mr-2" />
          {truncateHash(connectedWallet)}
        </>
      ) : (
        <>
          <Wallet size={18} className="mr-2" />
          Connect Wallet
        </>
      )}
    </button>
  );

  const handleWalletClick = (address) => {
    setSelectedWallet(address);
    setActiveTab('wallet');
    setSelectedTx(null); // Close the transaction modal
  };

  // Add a new component for mobile navigation bar
  const MobileNavBar = ({ activeTab, setActiveTab, darkMode }) => {
    const navItems = [
      { id: 'overview', label: 'Overview', icon: <BarChart2 size={20} /> },
      { id: 'blocks', label: 'Blocks', icon: <Box size={20} /> },
      { id: 'transactions', label: 'Tx', icon: <Activity size={20} /> },
      { id: 'validators', label: 'Validators', icon: <Users size={20} /> },
      { id: 'access', label: 'Access', icon: <Shield size={20} /> },
    ];

    return (
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-20 ${darkMode ? 'bg-gray-800 border-t border-gray-700' : 'bg-white border-t border-gray-200'} shadow-lg`}>
        <div className="flex justify-between px-2">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`flex flex-col items-center p-2 flex-1 ${
                activeTab === item.id 
                  ? darkMode ? 'text-blue-400' : 'text-blue-600' 
                  : darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Enhanced Header */}
      <header className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'} shadow-lg transition-colors duration-200`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col space-y-4">
            {/* Top Row */}
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-white p-2 rounded-lg shadow-md mr-3">
                  <Shield className={`${darkMode ? 'text-blue-600' : 'text-purple-600'}`} size={24} />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">ZTACC Explorer</h1>
              </div>
              
              {/* Desktop Controls */}
              <div className="hidden md:flex items-center space-x-4">
                <SecurityInsightsBadge securityStats={securityStats} />
                <TokenPrice />
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-full hover:bg-opacity-20 hover:bg-gray-700 transition-colors"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <ConnectWalletButton />
                <AiAssistantButton />
              </div>

              {/* Mobile Menu Button */}
              <div className="flex md:hidden items-center space-x-2">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-full hover:bg-opacity-20 hover:bg-gray-700 transition-colors"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-md hover:bg-opacity-20 hover:bg-gray-700 transition-colors"
                >
                  {mobileMenuOpen ? 
                    <X size={24} /> : 
                    <List size={24} />
                  }
                </button>
              </div>
            </div>

            {/* Middle Row - Search */}
            <div className="flex-1 max-w-4xl mx-auto w-full">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  className={`w-full px-4 py-3 pl-10 pr-12 rounded-lg ${
                    darkMode ? 'bg-gray-700 text-white border border-gray-600' : 'bg-white text-gray-800 border border-purple-200'
                  } focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-blue-500' : 'focus:ring-purple-500'} shadow-md`}
                  placeholder="Search by tx hash, block, or address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className={`absolute left-3 top-3.5 ${darkMode ? 'text-gray-400' : 'text-purple-500'}`} size={18} />
                <button 
                  type="button"
                  className={`absolute right-3 top-3 ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-purple-500 hover:text-purple-700'}`}
                  onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                >
                  <Filter size={18} />
                </button>
              </form>
            </div>

            {/* Bottom Row - Network Stats */}
            <div className="hidden sm:block">
            <NetworkStatsTicker />
            </div>
            
            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden mt-2 bg-gray-700 bg-opacity-95 rounded-lg shadow-lg p-4 absolute top-24 right-4 z-50 w-64">
                <div className="flex flex-col space-y-3">
                  <SecurityInsightsBadge securityStats={securityStats} />
                  <TokenPrice />
                  <ConnectWalletButton />
                  <AiAssistantButton />
                  <div className="pt-2 border-t border-gray-600">
                    <div className="text-sm font-medium mb-2">Network Status:</div>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span>Live TPS:</span>
                        <span className="font-semibold">{networkStats.liveTPS}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Next Block:</span>
                        <span className="font-semibold">{networkStats.nextBlockIn}s</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Gas Fee:</span>
                        <span className="font-semibold">{networkStats.averageGasFee} ZTAC</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-grow">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <StatsCard 
            title="Blocks" 
            value={statistics.totalBlocks.toLocaleString()} 
            icon={<Box size={20} />} 
          />
          <StatsCard 
            title="Transactions" 
            value={statistics.totalTransactions.toLocaleString()} 
            icon={<Activity size={20} />} 
          />
          <StatsCard 
            title="Validators" 
            value={statistics.activeValidators} 
            icon={<Users size={20} />} 
          />
          <StatsCard 
            title="Avg Block Time" 
            value={`${statistics.avgBlockTime}s`} 
            icon={<Clock size={20} />} 
          />
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200 relative">
          <div className="flex overflow-x-auto pb-1 hide-scrollbar">
            <TabButton 
              label="Overview" 
              active={activeTab === 'overview'} 
              onClick={() => setActiveTab('overview')} 
            />
            <TabButton 
              label="Blocks" 
              active={activeTab === 'blocks'} 
              onClick={() => setActiveTab('blocks')} 
            />
            <TabButton 
              label="Transactions" 
              active={activeTab === 'transactions'} 
              onClick={() => setActiveTab('transactions')} 
            />
            <TabButton 
              label="Access" 
              active={activeTab === 'access'} 
              onClick={() => setActiveTab('access')} 
            />
            <TabButton 
              label="Validators" 
              active={activeTab === 'validators'} 
              onClick={() => setActiveTab('validators')} 
            />
            {selectedWallet && (
              <TabButton 
                label="Wallet" 
                active={activeTab === 'wallet'} 
                onClick={() => setActiveTab('wallet')} 
              />
            )}
            {connectedWallet && (
              <TabButton 
                label="My Wallet" 
                active={activeTab === 'connected-wallet'} 
                onClick={() => setActiveTab('connected-wallet')} 
              />
            )}
          </div>
          <style jsx>{`
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .hide-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {activeTab === 'overview' && (
            <OverviewTab 
              blocks={blocks.slice(0, 5)} 
              transactions={transactions.slice(0, 5)} 
              statistics={statistics}
              darkMode={darkMode}
              chartData={chartData}
              validatorStats={validatorStats}
            />
          )}
          {activeTab === 'blocks' && (
            <BlocksTab 
              blocks={blocks} 
              statistics={statistics} 
            />
          )}
          {activeTab === 'transactions' && (
            <TransactionsTab 
              transactions={transactions} 
              isRefreshing={isRefreshing} 
              onRefresh={refreshData}
              onWalletClick={handleWalletClick}
              darkMode={darkMode}
            />
          )}
          {activeTab === 'access' && (
            <AccessControlTab 
              transactions={transactions.filter(tx => tx.type === 'Access Control')} 
              statistics={statistics} 
            />
          )}
          {activeTab === 'validators' && (
            <ValidatorsTab validators={generateValidatorStats()} statistics={statistics} />
          )}
          {activeTab === 'wallet' && selectedWallet && (
            <WalletProfile 
              address={selectedWallet}
              darkMode={darkMode}
              onWalletClick={handleWalletClick}
            />
          )}
          {activeTab === 'connected-wallet' && connectedWallet && (
            <AuthenticatedWalletProfile 
              address={connectedWallet}
              darkMode={darkMode}
              onDisconnect={() => {
                setConnectedWallet(null);
                setActiveTab('overview');
              }}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className={`bg-blue-900 text-white py-4 sm:py-6 ${activeTab !== 'wallet' && activeTab !== 'connected-wallet' ? 'mb-16 md:mb-0' : ''}`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="mb-3 sm:mb-0 text-center sm:text-left">
              <p className="font-medium">ZTACC Blockchain Explorer</p>
              <p className="text-xs sm:text-sm text-blue-200">Zero-Trust Access Control Chain</p>
            </div>
            <div className="text-xs text-center sm:text-right">
              <p>© 2025 ZTACC.org. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Navigation Bar */}
      <MobileNavBar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        darkMode={darkMode}
      />

      {/* Transaction Modal */}
      {selectedTx && (
        <TransactionModal
          transaction={selectedTx}
          onClose={() => setSelectedTx(null)}
          darkMode={darkMode}
          onWalletClick={handleWalletClick}
        />
      )}
    </div>
  );
};

// Component for individual stats cards
const StatsCard = ({ title, value, icon }) => {
  // Get darkMode from context
  const darkMode = document.documentElement.classList.contains('dark');
  
  return (
    <div className={`p-5 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'} flex justify-between items-center transition-colors`}>
      <div>
        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{title}</h3>
        <p className={`text-lg sm:text-xl font-semibold mt-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{value}</p>
      </div>
      <div className={`p-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
        {React.cloneElement(icon, { className: darkMode ? 'text-blue-400' : 'text-blue-500' })}
    </div>
  </div>
);
};

// Tab button component
const TabButton = ({ label, active, onClick }) => {
  // Get darkMode from context
  const darkMode = document.documentElement.classList.contains('dark');
  
  return (
  <button
      className={`py-2 px-3 sm:px-4 text-sm sm:text-base font-medium border-b-2 ${
      active 
          ? `border-blue-500 ${darkMode ? 'text-blue-400' : 'text-blue-600'}` 
          : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} hover:border-gray-300`
      } transition-colors`}
    onClick={onClick}
  >
    {label}
  </button>
);
};

// Update Charts component to accept props
const Charts = ({ darkMode, chartData, validatorStats }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-8">
    {/* TPS Chart */}
    <div className={`rounded-lg shadow-md overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} p-4`}>
      <h3 className={`text-sm sm:text-base font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
        Transactions Per Second (24h)
      </h3>
      <div className="h-60 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="tpsColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 10 }} 
              stroke={darkMode ? '#6B7280' : '#9CA3AF'}
              tickFormatter={(value) => {
                const time = new Date(value);
                return time.getHours() + ':00';
              }}
            />
            <YAxis tick={{ fontSize: 10 }} stroke={darkMode ? '#6B7280' : '#9CA3AF'} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: darkMode ? '#1F2937' : 'white', 
                borderColor: darkMode ? '#4B5563' : '#E5E7EB',
                borderRadius: '0.375rem',
                fontSize: '0.75rem'
              }} 
              labelStyle={{ 
                color: darkMode ? 'white' : 'black'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="tps" 
              stroke="#3B82F6" 
              fillOpacity={1} 
              fill="url(#tpsColor)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Access Control Chart */}
    <div className={`rounded-lg shadow-md overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} p-4`}>
      <h3 className={`text-sm sm:text-base font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
        Access Control Requests (24h)
      </h3>
      <div className="h-60 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 10 }} 
              stroke={darkMode ? '#6B7280' : '#9CA3AF'}
              tickFormatter={(value) => {
                const time = new Date(value);
                return time.getHours() + ':00';
              }}
            />
            <YAxis tick={{ fontSize: 10 }} stroke={darkMode ? '#6B7280' : '#9CA3AF'} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: darkMode ? '#1F2937' : 'white', 
                borderColor: darkMode ? '#4B5563' : '#E5E7EB',
                borderRadius: '0.375rem',
                fontSize: '0.75rem'
              }} 
              labelStyle={{ 
                color: darkMode ? 'white' : 'black'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="approved" 
              stroke="#10B981" 
              dot={false}
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="denied" 
              stroke="#EF4444" 
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-end mt-1 space-x-4 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
          <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Approved</span>
    </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
          <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Denied</span>
        </div>
      </div>
    </div>
  </div>
);

// Add the LiveTransactionFeed component before the OverviewTab component
const LiveTransactionFeed = ({ darkMode }) => {
  const [liveTxs, setLiveTxs] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [networkStats, setNetworkStats] = useState({
    total: 0,
    success: 0,
    failed: 0
  });
  
  // Transaction type configurations
  const txTypes = {
    'Token Transfer': { icon: Wallet, color: 'green' },
    'Access Control': { icon: Shield, color: 'blue' },
    'Smart Contract': { icon: Code, color: 'purple' },
    'Validation': { icon: CheckCircle, color: 'yellow' }
  };

  // Filter transactions based on active filter
  const filteredTxs = liveTxs.filter(tx => 
    activeFilter === 'all' || tx.type.toLowerCase().includes(activeFilter.toLowerCase())
  );

  // Simulate live transaction updates
  useEffect(() => {
    if (isPaused) return;
    
    const generateTx = () => ({
      id: `0x${Math.random().toString(16).substring(2, 14)}${Math.random().toString(16).substring(2, 14)}`,
      type: ['Access Control', 'Token Transfer', 'Validation', 'Smart Contract'][Math.floor(Math.random() * 4)],
      timestamp: new Date().toISOString(),
      amount: Math.random() * 100,
      status: Math.random() > 0.1 ? 'Success' : 'Failed',
      from: `0x${Math.random().toString(16).substring(2, 42)}`,
      to: `0x${Math.random().toString(16).substring(2, 42)}`,
      gasFee: (Math.random() * 0.01).toFixed(6),
      executionTime: (Math.random() * 100).toFixed(2)
    });
    
    const interval = setInterval(() => {
      const newTx = generateTx();
      setLiveTxs(prev => {
        const updated = [newTx, ...prev].slice(0, 10);
        setNetworkStats(stats => ({
          total: stats.total + 1,
          success: stats.success + (newTx.status === 'Success' ? 1 : 0),
          failed: stats.failed + (newTx.status === 'Failed' ? 1 : 0)
        }));
        return updated;
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center dark:text-white">
          <Activity className="mr-2" size={20} />
          Live Transaction Feed
        </h2>
        <button 
          onClick={() => setIsPaused(!isPaused)}
          className="flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          {isPaused ? (
            <><Play size={14} className="mr-1" /> Resume</>
          ) : (
            <><Pause size={14} className="mr-1" /> Pause</>
          )}
        </button>
      </div>

      {/* Filter Pills - Scrollable Container */}
      <div className="mb-4 overflow-x-auto pb-1 hide-scrollbar">
        <div className="flex space-x-2 min-w-max">
            {Object.entries(txTypes).map(([type, { icon: Icon, color }]) => (
              <button
                key={type}
                onClick={() => setActiveFilter(type.toLowerCase())}
              className={`px-3 py-1 rounded-full text-xs font-medium flex items-center whitespace-nowrap ${
                  getButtonColorClasses(color, activeFilter === type.toLowerCase())
                }`}
              >
                <Icon size={12} className="mr-1" />
                {type}
              </button>
            ))}
            <button
              onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                activeFilter === 'all' 
                  ? 'bg-gray-800 text-white dark:bg-gray-600 dark:text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              All
          </button>
        </div>
      </div>

      {/* Network Stats */}
      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex flex-wrap items-center justify-between text-sm gap-2">
          <span className="text-gray-600 dark:text-gray-300">
            📊 {networkStats.total} Transactions in the Last 10 Mins
          </span>
          <div className="flex items-center space-x-4">
            <span className="text-green-600 dark:text-green-400">
              🟢 {((networkStats.success / (networkStats.total || 1)) * 100).toFixed(1)}% Success
            </span>
            <span className="text-red-600 dark:text-red-400">
              🔴 {networkStats.failed} Failed
            </span>
          </div>
        </div>
      </div>
      
      <div className="overflow-y-auto max-h-64 border border-gray-200 dark:border-gray-600 rounded">
        {filteredTxs.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            {isPaused ? 'Feed is paused' : 'Waiting for transactions...'}
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredTxs.map(tx => (
              <div 
                key={tx.id} 
                onClick={() => setSelectedTx(tx)}
                className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer live-tx-item"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-blue-600 dark:text-blue-400 truncate max-w-xs">
                    {truncateHash(tx.id)}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(tx.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <div className="flex items-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getButtonColorClasses(txTypes[tx.type]?.color || 'blue', true)}`}>
                      {tx.type}
                    </span>
                    {tx.type === 'Token Transfer' && (
                      <span className="text-sm ml-2 text-gray-600 dark:text-gray-300">
                        {tx.amount.toFixed(2)} ZTAC
                      </span>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColorClasses(tx.status)}`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      {selectedTx && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className={`relative w-full max-w-2xl rounded-lg shadow-xl ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}>
            <div className="p-6">
              <button
                onClick={() => setSelectedTx(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
              
              <h2 className="text-2xl font-bold mb-6">Transaction Details</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Transaction Hash</p>
                    <p className="font-mono text-sm">{selectedTx.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getButtonColorClasses(txTypes[selectedTx.type]?.color || 'blue', true)}`}>
                      {selectedTx.type}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColorClasses(selectedTx.status)}`}>
                      {selectedTx.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Timestamp</p>
                    <p>{new Date(selectedTx.timestamp).toLocaleString()}</p>
                  </div>
                  {selectedTx.type === 'Token Transfer' && (
                    <>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>
                        <p>{selectedTx.amount.toFixed(2)} ZTAC</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Gas Fee</p>
                        <p>{selectedTx.gasFee} ZTAC</p>
                      </div>
                    </>
                  )}
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">From</p>
                    <p className="font-mono text-sm">{truncateHash(selectedTx.from)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">To</p>
                    <p className="font-mono text-sm">{truncateHash(selectedTx.to)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .live-tx-item {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

// Update the OverviewTab component to include LiveTransactionFeed
const OverviewTab = ({ blocks, transactions, statistics, darkMode, chartData, validatorStats }) => (
  <div className="space-y-8">
    <Charts darkMode={darkMode} chartData={chartData} validatorStats={validatorStats} />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Security Statistics */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 flex items-center dark:text-white">
          <Shield className="mr-2" size={20} />
          Security Statistics
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">Access Requests</span>
            <span className="font-medium dark:text-white">{statistics.accessRequests.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">Access Approved</span>
            <span className="font-medium text-green-600 dark:text-green-400">{statistics.accessApproved.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">Access Denied</span>
            <span className="font-medium text-red-600 dark:text-red-400">{statistics.accessDenied.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">Approval Rate</span>
            <span className="font-medium dark:text-white">
              {((statistics.accessApproved / statistics.accessRequests) * 100).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* Network Performance */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 flex items-center dark:text-white">
          <Activity className="mr-2" size={20} />
          Network Performance
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">Transactions Per Second</span>
            <span className="font-medium dark:text-white">{statistics.tps}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">Average Block Time</span>
            <span className="font-medium dark:text-white">{statistics.avgBlockTime}s</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">Active Validators</span>
            <span className="font-medium dark:text-white">{statistics.activeValidators}/5</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">Network Status</span>
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-full text-xs font-medium">Healthy</span>
          </div>
        </div>
      </div>
    </div>
    
    {/* Add the Live Transaction Feed here */}
    <LiveTransactionFeed darkMode={darkMode} />
    
    {/* Recent Blocks */}
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center dark:text-white">
          <Box className="mr-2" size={20} />
          Recent Blocks
        </h2>
        <button 
          onClick={() => {}} 
          className="text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center hover:text-blue-800 dark:hover:text-blue-300"
        >
          View All <ChevronRight size={16} />
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Block</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Age</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Txs</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Validator</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Size</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {blocks.map((block) => (
              <tr key={block.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">{block.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {new Date(block.timestamp).toLocaleTimeString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{block.transactions}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{block.validator}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{block.size} bytes</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// Blocks tab content
const BlocksTab = ({ blocks, statistics }) => (
  <div className="space-y-8">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800 dark:text-gray-100">
        <Box className="mr-2" size={20} />
        Block Statistics
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-50 dark:bg-emerald-900/50 p-4 rounded-lg">
          <p className="text-sm text-emerald-700 dark:text-emerald-300">Latest Block</p>
          <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">#{safeNumber(statistics?.latestBlock)}</p>
        </div>
        <div className="bg-teal-50 dark:bg-teal-900/50 p-4 rounded-lg">
          <p className="text-sm text-teal-700 dark:text-teal-300">Average Block Time</p>
          <p className="text-2xl font-bold text-teal-900 dark:text-teal-100">{safeNumber(statistics?.avgBlockTime)}s</p>
        </div>
        <div className="bg-cyan-50 dark:bg-cyan-900/50 p-4 rounded-lg">
          <p className="text-sm text-cyan-700 dark:text-cyan-300">Transactions/Block</p>
          <p className="text-2xl font-bold text-cyan-900 dark:text-cyan-100">{safeNumber(statistics?.txPerBlock)}</p>
        </div>
      </div>
    </div>

    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800 dark:text-gray-100">
        <List className="mr-2" size={20} />
        Latest Blocks
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Block</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Age</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Validator</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Transactions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Size</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Gas Used</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {(blocks || []).map((block) => (
              <tr key={block?.number} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                  #{safeNumber(block?.number)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {safeString(block?.age)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {safeString(block?.validator)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {safeNumber(block?.transactions)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {safeNumber(block?.size)} bytes
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {safeNumber(block?.gasUsed)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing <span className="font-medium text-gray-800 dark:text-gray-100">1</span> to <span className="font-medium text-gray-800 dark:text-gray-100">{blocks?.length || 0}</span> of <span className="font-medium text-gray-800 dark:text-gray-100">{safeNumber(statistics?.totalBlocks)}</span> blocks
        </div>
        <div className="flex space-x-2">
          <button 
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            Previous
          </button>
          <button 
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Transaction Modal Component
const TransactionModal = ({ transaction, onClose, darkMode, onWalletClick }) => {
  const WalletLink = ({ address }) => (
      <button 
      className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} inline-flex items-center`}
      onClick={(e) => {
        e.stopPropagation();
        onWalletClick(address);
        onClose();
      }}
    >
      <span className="truncate max-w-[150px] sm:max-w-[250px]">{address}</span>
      <Copy 
        size={14} 
        className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer" 
        onClick={(e) => {
          e.stopPropagation();
          navigator.clipboard.writeText(address);
        }}
      />
      </button>
  );

  const renderTransactionDetails = () => {
        return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
          <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Transaction Hash</h3>
          <div className="mt-1 flex items-center">
            <div className={`font-mono text-sm break-all ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {transaction.hash}
              </div>
            <button 
              className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => navigator.clipboard.writeText(transaction.hash)}
            >
              <Copy size={14} />
            </button>
              </div>
        </div>

              <div>
          <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status</h3>
          <div className="mt-1">
            <span className={`px-2 py-1 text-xs rounded-full ${
              transaction.status === 'Success'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {transaction.status}
            </span>
              </div>
        </div>

              <div>
          <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Block</h3>
          <div className="mt-1">
            <span className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {transaction.blockNumber}
            </span>
              </div>
            </div>

        <div>
          <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Timestamp</h3>
          <div className="mt-1">
            <span className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {new Date(transaction.timestamp).toLocaleString()}
            </span>
          </div>
        </div>

              <div>
          <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>From</h3>
          <div className="mt-1">
                <WalletLink address={transaction.from} />
              </div>
        </div>

              <div>
          <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>To</h3>
          <div className="mt-1">
                <WalletLink address={transaction.to} />
              </div>
              </div>

              <div>
          <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Value</h3>
          <div className="mt-1">
            <span className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {transaction.amount.toFixed(6)} ZTAC
                </span>
              </div>
            </div>

                <div>
          <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Transaction Fee</h3>
          <div className="mt-1">
            <span className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {transaction.gasFee} ZTAC
            </span>
                </div>
                </div>

                <div>
          <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Type</h3>
          <div className="mt-1">
            <span className={`px-2 py-1 text-xs rounded-full font-medium ${getTypeColor(transaction.type, darkMode)}`}>
              {transaction.type}
            </span>
                </div>
        </div>

                <div>
          <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Execution Time</h3>
          <div className="mt-1">
            <span className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {transaction.executionTime} ms
                  </span>
              </div>
            </div>

        <div className="md:col-span-2">
          <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Signature</h3>
          <div className="mt-1">
            <div className={`font-mono text-xs break-all ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {transaction.signature}
          </div>
        </div>
      </div>
    </div>
  );
};

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="px-4 pt-5 pb-4 sm:p-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className={`text-lg sm:text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Transaction Details
        </h2>
          <button 
                type="button"
                className={`rounded-md p-2 inline-flex items-center justify-center ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} focus:outline-none`}
                onClick={onClose}
          >
                <span className="sr-only">Close</span>
                <X size={20} />
          </button>
      </div>
      
            {renderTransactionDetails()}
      </div>

          <div className={`px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <button 
              type="button"
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm`}
              onClick={onClose}
            >
              Close
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get appropriate color classes for transaction types
const getTypeColor = (type, darkMode) => {
  const types = {
    'Access Control': darkMode ? 'bg-purple-900 text-purple-100' : 'bg-purple-100 text-purple-800',
    'Token Transfer': darkMode ? 'bg-green-900 text-green-100' : 'bg-green-100 text-green-800',
    'Validation': darkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-800',
    'Smart Contract': darkMode ? 'bg-yellow-900 text-yellow-100' : 'bg-yellow-100 text-yellow-800',
  };
  
  return types[type] || (darkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-800');
};

// Access Control tab content
const AccessControlTab = ({ transactions = [], statistics = {} }) => {
  // Early check for empty transactions
  if (!transactions || transactions.length === 0) {
    return (
      <div className="space-y-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 flex items-center text-gray-900 dark:text-white">
            <Shield className="mr-2" size={20} />
            Access Control Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/50 p-4 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">Total Requests</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{safeNumber(statistics?.accessRequests)}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/50 p-4 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-300">Approved</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">{safeNumber(statistics?.accessApproved)}</p>
              <p className="text-sm text-green-700 dark:text-green-300">
                {statistics?.accessRequests ? ((statistics.accessApproved / statistics.accessRequests) * 100).toFixed(2) : 0}%
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/50 p-4 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-300">Denied</p>
              <p className="text-2xl font-bold text-red-900 dark:text-red-100">{safeNumber(statistics?.accessDenied)}</p>
              <p className="text-sm text-red-700 dark:text-red-300">
                {statistics?.accessRequests ? ((statistics.accessDenied / statistics.accessRequests) * 100).toFixed(2) : 0}%
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 flex items-center text-gray-900 dark:text-white">
            <FileText className="mr-2" size={20} />
            Access Control Transactions
          </h2>
          <p className="text-center py-8 text-gray-500 dark:text-gray-400">No access control transactions available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 flex items-center text-gray-900 dark:text-white">
          <Shield className="mr-2" size={20} />
          Access Control Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/50 p-4 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">Total Requests</p>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{safeNumber(statistics?.accessRequests)}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/50 p-4 rounded-lg">
            <p className="text-sm text-green-700 dark:text-green-300">Approved</p>
            <p className="text-2xl font-bold text-green-900 dark:text-green-100">{safeNumber(statistics?.accessApproved)}</p>
            <p className="text-sm text-green-700 dark:text-green-300">
              {statistics?.accessRequests ? ((statistics.accessApproved / statistics.accessRequests) * 100).toFixed(2) : 0}%
            </p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/50 p-4 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-300">Denied</p>
            <p className="text-2xl font-bold text-red-900 dark:text-red-100">{safeNumber(statistics?.accessDenied)}</p>
            <p className="text-sm text-red-700 dark:text-red-300">
              {statistics?.accessRequests ? ((statistics.accessDenied / statistics.accessRequests) * 100).toFixed(2) : 0}%
            </p>
          </div>
        </div>
      </div>
  
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 flex items-center text-gray-900 dark:text-white">
          <FileText className="mr-2" size={20} />
          Access Control Transactions
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tx Hash</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Block</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Age</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Requestor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Resource</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Decision</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Score</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.map((tx) => (
                <tr key={tx.hash || tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                    {truncateHash(tx.hash || tx.id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {safeNumber(tx.blockNumber || tx.blockId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {tx.timestamp ? new Date(tx.timestamp).toLocaleTimeString() : 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {truncateHash(tx.from)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {truncateHash(tx.to)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColorClasses(tx.status)}`}>
                      {tx.status === 'Success' ? 'Approved' : 'Denied'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {tx.trustScore || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium text-gray-900 dark:text-white">1</span> to <span className="font-medium text-gray-900 dark:text-white">{transactions.length}</span> of <span className="font-medium text-gray-900 dark:text-white">{safeNumber(statistics?.accessRequests)}</span> access requests
          </div>
          <div className="flex space-x-2">
            <button 
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Previous
            </button>
            <button 
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Validators tab content
const ValidatorsTab = ({ validators, statistics }) => (
  <div className="space-y-8">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 flex items-center text-gray-900 dark:text-white">
        <Shield className="mr-2" size={20} />
        Validator Statistics
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-purple-50 dark:bg-purple-900/50 p-4 rounded-lg">
          <p className="text-sm text-purple-700 dark:text-purple-300">Active Validators</p>
          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{statistics.activeValidators}</p>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-900/50 p-4 rounded-lg">
          <p className="text-sm text-indigo-700 dark:text-indigo-300">Total Stake</p>
          <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">{statistics.totalStake.toLocaleString()} ZTACC</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/50 p-4 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">Average Uptime</p>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{statistics.averageUptime}%</p>
        </div>
      </div>
    </div>

    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 flex items-center text-gray-900 dark:text-white">
        <Users className="mr-2" size={20} />
        Active Validators
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Stake</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Delegators</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Commission</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Uptime</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {validators.map((validator, index) => (
              <tr key={validator.address} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">#{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                  {validator.address.substring(0, 8)}...{validator.address.substring(validator.address.length - 8)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {validator.stake.toLocaleString()} ZTACC
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {validator.delegators}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {validator.commission}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mr-2">
                      <div 
                        className="bg-green-500 h-2.5 rounded-full" 
                        style={{ width: `${validator.uptime}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-300">{validator.uptime}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    validator.status === 'Active' 
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100' 
                      : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100'
                  }`}>
                    {validator.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing <span className="font-medium text-gray-900 dark:text-white">1</span> to <span className="font-medium text-gray-900 dark:text-white">{validators.length}</span> of <span className="font-medium text-gray-900 dark:text-white">{statistics.activeValidators}</span> validators
        </div>
        <div className="flex space-x-2">
          <button 
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            Previous
          </button>
          <button 
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Transactions tab content
const TransactionsTab = ({ transactions, isRefreshing, onRefresh, onWalletClick, darkMode }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterType, setFilterType] = useState('all');
  const [selectedTx, setSelectedTx] = useState(null);
  const [visibleColumns, setVisibleColumns] = useState({
    hash: true,
    blockNumber: true,
    type: true,
    status: true,
    amount: true,
    timestamp: true,
    from: true,
    to: true,
  });

  // Function to toggle column visibility
  const toggleColumn = (column) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  // Get sorted and filtered transactions
  const filteredTransactions = transactions.filter(tx => 
    filterType === 'all' || tx.type.toLowerCase().includes(filterType.toLowerCase())
  );

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === 'blockNumber' || sortBy === 'amount') {
      return sortOrder === 'asc' ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy];
    }
    if (sortBy === 'timestamp') {
      return sortOrder === 'asc' 
        ? new Date(a.timestamp) - new Date(b.timestamp)
        : new Date(b.timestamp) - new Date(a.timestamp);
    }
    return sortOrder === 'asc'
      ? a[sortBy].localeCompare(b[sortBy])
      : b[sortBy].localeCompare(a[sortBy]);
  });

  // Function to toggle sort order
  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
        <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Latest Transactions</h2>
        <div className="flex gap-2">
          <button
            onClick={onRefresh}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              darkMode 
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } flex items-center gap-1`}
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            <span className="hidden xs:inline">Refresh</span>
          </button>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              darkMode 
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } flex items-center gap-1`}
          >
            <Filter size={14} />
            <span className="hidden xs:inline">Filter</span>
          </button>
        </div>
      </div>

      {showFilter && (
        <div className={`p-4 mb-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Transaction Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className={`rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''
                }`}
              >
                <option value="all">All Types</option>
                <option value="token">Token Transfer</option>
                <option value="access">Access Control</option>
                <option value="validation">Validation</option>
                <option value="smart">Smart Contract</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Show Columns
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(visibleColumns).map(column => (
                  <button
                    key={column}
                    onClick={() => toggleColumn(column)}
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      visibleColumns[column]
                        ? darkMode
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-100 text-blue-800'
                        : darkMode
                          ? 'bg-gray-700 text-gray-300'
                          : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {column.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-md rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                {visibleColumns.hash && (
                  <th 
                    scope="col" 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort('hash')}
                  >
                    <div className="flex items-center">
                      Hash
                      {sortBy === 'hash' && (
                        <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                )}
                {visibleColumns.blockNumber && (
                  <th 
                    scope="col" 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort('blockNumber')}
                  >
                    <div className="flex items-center">
                      Block
                      {sortBy === 'blockNumber' && (
                        <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                )}
                {visibleColumns.type && (
                  <th 
                    scope="col" 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort('type')}
                  >
                    <div className="flex items-center">
                      Type
                      {sortBy === 'type' && (
                        <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                )}
                {visibleColumns.from && (
                  <th 
                    scope="col" 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell"
                  >
                    From
                  </th>
                )}
                {visibleColumns.to && (
                  <th 
                    scope="col" 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell"
                  >
                    To
                  </th>
                )}
                {visibleColumns.amount && (
                  <th 
                    scope="col" 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hidden md:table-cell"
                    onClick={() => toggleSort('amount')}
                  >
                    <div className="flex items-center">
                      Amount
                      {sortBy === 'amount' && (
                        <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                )}
                {visibleColumns.status && (
                  <th 
                    scope="col" 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort('status')}
                  >
                    <div className="flex items-center">
                      Status
                      {sortBy === 'status' && (
                        <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                )}
                {visibleColumns.timestamp && (
                  <th 
                    scope="col" 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hidden md:table-cell"
                    onClick={() => toggleSort('timestamp')}
                  >
                    <div className="flex items-center">
                      Time
                      {sortBy === 'timestamp' && (
                        <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedTransactions.map((tx) => (
                <tr key={tx.hash} className="hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer" onClick={() => setSelectedTx(tx)}>
                  {visibleColumns.hash && (
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <div className={`${darkMode ? 'text-blue-400' : 'text-blue-600'} truncate max-w-[120px]`}>
                          {truncateHash(tx.hash)}
                        </div>
                        <button 
                          className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(tx.hash);
                          }}
                        >
                          <Copy size={12} />
                        </button>
                      </div>
                    </td>
                  )}
                  {visibleColumns.blockNumber && (
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {tx.blockNumber}
                    </td>
                  )}
                  {visibleColumns.type && (
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${getTypeColor(tx.type, darkMode)}`}>
                        {tx.type}
                      </span>
                    </td>
                  )}
                  {visibleColumns.from && (
                    <td className="px-4 py-3 whitespace-nowrap text-sm hidden sm:table-cell">
                      <button 
                        className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} truncate max-w-[120px] inline-block`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onWalletClick(tx.from);
                        }}
                      >
                        {truncateHash(tx.from)}
                      </button>
                    </td>
                  )}
                  {visibleColumns.to && (
                    <td className="px-4 py-3 whitespace-nowrap text-sm hidden sm:table-cell">
                      <button 
                        className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} truncate max-w-[120px] inline-block`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onWalletClick(tx.to);
                        }}
                      >
                        {truncateHash(tx.to)}
                      </button>
                    </td>
                  )}
                  {visibleColumns.amount && (
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 hidden md:table-cell">
                      {tx.amount.toFixed(4)} ZTAC
                    </td>
                  )}
                  {visibleColumns.status && (
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        tx.status === 'Success'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                  )}
                  {visibleColumns.timestamp && (
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 hidden md:table-cell">
                      {new Date(tx.timestamp).toLocaleString()}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Mobile Card View for Transactions */}
        <div className="md:hidden">
          {sortedTransactions.map((tx) => (
            <div 
              key={tx.hash} 
              className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} ${darkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'}`}
              onClick={() => setSelectedTx(tx)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className={`${darkMode ? 'text-blue-400' : 'text-blue-600'} truncate max-w-[180px] text-sm font-medium`}>
                  {truncateHash(tx.hash)}
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  tx.status === 'Success'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {tx.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div className="text-gray-500 dark:text-gray-400">Type:</div>
                <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{tx.type}</div>
                
                <div className="text-gray-500 dark:text-gray-400">Block:</div>
                <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{tx.blockNumber}</div>
                
                <div className="text-gray-500 dark:text-gray-400">Amount:</div>
                <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{tx.amount.toFixed(4)} ZTAC</div>
                
                <div className="text-gray-500 dark:text-gray-400">Time:</div>
                <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {new Date(tx.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ZTACCExplorer;