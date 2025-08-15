import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { 
  FileText, Clock, ChevronLeft, Copy, Check, 
  Shield, ArrowRight, ArrowLeft, RefreshCw, ArrowDown, ArrowUp
} from 'lucide-react';

// Generate mock transaction data
const generateMockTransaction = (txHash) => {
  const now = Date.now();
  const blockNumber = 1000000 - Math.floor(Math.random() * 100);
  
  return {
    hash: txHash || `0x${Math.random().toString(16).substring(2, 62)}`,
    blockNumber,
    timestamp: new Date(now - Math.random() * 86400000), // Random time in last 24 hours
    from: `0x${Math.random().toString(16).substring(2, 42)}`,
    to: `0x${Math.random().toString(16).substring(2, 42)}`,
    value: Math.random() * 10,
    fee: Math.random() * 0.01,
    gasUsed: Math.floor(Math.random() * 100000),
    gasPrice: Math.floor(Math.random() * 100) + 20, // in Gwei
    gasLimit: Math.floor(Math.random() * 200000) + 100000,
    nonce: Math.floor(Math.random() * 1000),
    status: Math.random() > 0.1 ? 'Success' : 'Failed',
    type: ['Transfer', 'Access Control', 'Smart Contract', 'Validation'][Math.floor(Math.random() * 4)],
    method: ['transfer', 'approve', 'requestAccess', 'validate', 'execute'][Math.floor(Math.random() * 5)],
    input: `0x${Math.random().toString(16).substring(2, 200)}`,
    confirmations: Math.floor(Math.random() * 100),
    accessEvents: Math.floor(Math.random() * 10),
  };
};

const TransactionDetailsPage = ({ darkMode = false, toggleDarkMode, sidebarOpen = false, toggleSidebar, closeSidebar }) => {
  const { hash } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Load transaction data on initial render
  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        // Simulate API delay
        setTimeout(() => {
          const mockTx = generateMockTransaction(hash);
          setTransaction(mockTx);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching transaction data:', error);
        setLoading(false);
      }
    };
    
    fetchTransactionData();
  }, [hash]);
  
  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const mockTx = generateMockTransaction(hash);
      setTransaction(mockTx);
      setIsRefreshing(false);
    }, 1000);
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleString();
  };
  
  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Format address
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  // Format full address with copy button
  const formatAddressWithCopy = (address, label = null) => {
    if (!address) return '';
    
    return (
      <div className="flex items-center">
        <a 
          href={`/wallet/${address}`}
          onClick={(e) => {
            e.preventDefault();
            navigate(`/wallet/${address}`);
          }}
          className="font-mono text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          {formatAddress(address)}
        </a>
        {label && <span className="ml-2 text-gray-500 dark:text-gray-400">({label})</span>}
        <button 
          onClick={() => copyToClipboard(address)} 
          className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
    );
  };
  
  // Format hash with copy button
  const formatHashWithCopy = (hash) => {
    if (!hash) return '';
    
    return (
      <div className="flex items-center">
        <span className="font-mono text-sm">
          {hash.length > 20 
            ? `${hash.substring(0, 10)}...${hash.substring(hash.length - 10)}`
            : hash
          }
        </span>
        <button 
          onClick={() => copyToClipboard(hash)} 
          className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
    );
  };
  
  // Get type badge class
  const getTypeBadgeClass = (type) => {
    switch (type) {
      case 'Access Control':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Transfer':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Smart Contract':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Validation':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };
  
  return (
    <Layout
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
      sidebarOpen={sidebarOpen}
      toggleSidebar={toggleSidebar}
      onCloseSidebar={closeSidebar}
      title={transaction ? `Transaction: ${formatAddress(transaction.hash)}` : 'Transaction Details'}
    >
      <div className="container mx-auto px-4 py-6">
        {/* Navigation */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/transactions')}
            className="flex items-center text-blue-600 dark:text-blue-400 hover:underline"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to Transactions
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : transaction ? (
          <>
            {/* Transaction Header */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
              <div className={`p-4 sm:p-6 ${
                transaction.status === 'Success' ? 'bg-green-600 dark:bg-green-800' : 'bg-red-600 dark:bg-red-800'
              }`}>
                <div className="flex flex-wrap items-center justify-between">
                  <div className="flex items-center mb-4 sm:mb-0">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-full mr-4">
                      <FileText size={24} className={transaction.status === 'Success' ? 'text-green-600' : 'text-red-600'} />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-white flex items-center">
                        Transaction
                        <span className={`ml-3 px-2 py-1 text-xs rounded-full bg-white ${
                          transaction.status === 'Success' ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </h1>
                      <p className="text-blue-100 text-sm mt-1 flex items-center">
                        <Clock size={14} className="mr-1" />
                        {formatTimestamp(transaction.timestamp)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {/* Refresh Button */}
                    <button
                      onClick={handleRefresh}
                      className={`flex items-center px-3 py-1 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded ${
                        isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={isRefreshing}
                    >
                      <RefreshCw size={14} className={`mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                      Refresh
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Transaction Summary */}
              <div className="p-4 sm:p-6">
                <div className="mb-6">
                  <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Transaction Hash</h2>
                  <div className="text-base font-mono text-gray-900 dark:text-white break-all flex items-center">
                    {transaction.hash}
                    <button 
                      onClick={() => copyToClipboard(transaction.hash)} 
                      className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-4">
                      <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Transaction Type</h2>
                      <div className="text-base text-gray-900 dark:text-white">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadgeClass(transaction.type)}`}>
                          {transaction.type}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Block</h2>
                      <div className="text-base text-gray-900 dark:text-white">
                        <a 
                          href={`/block/${transaction.blockNumber}`} 
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/block/${transaction.blockNumber}`);
                          }}
                        >
                          {transaction.blockNumber}
                        </a>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">From</h2>
                      <div className="text-base text-gray-900 dark:text-white">
                        {formatAddressWithCopy(transaction.from)}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">To</h2>
                      <div className="text-base text-gray-900 dark:text-white">
                        {formatAddressWithCopy(transaction.to)}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="mb-4">
                      <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Value</h2>
                      <div className="text-base text-gray-900 dark:text-white">
                        {transaction.value.toFixed(5)} ZTACC
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Transaction Fee</h2>
                      <div className="text-base text-gray-900 dark:text-white">
                        {transaction.fee.toFixed(5)} ZTACC
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Gas Used</h2>
                      <div className="text-base text-gray-900 dark:text-white">
                        {transaction.gasUsed.toLocaleString()} ({Math.round((transaction.gasUsed / transaction.gasLimit) * 100)}%)
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Gas Price</h2>
                      <div className="text-base text-gray-900 dark:text-white">
                        {transaction.gasPrice} Gwei
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-4">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`py-3 px-4 font-medium text-sm border-b-2 ${
                      activeTab === 'overview'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    Overview
                  </button>
                  {transaction.type === 'Access Control' && (
                    <button
                      onClick={() => setActiveTab('access')}
                      className={`py-3 px-4 font-medium text-sm border-b-2 ${
                        activeTab === 'access'
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      Access Events ({transaction.accessEvents})
                    </button>
                  )}
                </nav>
              </div>
            </div>
            
            {/* Tab Content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="p-4 sm:p-6">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Transaction Details</h2>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700">
                    <dl>
                      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 grid grid-cols-3">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">Transaction Hash</dt>
                        <dd className="text-sm text-gray-900 dark:text-white col-span-2 break-all">{transaction.hash}</dd>
                      </div>
                      <div className="bg-white dark:bg-gray-800 px-4 py-3 grid grid-cols-3">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">Status</dt>
                        <dd className="text-sm col-span-2">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            transaction.status === 'Success' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {transaction.status}
                          </span>
                        </dd>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 grid grid-cols-3">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">Block</dt>
                        <dd className="text-sm text-gray-900 dark:text-white col-span-2">
                          <a 
                            href={`/block/${transaction.blockNumber}`} 
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(`/block/${transaction.blockNumber}`);
                            }}
                          >
                            {transaction.blockNumber}
                          </a>
                        </dd>
                      </div>
                      <div className="bg-white dark:bg-gray-800 px-4 py-3 grid grid-cols-3">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">Timestamp</dt>
                        <dd className="text-sm text-gray-900 dark:text-white col-span-2">{formatTimestamp(transaction.timestamp)}</dd>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 grid grid-cols-3">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">From</dt>
                        <dd className="text-sm text-gray-900 dark:text-white col-span-2">{formatAddressWithCopy(transaction.from)}</dd>
                      </div>
                      <div className="bg-white dark:bg-gray-800 px-4 py-3 grid grid-cols-3">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">To</dt>
                        <dd className="text-sm text-gray-900 dark:text-white col-span-2">{formatAddressWithCopy(transaction.to)}</dd>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 grid grid-cols-3">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">Value</dt>
                        <dd className="text-sm text-gray-900 dark:text-white col-span-2">{transaction.value.toFixed(5)} ZTACC</dd>
                      </div>
                      <div className="bg-white dark:bg-gray-800 px-4 py-3 grid grid-cols-3">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">Transaction Fee</dt>
                        <dd className="text-sm text-gray-900 dark:text-white col-span-2">{transaction.fee.toFixed(5)} ZTACC</dd>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 grid grid-cols-3">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">Gas Price</dt>
                        <dd className="text-sm text-gray-900 dark:text-white col-span-2">{transaction.gasPrice} Gwei</dd>
                      </div>
                      <div className="bg-white dark:bg-gray-800 px-4 py-3 grid grid-cols-3">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">Gas Limit</dt>
                        <dd className="text-sm text-gray-900 dark:text-white col-span-2">{transaction.gasLimit.toLocaleString()}</dd>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 grid grid-cols-3">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">Gas Used</dt>
                        <dd className="text-sm text-gray-900 dark:text-white col-span-2">
                          {transaction.gasUsed.toLocaleString()} ({Math.round((transaction.gasUsed / transaction.gasLimit) * 100)}%)
                        </dd>
                      </div>
                      <div className="bg-white dark:bg-gray-800 px-4 py-3 grid grid-cols-3">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">Nonce</dt>
                        <dd className="text-sm text-gray-900 dark:text-white col-span-2">{transaction.nonce}</dd>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 grid grid-cols-3">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">Input Data</dt>
                        <dd className="text-sm text-gray-900 dark:text-white col-span-2 font-mono break-all">
                          {transaction.input}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              )}
              
              {/* Access Events Tab */}
              {activeTab === 'access' && (
                <div className="p-4 sm:p-6">
                  <div className="text-center py-20">
                    <div className="inline-block p-6 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                      <Shield size={48} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                      Access Events Coming Soon
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                      This feature is under development. Access event details will be available soon.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Transaction Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              The transaction you're looking for doesn't exist or hasn't been indexed yet.
            </p>
            <button
              onClick={() => navigate('/transactions')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              View All Transactions
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TransactionDetailsPage; 